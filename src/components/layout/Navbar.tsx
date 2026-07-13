"use client";

import Link from "next/link";
import { translatePage } from "../../services/translateService";

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center px-6">
        <Link href="/" className="text-lg font-semibold">
          DeskHere
        </Link>
        <div className="hidden md:flex items-center ml-10 gap-6 text-sm font-medium text-gray-700">
        <Link href="/">Lokasyonlar</Link>
        <Link href="/">Hizmet Verdiklerimiz</Link>
        <Link href="/">Çalışma Alanı Çözümleri</Link>
        <Link href="/">Kaynaklar</Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <select onChange={(e) => translatePage(e.target.value)} 
          defaultValue="tr" className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option  value="en"> EN</option>
            <option  value="tr"> TR</option>
          </select>
          <Link href="/login" className="rounded-md border border-sky-600 px-4 py-2 text-sky-700 hover:bg-sky-600 hover:text-white transititon">
            Giriş Yap
          </Link>
          <Link href="/register" className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 transition">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </nav>
  );
}
