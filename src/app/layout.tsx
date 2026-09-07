import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'WetterApp – Osnabrück & Münster',
    template: '%s | WetterApp',
  },
  description: 'Moderne Wettervorhersage und Unwetterwarnungen für Osnabrück und Münster mit verlässlichem Offline-Cache.',
  applicationName: 'WetterApp',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    title: 'WetterApp',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'WetterApp – Osnabrück & Münster',
    description: 'Moderne Wettervorhersage und Unwetterwarnungen für Osnabrück und Münster mit verlässlichem Offline-Cache.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'WetterApp',
  },
  twitter: {
    card: 'summary',
    title: 'WetterApp – Osnabrück & Münster',
    description: 'Moderne Wettervorhersage und Unwetterwarnungen für Osnabrück und Münster mit verlässlichem Offline-Cache.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: '#051028',
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
