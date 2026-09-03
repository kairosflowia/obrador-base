import "server-only";import Stripe from "stripe";
const demoMode=()=>["true","1","yes"].includes(process.env.NEXT_PUBLIC_DEMO_MODE?.trim().toLowerCase()??"");
export function getStripe(){if(demoMode())throw new Error("Stripe está bloqueado en modo demo.");const key=process.env.STRIPE_SECRET_KEY?.trim();if(!key)throw new Error("Stripe no está configurado.");return new Stripe(key);}
export function stripeConfigured(){return !demoMode()&&Boolean(process.env.STRIPE_SECRET_KEY?.trim()&&process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()&&process.env.STRIPE_WEBHOOK_SECRET?.trim());}
