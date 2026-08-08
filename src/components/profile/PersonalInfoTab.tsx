"use client";
import { useState, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography, Alert } from "@mui/material";
import { createClient } from "@/src/utils/supabase/client";

export default function PersonalInfoTab({ userData, setUserData }: { userData?: any, setUserData?: any }) {
  const [formData, setFormData] = useState({ name: "", surname: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const supabase = createClient();

  // Supabase'den gelen veriyi forma yerleştiriyoruz
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Supabase User Tablosunu Güncelliyoruz
    const { data, error } = await supabase
      .from("user")
      .update({ name: formData.name, surname: formData.surname })
      .eq("email", formData.email)
      .select()
      .single();

    setIsSaving(false);
    
    if (!error && data && setUserData) {
      setUserData(data); // Ana sayfadaki state'i günceller
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert("Bilgiler güncellenirken bir hata oluştu.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Kişisel Bilgiler</Typography>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>Bilgileriniz başarıyla güncellendi.</Alert>
      )}
      <Grid container spacing={3}>
        <Grid xs={12} sm={6}>
          <TextField fullWidth label="Ad" name="name" value={formData.name} onChange={handleChange} variant="outlined" />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField fullWidth label="Soyad" name="surname" value={formData.surname} onChange={handleChange} variant="outlined" />
        </Grid>
        <Grid xs={12}>
          <TextField fullWidth label="E-posta Adresi" name="email" value={formData.email} disabled variant="outlined" helperText="E-posta adresinizi değiştirmek için lütfen destek ile iletişime geçin." />
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleSave} disabled={isSaving} sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: "none" }}>
          {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </Box>
    </Box>
  );
}