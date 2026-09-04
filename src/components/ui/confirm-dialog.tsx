"use client";

import type { ReactNode, RefObject } from "react";

import { Button } from "./button";
import { Modal } from "./dialog";

/**
 * Reemplazo estilizado para confirm() nativo del navegador. El padre
 * controla open/onClose/onConfirm igual que ya hace con su propio estado
 * local; este componente solo pone la interfaz.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  loading = false,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      returnFocusRef={returnFocusRef}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button type="button" variant={destructive ? "destructive" : "primary"} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
