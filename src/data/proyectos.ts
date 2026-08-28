/**
 * Proyectos de estudiantes — Programa Creación Digital.
 *
 * Contenido 100% estático (sin base de datos, sin backend): cada vez que
 * haya un proyecto nuevo, se agrega un objeto a este array a mano. Las
 * imágenes/archivos se suben directo a `public/programa/img/proyectos/`
 * (o donde corresponda) y se referencian aquí por ruta.
 *
 * - El preview del home (sección "Proyectos que crean nuestros
 *   estudiantes") NO muestra siempre los mismos 2 proyectos: en cada
 *   carga de página elige 2 al azar entre los que tengan AMBAS
 *   portadas (`image` horizontal + `imageVertical`) — ver
 *   HOME_PROJECTS_POOL/pickHomeProjects en ProgramaCreacionDigital.tsx.
 *   Por eso, para que un proyecto entre a esa rotación, necesita las
 *   dos versiones de portada: puede tocarle el marco ancho (horizontal)
 *   o el marco alto (vertical) según le toque en el sorteo. Un proyecto
 *   sin `imageVertical` simplemente no participa del preview del home
 *   (pero sí aparece igual en `/proyectos`, que muestra el array
 *   completo).
 * - `/proyectos` muestra el array completo.
 */

export interface ProyectoModal {
  /** Imágenes del carrusel en el modal (rutas dentro de /public). */
  images: string[];
  /** Nombre largo del proyecto (puede diferir de caption). */
  titleEs?: string;
  titleEn?: string;
  descriptionEs: string;
  descriptionEn: string;
  /** Habilidades que los estudiantes desarrollaron con este proyecto. */
  skillsEs?: string[];
  skillsEn?: string[];
}

export interface Proyecto {
  id: string;
  /** Imagen principal (portada) del proyecto — siempre horizontal. */
  image: string;
  /** Versión vertical de la portada. Si falta, el proyecto no entra en
      el sorteo del preview del home (ver comentario arriba del array) —
      igual se sigue mostrando en /proyectos con la horizontal. */
  imageVertical?: string;
  /** Asignatura/curso, ej. "Estudio de Creación Digital 4" — se usa para el filtro. */
  subject: string;
  /** Versión en inglés de subject, opcional. */
  subjectEn?: string;
  /** Iniciales o nombre del profesor, ej. "A. Rozo". Opcional — hay proyectos (iniciativas fuera de una asignatura) sin docente asociado. */
  professor?: string;
  /** Año del proyecto (texto, ej. "2026") — se usa para el filtro. */
  year: string;
  /** Descripción corta (1 línea), se usa en el home y como título en /proyectos. */
  caption: string;
  /** Versión en inglés de caption, opcional. */
  captionEn?: string;
  /** Nombre del estudiante autor, opcional. */
  student?: string;
  /** Archivo descargable opcional (PDF, .glb, .zip, etc.), ruta dentro de /public. */
  fileUrl?: string;
  fileLabel?: string;
  /** Datos del modal — si está presente, la card abre popup. */
  modal?: ProyectoModal;
}

export const PROYECTOS: Proyecto[] = [
  {
    id: 'chocosapiens-humanismo-digital',
    image: '/programa/img/chocosapiens.webp',
    imageVertical: '/programa/img/proyectos/chocosapiens-portada.webp',
    subject: 'Contexto Digital 1',
    subjectEn: 'Digital Context 1',
    professor: 'C. Cardozo',
    year: '2026',
    caption: 'Investigación de mercado y estrategia de marca para ChocoSapiens',
    captionEn: 'Market research and brand strategy for ChocoSapiens',
    student: 'Danna Gómez y Simón Perdomo',
    modal: {
      images: [
        '/programa/img/proyectos/chocosapiens-portada.webp',
        '/programa/img/proyectos/chocosapiens-cover.webp',
        '/programa/img/proyectos/chocosapiens-s02.webp',
        '/programa/img/proyectos/chocosapiens-mapa.webp',
        '/programa/img/proyectos/chocosapiens-s23.webp',
        '/programa/img/proyectos/chocosapiens-s28.webp',
        '/programa/img/proyectos/chocosapiens-s30.webp',
        '/programa/img/proyectos/chocosapiens-chocobuds.webp',
      ],
      titleEs: 'ChocoSapiens — Investigación de Mercado',
      titleEn: 'ChocoSapiens — Market Research',
      descriptionEs:
        'A partir de un encargo real, Danna y Simón se sumergieron en el ecosistema de bebidas funcionales wellness en Colombia. No empezaron con ideas, sino con preguntas: ¿quién le compra a ChocoSapiens? ¿por qué esa persona elegiría una bebida de cacao sobre las decenas de opciones que ya existen? ¿qué dice el empaque de Savvy que el de Toning no dice?\n\nLa investigación los llevó a supermercados, lineales de góndola y chats de atención al cliente. Con cada visita de campo, cada captura de pantalla y cada recorrido de mystery shopper, el patrón fue apareciendo con claridad: el mercado wellness en Colombia comunica funcionalidad, pero no emoción. Proteína, colágeno, sin azúcar. Siempre lo mismo. En ese silencio emocional vieron una apertura.\n\nDe ahí nació Coquito —un coco estilizado con sombrero vueltiao que no solo representa la identidad colombiana, sino que encarna una filosofía: el bienestar no es una meta fitness, es un ritual diario, una pausa, un reset. Y para que ese personaje viviera más allá de una campaña, diseñaron ChocoBuds: stickers coleccionables que van dentro de cada empaque, pensados para convertir cada compra en un acto de comunidad y cada usuario en un embajador espontáneo de la marca.',
      descriptionEn:
        'Working from a real client brief, Danna and Simón dove into the functional wellness drink ecosystem in Colombia. They didn\'t start with ideas — they started with questions: who actually buys ChocoSapiens? Why would that person choose a cacao-based drink over the dozens of options already on the shelf? What does Savvy\'s packaging say that Toning\'s doesn\'t?\n\nThe research took them to supermarkets, retail gondolas and brand chatbots. Through mystery shopper visits, screenshots and field notes, a pattern emerged clearly: the wellness market in Colombia communicates functionality, but not emotion. Protein, collagen, no added sugar. Always the same. And in that emotional silence, they saw an opening.\n\nThat\'s where Coquito came from — a stylized cacao character wearing a sombrero vueltiao who doesn\'t just represent Colombian identity, but embodies a philosophy: wellness isn\'t a fitness goal, it\'s a daily ritual, a pause, a reset. And to give that character a life beyond a single campaign, they designed ChocoBuds: collectible stickers packed inside each unit, built to turn every purchase into an act of community and every customer into a spontaneous brand ambassador.',
      skillsEs: ['Investigación de mercado', 'Benchmarking', 'User Persona', 'Análisis FODA', 'Estrategia de marca', 'Diseño de personaje', 'Planificación de campaña'],
      skillsEn: ['Market Research', 'Benchmarking', 'User Persona', 'SWOT Analysis', 'Brand Strategy', 'Character Design', 'Campaign Planning'],
    },
  },
  {
    id: 'rappi-ux-research',
    image: '/programa/img/rappi.webp',
    imageVertical: '/programa/img/proyectos/rappi-portada.webp',
    subject: 'Análisis de Usuarios 2',
    subjectEn: 'User Analysis 2',
    professor: 'J. Lamprea',
    year: '2026',
    caption: 'Investigación de UX y auditoría de usabilidad de Rappi Colombia',
    captionEn: 'UX research and usability audit of Rappi Colombia',
    student: 'Laura Sierra y Daniel Rodríguez',
    modal: {
      images: [
        '/programa/img/proyectos/rappi-cover.webp',
        '/programa/img/proyectos/rappi-problema.webp',
        '/programa/img/proyectos/rappi-objetivos.webp',
        '/programa/img/proyectos/rappi-metodologia.webp',
        '/programa/img/proyectos/rappi-recomendaciones.webp',
        '/programa/img/proyectos/rappi-impacto.webp',
        '/programa/img/proyectos/rappi-conclusiones.webp',
      ],
      titleEs: 'Rappi — La app que convierte conveniencia en frustración',
      titleEn: 'Rappi — The App That Turns Convenience Into Frustration',
      descriptionEs:
        'El punto de partida fue una pregunta incómoda: ¿por qué seis de cada diez usuarios de Rappi abandonan su pedido antes de pagar? Laura y Daniel no asumieron que el problema era el precio. Investigaron para descubrir que el problema era el momento en que ese precio aparecía.\n\nCon una mezcla de métodos cualitativos y cuantitativos —entrevistas semiestructuradas, diarios de estudio, pruebas de usabilidad, benchmarking contra Uber Eats y DiDi Food, SUS Score, auditoría WCAG y un experimento A/B— construyeron un retrato preciso de la fricción. El hallazgo central: Rappi no pierde usuarios por sus precios. Los pierde porque se los esconde hasta el final. El checkout sorprende; el usuario no vuelve.\n\nLas recomendaciones apuntan a soluciones concretas: mostrar el costo real desde el inicio del flujo, reducir la sobrecarga visual, destacar restaurantes frecuentes para acelerar la decisión. Si se implementaran, los modelos proyectan −48% en tiempo de tarea y +40% en tasa de completación. El insight de cierre lo dice mejor que cualquier métrica: Rappi no tiene un problema de producto. Tiene un problema de promesa.',
      descriptionEn:
        'The starting point was an uncomfortable question: why do six out of ten Rappi users abandon their order before paying? Laura and Daniel didn\'t assume the problem was the price. They investigated to find that the problem was the moment that price appeared.\n\nUsing a mix of qualitative and quantitative methods — semi-structured interviews, study diaries, usability testing, benchmarking against Uber Eats and DiDi Food, SUS Score, WCAG accessibility audit, and an A/B experiment — they built a precise portrait of friction. The central finding: Rappi doesn\'t lose users because of its prices. It loses them because it hides those prices until the very end. The checkout surprises; the user doesn\'t come back.\n\nThe recommendations point to concrete solutions: show the real cost from the beginning of the flow, reduce visual overload, highlight frequent restaurants to speed up decisions. If implemented, models project −48% in task time and +40% in order completion rate. The closing insight says it better than any metric: Rappi doesn\'t have a product problem. It has a promise problem.',
      skillsEs: ['Investigación UX', 'Pruebas de usabilidad', 'SUS Score', 'Auditoría WCAG', 'Customer Journey Map', 'Experimento A/B', 'Benchmarking', 'Análisis AARRR'],
      skillsEn: ['UX Research', 'Usability Testing', 'SUS Score', 'WCAG Audit', 'Customer Journey Map', 'A/B Experiment', 'Benchmarking', 'AARRR Analysis'],
    },
  },
  {
    id: 'la-guarida',
    image: '/programa/img/la-guarida.webp',
    imageVertical: '/programa/img/proyectos/la-guarida-portada.webp',
    subject: 'Composición Plástica 2',
    subjectEn: 'Plastic Composition 2',
    professor: 'C. Cardozo',
    year: '2026',
    caption: 'Identidad visual y campaña para la miniserie web La Guarida',
    captionEn: 'Visual identity and campaign for the web series La Guarida',
    student: 'Laura Correa, Mateo Pineda y Manuel Zambrano',
    modal: {
      images: [
        '/programa/img/proyectos/la-guarida-cover.webp',
        '/programa/img/proyectos/la-guarida-moodboard.webp',
        '/programa/img/proyectos/la-guarida-tipografia.webp',
        '/programa/img/proyectos/la-guarida-logo.webp',
        '/programa/img/proyectos/la-guarida-keyvisual.webp',
        '/programa/img/proyectos/la-guarida-mockups.webp',
      ],
      titleEs: 'La Guarida — Identidad Visual y Campaña',
      titleEn: 'La Guarida — Visual Identity & Campaign',
      descriptionEs:
        'La Guarida nació como una miniserie web sobre dos amigos de infancia, Carlos y Camila, que comparten una azotea en medio del caos urbano. Pero antes de existir en pantalla, tuvo que existir como imagen. Laura, Mateo y Manuel tomaron esa historia y la convirtieron en un sistema visual completo: un universo donde cada decisión —el color, la tipografía, el encuadre— cuenta algo sobre la amistad, el tiempo y lo que se pierde sin darse cuenta.\n\nLa paleta partió de un concepto claro: vínculos cercanos. Tonos tierra, cafés y un filtro sepia que unifica todas las piezas sin volverlas monótonas. La tipografía principal, Headstock Sans, le da carácter contemporáneo a los títulos; Aileron sostiene el cuerpo de texto con limpieza. El logo se construyó sobre una retícula visible —la estructura como parte del diseño— y se lee en dos tiempos: primero "Guarida", luego "La". Una jerarquía intencional.\n\nLa campaña se desplegó en tres fases sobre Instagram (@laguaridafilm): expectativa, lanzamiento y sostenimiento. Cada pieza fue diseñada para funcionar sola y en conjunto, construyendo un feed coherente. El proyecto culminó con una línea de merchandising estilo A24 —gorra, tote bag, agenda, postal— que llevó la identidad más allá de la pantalla y la convirtió en objeto.',
      descriptionEn:
        'La Guarida started as a web series about two childhood friends, Carlos and Camila, who share a rooftop in the middle of the urban chaos. But before it could exist on screen, it had to exist as an image. Laura, Mateo and Manuel took that story and turned it into a complete visual system — a universe where every decision, the color, the typeface, the framing, says something about friendship, time, and what gets lost without anyone noticing.\n\nThe palette came from a clear concept: close bonds. Earth tones, warm browns, and a sepia filter that unifies every piece without making them monotonous. The main typeface, Headstock Sans, gives the titles a contemporary character; Aileron keeps the body text clean and readable. The logo was built on a visible grid — structure as part of the design — and reads in two beats: first "Guarida", then "La". An intentional hierarchy.\n\nThe campaign rolled out in three phases on Instagram (@laguaridafilm): expectation, launch, and sustaining. Each piece was designed to work alone and as part of a whole, building a coherent feed. The project ended with an A24-style merchandise line — cap, tote bag, notebook, postcard — that carried the identity beyond the screen and turned it into an object.',
      skillsEs: ['Dirección de arte', 'Identidad visual', 'Diseño tipográfico', 'Fotografía editorial', 'Campaña en redes', 'Diseño de logo', 'Merchandising'],
      skillsEn: ['Art Direction', 'Visual Identity', 'Typographic Design', 'Editorial Photography', 'Social Media Campaign', 'Logo Design', 'Merchandising'],
    },
  },
  {
    id: 'libro-ilustrado-ia-vitiligo-infantil',
    image: '/programa/img/vitiligo-infantil.webp',
    imageVertical: '/programa/img/proyectos/vitiligo-infantil-portada.webp',
    subject: 'Proyecto adicional',
    subjectEn: 'Additional project',
    year: '2026',
    caption: 'Libro ilustrado con IA para la concientización del vitiligo infantil',
    captionEn: 'AI-illustrated book raising awareness about childhood vitiligo',
    student: 'Junior Mejía Méndez',
    modal: {
      // Solo la portada horizontal se muestra en la galería del detalle del
      // proyecto (a pedido) — la vertical (imageVertical, arriba) es
      // exclusivamente para la portada alta del carrusel rotativo del home.
      images: ['/programa/img/vitiligo-infantil.webp'],
      titleEs: 'Libro Ilustrado con IA — Vitiligo Infantil',
      titleEn: 'AI-Illustrated Book — Childhood Vitiligo',
      descriptionEs:
        'Durante 2026-1, Junior Mejía Méndez, estudiante de tercer semestre de Creación Digital, participó en el desarrollo de un libro ilustrado creado con inteligencia artificial, cuyo propósito es contribuir a la concientización sobre el vitiligo infantil.\n\nLa iniciativa surgió a partir de la necesidad planteada por la Dra. María Paula Torres Langhammer, residente de dermatología, quien buscaba desarrollar un cuento de biblioterapia dirigido a niños con vitiligo pediátrico. A partir de esta necesidad, la doctora se conectó con Junior para convertir la idea en una propuesta visual y narrativa.\n\nPara desarrollar el proyecto, Junior llevó a cabo un proceso de exploración y experimentación. Comenzó investigando referentes visuales, definiendo una estética propia y entrenando modelos de inteligencia artificial a partir de imágenes de referencia, con el objetivo de conseguir uniformidad y estabilidad visual a lo largo de las ilustraciones.\n\nPosteriormente, desarrolló el contenido final utilizando herramientas de inteligencia artificial como Higgsfield y Gemini, integrando diferentes recursos y técnicas para construir una propuesta coherente. El resultado evidencia no solo su dominio de estas herramientas, sino también habilidades propias de un creador digital, como la composición, la dirección de arte, la exploración visual y la capacidad de convertir una necesidad real en una solución creativa con impacto social.',
      descriptionEn:
        'During 2026-1, Junior Mejía Méndez, a third-semester Digital Creation student, took part in developing an AI-illustrated book aimed at raising awareness about childhood vitiligo.\n\nThe initiative began with a need raised by Dr. María Paula Torres Langhammer, a dermatology resident, who wanted to create a bibliotherapy story for children with pediatric vitiligo. From there, she connected with Junior to turn the idea into a visual and narrative proposal.\n\nTo develop the project, Junior went through a process of exploration and experimentation. He started by researching visual references, defining his own aesthetic, and training AI models on reference images to achieve visual consistency and stability throughout the illustrations.\n\nHe then produced the final content using AI tools like Higgsfield and Gemini, combining different resources and techniques to build a coherent proposal. The result showcases not only his command of these tools but also skills specific to a digital creator — composition, art direction, visual exploration, and the ability to turn a real need into a creative solution with social impact.',
      skillsEs: ['Ilustración con IA', 'Entrenamiento de modelos de imagen', 'Diagramación editorial', 'Diseño de personajes', 'Storytelling visual'],
      skillsEn: ['AI Illustration', 'Image Model Training', 'Editorial Layout', 'Character Design', 'Visual Storytelling'],
    },
  },
  {
    id: 'global-hack-seguros-educativos',
    image: '/programa/img/global-hack-seguros-educativos.webp',
    imageVertical: '/programa/img/proyectos/global-hack-seguros-educativos-portada.webp',
    subject: 'Proyecto adicional',
    subjectEn: 'Additional project',
    year: '2026',
    caption: 'Tercer lugar en la Global Hack de seguros educativos',
    captionEn: 'Third place at the Global Hack for educational insurance',
    student: 'Danna Bolaños, Mariana Cifuentes y Juliana Sanabria',
    modal: {
      // Solo la portada horizontal se muestra en la galería del detalle del
      // proyecto (a pedido) — la vertical (imageVertical, arriba) es
      // exclusivamente para la portada alta del carrusel rotativo del home.
      images: ['/programa/img/global-hack-seguros-educativos.webp'],
      titleEs: 'Global Hack de Seguros Educativos — 3er lugar',
      titleEn: 'Educational Insurance Global Hack — 3rd Place',
      descriptionEs:
        'En 2026-1, nuestras estudiantes de tercer semestre, Danna Bolaños, Mariana Cifuentes y Juliana Sanabria, participaron en la Global Hack 2026 de seguros educativos, donde se enfrentaron a más de 19 equipos conformados, en su mayoría, por estudiantes de sexto semestre en adelante.\n\nA lo largo de la competencia, las tres creadoras atravesaron diferentes fases en las que desarrollaron, prototiparon y consolidaron su propuesta hasta llegar a la gran final. Allí obtuvieron el tercer puesto con una idea inspirada en la bóveda y el concepto de protección, demostrando su capacidad para transformar un reto complejo en una propuesta creativa e integral.\n\nEste resultado representa un logro especialmente significativo, no solo por haber llegado a la final, sino por hacerlo siendo las únicas participantes de tercer semestre en la competencia.\n\nPara Danna, Mariana y Juliana, su formación como creadoras digitales y su perfil versátil fueron fundamentales para el desarrollo de la propuesta. Su conocimiento en diferentes áreas les permitió integrar distintas perspectivas, construir una solución completa y presentar una idea que logró destacarse frente a equipos de semestres más avanzados.',
      descriptionEn:
        'In 2026-1, our third-semester students Danna Bolaños, Mariana Cifuentes, and Juliana Sanabria took part in the 2026 Global Hack for educational insurance, where they went up against more than 19 teams made up mostly of sixth-semester students and above.\n\nThroughout the competition, the three creators went through several phases — developing, prototyping, and refining their proposal all the way to the grand final. There, they placed third with an idea inspired by the vault and the concept of protection, showing their ability to turn a complex challenge into a creative, well-rounded proposal.\n\nThis result is an especially meaningful achievement, not only for reaching the final, but for doing so as the only third-semester participants in the entire competition.\n\nFor Danna, Mariana, and Juliana, their training as digital creators and their versatile profiles were key to developing the proposal. Their knowledge across different fields let them bring together different perspectives, build a well-rounded solution, and present an idea that stood out among teams from more advanced semesters.',
      skillsEs: ['Design thinking', 'Prototipado rápido', 'Trabajo en equipo', 'Presentación a jurado', 'Pensamiento estratégico'],
      skillsEn: ['Design Thinking', 'Rapid Prototyping', 'Teamwork', 'Pitching', 'Strategic Thinking'],
    },
  },
];
