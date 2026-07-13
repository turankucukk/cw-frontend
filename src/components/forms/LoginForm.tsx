"use client";
import { useState, type FormEvent } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword , setShowPassword ]=useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Giriş gönderildi", { email, password });
  };
    return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)",
    }}
  >
    <Paper
      elevation={8}
      sx={{
        width: 420,
        p: 5,
        borderRadius: 4,}}>
      <Typography variant="h4" sx={{fontWeight : "700"}} align="center">
        DeskHere
      </Typography>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Giriş yap
      </button>
    </form>
  );
}
