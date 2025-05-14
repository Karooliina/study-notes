import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Study Notes",
  description: "Twoje inteligentne notatki, zawsze pod ręką.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col items-center">
          <Header />
          <main className="w-full  flex flex-1 flex-col p-20">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
