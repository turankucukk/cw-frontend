"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { createClient } from "@/src/utils/supabase/client";

type WeeklyCalendarProps = {
  roomId: number;
  roomCapacity: number;
};

type CalendarReservation = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    isMine: boolean;
  };
};

function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeForInput(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${hour}:${minute}`;
}

function addOneHour(time: string) {
  if (!time) return "";

  const [hour, minute] = time.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return "";
  }

  const date = new Date();

  date.setHours(hour, minute, 0, 0);
  date.setHours(date.getHours() + 1);

  return formatTimeForInput(date);
}

function getNextHour() {
  const date = new Date();

  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);

  return date;
}

export default function WeeklyCalendar({
  roomId,
  roomCapacity,
}: WeeklyCalendarProps) {
  const router = useRouter();

  const minParticipants = Math.ceil((roomCapacity * 2) / 3);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participantCount, setParticipantCount] = useState(String(minParticipants));
  const [reservations, setReservations] = useState<CalendarReservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const supabase = createClient();

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Kullanıcı bilgisi alınamadı:", authError);
      }

      let currentDbUserId: number | string | null = null;

      if (authUser) {
        const { data: dbUser, error: dbUserError } = await supabase
          .from("user")
          .select("id")
          .eq("user_id", authUser.id)
          .single();

        if (dbUserError) {
          console.error("Public user bulunamadı:", dbUserError);
        } else if (dbUser) {
          currentDbUserId = dbUser.id;
        }
      }

      const { data, error } = await supabase
        .from("reservation")
        .select(`
          id,
          space_id,
          user_id,
          start_time,
          end_time,
          status
        `)
        .eq("space_id", roomId)
        .neq("status", "cancelled")
        .order("start_time", {
          ascending: true,
        });

      if (error) {
        console.error("Rezervasyonlar alınamadı:", error);
        return;
      }

      const calendarEvents: CalendarReservation[] = (data ?? []).map((reservation) => {
        const isMine =
          currentDbUserId !== null &&
          String(currentDbUserId) === String(reservation.user_id);

        return {
          id: String(reservation.id),
          title: isMine ? "Rezervasyonum" : "Dolu",
          start: reservation.start_time,
          end: reservation.end_time,
          backgroundColor: isMine ? "#175bb8" : "#9ca3af",
          borderColor: isMine ? "#175bb8" : "#9ca3af",
          textColor: "#ffffff",
          extendedProps: {
            isMine,
          },
        };
      });

      setReservations(calendarEvents);
    };

    fetchReservations();
  }, [roomId]);

  const handleDateClick = (clickedDate: Date) => {
    if (clickedDate < new Date()) {
      alert("Geçmiş bir tarihe veya saate rezervasyon yapamazsınız.");
      return;
    }

    const finishDate = new Date(clickedDate);

    finishDate.setHours(finishDate.getHours() + 1);

    setSelectedDate(formatDateForInput(clickedDate));
    setStartTime(formatTimeForInput(clickedDate));
    setEndTime(formatTimeForInput(finishDate));
    setParticipantCount(String(minParticipants));

    setDialogOpen(true);
  };

  const handleAddReservation = () => {
    const nextHour = getNextHour();
    const finishDate = new Date(nextHour);

    finishDate.setHours(finishDate.getHours() + 1);

    setSelectedDate(formatDateForInput(new Date()));
    setStartTime(formatTimeForInput(nextHour));
    setEndTime(formatTimeForInput(finishDate));
    setParticipantCount(String(minParticipants));

    setDialogOpen(true);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    setEndTime(addOneHour(value));
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    if (!selectedDate) {
      alert("Lütfen tarih seçin.");
      return;
    }

    if (!startTime) {
      alert("Lütfen başlangıç saatini seçin.");
      return;
    }

    if (!endTime) {
      alert("Lütfen bitiş saatini seçin.");
      return;
    }

    const participantNumber = Number(participantCount);

    const start = new Date(`${selectedDate}T${startTime}:00`);
    const end = new Date(`${selectedDate}T${endTime}:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      alert("Tarih veya saat bilgisi geçersiz.");
      return;
    }

    if (end <= start) {
      alert("Bitiş saati başlangıç saatinden sonra olmalıdır.");
      return;
    }

    if (start < new Date()) {
      alert("Geçmiş bir tarih veya saate rezervasyon yapamazsınız.");
      return;
    }

    if (
      !Number.isInteger(participantNumber) ||
      participantNumber < minParticipants ||
      participantNumber > roomCapacity
    ) {
      alert(`Katılımcı sayısı ${minParticipants} ile ${roomCapacity} arasında olmalıdır.`);
      return;
    }

    const hasConflict = reservations.some((reservation) => {
      const existingStart = new Date(reservation.start);
      const existingEnd = new Date(reservation.end);

      return start < existingEnd && end > existingStart;
    });

    if (hasConflict) {
      alert("Seçtiğiniz saat aralığı dolu. Lütfen başka bir saat seçin.");
      return;
    }

    const paymentUrl =
      `/payment?roomId=${roomId}` +
      `&start=${encodeURIComponent(start.toISOString())}` +
      `&end=${encodeURIComponent(end.toISOString())}` +
      `&participants=${participantNumber}`;

    setDialogOpen(false);

    router.push(paymentUrl);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #dfe5ed",
          borderRadius: 3,
          p: { xs: 1, md: 3 },
          overflowX: "auto",
          "& .fc-addReservation-button": {
            backgroundColor: "#175bb8 !important",
            borderColor: "#175bb8 !important",
            color: "#ffffff !important",
          },
          "& .fc-addReservation-button:hover": {
            backgroundColor: "#104a99 !important",
            borderColor: "#104a99 !important",
          },
        }}
      >
        <Box sx={{ minWidth: { xs: 300, md: 500, xl: "100%" } }}>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            firstDay={1}
            allDaySlot={false}
            weekends={true}
            nowIndicator={true}
            selectable={true}
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            slotDuration="01:00:00"
            height="auto"
            customButtons={{
              addReservation: {
                text: "Ekle",
                click: handleAddReservation,
              },
            }}
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "addReservation timeGridWeek,timeGridDay",
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            dateClick={(info) => {
              handleDateClick(info.date);
            }}
            eventClick={(info) => {
              const isMine = info.event.extendedProps.isMine;

              if (!isMine) {
                return;
              }

              router.push(
                `/profile?tab=reservations&reservationId=${info.event.id}`
              );
            }}
            eventDidMount={(info) => {
              const isMine = info.event.extendedProps.isMine;

              info.el.style.cursor = isMine ? "pointer" : "default";
            }}
            events={reservations}
          />
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          Rezervasyon Oluştur
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField
              label="Tarih"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: formatDateForInput(new Date()) },
              }}
              fullWidth
            />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="Başlangıç"
                type="time"
                value={startTime}
                onChange={(event) => handleStartTimeChange(event.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { step: 300 },
                }}
                fullWidth
              />

              <TextField
                label="Bitiş"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { step: 300 },
                }}
                fullWidth
              />
            </Box>

            <TextField
              label="Katılımcı sayısı"
              type="number"
              value={participantCount}
              onChange={(event) => setParticipantCount(event.target.value)}
              slotProps={{
                htmlInput: {
                  min: minParticipants,
                  max: roomCapacity,
                },
              }}
              helperText={`Min: ${minParticipants} | Max: ${roomCapacity}`}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>
            İptal
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              textTransform: "none",
              backgroundColor: "#175bb8",
              "&:hover": {
                backgroundColor: "#104a99",
              },
            }}
          >
            Ödemeye Geç
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}