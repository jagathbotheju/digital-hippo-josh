import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className="h-full">
      <body
        className={cn("relative h-full font-sand antialiased", inter.className)}
      >
        <SessionProvider session={session}>
          <Providers>
            <main className="flex flex-col min-h-screen relative">
              <Navbar />
              <div className="flex-grow flex-1">{children}</div>
            </main>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
