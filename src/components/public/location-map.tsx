import { PinIcon } from "@/components/ui/icons";

/**
 * Mapa esquemático propio (sin proveedor externo de mapas): la CSP del sitio
 * no permite iframes de terceros, y un mapa de calles real no aporta nada en
 * una dirección rural sin referencias urbanas. Este SVG solo ubica el pin en
 * el paisaje con el estilo editorial de la marca.
 */
export function LocationMap({ address }: { address: string }) {
  return (
    <figure className="location-map" aria-label={`Mapa esquemático de ubicación: ${address}`}>
      <svg viewBox="0 0 320 220" className="location-map__art" role="presentation" aria-hidden="true">
        <path d="M0 150 C 60 130, 110 170, 180 140 S 280 120, 320 150 V220 H0 Z" className="location-map__hill location-map__hill--back" />
        <path d="M0 175 C 70 160, 130 190, 200 165 S 270 150, 320 178 V220 H0 Z" className="location-map__hill location-map__hill--front" />
        <path d="M40 40 Q 110 10, 190 55 T 320 60" className="location-map__road" fill="none" />
        <path d="M40 40 Q 110 10, 190 55 T 320 60" className="location-map__road-dash" fill="none" />
      </svg>
      <span className="location-map__pin">
        <PinIcon />
      </span>
      <figcaption className="location-map__caption">{address}</figcaption>
    </figure>
  );
}
