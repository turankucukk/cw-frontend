"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  IconButton,
  Grid,
  Card,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useUserRole } from "@/src/hooks/useUserRole";
import { can, type Role } from "@/src/lib/permissions";
import {
  getUsers,
  getReservations,
  getActivityEvents,
  type AdminUser,
  type ReservationRecord,
  type ActivityEvent,
} from "@/src/lib/api/users";

function matchesQuery(u: AdminUser, query: string) {
  const q = query.trim().toLowerCase();
  return (
    q === "" ||
    u.fullName.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );
}

function UserTable({
  users,
  loading,
  onDelete,
}: {
  users: AdminUser[];
  loading: boolean;
  onDelete: (userId: number) => void;
}) {
  return (
    <TableContainer 
      component={Paper} 
      variant="outlined" 
      sx={{ mb: 3, maxWidth: "100%", overflowX: "auto" }}
    >
      <Table size="small" sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f9fafb" }}>
            <TableCell sx={{ fontWeight: 600 }}>Ad Soyad</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Kayıt Tarihi</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Sil</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} hover>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{u.fullName}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {new Date(u.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(u.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && !loading && (
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
                sx={{ py: 3, color: "text.secondary" }}
              >
                Kriterlere uyan kullanıcı bulunamadı.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const RESERVATION_STATUS_LABELS: Record<
  ReservationRecord["status"],
  { label: string; color: "info" | "success" | "error" }
> = {
  upcoming: { label: "Yaklaşan", color: "info" },
  completed: { label: "Tamamlandı", color: "success" },
  cancelled: { label: "İptal", color: "error" },
};

export default function AdminUsersPage() {
  const { role, loading: roleLoading } = useUserRole();
  const router = useRouter();

  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!roleLoading && !can((role as Role) ?? "user", "users.view")) {
      router.push("/");
    }
  }, [role, roleLoading, router]);

  useEffect(() => {
    Promise.all([getUsers(), getReservations(), getActivityEvents()]).then(
      ([u, r, e]) => {
        setUsers(u);
        setReservations(r);
        setEvents(e);
        setDataLoading(false);
      },
    );
  }, []);

  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const superAdminUsers = useMemo(
    () =>
      users.filter((u) => u.role === "superadmin" && matchesQuery(u, search)),
    [users, search],
  );

  const managerUsers = useMemo(
    () => users.filter((u) => u.role === "manager" && matchesQuery(u, search)),
    [users, search],
  );

  const normalUsers = useMemo(
    () => users.filter((u) => u.role === "user" && matchesQuery(u, search)),
    [users, search],
  );

  const stats = useMemo(() => {
    return {
      total: users.length,
      superAdmins: users.filter((u) => u.role === "superadmin").length,
      managers: users.filter((u) => u.role === "manager").length,
      normalUsers: users.filter((u) => u.role === "user").length,
      totalReservations: reservations.length,
      upcomingReservations: reservations.filter((r) => r.status === "upcoming")
        .length,
    };
  }, [users, reservations]);

  if (roleLoading || !can((role as Role) ?? "user", "users.view")) {
    return null;
  }

  return (
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 2 }}>
      {/* BAŞLIK */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", fontSize: { xs: "22px", sm: "28px" } }}>
          Kullanıcılar
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "13px", sm: "14px" } }}>
          Yönetici ve kullanıcı hesaplarını görüntüle, filtrele ve yönet.
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: "1px solid #e5e7eb" }}>
        <Tab label="Kullanıcılar" />
        <Tab label="Rezervasyonlar" />
        <Tab label="İstatistikler" />
        <Tab label="Aktivite" />
      </Tabs>

      {/* ─── SEKME 0: KULLANICI LİSTESİ ─── */}
      {tab === 0 && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="İsim veya email ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ maxWidth: { sm: 320 } }}
            />
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Süper Yöneticiler ({superAdminUsers.length})
          </Typography>
          <UserTable
            users={superAdminUsers}
            loading={dataLoading}
            onDelete={handleDeleteUser}
          />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, mt: 4 }}>
            Yöneticiler ({managerUsers.length})
          </Typography>
          <UserTable
            users={managerUsers}
            loading={dataLoading}
            onDelete={handleDeleteUser}
          />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, mt: 4 }}>
            Kullanıcılar ({normalUsers.length})
          </Typography>
          <UserTable
            users={normalUsers}
            loading={dataLoading}
            onDelete={handleDeleteUser}
          />
        </Box>
      )}

      {/* ─── SEKME 1: REZERVASYONLAR ─── */}
      {tab === 1 && (
        <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 550 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Oda</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Saat</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{r.userName}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{r.roomName}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{r.date}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{r.time}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={RESERVATION_STATUS_LABELS[r.status].label}
                      color={RESERVATION_STATUS_LABELS[r.status].color}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {reservations.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    Henüz rezervasyon bulunmuyor. Bu özellik eklendiğinde burada
                    listelenecek.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ─── SEKME 2: İSTATİSTİKLER ─── */}
      {tab === 2 && (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {[
            {
              label: "Toplam Kullanıcı",
              value: stats.total,
              icon: <PeopleIcon />,
              color: "#2563eb",
            },
            {
              label: "Süper Yönetici Sayısı",
              value: stats.superAdmins,
              icon: <AdminPanelSettingsIcon />,
              color: "#f43f5e",
            },
            {
              label: "Yönetici Sayısı",
              value: stats.managers,
              icon: <AdminPanelSettingsIcon />,
              color: "#10b981",
            },
            {
              label: "Normal Kullanıcı",
              value: stats.normalUsers,
              icon: <PersonIcon />,
              color: "#8b5cf6",
            },
            {
              label: "Toplam Rezervasyon",
              value: stats.totalReservations,
              icon: <EventAvailableIcon />,
              color: "#f59e0b",
            },
            {
              label: "Yaklaşan Rezervasyon",
              value: stats.upcomingReservations,
              icon: <EventAvailableIcon />,
              color: "#ef4444",
            },
          ].map((card) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.label}>
              <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{card.value}</Typography>
                    <Typography sx={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{card.label}</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 42 },
                      height: { xs: 36, sm: 42 },
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: `${card.color}1f`,
                      color: card.color,
                      flexShrink: 0
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ─── SEKME 3: AKTİVİTE / OLAY GEÇMİŞİ ─── */}
      {tab === 3 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {events.map((ev) => (
            <Paper key={ev.id} variant="outlined" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 14, color: "#111827" }}>{ev.message}</Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", ml: 2 }}>
                {ev.timestamp}
              </Typography>
            </Paper>
          ))}
          {events.length === 0 && (
            <Paper
              variant="outlined"
              sx={{ p: 4, textAlign: "center", color: "text.secondary" }}
            >
              Henüz bir aktivite kaydı yok. Bu özellik eklendiğinde burada
              listelenecek.
            </Paper>
          )}
        </Box>
      )}
    </Container>
  );
}
