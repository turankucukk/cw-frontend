import Image from "next/image";

import {
  Box,
  Button,
  Chip,
  Container,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import TvRoundedIcon from "@mui/icons-material/TvRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";

import WeeklyCalendar from "../../../src/components/rooms/WeeklyCalendar";

type RoomPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  const imageFolder = `/rooms/room-${id}`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        pb: 8,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          pt: 3,
        }}
      >
        {/* Geri butonu */}
        <Button
          href="/"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mb: 3,
            color: "#171717",
            textTransform: "none",
            fontSize: 16,
          }}
        >
          Geri
        </Button>

        {/* Fotoğraf alanı */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr",
            },
            gridTemplateRows: {
              xs: "280px 200px 200px",
              md: "240px 240px",
            },
            gap: 1.5,
            overflow: "hidden",
            borderRadius: 3,
          }}
        >
          {/* Büyük fotoğraf */}
          <Box
            sx={{
              position: "relative",
              gridRow: {
                xs: "auto",
                md: "1 / 3",
              },
              minHeight: 280,
            }}
          >
            <Image
              src={`${imageFolder}/first.jpg`}
              alt="Toplantı odası ana fotoğrafı"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 66vw"
              style={{
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Sağ üst fotoğraf */}
          <Box
            sx={{
              position: "relative",
              minHeight: 200,
            }}
          >
            <Image
              src={`${imageFolder}/second.jpg`}
              alt="Toplantı odası ikinci fotoğrafı"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
              style={{
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Sağ alt fotoğraf */}
          <Box
            sx={{
              position: "relative",
              minHeight: 200,
            }}
          >
            <Image
              src={`${imageFolder}/third.jpg`}
              alt="Toplantı odası üçüncü fotoğrafı"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
              style={{
                objectFit: "cover",
              }}
            />

            <Button
              variant="contained"
              startIcon={<CameraAltRoundedIcon />}
              sx={{
                position: "absolute",
                right: 20,
                bottom: 20,
                backgroundColor: "#ffffff",
                color: "#171717",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                "&:hover": {
                  backgroundColor: "#f2f2f2",
                },
              }}
            >
              Tüm 5 fotoğrafı göster
            </Button>
          </Box>
        </Box>

        {/* Oda bilgileri */}
        <Box
          sx={{
            py: {
              xs: 4,
              md: 5,
            },
            maxWidth: 1000,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: 38,
                md: 58,
              },
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            Toplantı Odası {id}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontSize: 18,
              color: "#444444",
            }}
          >
            İstanbul Merkez Ofis • 2. Kat
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mt: 3,
            }}
          >
            <Chip
              icon={<GroupsRoundedIcon />}
              label="8 Kişi"
              variant="outlined"
            />

            <Chip
              icon={<TvRoundedIcon />}
              label="Televizyon"
              variant="outlined"
            />

            <Chip
              icon={<AcUnitRoundedIcon />}
              label="Klima"
              variant="outlined"
            />

            <Chip label="Beyaz Tahta" variant="outlined" />
          </Box>

          <Typography
            sx={{
              mt: 4,
              fontSize: 17,
              lineHeight: 1.8,
              color: "#333333",
            }}
          >
            Modern toplantılar, ekip çalışmaları ve sunumlar için hazırlanmış
            konforlu bir toplantı odasıdır. Odada televizyon, klima, beyaz tahta
            ve yüksek hızlı internet bulunmaktadır.
          </Typography>

          <Button
            href="#weekly-calendar"
            variant="contained"
            size="large"
            sx={{
              mt: 4,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "#175bb8",
              textTransform: "none",
              fontSize: 16,
              "&:hover": {
                backgroundColor: "#104a99",
              },
            }}
          >
            Rezervasyon Yap
          </Button>
        </Box>

        {/* Haftalık takvim */}
        <Box
          id="weekly-calendar"
          sx={{
            scrollMarginTop: 24,
            borderTop: "1px solid #e4e4e4",
            pt: 5,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: 28,
                md: 36,
              },
              fontWeight: 700,
              mb: 1,
            }}
          >
            Haftalık Takvim
          </Typography>

          <Typography
            sx={{
              color: "#666666",
              mb: 4,
            }}
          >
            Boş bir saate tıklayarak rezervasyon oluşturabilirsin.
          </Typography>

          <WeeklyCalendar />
        </Box>
      </Container>
    </Box>
  );
}