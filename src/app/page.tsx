import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Nyatet.online</h1>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Kelola Keuangan RT & UMKM <br /> <span className="text-blue-600">Lebih Mudah</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Aplikasi manajemen keuangan hybrid. Atur iuran warga atau kasir toko
          dalam satu platform yang terintegrasi.
        </p>
        <Link href="/login">
          <Button size="lg" className="gap-2">
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} Nyatet.online. All rights reserved.
      </footer>
    </div>
  );
}
