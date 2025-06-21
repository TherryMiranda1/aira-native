import { LibrarySection } from "@/types/biblioteca";

export const bibliotecaData: LibrarySection[] = [
  {
    id: "recetas",
    title: "Recetas Saludables",
    description: "Transforma tu cocina en tu templo de bienestar",
    href: "/recipes",
    gradient: "from-orange-400 to-pink-400",
    icon: "restaurant",
    categories: [
      {
        id: "desayuno",
        title: "Desayunos Nutritivos",
        href: "/recipes?category=desayuno",
        icon: "cafe",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916751/desayuno_dqof52.jpg",
        description: "Comienza tu día con energía",
        featured: true,
      },
      {
        id: "almuerzo",
        title: "Almuerzos Equilibrados",
        href: "/recipes?category=almuerzo",
        icon: "restaurant",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916745/almuerzo_kzoujy.jpg",
        description: "Nutrición completa para el mediodía",
      },
      {
        id: "cena",
        title: "Cenas Ligeras",
        href: "/recipes?category=cena",
        icon: "restaurant",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916747/cena_foft5p.jpg",
        description: "Termina el día con sabor",
      },
      {
        id: "snacks",
        title: "Snacks",
        href: "/recipes?category=snack",
        icon: "fast-food",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916751/merienda_tvsh5o.jpg",
        description: "Antojos saludables entre comidas",
      },
      {
        id: "postres",
        title: "Postres Conscientes",
        href: "/recipes?category=postre",
        icon: "ice-cream",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916754/postre_djqonz.jpg",
        description: "Dulces placeres sin culpa",
      },
    ],
  },
  {
    id: "ejercicios",
    title: "Ejercicios Personalizados",
    description: "Fortalece tu cuerpo con movimientos conscientes",
    href: "/exercises",
    gradient: "from-blue-400 to-purple-400",
    icon: "fitness",
    categories: [
      {
        id: "pecho",
        title: "Pecho",
        href: "/exercises?category=pecho",
        icon: "body",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916750/chest_mc5eyg.jpg",
        description: "Fortalece tu torso superior",
        featured: true,
      },
      {
        id: "espalda",
        title: "Espalda",
        href: "/exercises?category=espalda",
        icon: "body",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916746/back_vdw5to.jpg",
        description: "Postura y fuerza dorsal",
      },
      {
        id: "piernas",
        title: "Piernas",
        href: "/exercises?category=piernas",
        icon: "body",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916751/legs_edn2rt.jpg",
        description: "Base sólida y potente",
      },
      {
        id: "hombros",
        title: "Hombros",
        href: "/exercises?category=hombros",
        icon: "body",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916755/shoulders_mrjmx3.jpg",
        description: "Estabilidad y movilidad",
      },
      {
        id: "biceps",
        title: "Biceps",
        href: "/exercises?category=biceps",
        icon: "body",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916747/biceps_eqo1rm.jpg",
        description: "Fuerza funcional",
      },
      {
        id: "triceps",
        title: "Tríceps",
        href: "/exercises?category=triceps",
        icon: "body",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916757/triceps_tdoqxx.jpg",
        description: "Definición y potencia",
      },
    ],
  },
  {
    id: "mini-retos",
    title: "Mini Retos",
    description: "Pequeños pasos hacia grandes cambios",
    href: "/inspiration/mini-retos",
    gradient: "from-green-400 to-teal-400",
    icon: "sparkles",
    categories: [
      {
        id: "Mindfulness",
        title: "Mindfulness & Bienestar",
        href: "/inspiration/mini-retos?category=Mindfulness",
        icon: "sparkles",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916741/R6_vxqlvt.jpg",
        description: "Conecta con tu presente interior",
        featured: true,
      },
      {
        id: "Pausas-Activas",
        title: "Pausas Activas & Energía Exprés",
        href: "/inspiration/mini-retos?category=Pausas-Activas",
        icon: "flash",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916737/image_12_dycptu.png",
        description: "Recarga tu vitalidad",
      },
      {
        id: "Movimiento-Diario",
        title: "Movimiento Diario",
        href: "/inspiration/mini-retos?category=Movimiento-Diario",
        icon: "walk",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916743/R9_ufcgsk.jpg",
        description: "Activa tu cuerpo suavemente",
      },
      {
        id: "Nutrición-Consciente",
        title: "Nutrición Consciente",
        href: "/inspiration/mini-retos?category=Nutrición-Consciente",
        icon: "nutrition",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916735/image_4_zdqxxc.png",
        description: "Alimenta tu bienestar",
      },
      {
        id: "Sueño-Reparador",
        title: "Sueño Reparador",
        href: "/inspiration/mini-retos?category=Sueño-Reparador",
        icon: "moon",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916734/image_5_pvlqwj.png",
        description: "Recuperación consciente",
      },
      {
        id: "Autocuidado",
        title: "Autocuidado",
        href: "/inspiration/mini-retos?category=Autocuidado",
        icon: "heart",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749916739/R2_uslemq.jpg",
        description: "Tiempo para ti misma",
      },
    ],
  },
  {
    id: "rituales",
    title: "Rituales de Bienestar",
    description: "Momentos sagrados para nutrir tu alma",
    href: "/inspiration/rituales",
    gradient: "from-purple-400 to-indigo-400",
    icon: "sparkles",
    categories: [
      {
        id: "despertar-energia",
        title: "Despertar Energía",
        href: "/inspiration/rituales?category=despertar-energia",
        icon: "sunny",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988969/image_42_lhawbo.png",
        description: "Comienza el día con vitalidad",
      },
      {
        id: "anti-estres",
        title: "Anti Estrés",
        href: "/inspiration/rituales?category=anti-estres",
        icon: "water",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988969/image_43_e1kd6t.png",
        description: "Libera la tensión acumulada",
      },
      {
        id: "creatividad-enfoque",
        title: "Creatividad & Enfoque",
        href: "/inspiration/rituales?category=creatividad-enfoque",
        icon: "bulb",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988970/image_44_j2xtzx.png",
        description: "Potencia tu mente creativa",
      },
      {
        id: "nutricion-consciente",
        title: "Nutrición Consciente",
        href: "/inspiration/rituales?category=nutricion-consciente",
        icon: "nutrition",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988970/image_45_rgwmhh.png",
        description: "Alimentación mindful",
      },
      {
        id: "descanso-nocturno",
        title: "Descanso Nocturno",
        href: "/inspiration/rituales?category=descanso-nocturno",
        icon: "moon",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988971/image_46_ukpwlf.png",
        description: "Cierra el día con gratitud",
      },
      {
        id: "productividad-suave",
        title: "Productividad Suave",
        href: "/inspiration/rituales?category=productividad-suave",
        icon: "time",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988971/image_47_qmvltm.png",
        description: "Productividad suave y sostenible",
      },
      {
        id: "autoestima",
        title: "Autoestima",
        href: "/inspiration/rituales?category=autoestima",
        icon: "heart",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988972/image_48_eco4bi.png",
        description: "Autoestima y amor propio",
      },
      {
        id: "activacion-corporal",
        title: "Activación Corporal",
        href: "/inspiration/rituales?category=activacion-corporal",
        icon: "walk",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988973/image_49_reppas.png",
        description: "Movimiento consciente",
      },
      {
        id: "juego-diversion",
        title: "Juego & Diversión",
        href: "/inspiration/rituales?category=juego-diversion",
        icon: "game-controller",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988974/image_50_kmow8i.png",
        description: "Juego y diversión",
      },
      {
        id: "fortaleza-interior",
        title: "Fortaleza Interior",
        href: "/inspiration/rituales?category=fortaleza-interior",
        icon: "shield",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988974/image_51_o4lh6e.png",
        description: "Fortaleza interior",
      },
      {
        id: "bienestar-fisico",
        title: "Bienestar Físico",
        href: "/inspiration/rituales?category=bienestar-fisico",
        icon: "fitness",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988975/image_52_kycjc3.png",
        description: "Bienestar físico",
      },
    ],
  },
  {
    id: "inspiracion",
    title: "Inspiración",
    description: "Palabras que llegan al corazón",
    href: "/inspiration/frases",
    gradient: "from-pink-400 to-rose-400",
    icon: "chatbox-ellipses",
    categories: [
      {
        id: "Inicio-del-Dia-General",
        title: "Inicio del Día",
        href: "/inspiration/frases?category=Inicio-del-Dia-General",
        icon: "sunny",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987230/image_36-2_zjogce.png",
        description: "Empieza con buenas energías",
      },
      {
        id: "Momentos-de-Desanimo-Falta-de-Motivacion",
        title: "Motivación",
        href: "/inspiration/frases?category=Momentos-de-Desanimo-Falta-de-Motivacion",
        icon: "flash",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987218/image_28_ppi6bn.png",
        description: "Palabras que encienden tu fuego interior",
      },
      {
        id: "Despues-de-un-Esfuerzo-Pequenos-Logros",
        title: "Celebra tus Logros",
        href: "/inspiration/frases?category=Despues-de-un-Esfuerzo-Pequenos-Logros",
        icon: "star",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987229/image_34-2_fnhmxr.png",
        description: "Reconoce cada pequeño paso",
      },
      {
        id: "Recordatorios-de-Autocuidado-Compasion",
        title: "Autocuidado",
        href: "/inspiration/frases?category=Recordatorios-de-Autocuidado-Compasion",
        icon: "heart",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987211/image_20_kfiiqo.png",
        description: "Recordatorios de amor propio",
      },
      {
        id: "Cuando-se-Falla-un-Objetivo-Flexibilidad",
        title: "Flexibilidad",
        href: "/inspiration/frases?category=Cuando-se-Falla-un-Objetivo-Flexibilidad",
        icon: "leaf",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749988107/i2_t8ixue.png",
        description: "Adapta tu camino con gracia",
      },
      {
        id: "Para-Empezar-Algo-Nuevo-Superar-la-Inercia",
        title: "Superar la Inercia",
        href: "/inspiration/frases?category=Para-Empezar-Algo-Nuevo-Superar-la-Inercia",
        icon: "arrow-forward",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987225/image_31_cgjjl0.png",
        description: "Empieza algo nuevo",
      },
      {
        id: "Manejo-del-Estres-Cansancio",
        title: "Manejo del Estres",
        href: "/inspiration/frases?category=Manejo-del-Estres-Cansancio",
        icon: "water",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987224/image_30_qgi5d9.png",
        description: "Manejo del estres y cansancio",
      },
      {
        id: "Fomentar-la-Constancia",
        title: "Fomentar la Constancia",
        href: "/inspiration/frases?category=Fomentar-la-Constancia",
        icon: "flame",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987222/image_29_e8iquq.png",
        description: "Fomentar la constancia",
      },
      {
        id: "Reflexion-al-Final-del-Dia",
        title: "Reflexión al Final del Día",
        href: "/inspiration/frases?category=Reflexion-al-Final-del-Dia",
        icon: "moon",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987227/image_33_ldrqjr.png",
        description: "Reflexión al final del día",
      },
      {
        id: "Conectando-con-el-Cuerpo-Ejercicio-Escucha",
        title: "Conectando con el Cuerpo",
        href: "/inspiration/frases?category=Conectando-con-el-Cuerpo-Ejercicio-Escucha",
        icon: "body",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987226/image_32_nrhvyd.png",
        description: "Conectando con el cuerpo",
      },
      {
        id: "Alimentacion-Consciente",
        title: "Alimentacion Consciente",
        href: "/inspiration/frases?category=Alimentacion-Consciente",
        icon: "nutrition",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987221/image_26_fw7hdl.png",
        description: "Alimentacion consciente",
      },
      {
        id: "Celebrando-la-Resiliencia",
        title: "Resiliencia",
        href: "/inspiration/frases?category=Celebrando-la-Resiliencia",
        icon: "flame",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987218/image_27_qqvtbl.png",
        description: "Fortaleza que trasciende",
      },
    ],
  },
  {
    id: "generadores",
    title: "Planes Personalizados",
    description: "Herramientas inteligentes para tu bienestar",
    href: "/plans",
    gradient: "from-indigo-400 to-purple-400",
    icon: "bulb",
    categories: [
      {
        id: "plan-completo",
        title: "Plan Completo",
        href: "plans/complete-plan",
        icon: "bulb",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987193/g_3_l1sbk6.png",
        description: "Tu guía completa de bienestar",
      },
      {
        id: "rutinas",
        title: "Rutinas de Ejercicio",
        href: "/plans/workout-routine",
        icon: "fitness",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987194/g_voimfs.png",
        description: "Entrenamientos adaptados a ti",
      },
      {
        id: "comidas",
        title: "Planes de Comida",
        href: "/plans/daily-meal-plan",
        icon: "restaurant",
        image:
          "https://res.cloudinary.com/dtlaxm8gi/image/upload/v1749987194/g_2_dl5iq3.png",
        description: "Menús nutritivos diarios",
      },
    ],
  },
];
