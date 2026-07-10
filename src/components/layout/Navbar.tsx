"use client";
import Link from "next/link";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
export default function Navbar() {
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Box sx={{display: "flex",alignItems: "center",px: 3,}}>
        <Link href="/" className="text-lg font-semibold">
          DeskHere
        </Link>
        <Box sx={{display: { xs: "none", md: "flex" },alignItems: "center", ml: 5,gap: 3, fontSize: "0.875rem",fontWeight: 500,color: "text.secondary",}}>
        <Link href="/">Locations</Link>
        <Link href="/">Who We Serve</Link>
        <Link href="/">Workspace Solutions</Link>
        <Link href="/">Resources</Link>
        </Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2,}}>
          <FormControl size="small">
           <Select defaultValue="en">
           <MenuItem value="en">EN</MenuItem>
           <MenuItem value="tr">TR</MenuItem>
           </Select>
           </FormControl>
          <Button component={Link} href="/login" variant="outlined">
            Login
          </Button>
          <Button component={Link} href="/register" variant="contained">
           Register
          </Button>
        </Box>
      </Box>
    </AppBar>
  );
}
