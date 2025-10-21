import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinAppAI",
  description: "Gerencie suas finanças pessoais de forma inteligente!",
  icons: {
    icon: '/finappai_icon.svg',
    shortcut: '/finappai_icon.png',
    apple: '/finappai_icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

