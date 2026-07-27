import { createClient } from "../../utils/supabase/client";

export interface Building {
  id: number;
  name: string;
  location_url?: string;
  manager_id?: number;
  floor_plan_url?: string;
}

export interface RoomImage {
  id?: number;
  space_id: number;
  image_url: string;
  sort_order?: number;
  created_at?: string;
}

export interface Room {
  id?: number;
  name: string;
  capacity: number;
  type?: string;
  price?: number;
  building_id: number;
  floor?: string;
  description?: string;
  features?: string[];
  image?: string | null;
  isActive?: boolean;
  needsApproval?: boolean;
  parentSpace_id?: number | null;
  qr?: string | null;
  room_images?: RoomImage[];
}

export async function getRooms(): Promise<Room[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("space")
      .select("*, room_images(*)")
      .order("id", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Odalar çekilirken hata oluştu:", error.message);
    return [];
  }
}

export async function getBuildings(): Promise<Building[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("building")
      .select("*");

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Binalar çekilirken hata oluştu:", error.message);
    return [];
  }
}

async function uploadAndSaveImages(spaceId: number, files: File[]): Promise<{ success: boolean; error?: string }> {
  if (!files || files.length === 0) return { success: true };

  const supabase = createClient();
  try {
    const imageRecords = [];
    const BUCKET_NAME = "room_images";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `spaces/${spaceId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage Yükleme Hatası:", uploadError);
        return { success: false, error: `Storage Hatası: ${uploadError.message}` };
      }

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      imageRecords.push({
        space_id: spaceId,
        image_url: data.publicUrl,
        sort_order: i + 1
      });
    }

    const { error: insertError } = await supabase
      .from("room_images")
      .insert(imageRecords);

    if (insertError) {
      console.error("Tablo Ekleme Hatası:", insertError);
      return { success: false, error: `Tablo Kayıt Hatası: ${insertError.message}` };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Görseller işlenirken hata oluştu:", error);
    return { success: false, error: error.message || "Bilinmeyen hata" };
  }
}

export async function addRoom(roomData: Omit<Room, "id" | "room_images">, files?: File[]) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("space")
      .insert([
        {
          ...roomData,
          parentSpace_id: roomData.parentSpace_id ?? 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    if (files && files.length > 0 && data?.id) {
      const imgRes = await uploadAndSaveImages(data.id, files);
      if (!imgRes.success) {
        throw new Error(imgRes.error);
      }
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Oda eklenirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updateRoom(id: number, roomData: Partial<Omit<Room, "room_images">>, files?: File[]) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("space")
      .update(roomData)
      .eq("id", id)
      .select();

    if (error) throw error;

    if (files && files.length > 0) {
      await supabase
        .from("room_images")
        .delete()
        .eq("space_id", id);

      const imgRes = await uploadAndSaveImages(id, files);
      if (!imgRes.success) {
        throw new Error(imgRes.error);
      }
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Oda güncellenirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteRoom(id: number) {
  const supabase = createClient();
  try {
    await supabase
      .from("reservation")
      .delete()
      .eq("space_id", id);

    await supabase
      .from("room_images")
      .delete()
      .eq("space_id", id);

    const { error } = await supabase
      .from("space")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Oda silinirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}