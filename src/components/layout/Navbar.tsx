"use client";
import Link from "next/link";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
export default function Navbar() {
  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{py: 2}}>
      <Box sx={{display: "flex",alignItems: "center",px: 3, }}>
        <Link href="/" className="text-lg font-semibold">
          DeskHere
        </Link>
        <div className="hidden md:flex items-center ml-10 gap-6 text-sm font-medium text-gray-700">
        <Link href="/">Konumlar</Link>
        <Link href="/">Hizmet Verdiğimiz Kişiler</Link>
        <Link href="/">Çalışma Alanı Çözümleri</Link>
        <Link href="/">Kaynaklar</Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <select className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="en"> EN</option>
          <option value="tr"> TR</option>
          </select>
          <Link href="/login" className="rounded-md border border-sky-600 px-4 py-2 text-sky-700 hover:bg-sky-600 hover:text-white transititon">
            Giriş yap
          </Link>
          <Link href="/register" className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 transition">
            Kayıt ol
          </Link>
        </div>
      </Box>
    </AppBar>
  );
}
