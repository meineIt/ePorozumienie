import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, inviteToken } = body

    // Walidacja
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Hasło musi mieć co najmniej 6 znaków' },
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

    // Zwróć sukces (bez hasła!)
    return NextResponse.json(
      { 
        message: 'Rejestracja zakończona pomyślnie',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        ...(affair && { affairTitle: affair.title })
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
}