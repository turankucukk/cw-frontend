import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { decodeJwtPayload } from "@/src/utils/jwt";

interface AccessTokenClaims {
  user_role?: string;
}

function roleFromAccessToken(accessToken: string): string {
  const claims = decodeJwtPayload<AccessTokenClaims>(accessToken);
  return claims?.user_role ? claims.user_role.trim().toLowerCase() : "user";
}

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 1. Sayfa ilk açıldığında mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setRole(session ? roleFromAccessToken(session.access_token) : null);
      setLoading(false);
    });

    // 2. Oturum değişikliklerini (Giriş/Çıkış yapıldığında) anlık olarak dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setRole(session ? roleFromAccessToken(session.access_token) : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { role, loading };
}