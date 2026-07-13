"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createClient } from "@/src/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

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
        <Link href="/">Konumlar</Link>
        <Link href="/">Servislerimiz</Link>
        <Link href="/">Çalışma Alanalarımız</Link>
        <Link href="/">Kaynaklar</Link>
        </Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2,}}>
          <FormControl size="small">
           <Select defaultValue="en">
           <MenuItem value="en">EN</MenuItem>
           <MenuItem value="tr">TR</MenuItem>
           </Select>
           </FormControl>
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
