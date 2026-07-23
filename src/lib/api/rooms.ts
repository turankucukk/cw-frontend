import { createClient } from "../../utils/supabase/client";

export interface Room {
  id: number;
  name: string;
  capacity: number;
  type: string;
  price: number;
  features: string[];
  image: string | null;
}

export interface RoomDetails extends Room {
  description: string | null;
  floor: string | number | null;
  buildingId: number | null;
  buildingName: string | null;
  images: string[];
}

function mapSpaceToRoom(space: any): Room {
  return {
    id: space.id,
    name: space.name,
    capacity: space.capacity ?? 0,
    type: space.type ?? "Toplantı Odası",
    price: space.price ?? 0,
    features: Array.isArray(space.features) ? space.features : [],
    image: space.image ?? null,
  };
}

export async function getRooms(): Promise<Room[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("space")
    .select("*")
    .eq("isActive", true)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapSpaceToRoom);
}

export async function getRoomById(
  roomId: number,
): Promise<RoomDetails | null> {
  const supabase = createClient();

  // Oda bilgilerini getir
  const { data: space, error: spaceError } = await supabase
    .from("space")
    .select("*")
    .eq("id", roomId)
    .eq("isActive", true)
    .maybeSingle();

  if (spaceError) {
    throw new Error(spaceError.message);
  }

  if (!space) {
    return null;
  }

  // Odanın bağlı olduğu binayı getir
  let buildingName: string | null = null;

  if (space.building_id) {
    const { data: building, error: buildingError } = await supabase
      .from("building")
      .select("id, name")
      .eq("id", space.building_id)
      .maybeSingle();

    if (buildingError) {
      console.error("Bina alınamadı:", buildingError.message);
    } else {
      buildingName = building?.name ?? null;
    }
  }

  // Odanın bütün fotoğraflarını getir
  const { data: roomImages, error: imageError } = await supabase
    .from("room_images")
    .select("image_url, sort_order")
    .eq("space_id", roomId)
    .order("sort_order", { ascending: true });

  if (imageError) {
    console.error("Oda görselleri alınamadı:", imageError.message);
  }

  let images =
    roomImages
      ?.map((item) => item.image_url)
      .filter((url): url is string => Boolean(url)) ?? [];

  // room_images boşsa eski space.image alanını kullan
  if (images.length === 0 && space.image) {
    images = [space.image];
  }

  return {
    ...mapSpaceToRoom(space),
    description: space.description ?? null,
    floor: space.floor ?? null,
    buildingId: space.building_id ?? null,
    buildingName,
    images,
  };
}