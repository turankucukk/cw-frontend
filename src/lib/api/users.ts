import { createClient } from "@/src/utils/supabase/client";

export type UserRole = "superadmin" | "manager" | "user";

export interface AdminUser {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ReservationRecord {
  id: number;
  userId: number;
  userName: string;
  roomName: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface ActivityEvent {
  id: number;
  type: "login" | "reservation" | "signup";
  message: string;
  timestamp: string;
}

export async function getUsers(): Promise<AdminUser[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user")
    .select("id, user_id, name, surname, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    fullName: `${row.name ?? ""} ${row.surname ?? ""}`.trim() || row.email,
    email: row.email,
    role: (row.role?.trim().toLowerCase() as UserRole) ?? "user",
    createdAt: row.created_at,
  }));
}

export async function getReservations(): Promise<ReservationRecord[]> {
  // Rezervasyon tablosu henüz yok; özellik eklendiğinde gerçek sorguyla değiştirilecek.
  return [];
}

export async function getActivityEvents(): Promise<ActivityEvent[]> {
  // Aktivite/olay kaydı henüz yok; özellik eklendiğinde gerçek sorguyla değiştirilecek.
  return [];
}
