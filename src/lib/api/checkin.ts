// src/lib/api/checkin.ts
import { createClient } from "@/src/utils/supabase/client";

export interface VerifyAccessResult {
  granted: boolean;
  reason?: string;
  roomName?: string;
  reservation?: {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
  };
}

interface ReservationRow {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
}

export async function verifyAccess(qrcode: string): Promise<VerifyAccessResult> {
  const supabase = createClient();

  const { data: space, error: spaceError } = await supabase
    .from("space")
    .select("id, name, qr")
    .eq("qr", qrcode)
    .single();

  if (spaceError || !space) {
    return {
      granted: false,
      reason: "Geçersiz QR kodu.",
    };
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { granted: false, reason: "Giriş yapmanız gerekiyor." };
  }

  const now = new Date().toISOString();

  const { data: reservations, error: reservationError } = await supabase
    .from("reservation")
    .select("id, start_time, end_time, status")
    .eq("space_id", space.id)
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .lte("start_time", now)
    .gte("end_time", now)
    .returns<ReservationRow[]>();

  if (reservationError || !reservations || reservations.length === 0) {
    return {
      granted: false,
      reason: "Bu alan için geçerli bir rezervasyonunuz yok.",
      roomName: space.name,
    };
  }

  return {
    granted: true,
    reservation: reservations[0],
    roomName: space.name,
  };
}