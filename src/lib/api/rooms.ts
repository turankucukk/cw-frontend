
export interface Room {
  id: number;
  name: string;
  capacity: number;
  features: string[];
  floor: number;
  imageUrl?: string;
}

const mockRooms: Room[] = [
  {
    id: 1,
    name: 'Toplantı Odası A',
    capacity: 5,
    features: ['Wifi', 'TV', 'Beyaz Tahta'],
    floor: 1,
  },
  {
    id: 2,
    name: 'Toplantı Odası B',
    capacity: 3,
    features: ['Wifi'],
    floor: 1,
  },
  {
    id: 3,
    name: 'Konferans Salonu',
    capacity: 12,
    features: ['Wifi', 'TV', 'Projeksiyon', 'Ses Sistemi'],
    floor: 2,
  },
  {
    id: 4,
    name: 'Sessiz Çalışma Odası',
    capacity: 2,
    features: ['Wifi'],
    floor: 2,
  },
];

export async function getRooms(): Promise<Room[]> {

    await new Promise((resolve) => setTimeout(resolve, 300));
  return mockRooms;
}

export async function getRoomById(id: number): Promise<Room | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const room = mockRooms.find((r) => r.id === id);
  return room ?? null;
}


export async function getRoomsByMinCapacity(minCapacity: number): Promise<Room[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockRooms.filter((r) => r.capacity >= minCapacity);
}

export async function getRoomsByFeature(feature: string): Promise<Room[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockRooms.filter((r) => r.features.includes(feature));
}