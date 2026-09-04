"use client";

import { useState, type ChangeEvent } from "react";

import { Button, Input } from "@/components/ui";

export function BrandImageUploadForm({
  action,
  slot,
  hasCurrent,
  help,
}: {
  action: (formData: FormData) => void;
  slot: string;
  hasCurrent: boolean;
  help?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });
  }

  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="slot" value={slot} />
      <Input
        id={`file_${slot}`}
        name="image"
        label="Nuevo archivo"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/x-icon"
        helpText={help}
        onChange={onChange}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Vista previa" style={{ maxWidth: "100%", maxHeight: 120 }} />
      ) : null}
      <Button type="submit">{hasCurrent ? "Sustituir" : "Subir"}</Button>
    </form>
  );
}
