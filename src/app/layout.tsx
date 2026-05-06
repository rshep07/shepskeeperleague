import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Shep's Keeper League",
  description: "Private fantasy hockey league history",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-ice-300 text-xs tracking-widest uppercase py-8 border-t border-rink-700">
          Shep's Keeper League · Est. 2008
        </footer>
      </body>
    </html>
  );
}
