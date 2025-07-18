import type { Metadata } from "next";
import { Inter, Poppins, Lora } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YPO SF Gold Community Platform",
  description: "A centralized hub for YPO SF Gold Chapter members",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${lora.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 