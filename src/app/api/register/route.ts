import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma, prismaWithTimeout } from '@/lib/prisma'
import { generateToken, getAuthenticatedUser } from '@/lib/auth/jwt'
import { validatePasswordStrength } from '@/lib/auth/passwordValidation'
import { rateLimit } from '@/lib/auth/rateLimit'
import { isValidEmail } from '@/lib/api/validation'
import { TOKEN_LENGTH_LIMITS } from '@/lib/utils/constants'
import { sanitizeName } from '@/lib/utils/sanitize'

// Rate limiting: 3 rejestracje na 60 minut
const registerRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 60 minut
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - spróbuj wyciągnąć userId z JWT jeśli użytkownik jest już zalogowany
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const authenticatedUser = getAuthenticatedUser(request)
    const userId = authenticatedUser?.userId
    
    try {
      await registerRateLimit.check(3, ip, request, userId)
    } catch {
      return NextResponse.json(
        { error: 'Zbyt wiele prób rejestracji. Spróbuj ponownie za chwilę.' },
        { status: 429 }
      )
    }

    // Walidacja rozmiaru requestu (max 10KB)
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10 * 1024) {
      return NextResponse.json(
        { error: 'Request zbyt duży' },
        { status: 413 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, password, inviteToken } = body

    // Walidacja typów
    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Wszystkie pola muszą być ciągami znaków' },
        { status: 400 }
      )
    }

    // Walidacja
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      )
    }

    // Walidacja długości
    if (firstName.length > 100 || lastName.length > 100) {
      return NextResponse.json(
        { error: 'Imię i nazwisko nie mogą być dłuższe niż 100 znaków' },
        { status: 400 }
      )
    }

    if (email.length > 200) {
      return NextResponse.json(
        { error: 'Email nie może być dłuższy niż 200 znaków' },
        { status: 400 }
      )
    }

    if (inviteToken && typeof inviteToken !== 'string') {
      return NextResponse.json(
        { error: 'Token zaproszenia musi być ciągiem znaków' },
        { status: 400 }
      )
    }

    // Walidacja długości inviteToken - ochrona przed atakami DoS
    if (inviteToken && inviteToken.length > TOKEN_LENGTH_LIMITS.INVITE_TOKEN) {
      return NextResponse.json(
        { error: 'Token zaproszenia jest nieprawidłowy' },
        { status: 400 }
      )
    }

    // Walidacja email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format email' },
        { status: 400 }
      )
    }

    // Walidacja siły hasła
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join('. ') },
        { status: 400 }
      )
    }

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prismaWithTimeout(async (client) => {
        return client.user.findUnique({
            where: { email }
        });
    }, 30000)

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik o tym adresie email już istnieje' },
        { status: 400 }
      )
    }

    // Jeśli podano token, sprawdź czy jest ważny
    let affair = null
    if (inviteToken) {
      affair = await prismaWithTimeout(async (client) => {
          return client.affair.findUnique({
              where: { inviteToken },
              select: {
                  id: true,
                  inviteTokenUsed: true,
                  title: true
              }
          });
      }, 30000)

      if (!affair) {
        return NextResponse.json(
          { error: 'Nieprawidłowy lub nieważny token zaproszenia' },
          { status: 400 }
        )
      }

      if (affair.inviteTokenUsed) {
        return NextResponse.json(
          { error: 'Token zaproszenia został już wykorzystany' },
          { status: 400 }
        )
      }
    }

    // Sanityzacja danych przed zapisem
    const sanitizedFirstName = sanitizeName(firstName)
    const sanitizedLastName = sanitizeName(lastName)

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 10)

    // Utwórz użytkownika
    const user = await prismaWithTimeout(async (client) => {
        return client.user.create({
            data: {
                firstName: sanitizedFirstName,
                lastName: sanitizedLastName,
                email,
                password: hashedPassword
            }
        });
    }, 30000)

    // Jeśli rejestracja przez token, przypisz sprawę do użytkownika
    if (inviteToken && affair) {
      await prismaWithTimeout(async (client) => {
        return client.$transaction(async (tx) => {
          // Zaktualizuj sprawę
          await tx.affair.update({
            where: { id: affair.id },
            data: {
              involvedUserId: user.id,
              inviteTokenUsed: true,
              inviteToken: null
            }
          })

          // Utwórz rekord uczestnika dla nowego użytkownika ze statusem REACTION_NEEDED
          await tx.affairParticipant.create({
            data: {
              userId: user.id,
              affairId: affair.id,
              status: 'REACTION_NEEDED'
            }
          })
        })
      }, 30000)
    }

    // Generuj JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    // Zwróć sukces (bez hasła!)
    const response = NextResponse.json(
      { 
        message: 'Rejestracja zakończona pomyślnie',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token,
        ...(affair && { affairTitle: affair.title })
      },
      { status: 201 }
    )

    // Ustaw httpOnly cookie z tokenem
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
}