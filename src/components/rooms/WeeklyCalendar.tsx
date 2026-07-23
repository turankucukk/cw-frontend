"use client";

import { useMemo, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import classicThemePlugin from "@fullcalendar/react/themes/classic";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

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

function getCurrentWeekDate(dayOffset: number, hour: number) {
  const today = new Date();
  const currentDay = today.getDay();

  const mondayDifference = currentDay === 0 ? -6 : 1 - currentDay;

  const result = new Date(today);

  result.setDate(today.getDate() + mondayDifference + dayOffset);
  result.setHours(hour, 0, 0, 0);

  return result;
}

export default function WeeklyCalendar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participantCount, setParticipantCount] = useState("1");

  const exampleReservations = useMemo(
    () => [
      {
        id: "reservation-1",
        title: "Dolu",
        start: getCurrentWeekDate(1, 10),
        end: getCurrentWeekDate(1, 12),
      },
      {
        id: "reservation-2",
        title: "Dolu",
        start: getCurrentWeekDate(3, 14),
        end: getCurrentWeekDate(3, 16),
      },
    ],
    [],
  );

  const handleDateClick = (clickedDate: Date) => {
    const finishDate = new Date(clickedDate);

    finishDate.setHours(finishDate.getHours() + 1);

    setSelectedDate(formatDateForInput(clickedDate));
    setStartTime(formatTimeForInput(clickedDate));
    setEndTime(formatTimeForInput(finishDate));
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    console.log({
      selectedDate,
      startTime,
      endTime,
      participantCount,
    });

    alert("Rezervasyon bilgileri seçildi.");
    setDialogOpen(false);
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
              classicThemePlugin,
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
            slotHeaderFormat={{
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
            events={exampleReservations}
          />
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
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
              onChange={(event) => setSelectedDate(event.target.value)}
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
                onChange={(event) => setStartTime(event.target.value)}
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
                onChange={(event) => setEndTime(event.target.value)}
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
                setParticipantCount(event.target.value)
              }
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 8,
                },
              }}
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
            sx={{ textTransform: "none" }}
          >
            İptal
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              textTransform: "none",
              backgroundColor: "#175bb8",
            }}
          >
            Rezervasyonu Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}