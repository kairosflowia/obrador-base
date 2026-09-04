"use client";

import { useEffect, useRef, useState } from "react";
import { useBrand } from "@/components/brand/brand-provider";

import { Button } from "../ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const siteConfig = useBrand();
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const eligible = useRef(false);

  useEffect(() => {
    // Prefijo genérico "obrador-"; se lee el contador antiguo "fuerza-visits"
    // como base si existe, para no reiniciar la elegibilidad de visitantes
    // recurrentes reales tras esta migración de marca.
    const previous = localStorage.getItem("obrador-visits") ?? localStorage.getItem("fuerza-visits") ?? "0";
    const visited = Number(previous) + 1;
    localStorage.setItem("obrador-visits", String(visited));
    eligible.current = visited > 1;

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      if (eligible.current) setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  if (!installEvent) return null;

  const install = async () => {
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <aside className="install-prompt" aria-label={`Instalar ${siteConfig.brand.name}`}>
      <p><strong>Lleva {siteConfig.brand.name} contigo.</strong> Puedes instalar este portal.</p>
      <Button variant="secondary" onClick={install}>Instalar</Button>
    </aside>
  );
}

export function IOSInstallInstructions({ show = false }: { show?: boolean }) {
  const siteConfig = useBrand();
  if (!show) return null;

  return (
    <aside className="alert alert--information" aria-label={`Instalar ${siteConfig.brand.name} en iPhone o iPad`}>
      <p>Pulsa Compartir y después Añadir a pantalla de inicio.</p>
    </aside>
  );
}
