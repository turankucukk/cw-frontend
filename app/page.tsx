import Navbar from "@/src/components/layout/Navbar";
import RoomsSection from "@/src/components/rooms/RoomSection";
import Hero from "@/src/components/layout/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <RoomsSection />
    </main>
  );
}
