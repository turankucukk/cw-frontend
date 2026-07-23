"use client";

import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";

import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

type RoomGalleryProps = {
  images: string[];
  roomName: string;
};

export default function RoomGallery({
  images,
  roomName,
}: RoomGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const openGallery = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const closeGallery = () => {
    setOpen(false);
  };

  const goToImage = (index: number) => {
    if (images.length === 0) {
      return;
    }

    const newIndex =
      (index + images.length) % images.length;

    setActiveIndex(newIndex);

    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollTo({
      left: slider.clientWidth * newIndex,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const slider = sliderRef.current;

    if (!slider || slider.clientWidth === 0) {
      return;
    }

    const currentIndex = Math.round(
      slider.scrollLeft / slider.clientWidth,
    );

    setActiveIndex(currentIndex);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const slider = sliderRef.current;

      if (!slider) {
        return;
      }

      slider.scrollTo({
        left: slider.clientWidth * activeIndex,
      });
    }, 50);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [open]);

  if (images.length === 0) {
    return (
      <Box
        sx={{
          height: 420,
          borderRadius: 3,
          backgroundColor: "#f2f3f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e1e4e8",
        }}
      >
        <Typography color="text.secondary">
          Bu oda için henüz görsel eklenmemiş.
        </Typography>
      </Box>
    );
  }

  const firstImage = images[0];
  const secondImage = images[1];
  const thirdImage = images[2];

  return (
    <>
      {/* Sayfadaki fotoğraf ön izlemesi */}
      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: images.length === 1 ? "1fr" : "2fr 1fr",
          },
          gridTemplateRows: {
            xs: "280px",
            md: "240px 240px",
          },
          gap: 1.5,
          overflow: "hidden",
          borderRadius: 3,
          height: {
            xs: 280,
            md: 480,
          },
        }}
      >
        {/* Büyük ana fotoğraf */}
        <Box
          onClick={() => openGallery(0)}
          sx={{
            position: "relative",
            gridRow: {
              xs: "auto",
              md: images.length > 1 ? "1 / 3" : "auto",
            },
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={firstImage}
            alt={`${roomName} ana fotoğrafı`}
            sx={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
              transition: "transform 200ms ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          />
        </Box>

        {/* Sağ üst fotoğraf */}
        {secondImage && (
          <Box
            onClick={() => openGallery(1)}
            sx={{
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
              display: {
                xs: "none",
                md: "block",
              },
              gridRow:
                images.length === 2 ? "1 / 3" : "auto",
            }}
          >
            <Box
              component="img"
              src={secondImage}
              alt={`${roomName} ikinci fotoğrafı`}
              sx={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                transition: "transform 200ms ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Box>
        )}

        {/* Sağ alt fotoğraf */}
        {thirdImage && (
          <Box
            onClick={() => openGallery(2)}
            sx={{
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Box
              component="img"
              src={thirdImage}
              alt={`${roomName} üçüncü fotoğrafı`}
              sx={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                transition: "transform 200ms ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Box>
        )}

        {/* Tüm fotoğrafları açma butonu */}
        <Button
          variant="contained"
          startIcon={<CameraAltRoundedIcon />}
          onClick={(event) => {
            event.stopPropagation();
            openGallery(0);
          }}
          sx={{
            position: "absolute",
            right: 20,
            bottom: 20,
            backgroundColor: "#ffffff",
            color: "#171717",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            zIndex: 2,
            "&:hover": {
              backgroundColor: "#f2f2f2",
            },
          }}
        >
          Tüm {images.length} fotoğrafı göster
        </Button>
      </Box>

      {/* Büyük popup galeri */}
      <Dialog
        open={open}
        onClose={closeGallery}
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "#0d0d0d",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: {
              xs: "70vh",
              md: "85vh",
            },
            backgroundColor: "#0d0d0d",
          }}
        >
          {/* Kapatma butonu */}
          <IconButton
            aria-label="Galeriyi kapat"
            onClick={closeGallery}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              color: "#ffffff",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>

          {/* Kaydırılabilir fotoğraflar */}
          <Box
            ref={sliderRef}
            onScroll={handleScroll}
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {images.map((image, index) => (
              <Box
                key={`${image}-${index}`}
                sx={{
                  flex: "0 0 100%",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scrollSnapAlign: "center",
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`${roomName} fotoğrafı ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Sol ok */}
          {images.length > 1 && (
            <IconButton
              aria-label="Önceki fotoğraf"
              onClick={() => goToImage(activeIndex - 1)}
              sx={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "#ffffff",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
          )}

          {/* Sağ ok */}
          {images.length > 1 && (
            <IconButton
              aria-label="Sonraki fotoğraf"
              onClick={() => goToImage(activeIndex + 1)}
              sx={{
                position: "absolute",
                right: 18,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "#ffffff",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          )}

          {/* Fotoğraf sayacı */}
          <Typography
            sx={{
              position: "absolute",
              bottom: 18,
              left: "50%",
              transform: "translateX(-50%)",
              color: "#ffffff",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              borderRadius: 2,
              px: 2,
              py: 0.75,
              zIndex: 10,
            }}
          >
            {activeIndex + 1} / {images.length}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}