"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../../utils/supabase/client";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Link as MuiLink,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("E-posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f7fa",
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: { xs: "100%", sm: 420 },
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }} align="center">
            DeskHere
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center">
            Hesabına giriş yap
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="E-posta"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Şifre"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Şifreyi göster/gizle"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                  }
                  label="Beni hatırla"
                />

                <MuiLink
                  component={NextLink}
                  href="/forgot-password"
                  underline="hover"
                  color="primary"
                >
                  Şifremi unuttum?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Giriş yap"
                )}
              </Button>

              {errorMessage && (
                <Typography color="error" align="center">
                  {errorMessage}
                </Typography>
              )}
            </Stack>
          </Box>

          <Typography variant="body2" align="center" color="text.secondary">
            Hesabın yok mu?{" "}
            <MuiLink
              component={NextLink}
              href="/register"
              underline="hover"
              color="primary"
            >
              Kayıt ol
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}