export const contentConfig = {
  hero: {
    title: "Pan artesanal, cada día",
    description: "Elaboramos pan en pequeñas tandas, con buenos ingredientes y el tiempo que necesita.",
    imageAlt: "Pan artesanal recién horneado en el obrador",
    primaryAction: { label: "Conocer el obrador", href: "/obrador" },
    secondaryAction: { label: "Reservar pan", href: "/reserva-y-recoge" },
  },
  home: {
    seo: {
      ogDescription: "Reserva tu pan antes de que lo horneemos y recógelo cuando esté listo.",
    },
    catalog: { title: "Pan disponible hoy", actionLabel: "Ver todo el pan" },
    weeklySpecial: { badge: "Especial de la semana", datePrefix: "Para recoger el", priorityPrefix: "Con", prioritySuffix: "reservas el especial antes que el público general.", action: "Reservar →" },
    craft: {
      title: "Así hacemos nuestro pan",
      description: "Tiempo, buenos ingredientes y oficio en cada tanda.",
      imageAlt: "Manos trabajando una masa de pan",
      features: [
        { icon: "starter", title: "Masa madre viva", description: "La cuidamos cada día para aportar sabor y carácter a cada pan." },
        { icon: "time", title: "Fermentación lenta", description: "Damos a cada masa el tiempo necesario para desarrollar aroma y textura." },
        { icon: "grain", title: "Harinas seleccionadas", description: "Elegimos harinas de calidad y moliendas que respetan el grano." },
        { icon: "craft", title: "Oficio artesanal", description: "Amasamos, formamos y horneamos en pequeñas tandas." },
      ],
    },
    subscriptions: {
      title: "Tu pan habitual, sin tener que pedirlo cada vez",
      description: "Un plan flexible para reservar el pan que forma parte de tu semana.",
      imageAlt: "Selección de panes artesanales del plan de suscripción",
      benefits: ["Tu pan queda reservado", "Elige frecuencia y punto de recogida", "Pausa o cancela cuando quieras"],
      pricePrefix: "Desde",
      priceSuffix: " / semana",
      priceNote: "Pausa o cancela cuando quieras.",
      primaryAction: "Configurar mi plan",
      secondaryAction: "Cómo funciona",
    },
  },
  obrador: {
    seo: { title: "Cómo hacemos el pan", description: "Masa madre, fermentación lenta y pequeñas tandas: así trabajamos en nuestro obrador.", ogTitle: "Nuestro obrador", ogDescription: "Harina, agua, tiempo y oficio detrás de cada pan." },
    intro: { eyebrow: "Cómo trabajamos", title: "El obrador", description: "Aquí se mezclan ingredientes sencillos, trabajo diario y el tiempo que cada masa necesita.", imageAlt: "Mesa de trabajo de un obrador artesanal" },
    process: [
      { number: "01", icon: "starter", title: "La masa madre", description: "Harina y agua que fermentan y alimentamos cada día." },
      { number: "02", icon: "time", title: "La fermentación", description: "Después de amasar, esperamos y dejamos que la masa marque el ritmo." },
      { number: "03", icon: "oven", title: "El horno", description: "Formamos cada pieza y la horneamos hasta conseguir su corteza y su miga." },
      { number: "04", icon: "grain", title: "La rutina", description: "Amasar, reposar, formar, hornear y volver a empezar." },
    ],
    production: {
      title: "Por qué trabajamos en pequeñas tandas",
      paragraphs: [
        "La capacidad del horno, las manos y las horas del día ponen un límite natural a la producción.",
        "Planificar cada hornada nos ayuda a cuidar el pan y a reducir el desperdicio.",
      ],
      secondaryTitle: "Aprovechar cada pieza",
      secondaryParagraphs: [
        "Buscamos una salida responsable para el pan que no se vende en el día.",
        "La reserva anticipada permite que cada pieza tenga un destino antes de entrar en el horno.",
      ],
      imageAlt: "Proceso de amasado en el obrador",
    },
    cta: { eyebrow: "Hecho con tiempo", title: "El pan empieza mucho antes de abrir la puerta.", action: "Ver el pan disponible", imageAlt: "Pan artesanal recién horneado" },
  },
  nosotros: {
    seo: { title: "Quiénes somos", description: "Conoce a las personas, los valores y la forma de trabajar de nuestro obrador.", ogTitle: "Un obrador hecho por personas", ogDescription: "Oficio, ingredientes honestos y una relación cercana con nuestro entorno." },
    intro: { eyebrow: "Las personas", title: "Nosotros", description: "Somos un pequeño equipo dedicado a hacer pan artesanal cada día." },
    team: { title: "Quién lo hace", paragraphs: ["Detrás de cada hogaza hay personas que amasan, forman, hornean y atienden el obrador.", "Aquí puedes contar la historia del equipo, sus oficios y cómo nació el proyecto."], imageAlt: "Equipo del obrador artesanal" },
    place: { eyebrow: "Nuestro entorno", title: "Por qué aquí", paragraphs: ["Trabajamos cerca de las personas y productores que dan vida a nuestro entorno.", "Elegimos ingredientes con origen conocido siempre que es posible."] },
    values: {
      title: "Lo que sostiene nuestro trabajo",
      description: "El buen pan también depende de las decisiones que se toman antes y después de hornear.",
      items: [
        { title: "Tradición útil", description: "Conservamos las técnicas que aportan calidad y sentido al proceso.", tone: "terracotta" },
        { title: "Ingredientes honestos", description: "Cada ingrediente tiene una función y un origen que podemos explicar.", tone: "yellow" },
        { title: "Tiempo necesario", description: "Respetamos el ritmo de la masa sin buscar atajos.", tone: "green" },
        { title: "Comunidad cercana", description: "Un obrador existe gracias a quienes trabajan, colaboran y vuelven.", tone: "blue" },
      ],
    },
    cta: { eyebrow: "Pequeño obrador", title: "Hacemos solo lo que podemos hacer bien.", description: "Cada tanda recibe la atención que merece.", primaryAction: "Ver el pan", secondaryAction: "Dónde estamos" },
  },
  reservation: {
    seo: { title: "Reserva y recoge", description: "Elige el pan disponible, completa tu pedido y recógelo en el punto que prefieras." },
    productSeoSuffix: "— reserva online y recoge en el obrador.",
  },
  subscriptions: {
    name: "Plan de Pan",
    seo: { title: "Plan de Pan", description: "Recibe tu pan artesanal con la frecuencia que elijas, sin tener que reservar cada vez." },
    intro: { eyebrow: "Plan de Pan", title: "Tu pan, con la frecuencia que elijas", description: "Configura una cesta habitual y nosotros reservaremos cada entrega para ti.", action: "Configurar suscripción", imageAlt: "Panes artesanales preparados para una suscripción" },
    processHeading: { eyebrow: "Así de simple", title: "Cómo funciona" },
    steps: [
      { icon: "grain", title: "Elige tu pan", description: "Monta una cesta con los panes que quieres recibir habitualmente." },
      { icon: "calendar", title: "Define tu frecuencia", description: "Escoge el ritmo que mejor encaje en tu rutina." },
      { icon: "package", title: "Recógelo sin volver a pedir", description: "Prepararemos tu cesta automáticamente para el punto de recogida elegido." },
    ],
    pickupAction: "Ver puntos de recogida",
    frequencyHeading: { eyebrow: "A tu ritmo", title: "Elige tu frecuencia" },
    catalogHeading: { eyebrow: "Tu cesta, tu pan", title: "Panes disponibles en el plan", description: "Explora los panes que puedes añadir a tu cesta habitual y elige los que mejor se adapten a tu rutina." },
    catalogAction: "Ver panes del plan",
    memberships: { eyebrow: "Elige tu cesta", title: "Configura tu Plan de Pan", description: "Elige el pan, la cantidad y la frecuencia que mejor encajen en tu rutina." },
  },
  location: {
    seo: { title: "Dónde estamos", description: "Consulta la ubicación del obrador y sus puntos y horarios de recogida." },
    intro: { eyebrow: "Visítanos", title: "Dónde estamos", withPoints: "Puedes recoger tu pan en el obrador o en nuestros puntos de recogida. Consulta los días y horarios de cada uno.", withoutPoints: "Estamos preparando la información del obrador y sus próximos puntos de recogida." },
    callout: { eyebrow: "Antes de venir", title: "Cada punto tiene sus propios horarios", description: "Tu reserva indicará el lugar, el día y la franja de recogida disponibles para tu pedido.", action: "Cómo funciona la recogida" },
  },
  newsletter: {
    eyebrow: "Desde el obrador", title: "Te contamos lo que sale del horno", description: "Nuevos panes, fechas y noticias del obrador. Sin ruido y con baja en cualquier momento.", consentLabel: "Quiero recibir novedades del obrador por correo.", consentDescription: "Podrás darte de baja cuando quieras.", successMessage: "¡Gracias! Revisa tu correo para completar la suscripción.", confirmedMessage: "Tu suscripción a la newsletter está confirmada.", unsubscribedMessage: "Te has dado de baja de la newsletter.",
    confirmation: { seoDescription: "Confirma tu suscripción a la newsletter del obrador.", eyebrow: "Newsletter", title: "Confirma tu suscripción", description: "Un último paso: confirma que quieres recibir nuestras novedades por correo." },
    unsubscribe: { seoDescription: "Gestiona tu baja de la newsletter del obrador.", eyebrow: "Newsletter", title: "Darte de baja", description: "Confirma que quieres dejar de recibir la newsletter. Seguirás recibiendo los correos relacionados con pedidos en curso." },
  },
  contact: {
    seo: { title: "Contacto", description: "Ponte en contacto con nuestro obrador artesanal." },
    intro: { eyebrow: "Hablemos", title: "Contacto", description: "Escríbenos para consultas generales, recogidas o colaboraciones." },
    body: { title: "Cuéntanos en qué podemos ayudarte", description: "Rellena el formulario y te responderemos al correo que nos indiques.", emailPrefix: "También puedes escribirnos directamente a" },
  },
  footer: {
    description: "Pan artesanal, hecho entre manos y tiempo.", legalName: "",
    breadHeading: "Pan", informationHeading: "Información", contactHeading: "Contacto",
    breadLinks: [
      { label: "Panes diarios", href: "/reserva-y-recoge/panes-diarios" },
      { label: "Especiales", href: "/reserva-y-recoge/pan-especial-del-dia" },
      { label: "Dulces", href: "/reserva-y-recoge/dulces" },
      { label: "Ver todo", href: "/reserva-y-recoge" },
    ],
    informationLinks: [
      { label: "Reserva y recoge", href: "/reserva-y-recoge" },
      { label: "Plan de Pan", href: "/plan-de-pan" },
      { label: "Dónde estamos", href: "/donde-estamos" },
      { label: "Mi cuenta", href: "/cuenta/acceder" },
    ],
    contactFallback: "Formulario de contacto", sealTop: "Masa madre", sealBottom: "Oficio artesanal",
  },
} as const;

export type SiteContent = typeof contentConfig;
