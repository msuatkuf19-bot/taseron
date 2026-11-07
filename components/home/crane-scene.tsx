/**
 * Hero sahnesi: kule vinç, üç katlı binanın üzerine dördüncü katı yerleştirir.
 * Animasyon sayfa açılışında bir kez oynar. Hareket azaltma tercihinde son kare görünür.
 */
const floors = [
  { y: 444, label: "Kaba inşaat", tone: "#565C61" },
  { y: 388, label: "Tesisat", tone: "#62686D" },
  { y: 332, label: "Elektrik", tone: "#6E7479" },
];

function Windows({ y }: { y: number }) {
  return (
    <g fill="#2E3236" opacity=".55">
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={318 + i * 36} y={y + 26} width="20" height="18" rx="1" />
      ))}
    </g>
  );
}

export function CraneScene() {
  return (
    <svg
      className="crane-scene"
      viewBox="0 0 560 520"
      role="img"
      aria-label="Kule vinç, binanın en üst katını yerine yerleştiriyor"
    >
      <defs>
        <pattern id="lattice" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 0 L24 24 M24 0 L0 24" stroke="#F37021" strokeWidth="1.6" />
          <path d="M0 0 H24" stroke="#F37021" strokeWidth="1.6" />
        </pattern>
        <pattern id="jib" width="20" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 16 L10 0 L20 16" stroke="#F37021" strokeWidth="1.4" fill="none" />
        </pattern>
      </defs>

      {/* zemin ve ölçü çizgisi */}
      <line x1="0" y1="500.5" x2="560" y2="500.5" stroke="#8C979E" strokeOpacity=".45" />
      <g className="dim" stroke="#8C979E" strokeOpacity=".6" fill="none">
        <line x1="528" y1="276" x2="528" y2="500" />
        <line x1="520" y1="276" x2="536" y2="276" />
        <line x1="520" y1="500" x2="536" y2="500" />
      </g>
      <text x="540" y="392" className="dim-text" transform="rotate(90 540 392)" textAnchor="middle">
        4 kat, 4 uzman ekip
      </text>

      {/* bina */}
      {floors.map((f) => (
        <g key={f.label}>
          <rect x="300" y={f.y} width="200" height="56" fill={f.tone} />
          <Windows y={f.y} />
          <text x="312" y={f.y + 17} className="floor-label">{f.label}</text>
        </g>
      ))}

      {/* vinç kulesi */}
      <rect x="104" y="96" width="32" height="404" fill="url(#lattice)" />
      <rect x="104" y="96" width="32" height="404" fill="none" stroke="#F37021" strokeWidth="2" />
      <rect x="96" y="486" width="48" height="14" fill="#F37021" />
      {/* kabin */}
      <rect x="96" y="96" width="40" height="30" fill="#F37021" />
      <rect x="120" y="102" width="12" height="12" fill="#2E3236" />
      {/* tepe */}
      <path d="M120 96 L120 40" stroke="#F37021" strokeWidth="4" />
      <path d="M120 40 L36 80 M120 40 L540 80" stroke="#F37021" strokeWidth="1.5" />
      {/* bom ve karşı ağırlık kolu */}
      <rect x="28" y="80" width="512" height="16" fill="url(#jib)" />
      <rect x="28" y="80" width="512" height="16" fill="none" stroke="#F37021" strokeWidth="2" />
      <rect x="34" y="96" width="44" height="28" fill="#D85F17" />

      {/* araba + halat + kanca + yeni kat */}
      <g className="trolley">
        <rect x="384" y="94" width="32" height="10" fill="#F9FAFB" />
        <rect className="cable" x="399" y="104" width="2" height="150" fill="#D9DDE0" />
        <g className="drop">
          <path d="M392 254 h16 l-4 10 h-8 z" fill="#F9FAFB" />
          <path d="M400 264 v6 M400 270 L322 276 M400 270 L478 276" stroke="#D9DDE0" strokeWidth="1.5" fill="none" />
          <g className="new-floor">
            <rect x="300" y="276" width="200" height="56" fill="#F37021" />
            <g fill="#2E3236" opacity=".35">
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={318 + i * 36} y="302" width="20" height="18" rx="1" />
              ))}
            </g>
            <text x="312" y="293" className="floor-label strong">Boya &amp; badana: teklif onaylandı</text>
          </g>
        </g>
      </g>
    </svg>
  );
}
