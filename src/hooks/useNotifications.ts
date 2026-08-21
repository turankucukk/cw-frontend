import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

export type AppNotification = {
  id: number;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const { data: userRecord } = await supabase
      .from("user")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!userRecord) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("id, message, link, is_read, created_at")
      .eq("user_id", userRecord.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Bildirimler çekilirken hata:", error);
      setLoading(false);
      return;
    }

    setNotifications(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (id: number) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) console.error(error);
    },
    [supabase]
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, unreadCount, loading, markAsRead, refetch: fetchNotifications };
}
