import type { FeatureKey } from "@/config/feature-config";

export const FEATURE_META: Record<FeatureKey, { label: string; description: string; dependsOn: FeatureKey[] }> = {
  catalog: { label: "Catálogo", description: "Muestra los productos del obrador en el portal.", dependsOn: [] },
  pickupPoints: { label: "Puntos de recogida", description: "Gestión de puntos, horarios y ventanas de recogida.", dependsOn: [] },
  availability: { label: "Disponibilidad", description: "Capacidad de producción y calendario de fechas.", dependsOn: ["catalog"] },
  payments: { label: "Pagos", description: "Cobro con Stripe. Sin esto, no se pueden cerrar pedidos online.", dependsOn: [] },
  onlineOrders: {
    label: "Pedidos online",
    description: "Reserva y pago desde el portal público.",
    dependsOn: ["catalog", "pickupPoints", "payments"],
  },
  customerAccounts: { label: "Cuentas de cliente", description: "Registro, acceso y área personal del cliente.", dependsOn: [] },
  inventory: { label: "Inventario", description: "Entradas, mermas y ajustes de estoque por variante.", dependsOn: ["catalog"] },
  production: { label: "Producción", description: "Organización del trabajo del obrador por fecha y punto.", dependsOn: ["catalog", "availability"] },
  subscriptions: {
    label: "Plan de Pan",
    description: "Suscripción con cesta propia y entregas recurrentes.",
    dependsOn: ["catalog", "onlineOrders", "payments", "customerAccounts", "pickupPoints"],
  },
  newsletter: { label: "Newsletter", description: "Suscripción a novedades por correo.", dependsOn: [] },
  analytics: { label: "Analítica", description: "Panel de ventas, producción y clientes.", dependsOn: [] },
  notifications: { label: "Notificaciones", description: "Avisos push y transaccionales al cliente.", dependsOn: ["customerAccounts"] },
};
