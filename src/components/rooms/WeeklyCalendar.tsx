"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isReservationExpired } from "@/src/utils/reservationUtils";

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
};

function formatDateForInput(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );

  const day = String(date.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

function formatTimeForInput(date: Date) {
  const hour = String(date.getHours()).padStart(
    2,
    "0"
  );

  const minute = String(date.getMinutes()).padStart(
    2,
    "0"
  );

  return `${hour}:${minute}`;
}

export default function WeeklyCalendar({
  roomId,
  roomCapacity,
}: WeeklyCalendarProps) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [participantCount, setParticipantCount] =
    useState("1");

  const [reservations, setReservations] =
    useState<CalendarReservation[]>([]);


  useEffect(() => {
    const fetchReservations = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("reservation")
        .select(
          "id, space_id, start_time, end_time, status"
        )
        .eq("space_id", roomId)
        .neq("status", "cancelled")
        .order("start_time", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Rezervasyonlar alınamadı:",
          JSON.stringify(error, null, 2)
        );

        return;
      }

      const calendarEvents: CalendarReservation[] =
        (data ?? [])
          .filter((reservation) => {
            // Eğer rezervasyon onaylıysa ama 15 dk içinde check-in (qr okutma) yapılmadıysa
            // takvimde dolu olarak GÖSTERME (başkasının alabilmesi için boşa düşür)
            if ((reservation.status === "confirmed" || reservation.status === "approved" || reservation.status === "pending") && isReservationExpired(reservation.start_time)) {
              return false;
            }
            return true;
          })
          .map((reservation) => ({
            id: String(reservation.id),
            title: "Dolu",
            start: reservation.start_time,
            end: reservation.end_time,
          }));

      setReservations(calendarEvents);
    };

    fetchReservations();
  }, [roomId]);

  const handleDateClick = (
    clickedDate: Date
  ) => {
    if (clickedDate < new Date()) {
      alert("Geçmiş bir tarihe veya saate rezervasyon yapamazsınız.");
      return;
    }

    const finishDate = new Date(clickedDate);

    finishDate.setHours(
      finishDate.getHours() + 1
    );

    setSelectedDate(
      formatDateForInput(clickedDate)
    );

    setStartTime(
      formatTimeForInput(clickedDate)
    );

    setEndTime(
      formatTimeForInput(finishDate)
    );

    setParticipantCount("1");

    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    const participantNumber =
      Number(participantCount);

    if (
      !selectedDate ||
      !startTime ||
      !endTime
    ) {
      alert(
        "Tarih, başlangıç ve bitiş saatini seçmelisin."
      );

      return;
    }

    if (startTime >= endTime) {
      alert(
        "Bitiş saati başlangıç saatinden sonra olmalıdır."
      );

      return;
    }

    const start = new Date(
      `${selectedDate}T${startTime}:00`
    );

    const end = new Date(
      `${selectedDate}T${endTime}:00`
    );

    if (start < new Date()) {
      alert("Geçmiş bir tarih veya saate rezervasyon yapamazsınız.");
      return;
    }

    const minParticipants = Math.ceil(roomCapacity * 2 / 3);

    if (
      !Number.isInteger(participantNumber) ||
      participantNumber < minParticipants ||
      participantNumber > roomCapacity
    ) {
      alert(
        `Katılımcı sayısı ${minParticipants} ile ${roomCapacity} arasında olmalıdır.`
      );

      return;
    }

    const hasConflict = reservations.some(
      (reservation) => {
        const existingStart = new Date(
          reservation.start
        );

        const existingEnd = new Date(
          reservation.end
        );

        return (
          start < existingEnd &&
          end > existingStart
        );
      }
    );

    if (hasConflict) {
      alert(
        "Seçtiğiniz saat aralığı dolu. Lütfen başka bir saat seçin."
      );

      return;
    }

    const paymentUrl =
      `/payment?roomId=${roomId}` +
      `&start=${encodeURIComponent(
        start.toISOString()
      )}` +
      `&end=${encodeURIComponent(
        end.toISOString()
      )}` +
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

          p: {
            xs: 1,
            md: 3,
          },

          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            minWidth: {
              xs: 900,
              md: "100%",
            },
          }}
        >
          <FullCalendar
            plugins={[
              timeGridPlugin,
              interactionPlugin,
            ]}
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
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "timeGridWeek,timeGridDay",
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
            events={reservations}
          />
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Rezervasyon Oluştur
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Tarih"
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(
                  event.target.value
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
            />

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },

                gap: 2,
              }}
            >
              <TextField
                label="Başlangıç"
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(
                    event.target.value
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
              />

              <TextField
                label="Bitiş"
                type="time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(
                    event.target.value
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
              />
            </Box>

            <TextField
              label="Katılımcı sayısı"
              type="number"
              value={participantCount}
              onChange={(event) =>
                setParticipantCount(
                  event.target.value
                )
              }
              slotProps={{
                htmlInput: {
                  min: Math.ceil(roomCapacity * 2 / 3),
                  max: roomCapacity,
                },
              }}
              helperText={`Min: ${Math.ceil(roomCapacity * 2 / 3)} | Max: ${roomCapacity}`}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              textTransform: "none",
            }}
          >
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