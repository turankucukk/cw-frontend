export function formatFloor(floor: string | null | undefined): string {
  if (!floor) return "Belirtilmedi";
  const trimmed = String(floor).trim();
  if (/kat/i.test(trimmed)) return trimmed;
  return `${trimmed}. Kat`;
}