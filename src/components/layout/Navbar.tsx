"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import { createClient } from "@/src/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { translatePage } from "../../services/translateService";
import { useUserRole } from "@/src/hooks/useUserRole";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();
  const { role, loading } = useUserRole();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <AppBar className=" px-4 py-3 shadow-sm " sx={{ background:"gray"}}>
      <Box className="flex items-center px-6">
        <Link href="/" className="text-lg font-semibold">
          DeskHere
        </Link>
        <Box sx={{display: { xs: "none", md: "flex" },alignItems: "center", ml: 5,gap: 3, fontSize: "0.875rem",fontWeight: 500,color: "text.secondary",}}>
          <Link href="/">Konumlarr</Link>
          <Link href="/">Servislerimiz</Link>
          <Link href="/">Çalışma Alanalarımız</Link>
          <Link href="/">Kaynaklar</Link>
          {!loading && role === "superadmin" && (
            <Link href="/admin">Admin</Link>
          )}
        </Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2,}}>
          <select onChange={(e) => translatePage(e.target.value)} 
          defaultValue="tr" className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option  value="en"> EN</option>
            <option  value="tr"> TR</option>
          </select>
          {session ? (
            <Button onClick={handleLogout} variant="outlined">
              Çıkış
            </Button>
          ) : (
            <>
              <Button component={Link} href="/login" variant="outlined">
                Giriş
              </Button>
              <Button component={Link} href="/register" variant="contained">
                Kayıt ol
              </Button>
            </>
          )}
        </Box>
      </Box>
    </AppBar>
  );
}