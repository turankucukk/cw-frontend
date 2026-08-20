"use client";

import Navbar from "@/src/components/layout/Navbar";
import { createClient } from "@/src/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
  Paper
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { sendComplaintEmail } from "@/src/actions/mail";

export default function ComplaintsPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // user tablosundan public id'yi al
        const { data: dbUser } = await supabase
          .from("user")
          .select("id")
          .eq("user_id", authUser.id)
          .single();

        setUser({
          id: dbUser?.id,
          authId: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Kullanıcı"
        });
      }
    }
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setSnackbar({ open: true, message: "Lütfen tüm alanları doldurun.", severity: "error" });
      return;
    }

    setLoading(true);

    try {
      // 1. Veritabanına kaydet (Eğer issue tablosunda subject kolonu yoksa mesaja dahil edelim)
      let description = `Konu: ${subject}\n\nMesaj:\n${message}`;
      
      const insertData: any = {
        description: description,
      };

      // Sadece giriş yapmış kullanıcıysa id'sini ekle (Kimliksiz de şikayet edilebilir mi? Sisteme bağlı, ekleyelim)
      if (user?.id) {
        insertData.user_id = user.id;
      }

      const { error: dbError } = await supabase
        .from("issue")
        .insert(insertData);

      if (dbError) {
        console.warn("Veritabanına kaydedilemedi (Supabase kısıtlaması), ama mail gönderilmeye devam edilecek:", dbError.message);
      }

      // 2. Yöneticinin mailine bildirimi gönder!
      const userName = user?.name || "Anonim Kullanıcı";
      const userEmail = user?.email || "Belirtilmedi";
      
      const mailRes = await sendComplaintEmail(userName, userEmail, subject, message);
      
      if (!mailRes.success) {
        throw new Error(`Mail gönderilemedi: ${mailRes.error}`);
      }

      setSnackbar({ open: true, message: "Şikayet/Bildiriminiz başarıyla yöneticilere iletilmiştir.", severity: "success" });
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Şikayet kaydedilemedi:", error);
      setSnackbar({ open: true, message: `Bir hata oluştu: ${error.message || "Bilinmeyen hata"}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8fafc" }}>
      <Navbar />
      
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", pt: { xs: 12, md: 16 }, pb: 8, px: 2 }}>
        <Container maxWidth="sm">
          <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                Bize Ulaşın
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                Sistemle ilgili sorunlarınızı, önerilerinizi veya şikayetlerinizi doğrudan iletebilirsiniz.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                
                <TextField
                  label="Konu"
                  variant="outlined"
                  fullWidth
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Örn: X Odasının Kliması Çalışmıyor"
                />

                <TextField
                  label="Mesajınız / Şikayetiniz"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Lütfen iletmek istediğiniz mesajı detaylıca yazın..."
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{ py: 1.5, mt: 2, borderRadius: 2, fontWeight: 600, fontSize: "1.1rem" }}
                >
                  {loading ? "Gönderiliyor..." : "Mesajı İlet"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}