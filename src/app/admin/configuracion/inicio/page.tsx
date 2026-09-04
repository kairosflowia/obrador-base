import { redirect } from "next/navigation";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge, Card } from "@/components/ui";
import { getCurrentIdentity } from "@/lib/auth/session";
import { getWizardSteps, summarizeWizardSteps, type StepStatus } from "@/lib/onboarding";

const STATUS_META: Record<StepStatus, { label: string; badge: "success" | "warning" | "neutral" | "information" }> = {
  ready: { label: "Listo", badge: "success" },
  pending: { label: "Pendiente", badge: "warning" },
  recommended: { label: "Recomendado", badge: "information" },
  blocked: { label: "Bloqueado", badge: "neutral" },
};

export default async function ConfiguracionInicio() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("owner")) redirect("/cuenta/acceso-denegado");

  const steps = await getWizardSteps();
  const summary = summarizeWizardSteps(steps);
  const progressPercent = summary.relevantTotal ? Math.round((summary.ready / summary.relevantTotal) * 100) : 100;

  return (
    <>
      <AdminPageHeader
        title="Puesta en marcha"
        description="Guía paso a paso para preparar el portal de un cliente nuevo. Cada paso enlaza a la pantalla real donde se configura."
      />

      <Card>
        <h2>Progreso</h2>
        <p>
          {summary.ready} de {summary.relevantTotal} pasos aplicables listos ({progressPercent}%).
          {summary.blocked ? ` ${summary.blocked} paso${summary.blocked === 1 ? "" : "s"} no aplicable${summary.blocked === 1 ? "" : "s"} por funcionalidades desactivadas.` : ""}
        </p>
        <div className="admin-progress-bar" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="admin-progress-bar__fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      <ol className="admin-wizard-list">
        {steps.map((step, index) => {
          const meta = STATUS_META[step.status];
          return (
            <li key={step.slug}>
              <Card>
                <div className="admin-wizard-step__header">
                  <span className="admin-wizard-step__number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <Badge variant={meta.badge}>{meta.label}</Badge>
                </div>
                <p>{step.detail}</p>
                {step.status !== "blocked" ? (
                  <Link href={step.href} className="button button--secondary">
                    {step.actionLabel}
                  </Link>
                ) : (
                  <Link href={step.href} className="text-link">
                    Revisar en Funcionalidades
                  </Link>
                )}
              </Card>
            </li>
          );
        })}
        <li>
          <Card>
            <div className="admin-wizard-step__header">
              <span className="admin-wizard-step__number" aria-hidden="true">
                13
              </span>
              <h3>Revisión</h3>
            </div>
            <p>
              {summary.ready} listos · {summary.pending} pendientes · {summary.recommended} recomendados · {summary.blocked} no
              aplicables.
            </p>
            {summary.pending === 0 ? (
              <Badge variant="success">Listo para presentar al cliente</Badge>
            ) : (
              <Badge variant="warning">Todavía hay pasos pendientes</Badge>
            )}
          </Card>
        </li>
      </ol>
    </>
  );
}
