"use client";

// Bu örnek dışarıdan alınmış bir bina krokisidir

export default function BuildingFloorPlan() {
  return (
    <svg width="320" height="240" viewBox="0 0 320 240" role="img" aria-label="Bina krokisi">
      <rect x="10" y="10" width="300" height="220" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />

      {/* Oda 1 */}
      <rect x="10" y="10" width="140" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <text x="80" y="65" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">Oda A</text>

      {/* Oda 2 */}
      <rect x="150" y="10" width="160" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <text x="230" y="65" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">Oda B</text>

      {/* Koridor */}
      <rect x="10" y="110" width="300" height="20" fill="currentColor" opacity="0.08" />
      <text x="160" y="123" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">Koridor</text>

      {/* Konferans Salonu */}
      <rect x="10" y="130" width="190" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <text x="105" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">Konferans Salonu</text>

      {/* Sessiz Oda */}
      <rect x="200" y="130" width="110" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <text x="255" y="185" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7">Sessiz Oda</text>

      {/* Giriş kapısı işareti */}
      <circle cx="160" cy="230" r="4" fill="currentColor" opacity="0.6" />
      <text x="160" y="215" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">Giriş</text>
    </svg>
  );
}