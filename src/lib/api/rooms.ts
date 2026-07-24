// src/lib/api/rooms.ts
import { createClient } from '../../utils/supabase/client';

export interface Room {
  id: number;
  name: string;
  capacity: number;
  type: string;
  price: number;
  buildingId: number;
  features: string[];
  image: string | null;
}

function mapSpaceToRoom(space: any): Room {
  return {
    id: space.id,
    name: space.name,
    type: space.type,
    capacity: space.capacity,
    buildingId: space.building_id,
    features: space.features || [],
    price: space.price,
    image: space.image || null,
  };
}

export async function getRooms(): Promise<Room[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('space')
    .select('*')
    .eq('isActive', true)
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []).map(mapSpaceToRoom);
}

export async function createRoom(input: {
  name: string;
  capacity: number;
  type: string;
  features: string[];
  buildingId: number;
  image: string;
}): Promise<Room> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('space')
    .insert({
      name: input.name,
      capacity: input.capacity,
      type: input.type,
      features: input.features,
      building_id: input.buildingId,
      image: input.image,
      price: 0,
      parentSpace_id: 0,
      needsApproval: false,   
      isActive: true,
    })
    
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return mapSpaceToRoom(data);
}

export async function updateRoom(
  id: number,
  input: Partial<{ name: string; capacity: number; type: string; features: string[]; image: string }>
): Promise<Room> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('space')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return mapSpaceToRoom(data);
}

export async function deleteRoom(id: number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('space')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}