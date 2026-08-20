"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Box, TextField, Button, Typography, Alert, CircularProgress,Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,} from "@mui/material";
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
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false); 

  const supabase = createClient();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (password !== confirmPassword) {
    setError("Şifreler eşleşmiyor.");
    toast.error("Şifreler eşleşmiyor.");
    return;
  }

  setError("");
  setShowTerms(true);
};
 const handleRegister = async () => {
  if (!termsAccepted) {
    toast.error("Devam etmek için koşulları kabul etmelisiniz.");
    return;
  }

  setShowTerms(false);
  setLoading(true);

  try {
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username: nickname,
        },
      },
    });

    if (supabaseError) {
      setError("Kayıt başarısız: " + supabaseError.message);
      toast.error("Kayıt başarısız.");
      return;
    }

    console.log("Kayıt başarılı", data);

    toast.success("Kayıt başarıyla oluşturuldu.");

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 700);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Bir hata oluştu.";

    setError(message);
    toast.error("Kayıt sırasında bir hata oluştu.");
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
      bgcolor: "#f3f6fa",
      px: 2,
      py: 2,
    
    }}
  >
    <Box
      sx={{
        width: "100%",
         maxWidth: 630,
        backgroundColor: "#fff",
        borderRadius: "48px",
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.25)",
        px: { xs: 3, sm: 7.5 },
        py: { xs: 4, sm: 6},

    transform: "scale(0.75)",
    transformOrigin: "center center",
      }}
    >
{/* DeskHere Logo */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mb: 1.5,
  }}
>
  <Typography
    component="h1"
    sx={{
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1,
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

      {/* Alt başlık */}
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "1.1rem",
          color: "#111",
          mb: 2.5,
        }}
      >
        Hesap oluştur
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <input
          id="name"
          type="text"
          placeholder="Ad Soyad *"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          className="register-input"
          required
        />

        <input
          id="nickname"
          type="text"
          placeholder="Kullanıcı Adı *"
          value={nickname}
          onChange={(event) =>
            setNickname(event.target.value)
          }
          className="register-input"
          required
        />

        <input
          id="email"
          type="email"
          placeholder="E-posta *"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="register-input"
          required
        />

        <input
          id="password"
          type="password"
          placeholder="Şifre *"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          className="register-input"
          required
        />

        <input
          id="confirmPassword"
          type="password"
          placeholder="Şifre Tekrarı *"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          className="register-input"
          required
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{
            height: 58,
            borderRadius: "24px",
            backgroundColor: "#1976d2",
            textTransform: "uppercase",
            fontSize: "1.05rem",
            fontWeight: 400,
            boxShadow: "0 5px 10px rgba(0,0,0,0.25)",
            mt: 1,

            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          {loading ? (
            <CircularProgress
              size={26}
              color="inherit"
            />
          ) : (
            "Kayıt Ol"
          )}
        </Button>

      </Box>

      <Typography
        sx={{
          textAlign: "center",
          fontSize: "1.2rem",
          color: "#111",
          mt: 4,
        }}
      >
        Zaten hesabınız var?{" "}
        <a
          href="/login"
          style={{
            color: "#1976d2",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Giriş Yap
        </a>
      </Typography>

    </Box>

    <style jsx global>{`
      .register-input {
        width: 100%;
        height: 65px;
        box-sizing: border-box;

        border: 1px solid #c8c8c8;
        border-radius: 14px;

        background-color: #fff;

        padding: 0 20px;

        font-family: Arial, sans-serif;
        font-size: 1.1rem;
        color: #222;

        outline: none;
      }

      .register-input::placeholder {
        color: #666;
        opacity: 1;
      }

      .register-input:focus {
        border-color: #1976d2;
        box-shadow: 0 0 0 1px #1976d2;
      }
    `}</style>

    {/* KOŞULLAR POPUP */}
    <Dialog
      open={showTerms}
      onClose={() => setShowTerms(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
  sx={{
    fontWeight: 700,
    fontSize: "1.4rem",
  }}
>
  Üyelik ve Kullanım Koşulları
</DialogTitle>

<DialogContent dividers>
  <Typography
    sx={{
      fontSize: "0.95rem",
      lineHeight: 1.7,
      color: "#333",
    }}
  >
    DeskHere platformuna kayıt olmadan önce aşağıdaki koşulları
    lütfen okuyunuz.
  </Typography>

  <Typography sx={{ mt: 2, fontWeight: 700 }}>
    1. Hesap Bilgileri
  </Typography>

  <Typography sx={{ mt: 0.5, fontSize: "0.9rem" }}>
    Kayıt sırasında verilen ad, kullanıcı adı ve e-posta
    bilgilerinin doğru ve güncel olması kullanıcının
    sorumluluğundadır. Kullanıcı, hesap bilgilerinin
    güvenliğinden sorumludur.
  </Typography>

  <Typography sx={{ mt: 2, fontWeight: 700 }}>
    2. Hesap Kullanımı
  </Typography>

  <Typography sx={{ mt: 0.5, fontSize: "0.9rem" }}>
    Kullanıcı, oluşturduğu hesabı platformun kullanım amacı
    doğrultusunda kullanmayı kabul eder. Hesap bilgileri
    başka kişilerle paylaşılmamalıdır.
  </Typography>

  <Typography sx={{ mt: 2, fontWeight: 700 }}>
    3. Rezervasyon İşlemleri
  </Typography>

  <Typography sx={{ mt: 0.5, fontSize: "0.9rem" }}>
  Kullanıcı, rezervasyon sırasında tarih, saat ve kişi sayısı gibi
  bilgileri doğru girmeyi kabul eder. Rezervasyon sahibi, rezervasyon sırasında belirtilen kişi sayısına
  uygun şekilde gelmelidir ve rezervasyon kapasitesini aşmamalıdır.   Kullanıcı, kullanamayacağı rezervasyonları mümkün olduğunca önceden
  iptal etmeyi kabul eder.
  </Typography>

  <Typography sx={{ mt: 2, fontWeight: 700 }}>
    4. Güvenlik
  </Typography>

  <Typography sx={{ mt: 0.5, fontSize: "0.9rem" }}>
    Kullanıcı, şifresini ve hesap bilgilerini üçüncü kişilerle
    paylaşmamalıdır. Hesabında şüpheli bir işlem fark edilmesi
    durumunda gerekli güvenlik önlemlerini almak kullanıcının
    sorumluluğundadır.
  </Typography>

  <FormControlLabel
    sx={{ mt: 2 }}
    control={
      <Checkbox
        checked={termsAccepted}
        onChange={(event) =>
          setTermsAccepted(event.target.checked)
        }
      />
    }
    label="Üyelik ve Kullanım Koşulları'nı okudum ve kabul ediyorum."
  />
</DialogContent>

<DialogActions sx={{ px: 3, py: 2 }}>
  <Button
    onClick={() => setShowTerms(false)}
    sx={{
      color: "#666",
      textTransform: "none",
    }}
  >
    Vazgeç
  </Button>

  <Button
    onClick={handleRegister}
    variant="contained"
    disabled={!termsAccepted || loading}
    sx={{
      backgroundColor: "#1976d2",
      borderRadius: "12px",
      px: 3,
      textTransform: "none",

      "&:hover": {
        backgroundColor: "#1976d2",
      },
    }}
  >
    {loading ? (
      <CircularProgress size={22} color="inherit" />
    ) : (
      "Kabul Et ve Kayıt Ol"
    )}
  </Button>
   </DialogActions>
    </Dialog>

  </Box>
);
}
