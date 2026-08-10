import { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

export function useProfileData() {
  const [userData, setUserData] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Supabase Auth'tan aktif oturumu alıyoruz
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) return;

        // 2. Kendi "user" tablonuzdaki kullanıcı verisini çekiyoruz
        const { data: userRecord } = await supabase
          .from("user")
          .select("*")
          .eq("email", session.user.email)
          .single();

        if (userRecord) {
          setUserData(userRecord);

          // 3. Kullanıcının rezervasyonlarını mekan ve bina isimleriyle join (ilişkilendirme) yaparak çekiyoruz
          const { data: resData } = await supabase
            .from("reservation")
            .select(`
              *,
              space (
                name,
                building (
                  name
                )
              )
            `)
            .eq("user_id", userRecord.id)
            .order("start_time", { ascending: false });

          if (resData) {
            setReservations(resData);
            
            if (resData.length > 0) {
              const resIds = resData.map((r: any) => r.id);
              // 4. Rezervasyonlara ait ödeme geçmişini çekiyoruz
              const { data: payData, error: payError } = await supabase
                .from("payment")
                .select(`*, reservation(space(name))`)
                .in("reservation_id", resIds)
                .order("paid_at", { ascending: false });
              
              if (payError) {
                console.error("Ödemeler çekilirken hata:", payError);
              }

              if (payData) {
                setPayments(payData);
              }
            }
          }
        }
      } catch (error) {
        console.error("Profil verileri çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { userData, reservations, payments, loading, setUserData };
}