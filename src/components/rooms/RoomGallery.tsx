"use client";

import { useState } from "react";

import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";

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
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: {
            xs: 260,
            md: 520,
          },
          backgroundColor: "#f3f4f6",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "#9ca3af" }}>
          Bu oda için henüz fotoğraf eklenmemiş.
        </Typography>
      </Box>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: 300,
          sm: 420,
          md: 560,
          lg: 650,
        },
        overflow: "hidden",
        borderRadius: "18px",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Box
        component="img"
        src={images[selectedIndex]}
        alt={`${roomName} fotoğraf ${selectedIndex + 1}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "0.3s ease",
        }}
      />

      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: {
                xs: 12,
                md: 28,
              },
              top: "50%",
              transform: "translateY(-50%)",

              width: {
                xs: 44,
                md: 58,
              },

              height: {
                xs: 44,
                md: 58,
              },

              backgroundColor: "rgba(20, 25, 55, 0.65)",
              color: "#ffffff",

              "&:hover": {
                backgroundColor: "rgba(20, 25, 55, 0.85)",
              },
            }}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: {
                xs: 12,
                md: 28,
              },
              top: "50%",
              transform: "translateY(-50%)",

              width: {
                xs: 44,
                md: 58,
              },

              height: {
                xs: 44,
                md: 58,
              },

              backgroundColor: "rgba(20, 25, 55, 0.65)",
              color: "#ffffff",

              "&:hover": {
                backgroundColor: "rgba(20, 25, 55, 0.85)",
              },
            }}
          >
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        </>
      )}

      {images.length > 1 && (
        <Typography
          sx={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",

            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.5)",

            px: 1.5,
            py: 0.6,

            borderRadius: "8px",
            fontSize: 14,
          }}
        >
          {selectedIndex + 1} / {images.length}
        </Typography>
      )}
    </Box>
  );
}