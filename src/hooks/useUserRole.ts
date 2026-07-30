import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

function roleFromClaims(claims: unknown): string | null {
  if (!claims || typeof claims !== "object") return null;
  const rawRole = (claims as Record<string, unknown>).user_role;
  return typeof rawRole === "string" ? rawRole.trim().toLowerCase() : "user";
}

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadRole() {
      const { data } = await supabase.auth.getClaims();
      setRole(roleFromClaims(data?.claims ?? null));
      setLoading(false);
    }

    // 1. Sayfa ilk açıldığında mevcut oturumu kontrol et
    loadRole();

    // 2. Oturum değişikliklerini (Giriş/Çıkış yapıldığında) anlık olarak dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { role, loading };
}
