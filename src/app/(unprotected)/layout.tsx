import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import Navbar from "@/components/ui/navbar"
import { SessionProvider } from "@/components/providers/session-provider"
import { ModalProvider } from "@/components/providers/modal-provider"
import { Footer } from "@/components/ui/footer"
import { FloatingNotification } from "@/components/shared/floating-notification"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function UnprotectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <SessionProvider>
          <ModalProvider />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingNotification 
            type="newsletter"
            message="Subscribe to get travel tips, destination guides, and exclusive content directly in your inbox! ✈️"
            delay={3000}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
