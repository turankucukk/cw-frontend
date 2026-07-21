import { useEffect, useState } from "react";
import {createClient} from "@/src/utils/supabase/client"

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRole(email: string) {
      try {
        const { data: userData, error: dbError } = await supabase
          .from("user")
          .select("role")
          .ilike("email", email.trim())
          .limit(1);

        if (dbError) {
          console.error(dbError.message);
          setRole("user");
        } else {
          const firstUser = userData && userData.length > 0 ? userData[0] : null;
          const rawRole = firstUser?.role ? firstUser.role.trim().toLowerCase() : "user";
          setRole(rawRole);
        }
      } catch (err) {
        console.error(err);
        setRole("user");
      } finally {
        setLoading(false);
      }
    }

    // 1. Sayfa ilk açıldığında mevcut oturumu kontrol et
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email) {
        fetchRole(user.email);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    // 2. Oturum değişikliklerini (Giriş/Çıkış yapıldığında) anlık olarak dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        fetchRole(session.user.email);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { role, loading };
}