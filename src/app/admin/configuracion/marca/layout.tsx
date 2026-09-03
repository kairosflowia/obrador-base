import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { getCurrentIdentity } from "@/lib/auth/session";

import { MarcaTabs } from "./marca-tabs";

export default async function MarcaLayout({ children }: { children: ReactNode }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) redirect("/cuenta/acceso-denegado");

  return (
    <div className="admin-marca">
      <MarcaTabs />
      {children}
    </div>
  );
}
