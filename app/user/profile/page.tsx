"use client";

import { useState } from "react";
import { Box, Card, Typography, Tabs, Tab, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaymentIcon from "@mui/icons-material/Payment";
import DashboardTab from "@/src/components/profile/DashboardTab";
import PersonalInfoTab from "@/src/components/profile/PersonalInfoTab";
import ReservationsTab from "@/src/components/profile/ReservationsTab";
import PaymentsTab from "@/src/components/profile/PaymentsTab";
import DashboardIcon from "@mui/icons-material/Dashboard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

export default function ProfilePage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Profilim
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Kişisel bilgilerinizi yönetebilir, geçmiş rezervasyonlarınızı ve ödemelerinizi inceleyebilirsiniz.
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, pt: 2, bgcolor: "#fff" }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: 60,
              }
            }}
          >
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Genel Bakış" {...a11yProps(0)} />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Kişisel Bilgiler" {...a11yProps(1)} />
            <Tab icon={<EventNoteIcon />} iconPosition="start" label="Rezervasyonlarım" {...a11yProps(2)} />
            <Tab icon={<PaymentIcon />} iconPosition="start" label="Ödemelerim" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <Divider />

        <Box sx={{ px: { xs: 2, sm: 4 }, pb: 4, bgcolor: "#fff" }}>
          <CustomTabPanel value={value} index={0}>
            <DashboardTab />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <PersonalInfoTab />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ReservationsTab />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <PaymentsTab />
          </CustomTabPanel>
        </Box>
      </Card>
    </Box>
  );
}
