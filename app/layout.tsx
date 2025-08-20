import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import Image from "next/image"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Maa Ashapura Enterprise - EV Spare Parts",
  description: "Quality EV spare parts for your electric vehicles",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Quality EV spare parts for your electric vehicles" />
        <title>Maa Ashapura Enterprise - EV Spare Parts</title>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <Image
            src="/placeholder-logo.png"
            alt="Maa Ashapura Logo"
            width={150}
            height={100}
            priority
          />
        </div>  
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
