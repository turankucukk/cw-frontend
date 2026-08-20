"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useUserRole } from "@/src/hooks/useUserRole";
import { can } from "@/src/lib/permissions";
import { createClient } from "@/src/utils/supabase/client";
import dayjs from "dayjs";
import { toAppTz } from "@/src/lib/date";
import { useToast } from "@/src/contexts/toastcontext";
import { useMediaQuery, useTheme, Stack } from "@mui/material";

type PendingReservation = {
  id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  participant_count: number;
  room: string;
  building: string;
  user_name: string;
  user_id: number;
};

export default function ApprovalsPage() {
  const { role, loading } = useUserRole();
  const router = useRouter();
  const { showToast } = useToast();

  const [rows, setRows] = useState<PendingReservation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!loading && !can(role as any, "approvals.manage")) {
      router.push("/admin");
    }
  }, [role, loading, router]);

  const fetchPending = async () => {
    setDataLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reservation")
      .select(
        `
        id,
        start_time,
        end_time,
        total_price,
        participant_count,
        user_id,
        user:user_id ( name, surname ),
        space:space_id (
          name,
          building:building_id ( name )
        )
      `
      )
      .eq("status", "pending")
      .order("start_time", { ascending: true });

    if (error) {
      console.error(error);
      setDataLoading(false);
      return;
    }

    const formatted: PendingReservation[] = (data ?? []).map((r: any) => ({
      id: r.id,
      start_time: toAppTz(r.start_time).format("DD.MM.YYYY HH:mm"),
      end_time: toAppTz(r.end_time).format("DD.MM.YYYY HH:mm"),
      total_price: r.total_price ?? 0,
      participant_count: r.participant_count ?? 0,
      room: r.space?.name ?? "-",
      building: r.space?.building?.name ?? "-",
      user_name: r.user ? `${r.user.name ?? ""} ${r.user.surname ?? ""}`.trim() : "-",
      user_id: r.user_id,
    }));

    setRows(formatted);
    setDataLoading(false);
  };

  useEffect(() => {
    if (!loading && can(role as any, "approvals.manage")) {
      fetchPending();
    }
  }, [loading, role]);

  const handleDecision = async (id: number, decision: "confirmed" | "cancelled") => {
  setProcessingId(id);
  const supabase = createClient();
  const { error } = await supabase
    .from("reservation")
    .update({ status: decision })
    .eq("id", id);

  if (error) {
    console.error(error);
    showToast("İşlem sırasında hata oluştu: " + error.message, "error");
    setProcessingId(null);
    return;
  }

  const { error: paymentError } = await supabase
    .from("payment")
    .update(
      decision === "confirmed"
        ? { status: "paid", paid_at: new Date().toISOString() }
        : { status: "cancelled" }
    )
    .eq("reservation_id", id);

  if (paymentError) {
    console.error(paymentError);
  }

  const targetRow = rows.find((r) => r.id === id);
  if (targetRow) {
    const { error: notificationError } = await supabase.from("notifications").insert({
      user_id: targetRow.user_id,
      message:
        decision === "confirmed"
          ? `${targetRow.room} rezervasyonunuz onaylandı, ödemeniz tamamlandı. Faturanızı görüntülemek için tıklayın.`
          : `${targetRow.room} rezervasyonunuz reddedildi.`,
      link: decision === "confirmed" ? `/invoice/${id}` : `/user/profile?tab=payments`,
    });

    if (notificationError) {
      console.error(notificationError);
    }
  }

  showToast(
    decision === "confirmed" ? "Rezervasyon onaylandı!" : "Rezervasyon reddedildi!",
    decision === "confirmed" ? "success" : "error"
  );

  setRows((prev) => prev.filter((r) => r.id !== id));
  setProcessingId(null);
};

  if (loading || dataLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={40} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  if (!can(role as any, "approvals.manage")) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Onay Bekleyen Rezervasyonlar
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Onay gerektiren odalara yapılan rezervasyonları burada onaylayabilir veya reddedebilirsiniz.
      </Typography>

            {rows.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid #E2E8F0" }}>
          <Typography sx={{ color: "text.secondary" }}>Şu anda onay bekleyen rezervasyon yok.</Typography>
        </Card>
      ) : isMobile ? (
        <Stack spacing={2}>
          {rows.map((r) => (
            <Card
              key={r.id}
              sx={{ p: 2.5, borderRadius: 3, border: "1px solid #E2E8F0" }}
            >
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{r.room}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {r.building}
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Kullanıcı</Typography>
                  <Typography variant="body2">{r.user_name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Katılımcı</Typography>
                  <Typography variant="body2">{r.participant_count}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Başlangıç</Typography>
                  <Typography variant="body2">{r.start_time}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Bitiş</Typography>
                  <Typography variant="body2">{r.end_time}</Typography>
                </Box>
              </Box>

              <Typography sx={{ fontWeight: 700, mb: 2 }}>{r.total_price} TL</Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  color="success"
                  disabled={processingId === r.id}
                  onClick={() => handleDecision(r.id, "confirmed")}
                >
                  Onayla
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  color="error"
                  disabled={processingId === r.id}
                  onClick={() => handleDecision(r.id, "cancelled")}
                >
                  Reddet
                </Button>
              </Box>
            </Card>
          ))}
        </Stack>
      ) : (
        <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Oda</TableCell>
                <TableCell>Bina</TableCell>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Başlangıç</TableCell>
                <TableCell>Bitiş</TableCell>
                <TableCell>Katılımcı</TableCell>
                <TableCell>Ücret</TableCell>
                <TableCell align="right">İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.room}</TableCell>
                  <TableCell>{r.building}</TableCell>
                  <TableCell>{r.user_name}</TableCell>
                  <TableCell>{r.start_time}</TableCell>
                  <TableCell>{r.end_time}</TableCell>
                  <TableCell>{r.participant_count}</TableCell>
                  <TableCell>{r.total_price} TL</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={processingId === r.id}
                        onClick={() => handleDecision(r.id, "confirmed")}
                      >
                        Onayla
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={processingId === r.id}
                        onClick={() => handleDecision(r.id, "cancelled")}
                      >
                        Reddet
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  );
}