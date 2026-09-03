"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { useBrand } from "@/components/brand/brand-provider";

type BrandImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

/** Imagem configurável que nunca deixa um slot institucional visualmente partido. */
export function BrandImage({ src, fallbackSrc, alt, onError, ...props }: BrandImageProps) {
  const siteConfig = useBrand();
  const resolvedFallback = fallbackSrc ?? siteConfig.content.images.institutional;
  const preferred = src?.trim() || resolvedFallback;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = failedSrc === preferred ? resolvedFallback : preferred;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event);
        if (resolvedSrc !== resolvedFallback) setFailedSrc(preferred);
      }}
    />
  );
}
