"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/src/utils/supabase/client";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const supabase = createClient();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Supabase Giriş İşlemi
      const { data, error: supabaseError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

      if (supabaseError) {
        const message = "Giriş başarısız: " + supabaseError.message;

        setError(message);
        toast.error("Giriş başarısız. Email veya şifrenizi kontrol edin.");
        return;
      }

      console.log("Login başarılı", data);

      toast.success("Başarıyla giriş yapıldı.");

      // Başarılı girişte ana sayfaya yönlendir ve auth durumunu tazele
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 700);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.";

      setError(message);
      toast.error("Giriş sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            <Box component="span" sx={{ color: "#111827" }}>
              Desk
            </Box>
            <Box component="span" sx={{ color: "#1976d2" }}>
              Here
            </Box>
          </Typography>
        </Box>

        <Typography align="center" color="text.secondary" sx={{ mb: 4, mt: 1 }}>
          Hesabınıza giriş yapın
        </Typography>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="E-posta"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <TextField
            label="Şifre"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControlLabel
            control={<Checkbox />}
            label="Beni Hatırla"
            sx={{ mt: 1 }}
          />

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              py: 1.3,
              borderRadius: 2,
              transition: "0.3s",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 6 },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Giriş Yap"
            )}
          </Button>

          <Typography align="center" sx={{ mt: 3 }}>
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Kayıt Ol
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
