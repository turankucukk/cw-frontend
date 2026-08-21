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

export type RoomLayoutItemType =
  | "table"
  | "chair"
  | "screen"
  | "door"
  | "window"
  | "whiteboard";

export interface RoomLayoutItem {
  id: string;
  type: RoomLayoutItemType;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoomLayout {
  version: 1;
  canvasWidth: number;
  canvasHeight: number;
  items: RoomLayoutItem[];
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
  layout_data?: RoomLayout | null;
}

export type RoomDetails = Room;

export async function getRooms(): Promise<Room[]> {
  const supabase = createClient();
  try {
    await activateDueMaintenance();
    await releaseExpiredMaintenance();

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

// Bakım süresi dolmuş odaları otomatik olarak aktif hale getirir
export async function releaseExpiredMaintenance(): Promise<void> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("space")
    .update({
      isActive: true,
      maintenance_type: null,
      maintenance_start: null,
      maintenance_end: null,
      maintenance_reason: null,
    })
    .eq("isActive", false)
    .not("maintenance_end", "is", null)
    .lt("maintenance_end", now);

  if (error) {
    console.error("Süresi geçmiş bakımlar temizlenirken hata oluştu:", error.message);
  }
}

// Başlangıç tarihi gelmiş planlı bakımları otomatik olarak devreye sokar (odayı pasif yapar)
export async function activateDueMaintenance(): Promise<void> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("space")
    .update({ isActive: false })
    .eq("isActive", true)
    .eq("maintenance_type", "planli")
    .not("maintenance_start", "is", null)
    .lte("maintenance_start", now);

  if (error) {
    console.error("Zamanı gelen bakımlar devreye alınırken hata oluştu:", error.message);
  }
}



export async function getRoomById(id: number | string): Promise<Room | null> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("space")
      .select("*, room_images(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Oda detayları çekilirken hata oluştu:", error.message);
    return null;
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

export async function updateRoomLayout(id: number, layout: RoomLayout) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("space")
      .update({ layout_data: layout })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Oda krokisi kaydedilirken hata oluştu:", error.message);
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

// Bir odaya tek bir görsel yükler (mevcut görsellerin sonuna ekler)
export async function uploadRoomImage(spaceId: number, file: File) {
  const supabase = createClient();
  const BUCKET_NAME = "room_images";

  try {
    const { count } = await supabase
      .from("room_images")
      .select("id", { count: "exact", head: true })
      .eq("space_id", spaceId);

    const nextSortOrder = (count ?? 0) + 1;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `spaces/${spaceId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      return { success: false, error: `Storage Hatası: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const { data, error: insertError } = await supabase
      .from("room_images")
      .insert({
        space_id: spaceId,
        image_url: publicUrlData.publicUrl,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, error: `Tablo Kayıt Hatası: ${insertError.message}` };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Görsel yüklenirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}

// Bir oda görselini siler (hem tablo kaydını hem storage dosyasını)
export async function deleteRoomImage(imageId: number) {
  const supabase = createClient();

  try {
    const { data: image, error: fetchError } = await supabase
      .from("room_images")
      .select("image_url")
      .eq("id", imageId)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    const { error: deleteError } = await supabase
      .from("room_images")
      .delete()
      .eq("id", imageId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Storage'daki dosyayı da silmeye çalış (URL'den path'i çıkarıp)
    if (image?.image_url) {
      const url = new URL(image.image_url);
      const pathParts = url.pathname.split("/room_images/");
      if (pathParts[1]) {
        await supabase.storage.from("room_images").remove([pathParts[1]]);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Görsel silinirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}

// Bir odanın görsellerinin sırasını günceller
// orderedImageIds: yeni sıraya göre dizilmiş görsel id'leri
export async function updateRoomImageOrder(orderedImageIds: number[]) {
  const supabase = createClient();

  try {
    const updates = orderedImageIds.map((imageId, index) =>
      supabase
        .from("room_images")
        .update({ sort_order: index + 1 })
        .eq("id", imageId)
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) {
      return { success: false, error: failed.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Görsel sırası güncellenirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}