import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth/jwt'
import { validatePasswordStrength } from '@/lib/auth/passwordValidation'
import { rateLimit } from '@/lib/auth/rateLimit'
import { isValidEmail } from '@/lib/api/validation'

// Rate limiting: 3 rejestracje na 60 minut
const registerRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 60 minut
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    try {
      await registerRateLimit.check(3, ip)
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

    // Walidacja
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik o tym adresie email już istnieje' },
        { status: 400 }
      )
    }

    // Jeśli podano token, sprawdź czy jest ważny
    let affair = null
    if (inviteToken) {
      affair = await prisma.affair.findUnique({
        where: { inviteToken },
        select: {
          id: true,
          inviteTokenUsed: true,
          title: true
        }
      })

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

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 10)

    // Utwórz użytkownika
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
      }
    })

    // Jeśli rejestracja przez token, przypisz sprawę do użytkownika
    if (inviteToken && affair) {
      await prisma.$transaction(async (tx) => {
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