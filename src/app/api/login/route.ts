import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma, prismaWithTimeout } from '@/lib/prisma'
import { generateToken, getAuthenticatedUser } from '@/lib/auth/jwt'
import { rateLimit } from '@/lib/auth/rateLimit'

// Rate limiting: 5 prób na 15 minut
const loginRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minut
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - spróbuj wyciągnąć userId z JWT jeśli użytkownik jest już zalogowany
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const authenticatedUser = getAuthenticatedUser(request)
    const userId = authenticatedUser?.userId
    
    try {
      await loginRateLimit.check(5, ip, request, userId)
    } catch {
      return NextResponse.json(
        { error: 'Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Walidacja typów
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email i hasło muszą być ciągami znaków' },
        { status: 400 }
      )
    }

    // Walidacja
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      )
    }

    // Walidacja długości - ochrona przed DoS
    if (email.length > 200) {
      return NextResponse.json(
        { error: 'Email nie może być dłuższy niż 200 znaków' },
        { status: 400 }
      )
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: 'Hasło nie może być dłuższe niż 128 znaków' },
        { status: 400 }
      )
    }

    // Walidacja email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format email' },
        { status: 400 }
      )
    }

    // Znajdź użytkownika
    const user = await prismaWithTimeout(async (client) => {
        return client.user.findUnique({
            where: { email }
        });
    }, 30000)

    if (!user) {
      return NextResponse.json(
        { error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      )
    }

    // Sprawdź hasło
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      )
    }

    // Generuj JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    // Sukces - zwróć dane użytkownika i token
    const response = NextResponse.json(
      {
        message: 'Logowanie pomyślne',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      },
      { status: 200 }
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    )
  }
}