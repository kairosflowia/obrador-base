"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

export function LocationMap({ latitude, longitude, address, directionsHref }: { latitude: number; longitude: number; address: string; directionsHref: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let map: LeafletMap | undefined;
    let cancelled = false;

    // Leaflet toca `window` en la carga del módulo, así que solo puede
    // importarse dentro del efecto (cliente), nunca en el scope del módulo.
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      const pinIcon = L.divIcon({
        className: "location-map__leaflet-pin",
        html: '<span class="location-map__pin"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
      map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 16,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      }).addTo(map);
      L.marker([latitude, longitude], { icon: pinIcon, alt: address }).addTo(map);
    });

    return () => { cancelled = true; map?.remove(); };
  }, [latitude, longitude, address]);

  return (
    <figure className="location-map" aria-label={`Mapa de ubicación: ${address}`}>
      <div ref={containerRef} className="location-map__canvas" />
      {directionsHref ? (
        <figcaption className="location-map__caption">
          <a href={directionsHref} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
        </figcaption>
      ) : (
        <figcaption className="location-map__caption">{address}</figcaption>
      )}
    </figure>
  );
}
