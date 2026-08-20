"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  MenuItem,
  TextField,
  Chip,
  Avatar,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { toAppTz, appTzDayBoundary } from "@/src/lib/date";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable,
  TableRow as DocxRow,
  TableCell as DocxCell,
} from "docx";
import { saveAs } from "file-saver";
import { createClient } from "@/src/utils/supabase/client"; // ← client dosyanızın gerçek yolu farklıysa burayı güncelleyin

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
  { day: "Pzt", count: 34 },
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

type ReportRow = {
  id: number;
  room: string;
  building: string;
  space_id: number | undefined;
  user_name: string;
  start_raw: string;
  end_raw: string;
  start: string;
  end: string;
  price: number;
};

export default function ReportsPage() {
const [from, setFrom] = useState<Dayjs | null>(dayjs().subtract(7, "day"));
const [to, setTo] = useState<Dayjs | null>(dayjs());
  const [room, setRoom] = useState("all");
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

  // ── Detaylı rapor (Supabase) state'leri ──
const [reportRows, setReportRows] = useState<ReportRow[]>([]);
const [loadingReport, setLoadingReport] = useState(false);
const [kpiData, setKpiData] = useState({ activeUsers: 0, totalUsers: 0, avgOccupancy: 0 });
const [occupancyDataset, setOccupancyDataset] = useState<any[]>([]);
const [occupancyDayCount, setOccupancyDayCount] = useState(0);
const [roomDistribution, setRoomDistribution] = useState<{ id: number; value: number; label: string }[]>([]);
const [weekdayData, setWeekdayData] = useState<{ day: string; count: number }[]>([]);
const [topUsers, setTopUsers] = useState<{ name: string; count: number }[]>([]);
const [summary, setSummary] = useState({
  totalRevenue: 0,
  totalReservations: 0,
  avgOccupancy: 0,
  mostUsedRoom: "-",
  leastUsedRoom: "-",
});

  // Dinamik: her oda için gradyan dolgulu alan serisi
const topRoomIds = roomDistribution
  .slice()
  .sort((a, b) => b.value - a.value)
  .slice(0, 6)
  .map((d) => rooms.find((r) => r.name === d.label)?.id)
  .filter((id): id is number => id !== undefined);

const lineSeries = rooms
  .filter((r) => topRoomIds.includes(r.id))
  .map((r, i) => ({
    dataKey: `room_${r.id}`,
    label: r.name,
    color: BRAND_COLORS[i % BRAND_COLORS.length],
    showMark: true,
    curve: "monotoneX" as const,
  }));

  const kpis = [
  { label: "Aktif Kullanıcı", value: kpiData.activeUsers, color: "#0052CC", suffix: "" },
  { label: "Toplam Kullanıcı", value: kpiData.totalUsers, color: "#00B4D8", suffix: "" },
  { label: "Ortalama Doluluk", value: kpiData.avgOccupancy, color: "#11998E", suffix: "%" },
];
  useEffect(() => {
  const fetchRooms = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("space")
      .select("id, name")
      .eq("isActive", true)
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }
    setRooms(data ?? []);
  };
  fetchRooms();
}, []);

 // ── Supabase'den seçilen aralıktaki rezervasyonları çek ──
const WEEKDAY_LABELS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const WORK_HOURS_PER_DAY = 9; // 09:00 - 18:00

const fetchDetailedReport = async () => {
  if (!from || !to) return;
  setLoadingReport(true);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reservation")
    .select(
      `
      id,
      start_time,
      end_time,
      total_price,
      status,
      user:user_id ( name, surname ),
      space:space_id (
        id,
        name,
        building:building_id ( name )
      )
    `
    )
    .eq("status", "confirmed")
.gte("start_time", appTzDayBoundary(from, "start").toISOString())
.lte("end_time", appTzDayBoundary(to, "end").toISOString())
.order("start_time", { ascending: true });

  if (error) {
    console.error(error);
    setLoadingReport(false);
    return;
  }

  let formatted: ReportRow[] = (data ?? []).map((r: any) => ({
    id: r.id,
    room: r.space?.name ?? "-",
    building: r.space?.building?.name ?? "-",
    space_id: r.space?.id,
    user_name: r.user ? `${r.user.name ?? ""} ${r.user.surname ?? ""}`.trim() : "-",
    start_raw: r.start_time,
    end_raw: r.end_time,
    start: toAppTz(r.start_time).format("DD.MM.YYYY HH:mm"),
    end: toAppTz(r.end_time).format("DD.MM.YYYY HH:mm"),
    price: r.total_price ?? 0,
  }));

  if (room !== "all") {
    formatted = formatted.filter((r) => String(r.space_id) === String(room));
  }

  setReportRows(formatted);

  // ── Toplam kullanıcı sayısı ──
  const { count: totalUserCount } = await supabase
    .from("user")
    .select("id", { count: "exact", head: true });

  // ── Aktif kullanıcı (bu aralıkta rezervasyon yapan farklı kullanıcı) ──
  const distinctUserNames = new Set(formatted.map((r) => r.user_name));

  // ── Oda dağılımı (pasta grafiği) ──
  const roomCounts: Record<string, number> = {};
  formatted.forEach((r) => {
    roomCounts[r.room] = (roomCounts[r.room] || 0) + 1;
  });
  const roomDist = Object.entries(roomCounts).map(([label, value], idx) => ({
    id: idx,
    value,
    label,
  }));
  setRoomDistribution(roomDist);

  const sortedRooms = [...roomDist].sort((a, b) => b.value - a.value);
  const mostUsedRoom = sortedRooms[0]?.label ?? "-";
  const leastUsedRoom = sortedRooms[sortedRooms.length - 1]?.label ?? "-";

  // ── Haftanın günlerine göre dağılım ──
  const weekdayCounts: Record<string, number> = {
    Pzt: 0, Sal: 0, Çar: 0, Per: 0, Cum: 0, Cmt: 0, Paz: 0,
  };
  formatted.forEach((r) => {
    const dayIndex = toAppTz(r.start_raw).day(); // 0=Paz
    const label = WEEKDAY_LABELS[dayIndex];
    weekdayCounts[label] = (weekdayCounts[label] || 0) + 1;
  });
  const weekdayArr = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => ({
  day,
  count: weekdayCounts[day] ?? 0,
}));
  setWeekdayData(weekdayArr);

  // ── En yoğun kullanıcılar ──
  const userCounts: Record<string, number> = {};
  formatted.forEach((r) => {
    if (r.user_name && r.user_name !== "-") {
      userCounts[r.user_name] = (userCounts[r.user_name] || 0) + 1;
    }
  });
  const topUsersArr = Object.entries(userCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  setTopUsers(topUsersArr);

  // ── Günlük doluluk oranı (mesai saatine göre) ──
  const dayCount = appTzDayBoundary(to, "start").diff(appTzDayBoundary(from, "start"), "day") + 1;
  const occupancyByDate: Record<string, Record<string, number>> = {};

  for (let i = 0; i < dayCount; i++) {
    const dateKey = appTzDayBoundary(from, "start").add(i, "day").format("DD.MM");
    occupancyByDate[dateKey] = {};
    rooms.forEach((rm) => {
      occupancyByDate[dateKey][`room_${rm.id}`] = 0;
    });
  }

  formatted.forEach((r) => {
    const dateKey = toAppTz(r.start_raw).format("DD.MM");
    const hours = dayjs(r.end_raw).diff(dayjs(r.start_raw), "hour", true);
    const roomKey = `room_${r.space_id}`;
    if (!occupancyByDate[dateKey]) occupancyByDate[dateKey] = {};
    occupancyByDate[dateKey][roomKey] = (occupancyByDate[dateKey][roomKey] || 0) + hours;
  });

  const occupancyDatasetArr = Object.entries(occupancyByDate).map(([date, roomHours]) => {
    const row: any = { date };
    rooms.forEach((rm) => {
      const key = `room_${rm.id}`;
      const hoursUsed = roomHours[key] || 0;
      row[key] = Math.min(100, Math.round((hoursUsed / WORK_HOURS_PER_DAY) * 100));
    });
    return row;
  });
  setOccupancyDataset(occupancyDatasetArr);
  setOccupancyDayCount(dayCount);

  // ── Genel ortalama doluluk ──
  const totalBookedHours = formatted.reduce(
    (sum, r) => sum + dayjs(r.end_raw).diff(dayjs(r.start_raw), "hour", true),
    0
  );
  const totalCapacityHours = dayCount * WORK_HOURS_PER_DAY * (rooms.length || 1);
  const avgOccupancyPct =
    totalCapacityHours > 0 ? Math.round((totalBookedHours / totalCapacityHours) * 100) : 0;

  setKpiData({
    activeUsers: distinctUserNames.size,
    totalUsers: totalUserCount ?? 0,
    avgOccupancy: avgOccupancyPct,
  });

  const totalRevenue = formatted.reduce((sum, r) => sum + (r.price || 0), 0);
  setSummary({
    totalRevenue,
    totalReservations: formatted.length,
    avgOccupancy: avgOccupancyPct,
    mostUsedRoom,
    leastUsedRoom,
  });

  setLoadingReport(false);
};

  // ── Export: Excel ──
  const exportExcel = () => {
  const summarySheet = XLSX.utils.json_to_sheet([
    { Metrik: "Toplam Gelir", Değer: `${summary.totalRevenue} TL` },
    { Metrik: "Toplam Rezervasyon", Değer: summary.totalReservations },
    { Metrik: "Ortalama Doluluk", Değer: `%${summary.avgOccupancy}` },
    { Metrik: "En Çok Kullanılan Oda", Değer: summary.mostUsedRoom },
    { Metrik: "En Az Kullanılan Oda", Değer: summary.leastUsedRoom },
  ]);

  const detaySheet = XLSX.utils.json_to_sheet(
    reportRows.map((r) => ({
      Oda: r.room,
      Bina: r.building,
      Kullanıcı: r.user_name,
      Başlangıç: r.start,
      Bitiş: r.end,
      Ücret: r.price,
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summarySheet, "Özet");
  XLSX.utils.book_append_sheet(wb, detaySheet, "Detay");
  XLSX.writeFile(wb, `rapor_${from?.format("DD-MM-YYYY")}_${to?.format("DD-MM-YYYY")}.xlsx`);
};

const turkceyiDuzelt = (text: string) =>
  text
    .replace(/ı/g, "i").replace(/İ/g, "I")
    .replace(/ş/g, "s").replace(/Ş/g, "S")
    .replace(/ğ/g, "g").replace(/Ğ/g, "G")
    .replace(/ü/g, "u").replace(/Ü/g, "U")
    .replace(/ö/g, "o").replace(/Ö/g, "O")
    .replace(/ç/g, "c").replace(/Ç/g, "C");

// ── Export: PDF ──
const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Rezervasyon Raporu", 14, 15);

  doc.setFontSize(11);
  doc.text(`Toplam Gelir: ${summary.totalRevenue} TL`, 14, 25);
  doc.text(`Toplam Rezervasyon: ${summary.totalReservations}`, 14, 31);
  doc.text(`Ortalama Doluluk: %${summary.avgOccupancy}`, 14, 37);
  doc.text(`En Cok Kullanilan: ${turkceyiDuzelt(summary.mostUsedRoom)}`, 14, 43);
  doc.text(`En Az Kullanilan: ${turkceyiDuzelt(summary.leastUsedRoom)}`, 14, 49);

  autoTable(doc, {
    startY: 56,
    head: [["Oda", "Bina", "Kullanici", "Baslangic", "Bitis", "Ucret"]],
    body: reportRows.map((r) => [
      turkceyiDuzelt(r.room),
      turkceyiDuzelt(r.building),
      turkceyiDuzelt(r.user_name),
      r.start,
      r.end,
      `${r.price} TL`,
    ]),
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 32 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
    },
    styles: { fontSize: 9, cellPadding: 3 },
  });
  doc.save(`rapor_${from?.format("DD-MM-YYYY")}_${to?.format("DD-MM-YYYY")}.pdf`);
};

  // ── Export: Word ──
  const exportWord = async () => {
  const summaryParagraphs = [
    new Paragraph({ text: `Toplam Gelir: ${summary.totalRevenue} TL` }),
    new Paragraph({ text: `Toplam Rezervasyon: ${summary.totalReservations}` }),
    new Paragraph({ text: `Ortalama Doluluk: %${summary.avgOccupancy}` }),
    new Paragraph({ text: `En Çok Kullanılan Oda: ${summary.mostUsedRoom}` }),
    new Paragraph({ text: `En Az Kullanılan Oda: ${summary.leastUsedRoom}` }),
    new Paragraph({ text: "" }),
  ];

  const tableRows = [
    new DocxRow({
      children: ["Oda", "Bina", "Kullanıcı", "Başlangıç", "Bitiş", "Ücret"].map(
        (h) => new DocxCell({ children: [new Paragraph({ text: h })] })
      ),
    }),
    ...reportRows.map(
      (r) =>
        new DocxRow({
          children: [r.room, r.building, r.user_name, r.start, r.end, `${r.price} TL`].map(
            (v) => new DocxCell({ children: [new Paragraph({ text: v })] })
          ),
        })
    ),
  ];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "Rezervasyon Raporu", heading: "Heading1" }),
          ...summaryParagraphs,
          new DocxTable({ rows: tableRows }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `rapor_${from?.format("DD-MM-YYYY")}_${to?.format("DD-MM-YYYY")}.docx`);
};

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
            <DatePicker
  label="Başlangıç"
  value={from}
  onChange={setFrom}
  maxDate={to ?? undefined}
  format="DD/MM/YYYY"
  slotProps={{ textField: { size: "small" } }}
/>
<DatePicker
  label="Bitiş"
  value={to}
  onChange={setTo}
  minDate={from ?? undefined}
  format="DD/MM/YYYY"
  slotProps={{ textField: { size: "small" } }}
/>
            <TextField select size="small" label="Oda" value={room} onChange={(e) => setRoom(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value="all">Tüm Odalar</MenuItem>
              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={fetchDetailedReport} disabled={loadingReport}>
              {loadingReport ? <CircularProgress size={20} /> : "Detaylı Raporu Getir"}
            </Button>
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
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 2 }}>
  <Typography variant="h4" sx={{ fontWeight: 700 }}>
    {k.suffix}{k.value}
  </Typography>
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
<BarChart
  dataset={occupancyDataset}
  xAxis={[{ dataKey: "date", scaleType: "band", disableLine: true, disableTicks: true }]}
  yAxis={[{ max: 100, disableLine: true, disableTicks: true, valueFormatter: (v: number) => `%${v}` }]}
  series={lineSeries.map((s) => ({ dataKey: s.dataKey, label: s.label, color: s.color }))}
  height={320}
  borderRadius={6}
  margin={{ left: 10, right: 10, top: 20, bottom: 10 }}
  grid={{ horizontal: true }}
  sx={{
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
    data: roomDistribution,
                    innerRadius: 68,
                    outerRadius: 100,
                    paddingAngle: 3,
                    cornerRadius: 6,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { innerRadius: 68, additionalRadius: -6, color: "#E2E8F0" },
                  }]}
                   colors={[...BRAND_COLORS, "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16", "#06B6D4", "#F43F5E"]}
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
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
  {roomDistribution.reduce((sum, d) => sum + d.value, 0)}
</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 12 }}>rezervasyon</Typography>
                </Box>
              </Box>

              {/* Özel legend */}
              <Box sx={{ mt: 1 }}>
                {roomDistribution.map((d, i) => (
                  <Box key={d.label} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.6 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: BRAND_COLORS[i % BRAND_COLORS.length] }} />
                    <Typography sx={{ fontSize: 13, flexGrow: 1, color: "text.secondary" }}>{d.label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
  {d.value} ({Math.round((d.value / roomDistribution.reduce((sum, x) => sum + x.value, 0)) * 100)}%)
</Typography>
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
                dataset={weekdayData}
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
              {topUsers.map((u, i) => (
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
{reportRows.length > 0 && (
  <Card sx={{ ...cardSx, mb: 3 }}>
    <Typography sx={{ fontWeight: 600, mb: 2 }}>Rapor Özeti</Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, md: 3 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>Toplam Gelir</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>{summary.totalRevenue} TL</Typography>
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>Toplam Rezervasyon</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>{summary.totalReservations}</Typography>
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>Ortalama Doluluk</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>%{summary.avgOccupancy}</Typography>
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>En Çok / En Az Kullanılan</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
          {summary.mostUsedRoom} / {summary.leastUsedRoom}
        </Typography>
      </Grid>
    </Grid>
  </Card>
)}

        {/* ── Detaylı Rapor Tablosu + Export Butonları ── */}
        {reportRows.length > 0 && (
          <Card sx={{ ...cardSx, mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>
                Detaylı Rapor ({reportRows.length} kayıt)
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" variant="outlined" onClick={exportExcel}>Excel</Button>
                <Button size="small" variant="outlined" onClick={exportPDF}>PDF</Button>
                <Button size="small" variant="outlined" onClick={exportWord}>Word</Button>
              </Box>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
<TableCell>Oda</TableCell>
<TableCell>Bina</TableCell>
<TableCell>Kullanıcı</TableCell>
<TableCell>Başlangıç</TableCell>
                  <TableCell>Bitiş</TableCell>
                  <TableCell>Ücret</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportRows.map((r) => (
                  <TableRow key={r.id}>
<TableCell>{r.room}</TableCell>
<TableCell>{r.building}</TableCell>
<TableCell>{r.user_name}</TableCell>
<TableCell>{r.start}</TableCell>
                    <TableCell>{r.end}</TableCell>
                    <TableCell>{r.price} ₺</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </Box>
    </LocalizationProvider>
  );
}