"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Card, Typography, Tabs, Tab, Divider, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaymentsIcon from "@mui/icons-material/Payments";
import DashboardIcon from "@mui/icons-material/Dashboard";

// Bileşen ve Hook Importları
import DashboardTab from "@/src/components/profile/DashboardTab";
import PersonalInfoTab from "@/src/components/profile/PersonalInfoTab";
import ReservationsTab from "@/src/components/profile/ReservationsTab";
import PaymentsTab from "@/src/components/profile/PaymentsTab";
import { useUserRole } from "@/src/hooks/useUserRole";
import { useProfileData } from "@/src/hooks/useProfileData"; // YENİ EKLEDİĞİMİZ HOOK

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}



export default function ProfilePage() {
  const [value, setValue] = useState(0);
  const router = useRouter();
  const { role, loading: roleLoading } = useUserRole();
  const { userData, reservations, payments, loading: profileLoading, setUserData } = useProfileData(); // VERİYİ ÇEKTİK

  useEffect(() => {
    if (!roleLoading && role === "superadmin") {
      router.push("/admin");
    }
  }, [role, roleLoading, router]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (roleLoading || profileLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (role === "superadmin") return null;

  return (
    <Box sx={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Hesabım</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Kişisel bilgilerinizi, rezervasyonlarınızı ve ödemelerinizi buradan yönetebilirsiniz.
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#F8FAFC", borderRadius: "12px 12px 0 0" }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" sx={{ px: 2, pt: 1 }}>
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Genel Bakış" />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Kişisel Bilgiler" />
            <Tab icon={<EventNoteIcon />} iconPosition="start" label="Rezervasyonlarım" />
            <Tab icon={<PaymentsIcon />} iconPosition="start" label="Ödemelerim" />
          </Tabs>
        </Box>

        <Divider />
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <CustomTabPanel value={value} index={0}>
            {/* Supabase Verilerini İçeri Gönderiyoruz */}
            <DashboardTab reservations={reservations} userData={userData} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <PersonalInfoTab userData={userData} setUserData={setUserData} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ReservationsTab reservations={reservations} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <PaymentsTab payments={payments} />
          </CustomTabPanel>
        </Box>
      </Card>
    </Box>
  );
}
