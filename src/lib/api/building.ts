import { createClient } from "../../utils/supabase/client"; // Projendeki supabase client yoluna göre ayarlayabilirsin

// 1. Bina Veri Tipi Tanımlaması (Building Interface)
export interface Building {
  id?: number;
  name: string;
  location_url?: string;
  floor_plan_url?: string;
  manager_id?: number;
  created_at?: string;
  layout_data?: BuildingLayout | null;
}

// Bina krokisindeki bir kutu: ya gerçek bir odaya bağlı (itemType "room"),
// ya da giriş/merdiven/asansör/koridor gibi yapısal bir öğe.
export type BuildingLayoutItemType = "room" | "entrance" | "stairs" | "elevator" | "corridor";

export interface BuildingLayoutItem {
  id: string;
  itemType: BuildingLayoutItemType;
  roomId?: number; // sadece itemType === "room" için dolu
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Tek bir katın krokisi
export interface BuildingFloorLayout {
  floor: string;
  canvasWidth: number;
  canvasHeight: number;
  items: BuildingLayoutItem[];
}

export interface BuildingLayout {
  version: 2;
  floors: BuildingFloorLayout[];
}

const DEFAULT_FLOOR_NAME = "Genel";
const LAYOUT_CANVAS_WIDTH = 800;
const LAYOUT_CANVAS_HEIGHT = 600;

// Eski (kat kavramı olmayan, tek düz "items" listesi taşıyan) kayıtları
// yeni floors[] yapısına dönüştürür; zaten güncel kayıtları olduğu gibi bırakır.
export function normalizeBuildingLayout(raw: any): BuildingLayout {
  if (!raw) {
    return { version: 2, floors: [] };
  }

  if (Array.isArray(raw.floors)) {
    return {
      version: 2,
      floors: raw.floors.map((floor: any) => ({
        floor: floor.floor ?? DEFAULT_FLOOR_NAME,
        canvasWidth: floor.canvasWidth ?? LAYOUT_CANVAS_WIDTH,
        canvasHeight: floor.canvasHeight ?? LAYOUT_CANVAS_HEIGHT,
        items: (floor.items ?? []).map((item: any) => ({
          ...item,
          itemType: item.itemType ?? "room",
        })),
      })),
    };
  }

  // v1: { version: 1, canvasWidth, canvasHeight, items: [...] }
  if (Array.isArray(raw.items) && raw.items.length > 0) {
    return {
      version: 2,
      floors: [
        {
          floor: DEFAULT_FLOOR_NAME,
          canvasWidth: raw.canvasWidth ?? LAYOUT_CANVAS_WIDTH,
          canvasHeight: raw.canvasHeight ?? LAYOUT_CANVAS_HEIGHT,
          items: raw.items.map((item: any) => ({ ...item, itemType: "room" })),
        },
      ],
    };
  }

  return { version: 2, floors: [] };
}

// 2. Bina Görseli / Kat Planı Yükleme Fonksiyonu
export async function uploadBuildingImage(file: File): Promise<string | null> {
  const supabase = createClient();
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `building_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `buildings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("room_images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Görsel yükleme hatası:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("room_images").getPublicUrl(filePath);
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

    return (data || []).map((building) => ({
      ...building,
      layout_data: normalizeBuildingLayout(building.layout_data),
    }));
  } catch (error: any) {
    console.error("Binalar çekilirken beklenmeyen hata:", error.message);
    return [];
  }
}

// 3b. Tek Bina Getir (READ by id)
export async function getBuildingById(id: number | string): Promise<Building | null> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("building")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? { ...data, layout_data: normalizeBuildingLayout(data.layout_data) } : null;
  } catch (error: any) {
    console.error("Bina detayı çekilirken hata oluştu:", error.message);
    return null;
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

// 6. Bina Krokisini Kaydet (bina planı üzerindeki oda konumları)
export async function updateBuildingLayout(id: number, layout: BuildingLayout) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("building")
      .update({ layout_data: layout })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Bina krokisi kaydedilirken hata oluştu:", error.message);
    return { success: false, error: error.message };
  }
}

// 7. Bina Sil (DELETE)
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