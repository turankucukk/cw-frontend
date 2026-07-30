"use client";
import { useState } from "react";
import { Box, Card, Grid, Typography, MenuItem, TextField, Chip, Avatar } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// ============ MOCK VERİ (Supabase bağlanınca değişecek) ============
const MOCK_ROOMS = [
  { id: "room_1", name: "Toplantı Odası 1" },
  { id: "room_2", name: "Toplantı Odası 2" },
  { id: "room_3", name: "Konferans Salonu" },
];

const MOCK_OCCUPANCY = [
  { date: "01.07", room_1: 55, room_2: 40, room_3: 80 },
  { date: "05.07", room_1: 62, room_2: 55, room_3: 70 },
  { date: "10.07", room_1: 70, room_2: 60, room_3: 85 },
  { date: "15.07", room_1: 48, room_2: 72, room_3: 60 },
  { date: "20.07", room_1: 80, room_2: 65, room_3: 90 },
  { date: "25.07", room_1: 75, room_2: 58, room_3: 78 },
];

const MOCK_WEEKDAY = [
  { day: "Pzt", count: 37 },
  { day: "Sal", count: 41 },
  { day: "Çar", count: 52 },
  { day: "Per", count: 38 },
  { day: "Cum", count: 47 },
];

const MOCK_SUMMARY = {
  activeUsers: { value: 42, trend: [30, 33, 31, 38, 36, 40, 42], change: "+8.2%" },
  totalUsers: { value: 137, trend: [110, 115, 119, 124, 128, 133, 137], change: "+12.5%" },
  avgOccupancy: { value: 61, trend: [55, 58, 54, 60, 57, 63, 61], change: "+4.1%" },
};

const MOCK_TOP_USERS = [
  { name: "Lionel Messi", count: 10 },
  { name: "Mason Greenwood", count: 8 },
  { name: "Turan Küçük", count: 5 },
  { name: "Çetin Ceviz", count: 3 },
];

const MOCK_ROOM_DISTRIBUTION = [
  { id: 0, value: 35, label: "Toplantı Odası 1" },
  { id: 1, value: 28, label: "Toplantı Odası 2" },
  { id: 2, value: 37, label: "Konferans Salonu" },
];
// ============ MOCK SONU ============

const BRAND_COLORS = ["#0052CC", "#00B4D8", "#11998E", "#38EF7D", "#F59E0B"];

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid #F1F5F9",
  boxShadow: "0 1px 3px rgba(16,24,40,0.05)",
};

export default function ReportsPage() {
  const [from, setFrom] = useState<Dayjs | null>(dayjs().subtract(30, "day"));
  const [to, setTo] = useState<Dayjs | null>(dayjs());
  const [room, setRoom] = useState("all");

  // Dinamik: her oda için gradyan dolgulu alan serisi
  const lineSeries = MOCK_ROOMS.map((r, i) => ({
  dataKey: r.id,
  label: r.name,
  color: BRAND_COLORS[i % BRAND_COLORS.length],
  showMark: false,
  curve: "monotoneX" as const,
}));

  const kpis = [
    { label: "Aktif Kullanıcı", ...MOCK_SUMMARY.activeUsers, color: "#0052CC", suffix: "" },
    { label: "Toplam Kullanıcı", ...MOCK_SUMMARY.totalUsers, color: "#00B4D8", suffix: "" },
    { label: "Ortalama Doluluk", ...MOCK_SUMMARY.avgOccupancy, color: "#11998E", suffix: "%" },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Raporlar
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Seçilen tarih aralığındaki kullanım istatistikleri.
        </Typography>

        {/* Filtre çubuğu */}
        <Card sx={{ ...cardSx, p: 2.5, mb: 3 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <DatePicker label="Başlangıç" value={from} onChange={setFrom} slotProps={{ textField: { size: "small" } }} />
            <DatePicker label="Bitiş" value={to} onChange={setTo} slotProps={{ textField: { size: "small" } }} />
            <TextField select size="small" label="Oda" value={room} onChange={(e) => setRoom(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value="all">Tüm Odalar</MenuItem>
              {MOCK_ROOMS.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Card>

        {/* KPI kartları — sparkline'lı */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {kpis.map((k) => (
            <Grid size={{ xs: 12, sm: 4 }} key={k.label}>
              <Card sx={{ ...cardSx, pb: 0, overflow: "hidden" }}>
                <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 0.5 }}>
                  {k.label}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {k.suffix}{k.value}
                  </Typography>
                  <Chip
                    size="small"
                    label={k.change}
                    sx={{ bgcolor: "rgba(17,153,142,0.10)", color: "#11998E", fontWeight: 600, height: 22 }}
                  />
                </Box>
                <Box sx={{ mx: -3, mt: 1 }}>
                  <SparkLineChart
                    data={k.trend}
                    height={56}
                    curve="monotoneX"
                    color={k.color}
                    showHighlight
                    showTooltip
                    valueFormatter={(v: number | null) => (v === null ? "" : `${v}${k.suffix}`)}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Doluluk alan grafiği */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={cardSx}>
              <Typography sx={{ fontWeight: 600 }}>Doluluk Oranı</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1 }}>
                Odalara göre zaman içindeki değişim
              </Typography>
              <LineChart
                dataset={MOCK_OCCUPANCY}
                xAxis={[{ dataKey: "date", scaleType: "point", disableLine: true, disableTicks: true }]}
                yAxis={[{ max: 100, disableLine: true, disableTicks: true, valueFormatter: (v: number) => `%${v}` }]}
                series={lineSeries}
                height={320}
                margin={{ left: 10, right: 10, top: 20, bottom: 10 }}
                grid={{ horizontal: true }}
                sx={{
                  "& .MuiAreaElement-root": { opacity: 0.15 },
                  "& .MuiChartsGrid-line": { stroke: "#F1F5F9", strokeDasharray: "4 4" },
                  "& .MuiChartsAxis-tickLabel": { fill: "#94A3B8", fontSize: 12 },
                }}
                slotProps={{
                  legend: {
                    direction: "horizontal",
                    position: { vertical: "top", horizontal: "end" },
                  },
                }}
              />
            </Card>
          </Grid>

          {/* Donut — ortasında toplam */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ ...cardSx, height: "100%", position: "relative" }}>
              <Typography sx={{ fontWeight: 600 }}>Odalara Göre Kullanım</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1 }}>
                Toplam rezervasyon payı
              </Typography>
              <Box sx={{ position: "relative" }}>
                <PieChart
                  series={[{
                    data: MOCK_ROOM_DISTRIBUTION,
                    innerRadius: 68,
                    outerRadius: 100,
                    paddingAngle: 3,
                    cornerRadius: 6,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { innerRadius: 68, additionalRadius: -6, color: "#E2E8F0" },
                  }]}
                  colors={BRAND_COLORS}
                  height={260}
                  hideLegend
                />
                <Box
                  sx={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>100</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 12 }}>rezervasyon</Typography>
                </Box>
              </Box>

              {/* Özel legend */}
              <Box sx={{ mt: 1 }}>
                {MOCK_ROOM_DISTRIBUTION.map((d, i) => (
                  <Box key={d.label} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.6 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: BRAND_COLORS[i] }} />
                    <Typography sx={{ fontSize: 13, flexGrow: 1, color: "text.secondary" }}>{d.label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>%{d.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Haftanın günlerine göre yoğunluk — yuvarlatılmış sütun */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={cardSx}>
              <Typography sx={{ fontWeight: 600 }}>Günlere Göre Yoğunluk</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1 }}>
                Haftalık rezervasyon dağılımı
              </Typography>
              <BarChart
                dataset={MOCK_WEEKDAY}
                xAxis={[{ dataKey: "day", scaleType: "band", disableLine: true, disableTicks: true }]}
                yAxis={[{ disableLine: true, disableTicks: true }]}
                series={[{ dataKey: "count", label: "Rezervasyon", color: "#0052CC" }]}
                height={280}
                borderRadius={8}
                grid={{ horizontal: true }}
                margin={{ left: 10, right: 10, top: 20, bottom: 10 }}
                sx={{
                  "& .MuiChartsGrid-line": { stroke: "#F1F5F9", strokeDasharray: "4 4" },
                  "& .MuiChartsAxis-tickLabel": { fill: "#94A3B8", fontSize: 12 },
                }}
                hideLegend
              />
            </Card>
          </Grid>

          {/* En yoğun kullanıcılar — avatarlı */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ ...cardSx, height: "100%" }}>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>En Yoğun Kullanıcılar</Typography>
              {MOCK_TOP_USERS.map((u, i) => (
                <Box
                  key={u.name}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.5,
                    py: 1.25,
                    borderBottom: i < MOCK_TOP_USERS.length - 1 ? "1px solid #F8FAFC" : "none",
                  }}
                >
                  <Avatar sx={{ width: 34, height: 34, bgcolor: BRAND_COLORS[i % BRAND_COLORS.length], fontSize: 14 }}>
                    {u.name.charAt(0)}
                  </Avatar>
                  <Typography sx={{ fontSize: 14, flexGrow: 1 }}>{u.name}</Typography>
                  <Chip
                    size="small"
                    label={u.count}
                    sx={{ bgcolor: "rgba(0,82,204,0.08)", color: "#0052CC", fontWeight: 700, minWidth: 40 }}
                  />
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}