import { createClient } from "@/src/utils/supabase/client";

/**
 * Checks if a reservation has passed its 15-minute check-in window.
 * @param start_time The start time of the reservation.
 * @returns true if more than 15 minutes have passed since the start time.
 */
export const isReservationExpired = (start_time: string): boolean => {
  const startTimeMs = new Date(start_time).getTime();
  const nowMs = new Date().getTime();
  const fifteenMinsMs = 15 * 60 * 1000;
  
  return nowMs > (startTimeMs + fifteenMinsMs);
};

/**
 * Sweeps through a list of reservations and cancels any that are confirmed but 
 * whose 15-minute check-in window has expired without a check-in.
 * 
 * @param reservations List of reservations to check.
 * @returns A boolean indicating if any reservations were actually updated/cancelled.
 */
export const cancelExpiredReservations = async (reservations: any[]): Promise<boolean> => {
  const supabase = createClient();
  let hasUpdates = false;

  for (const res of reservations) {
    if (
      (res.status === "confirmed" || res.status === "approved" || res.status === "pending") && 
      isReservationExpired(res.start_time)
    ) {
      // It has expired without a check-in, update status to 'cancelled'
      try {
        const { error } = await supabase
          .from("reservation")
          .update({ status: "cancelled" })
          .eq("id", res.id);
          
        if (error) {
          console.error(`Failed to auto-cancel reservation ${res.id}:`, error);
        } else {
          console.log(`Auto-cancelled expired reservation ${res.id}`);
          hasUpdates = true;
        }
      } catch (err) {
        console.error("Error auto-cancelling reservation:", err);
      }
    }
  }

  return hasUpdates;
};
