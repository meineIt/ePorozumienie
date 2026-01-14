import type { Metadata } from "next";
import { Montserrat, Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "e-Porozumienie | Porozumienie w 3 kliknięcia - Inwestycja",
  description: "Pierwsza platforma do mediacji online, która wykorzystując AI rozwiązuje spory frankowe w 3 dni zamiast w 15 miesięcy!",
  openGraph: {
    type: "website",
    url: "https://e-porozumienie.pl/",
    title: "e-Porozumienie | Porozumienie w 3 kliknięcia",
    description: "Pierwsza platforma do mediacji online, która wykorzystując AI rozwiązuje spory frankowe w 3 dni zamiast w 15 miesięcy!",
    images: [
      {
        url: "https://e-porozumienie.pl/images/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pl_PL",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${montserrat.variable} ${spaceGrotesk.variable} ${plusJakartaSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
