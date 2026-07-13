"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
// Supabase client'ı import ediyoruz
import { createClient } from "@/src/utils/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Supabase client'ı başlatıyoruz
  const supabase = createClient();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Supabase Kayıt İşlemi
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // `data` alanı, kullanıcı profili tablonuza eklenecek verileri içerir.
          data: {
            full_name: name,
            username: nickname,
          },
        },
      });

      if (supabaseError) {
        setError("Kayıt başarısız: " + supabaseError.message);
        return;
      }

      // Başarılı kayıttan sonra ana sayfaya yönlendir.
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: 400 } }}>
        {/* DeskHere Logo */}
        <Box sx={{ width: 280, ml: -1.5 }}>
          <svg viewBox="0 0 420 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0052CC" />
                <stop offset="100%" stopColor="#00B4D8" />
              </linearGradient>
              <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38EF7D" />
                <stop offset="100%" stopColor="#11998E" />
              </linearGradient>
            </defs>
            <g transform="translate(10, 10)">
              <rect x="15" y="10" width="70" height="70" rx="16" fill="url(#brandGradient)" opacity="0.1" />
              <rect x="30" y="45" width="16" height="20" rx="4" fill="none" stroke="url(#brandGradient)" strokeWidth="4" />
              <path d="M 38,65 L 38,75" stroke="url(#brandGradient)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 25,55 L 75,55 L 75,75" fill="none" stroke="url(#brandGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 60,25 L 70,35 L 90,15" fill="none" stroke="url(#checkGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g transform="translate(105, 70)">
              <text fontFamily="Segoe UI, Inter, Arial, sans-serif" fontSize="48" fontWeight="800" fill="#1E293B" letterSpacing="-0.5">Desk</text>
              <text x="116" fontFamily="Segoe UI, Inter, Arial, sans-serif" fontSize="48" fontWeight="400" fill="url(#brandGradient)" letterSpacing="-0.5">Here</text>
            </g>
          </svg>
        </Box>

        <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
          Kayıt Ol
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Ad Soyad"
            placeholder="Çetin Ceviz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Kullanıcı Adı"
            placeholder="çetinceviz"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="E-posta"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Şifre Tekrar"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              py: 1.5,
              background: "linear-gradient(135deg, #0052CC 0%, #00B4D8 100%)",
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Kayıt Ol"}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: "text.secondary" }}>
          Zaten bir hesabın var mı?{" "}
          <Box component="a" href="/login" sx={{ color: "#0052CC", fontWeight: 500, textDecoration: "none" }}>
            Giriş Yap
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}