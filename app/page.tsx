import Navbar from "@/src/components/layout/Navbar";
import Anasayfa from "@/src/components/home/Home";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <main>
      <Navbar />
       <Box sx={{ pt: '64px' }}> {/* navbar'ın yüksekliği kadar */}
      <Anasayfa />
  </Box>
      
    </main>
  );
} 