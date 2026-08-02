"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: {
            xs: 260,
            md: 480,
          },
          backgroundColor: "#f3f4f6",
          borderRadius: "16px",
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

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

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

  const mainImage = images[0];
  const secondImage = images[1];
  const thirdImage = images[2];

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "2fr 1fr",
          },
          gap: "8px",
          height: {
            xs: "auto",
            md: "520px",
          },
          overflow: "hidden",
          borderRadius: "18px",
        }}
      >
        <Box
          component="img"
          src={mainImage}
          alt={`${roomName} ana fotoğraf`}
          onClick={() => openImage(0)}
          sx={{
            width: "100%",
            height: {
              xs: "280px",
              md: "520px",
            },
            objectFit: "cover",
            cursor: "pointer",
            transition: "0.25s ease",

            "&:hover": {
              filter: "brightness(0.92)",
            },
          }}
        />

        <Box
          sx={{
            display: {
              xs: "none",
              md: "grid",
            },
            gridTemplateRows: "1fr 1fr",
            gap: "8px",
            minWidth: 0,
          }}
        >
          {secondImage ? (
            <Box
              component="img"
              src={secondImage}
              alt={`${roomName} fotoğraf 2`}
              onClick={() => openImage(1)}
              sx={{
                width: "100%",
                height: "100%",
                minHeight: 0,
                objectFit: "cover",
                cursor: "pointer",
                transition: "0.25s ease",

                "&:hover": {
                  filter: "brightness(0.92)",
                },
              }}
            />
          ) : (
            <Box sx={{ backgroundColor: "#f3f4f6" }} />
          )}

          <Box
            sx={{
              position: "relative",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {thirdImage ? (
              <Box
                component="img"
                src={thirdImage}
                alt={`${roomName} fotoğraf 3`}
                onClick={() => openImage(2)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                  transition: "0.25s ease",

                  "&:hover": {
                    filter: "brightness(0.92)",
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f3f4f6",
                }}
              />
            )}

            <Button
              onClick={() => openImage(0)}
              startIcon={<GridViewRoundedIcon />}
              variant="contained"
              sx={{
                position: "absolute",
                right: 16,
                bottom: 16,
                backgroundColor: "#ffffff",
                color: "#171717",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 2,
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.15)",

                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              Tüm fotoğrafları görüntüle
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "transparent",
              boxShadow: "none",
              overflow: "visible",
              borderRadius: "16px",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: {
              xs: "55vh",
              sm: "65vh",
              md: "75vh",
            },
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
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
            }}
          />

          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 5,
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.55)",

              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>

          {images.length > 1 && (
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                top: "50%",
                left: 16,
                transform: "translateY(-50%)",
                zIndex: 5,
                width: 50,
                height: 50,
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.5)",

                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                },
              }}
            >
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
          )}

          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
                zIndex: 5,
                width: 50,
                height: 50,
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.5)",

                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                },
              }}
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          )}

          <Typography
            sx={{
              position: "absolute",
              left: "50%",
              bottom: 16,
              transform: "translateX(-50%)",
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.55)",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              fontSize: 14,
            }}
          >
            {selectedIndex + 1} / {images.length}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}