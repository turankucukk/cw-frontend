import Navbar from "@/src/components/layout/Navbar";
import RoomsSection from "@/src/components/rooms/RoomSection";
import Hero from "@/src/components/layout/Hero";
import { Box } from "@mui/material";
export default function Home() {
  return (
    <main>
      <Navbar />
       <Box sx={{ pt: '64px' }}> {/* navbar'ın yüksekliği kadar */}
    <RoomsSection />
  </Box>
      
    </main>
  );
} 