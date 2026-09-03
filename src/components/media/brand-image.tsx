"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { siteConfig } from "@/config/site-config";

type BrandImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

/** Imagem configurável que nunca deixa um slot institucional visualmente partido. */
export function BrandImage({ src, fallbackSrc = siteConfig.content.images.institutional, alt, onError, ...props }: BrandImageProps) {
  const preferred = src?.trim() || fallbackSrc;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = failedSrc === preferred ? fallbackSrc : preferred;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event);
        if (resolvedSrc !== fallbackSrc) setFailedSrc(preferred);
      }}
    />
  );
}
