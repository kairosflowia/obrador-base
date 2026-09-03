import Link from "next/link";

import { InstagramIcon, PinIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site-config";
import { Newsletter } from "./newsletter";

import { Container } from "../ui/layout";

export function PublicFooter() {
  const content = siteConfig.content.footer;
  const breadLinks = siteConfig.features.catalog ? content.breadLinks : [];
  const informationLinks = content.informationLinks.filter(({ href }) => {
    if (href === "/reserva-y-recoge") return siteConfig.features.onlineOrders;
    if (href === "/plan-de-pan") return siteConfig.features.subscriptions;
    if (href === "/donde-estamos") return siteConfig.features.pickupPoints;
    if (href === "/cuenta/acceder") return siteConfig.features.customerAccounts;
    return true;
  });
  const socialLinks = [
    ...(siteConfig.business.instagram ? [{ label: "Instagram", href: siteConfig.business.instagram, Icon: InstagramIcon }] : []),
    { label: "Dónde estamos", href: "/donde-estamos", Icon: PinIcon },
  ];
  const legalName = content.legalName || siteConfig.brand.name;
  return (
    <footer className="public-footer">
      {siteConfig.features.newsletter ? <Container size="wide" className="container--home footer-newsletter"><Newsletter /></Container> : null}
      <Container size="wide" className="container--home public-footer__grid">
        <div className="public-footer__brand">
          <p className="wordmark">{siteConfig.brand.name}</p>
          <p className="footer-manifesto">{content.description}</p>
          <div className="footer-social" aria-label={`Redes sociales y ubicación de ${siteConfig.brand.name}`}>
            {socialLinks.map(({ label, href, Icon }) =>
              href.startsWith("/") ? (
                <Link key={label} href={href} aria-label={label} className="footer-social__link">
                  <Icon />
                </Link>
              ) : (
                <a key={label} href={href} aria-label={label} className="footer-social__link">
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>
        {breadLinks.length ? <nav aria-label="Navegación del pie: pan">
          <p className="footer-heading">{content.breadHeading}</p>
          {breadLinks.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav> : null}
        {informationLinks.length ? <nav aria-label="Navegación del pie: información">
          <p className="footer-heading">{content.informationHeading}</p>
          {informationLinks.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav> : null}
        <div>
          <p className="footer-heading">{content.contactHeading}</p>
          {siteConfig.business.email ? <a href={`mailto:${siteConfig.business.email}`} className="footer-email">{siteConfig.business.email}</a> : <Link href="/contacto" className="footer-email">{content.contactFallback}</Link>}
          {siteConfig.business.phone ? <a href={`tel:${siteConfig.business.phone.replace(/\s/g, "")}`} className="footer-email footer-phone">{siteConfig.business.phone}</a> : null}
        </div>
        <div className="footer-seal" aria-hidden="true">
          <span>{content.sealTop}</span>
          <span className="footer-seal__mark">{siteConfig.brand.shortName.charAt(0)}</span>
          <span>{content.sealBottom}</span>
        </div>
      </Container>
      <Container size="wide" className="container--home public-footer__bottom">
        <small>© {new Date().getFullYear()} {legalName}. Todos los derechos reservados.</small>
        <nav aria-label="Información legal" className="footer-legal">
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/privacidad">Política de privacidad</Link>
          <Link href="/cookies">Política de cookies</Link>
        </nav>
      </Container>
    </footer>
  );
}
