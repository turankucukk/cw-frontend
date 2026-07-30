import { createClient } from "../../utils/supabase/client"; // Projendeki supabase client yoluna göre ayarlayabilirsin

// 1. Bina Veri Tipi Tanımlaması (Building Interface)
export interface Building {
  id?: number;
  name: string;
  location_url?: string;
  floor_plan_url?: string;
  manager_id?: number;
  created_at?: string;
}

// 2. Bina Görseli / Kat Planı Yükleme Fonksiyonu
export async function uploadBuildingImage(file: File): Promise<string | null> {
  const supabase = createClient();
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `building_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `buildings/${fileName}`;

    // Projendeki Supabase storage bucket adını buraya gir ('room-images' veya 'building-images')
    const { error: uploadError } = await supabase.storage
      .from("room-images") 
      .upload(filePath, file);

    if (uploadError) {
      console.error("Görsel yükleme hatası:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("room-images").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error: any) {
    console.error("Görsel yüklenirken beklenmeyen hata oluştu:", error.message);
    return null;
  }
}

// 3. Tüm Binaları Getir (READ)
export async function getBuildings(): Promise<Building[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("building")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Binalar çekilirken hata oluştu:", error.message);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Binalar çekilirken beklenmeyen hata:", error.message);
    return [];
  }
}

// 4. Yeni Bina Ekle (CREATE)
export async function addBuilding(buildingData: Omit<Building, "id">, files?: File[]) {
  const supabase = createClient();
  try {
    let floorPlanUrl = buildingData.floor_plan_url || null;

    // Görsel yüklendiyse önce storage'a yükleyip URL alıyoruz
    if (files && files.length > 0) {
      const uploadedUrl = await uploadBuildingImage(files[0]);
      if (uploadedUrl) floorPlanUrl = uploadedUrl;
    }

    const { data, error } = await supabase
      .from("building")
      .insert([
        {
          ...buildingData,
          floor_plan_url: floorPlanUrl
        }
      ])
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Bina eklenirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}

// 5. Bina Bilgilerini Güncelle (UPDATE)
export async function updateBuilding(
  id: number,
  buildingData: Partial<Building>,
  files?: File[]
) {
  const supabase = createClient();
  try {
    let floorPlanUrl = buildingData.floor_plan_url;

    // Yeni görsel seçildiyse yükleyip URL'i güncelliyoruz
    if (files && files.length > 0) {
      const uploadedUrl = await uploadBuildingImage(files[0]);
      if (uploadedUrl) floorPlanUrl = uploadedUrl;
    }

    const updatePayload: Partial<Building> = { ...buildingData };

    if (floorPlanUrl !== undefined) {
      updatePayload.floor_plan_url = floorPlanUrl;
    }

    const { data, error } = await supabase
      .from("building")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Bina güncellenirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}

// 6. Bina Sil (DELETE)
export async function deleteBuilding(id: number) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("building")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Bina silinirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}