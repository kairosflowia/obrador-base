import { getBrandSettings } from "@/lib/brand/get-brand-settings";

const escapeHtml=(value:unknown)=>String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
export async function renderTemplate(template:{subject_template:string;body_html_template:string;body_text_template:string;required_variables:string[]},payload:Record<string,unknown>){
  const siteConfig=await getBrandSettings();
  // brand_name/brand_short_name/brand_tagline siempre están disponibles para
  // cualquier plantilla, sin que cada evento tenga que pasarlas en su
  // payload — así el contenido guardado en notification_templates puede
  // usar {{brand_name}} en vez de hardcodear el nombre de un cliente.
  const enrichedPayload:Record<string,unknown>={brand_name:siteConfig.brand.name,brand_short_name:siteConfig.brand.shortName,brand_tagline:siteConfig.brand.tagline,...payload};
  for(const key of template.required_variables??[])if(enrichedPayload[key]===undefined||enrichedPayload[key]===null)throw new Error(`missing_variable:${key}`);
  const replace=(source:string,html=false)=>source.replace(/\{\{([a-z0-9_]+)\}\}/gi,(_,key)=>html?escapeHtml(enrichedPayload[key]):String(enrichedPayload[key]??""));
  const content=replace(template.body_html_template,true);
  return{subject:replace(template.subject_template),text:replace(template.body_text_template),html:`<!doctype html><html lang="es"><body style="margin:0;background:${siteConfig.brand.colors.background};color:${siteConfig.brand.colors.foreground};font-family:Arial,sans-serif"><div style="max-width:600px;margin:auto;padding:32px"><p style="font-weight:800;font-size:24px">${escapeHtml(siteConfig.brand.name)}</p><div>${content}</div><hr style="border:0;border-top:1px solid currentColor"><p>${escapeHtml(siteConfig.brand.tagline)}</p></div></body></html>`}
}
