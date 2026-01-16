import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Tworzenie odpowiedzi
  const response = NextResponse.json(
    { message: 'Wylogowanie pomyślne' },
    { status: 200 }
  )

  // Czyszczenie cookie - ustawienie maxAge na 0 i datę wygaśnięcia w przeszłości
  // Używamy tych samych ustawień co przy logowaniu dla spójności
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://'),
    sameSite: 'lax',
    maxAge: 0, // Natychmiastowe wygaśnięcie
    path: '/',
    expires: new Date(0), // Data w przeszłości
  })

  return response
}
