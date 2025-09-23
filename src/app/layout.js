import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Mosque } from "@/animation/mosque";
import ClientWrapper from "@/components/clientwrapper";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Waktu Sholat",
  description: "Aplikasi waktu sholat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          <div className="-z-10 fixed inset w-full h-40 opacity-80">
            <Mosque />
          </div>
          <Navbar />
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
