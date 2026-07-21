// src/lib/api/rooms.ts
import { createClient } from '../../utils/supabase/client';

export interface Room {
  id: number;
  name: string;
  capacity: number;
  type: string;
  price: number;
  features: string[];
  image: string | null;
}

function mapSpaceToRoom(space: any): Room {
  return {
    id: space.id,
    name: space.name,
    capacity: space.capacity,
    type: space.type,
    price: space.price ?? 0,
    features: space.features ?? [],
    image: space.image,
  };
}

export async function getRooms(): Promise<Room[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('space')
    .select('*')
    .eq('isActive', true)
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSpaceToRoom);
}