import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/src/styles/theme.css";
import { AuthProvider } from "@/lib/auth-context";
import { ApolloStoreProvider } from "@/lib/apollo-demo-store";

export const metadata: Metadata = {
  title: "APOLLO | Enterprise AI Fitness Ecosystem",
  description: "Connected intelligence platform for TRI FIT enterprise gym operations, trainers, and members.",
  icons: {
    icon: "/tri_fit_badge.png",
    apple: "/tri_fit_badge.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark theme-dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased relative selection:bg-[var(--accent)] selection:text-[var(--on-accent)] overflow-x-clip transition-colors duration-300">
        {/* Ambient blurred yellow circles behind glass (DESIGN SPEC Section 3) */}
        <div
          className="orb pointer-events-none"
          style={{ width: 520, height: 520, top: -140, right: "10%", opacity: 0.8 }}
          aria-hidden="true"
        />
        <div
          className="orb pointer-events-none"
          style={{ width: 460, height: 460, bottom: "8%", left: "5%", opacity: 0.7 }}
          aria-hidden="true"
        />
        <div
          className="orb pointer-events-none"
          style={{ width: 340, height: 340, top: "45%", right: "25%", opacity: 0.65 }}
          aria-hidden="true"
        />

        <ApolloStoreProvider>
          <AuthProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </ApolloStoreProvider>
      </body>
    </html>
  );
}
