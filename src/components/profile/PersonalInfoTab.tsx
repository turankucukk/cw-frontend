"use client";

import { useState } from "react";
import { Box, Button, Grid, TextField, Typography, Alert } from "@mui/material";

// TODO: Replace with actual Supabase user fetching
const MOCK_USER = {
  name: "Yaren",
  surname: "K",
  email: "yaren@example.com",
};

export default function PersonalInfoTab() {
  const [formData, setFormData] = useState(MOCK_USER);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement Supabase save logic here
    // const { error } = await supabase.from('user').update({ name: formData.name, surname: formData.surname }).eq('email', formData.email);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Kişisel Bilgiler
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Bilgileriniz başarıyla güncellendi.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Ad"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Soyad"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="E-posta Adresi"
            name="email"
            value={formData.email}
            disabled // Email usually shouldn't be easily changed without verification
            variant="outlined"
            helperText="E-posta adresinizi değiştirmek için lütfen destek ile iletişime geçin."
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={isSaving}
          sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </Box>
    </Box>
  );
}
