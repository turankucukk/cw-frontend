
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Hata mesajları için state ekledik
  const router = useRouter();

  // Supabase client'ı başlatıyoruz
  const supabase = createClient();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(""); // Yeni denemede eski hatayı temizle

    try {
      // Supabase Giriş İşlemi
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (supabaseError) {
        setError("Giriş başarısız: " + supabaseError.message);
        return;
      }

      console.log("Login başarılı", data);
      
      // Başarılı girişte ana sayfaya yönlendir ve auth durumunu tazele
      router.push("/");
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
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
        <Typography variant="h4" sx={{ fontWeight: "700" }} align="center">
          DeskHere
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 4, mt: 1 }}
        >
          Sign in to your account
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Hata mesajı alanı */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <TextField
            label="Password"
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
            label="Remember me"
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
              "Login"
            )}
          </Button>

          <Typography align="center" sx={{ mt: 3 }}>
            Don't have an account? <Link href="/register">Register</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
