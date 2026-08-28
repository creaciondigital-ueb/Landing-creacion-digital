/**
 * Publicaciones del Blog — Programa Creación Digital.
 *
 * Contenido 100% estático (sin base de datos, sin backend), siguiendo el
 * mismo patrón que `proyectos.ts`: cada publicación nueva se agrega a mano
 * como un objeto en el array `BLOG_POSTS`.
 */

export interface BlogPostDetail {
  /** Imágenes del carrusel en la página de detalle (rutas dentro de /public). */
  images: string[];
  descriptionEs: string;
  descriptionEn: string;
  /** Etiquetas/temas relacionados con la publicación. */
  tagsEs?: string[];
  tagsEn?: string[];
}

export interface BlogPost {
  id: string;
  /** Imagen de portada — siempre horizontal. */
  image: string;
  /** Categoría de la noticia, ej. "Logros", "Eventos" — se usa para el filtro. */
  category: string;
  categoryEn?: string;
  /** Año de publicación (texto, ej. "2026") — se usa para el filtro. */
  year: string;
  /** Fecha legible, ej. "18 de agosto de 2026". */
  date: string;
  dateEn?: string;
  /** Título de la publicación. */
  title: string;
  titleEn?: string;
  /** Bajada corta (1-2 líneas), se usa en la card del listado. */
  excerpt: string;
  excerptEn?: string;
  /** Autor/es de la publicación, opcional. */
  author?: string;
  /** Datos de la página de detalle — si está presente, la card abre /blog/:id. */
  detail?: BlogPostDetail;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "intercambio-paraguay-ana-salavarrieta",
    image: "",
    category: "Logros",
    categoryEn: "Achievements",
    year: "2026",
    date: "Agosto 2026",
    dateEn: "August 2026",
    title: "Una creadora digital en Paraguay: Ana Salavarrieta vive su experiencia de intercambio",
    titleEn: "A digital creator in Paraguay: Ana Salavarrieta lives her exchange experience",
    excerpt: "Nuestra estudiante Ana Salavarrieta vive un intercambio académico en la Universidad Nacional de Asunción, Paraguay, poniendo en práctica su formación como creadora digital.",
    excerptEn: "Our student Ana Salavarrieta is doing an academic exchange at the Universidad Nacional de Asunción in Paraguay, putting her training as a digital creator into practice.",
    detail: {
      images: [],
      descriptionEs: `La creación digital también se construye explorando nuevos lugares, culturas y formas de entender el mundo. Este semestre, nuestra estudiante Ana Salavarrieta, de cuarto semestre de Creación Digital, lleva su talento y su mirada creativa hasta Paraguay, donde realiza un intercambio académico en la Universidad Nacional de Asunción.

Esta oportunidad fue posible gracias a una beca a la que Ana decidió postularse después de conocer la convocatoria a través del programa. Motivada por la posibilidad de vivir una experiencia académica internacional, dio el paso, se presentó y fue seleccionada como beneficiaria.

Para Ana, esta experiencia representa mucho más que estudiar durante un semestre en otro país. También es una oportunidad para poner en práctica las herramientas que ha adquirido durante su formación y descubrir nuevas perspectivas sobre su futuro profesional.

"Mi formación como creadora digital me ha permitido tener una mirada amplia sobre mi mundo profesional y ser muy versátil".

Su experiencia refleja precisamente uno de los grandes diferenciales de la Creación Digital: la posibilidad de formarse desde múltiples disciplinas y desarrollar una mirada capaz de adaptarse a diferentes contextos, lenguajes y desafíos creativos.

Desde el programa celebramos este nuevo paso en el recorrido de Ana y nos llena de orgullo verla representar a nuestra comunidad en otro país. Esperamos que este intercambio esté lleno de aprendizajes, nuevas conexiones y, por supuesto, muchas historias que pueda traer de vuelta a Colombia.

Porque ser creador digital también significa tener la capacidad de llevar tus ideas más allá de las fronteras.`,
      descriptionEn: `Digital creation is also built by exploring new places, cultures, and ways of understanding the world. This semester, our fourth-semester Digital Creation student, Ana Salavarrieta, is taking her talent and creative outlook all the way to Paraguay, where she is doing an academic exchange at the Universidad Nacional de Asunción.

This opportunity was made possible by a scholarship that Ana decided to apply for after learning about the call through the program. Motivated by the chance to live an international academic experience, she took the step, applied, and was selected as a recipient.

For Ana, this experience means much more than studying in another country for a semester. It is also an opportunity to put into practice the tools she has gained throughout her training and to discover new perspectives on her professional future.

"My training as a digital creator has given me a broad view of my professional world and made me very versatile."

Her experience reflects precisely one of the great strengths of Digital Creation: the chance to train across multiple disciplines and develop an outlook capable of adapting to different contexts, languages, and creative challenges.

From the program, we celebrate this new step in Ana's journey, and we are filled with pride to see her represent our community in another country. We hope this exchange is full of learning, new connections and, of course, many stories she can bring back to Colombia.

Because being a digital creator also means having the ability to take your ideas beyond borders.`,
      tagsEs: ["Intercambio", "Internacionalización", "Estudiantes"],
      tagsEn: ["Exchange", "International", "Students"],
    },
  },
  {
    id: "franziska-junge-alemania",
    image: "",
    category: "Eventos",
    categoryEn: "Events",
    year: "2026",
    date: "11 al 24 de agosto de 2026",
    dateEn: "August 11–24, 2026",
    title: "De Colombia a Alemania: una experiencia creativa junto a Franziska Junge",
    titleEn: "From Colombia to Germany: a creative experience with Franziska Junge",
    excerpt: "Durante dos semanas, la artista alemana Franziska Junge visitó el programa para explorar con nuestros creadores nuevas formas de narrar y crear.",
    excerptEn: "For two weeks, German artist Franziska Junge visited the program to explore new ways of storytelling and creating with our students.",
    detail: {
      images: [],
      descriptionEs: `Del 11 al 24 de agosto vivimos una experiencia internacional que nos permitió explorar nuevas formas de crear, narrar y experimentar con lo digital. Durante estas dos semanas contamos con la visita de Franziska Junge, artista visual, ilustradora y profesora de Diseño en la HAWK University of Applied Sciences and Arts, en Hildesheim, Alemania.

Su visita fue una oportunidad para que nuestros creadores se acercaran a diferentes lenguajes y procesos de creación. A lo largo de los talleres exploramos la construcción de personajes, la creación de narrativas y el storytelling, combinando técnicas de dibujo análogo y digital con herramientas de animación y videomapping.

Más que aprender nuevas técnicas, la experiencia nos invitó a pensar en cómo una idea puede transformarse y adquirir nuevas dimensiones cuando se cruza con diferentes medios. Un personaje puede convertirse en una historia; una ilustración puede cobrar movimiento; y una creación digital puede transformar un espacio completo.

El proceso terminó con una presentación en la que nuestros creadores compartieron sus resultados, hablaron sobre sus procesos y reflexionaron sobre la experiencia vivida durante estos días.

Pero el intercambio no termina aquí. Como parte de esta colaboración internacional, Franziska llevará los trabajos desarrollados en Colombia para compartirlos y trabajarlos con sus estudiantes en Alemania, creando así un puente entre ambas comunidades académicas y sus distintas maneras de entender la creación.

Agradecemos especialmente a Franziska por compartir con nosotros su conocimiento, experiencia y, sobre todo, su energía para inspirar nuevas formas de crear.

Nos quedamos con nuevos aprendizajes, nuevas historias y la certeza de que la creación no tiene fronteras.`,
      descriptionEn: `From August 11 to 24 we had an international experience that allowed us to explore new ways of creating, telling stories, and experimenting with the digital. During these two weeks we welcomed a visit from Franziska Junge, visual artist, illustrator, and design professor at HAWK University of Applied Sciences and Arts, in Hildesheim, Germany.

Her visit gave our creators the chance to engage with different languages and creative processes. Throughout the workshops, we explored character building, narrative creation, and storytelling, combining analog and digital drawing techniques with animation and videomapping tools.

More than learning new techniques, the experience invited us to think about how an idea can transform and take on new dimensions when it crosses paths with different media. A character can become a story; an illustration can come to life through movement; and a digital creation can transform an entire space.

The process ended with a presentation in which our creators shared their results, talked about their processes, and reflected on the experience they had lived through during these days.

But the exchange doesn't end here. As part of this international collaboration, Franziska will take the work developed in Colombia to share and work on with her students in Germany, building a bridge between both academic communities and their different ways of understanding creation.

We especially thank Franziska for sharing her knowledge, experience and, above all, her energy to inspire new ways of creating.

We come away with new learning, new stories, and the certainty that creation has no borders.`,
      tagsEs: ["Talleres", "Internacional", "Ilustración"],
      tagsEn: ["Workshops", "International", "Illustration"],
    },
  },
  {
    id: "explora-unbosque-agosto-2026",
    image: "",
    category: "Eventos",
    categoryEn: "Events",
    year: "2026",
    date: "19 y 22 de agosto de 2026",
    dateEn: "August 19 & 22, 2026",
    title: "Explora Unbosque: así estamos conociendo a nuestros futuros creadores",
    titleEn: "Explora Unbosque: this is how we are getting to know our future creators",
    excerpt: "Así vivimos Explora Unbosque: un espacio para que futuros estudiantes descubran al creador digital que llevan dentro.",
    excerptEn: "This is how we experienced Explora Unbosque: a space for future students to discover the digital creator within.",
    detail: {
      images: [],
      descriptionEs: `¿Quién es el creador digital que llevas dentro? Esa fue una de las preguntas que nos acompañó durante nuestra participación en Explora Unbosque, un espacio en el que, el miércoles 19 y el sábado 22 de agosto, tuvimos la oportunidad de encontrarnos con futuros estudiantes y sus familias.

Durante estas jornadas recibimos a estudiantes de diferentes colegios y los invitamos a acercarse al mundo de la Creación Digital de una manera diferente: a través de la experiencia, la exploración y, por supuesto, la creatividad.

Nuestra dinámica partió de una invitación muy especial: "invocar al creador interior". A través de diferentes preguntas, los participantes exploraron aspectos de su personalidad, sus intereses y su forma de ver el mundo. Con sus respuestas, pudieron construir un personaje que representaba ese ser creador que habita en cada uno de ellos.

Lo mejor de la experiencia fue que podían verlo aparecer en tiempo real en las pantallas de nuestro propio mundo digital. Así, una idea que comenzaba con unas cuantas respuestas terminaba convirtiéndose en un personaje frente a sus ojos.

Después de la experiencia, tuvimos la oportunidad de conversar con ellos sobre Creación Digital: qué hacemos, qué hemos logrado, quiénes hacen parte de nuestro equipo y, sobre todo, todas las posibilidades que encontrarán al formarse como creadores digitales.

Para nosotros, Explora Unbosque ha sido mucho más que un espacio para presentar nuestro programa. Ha sido una oportunidad para escuchar, conversar y conocer a quienes quizás muy pronto harán parte de nuestra comunidad.

Nos encanta encontrarnos nuevamente con nuestros futuros creadores y comenzar a imaginar juntos todo lo que podrán crear.`,
      descriptionEn: `Who is the digital creator within you? That was one of the questions that accompanied us during our participation in Explora Unbosque, a space where, on Wednesday, August 19, and Saturday, August 22, we had the chance to meet prospective students and their families.

During these sessions we welcomed students from different schools and invited them to approach the world of Digital Creation in a different way: through experience, exploration, and, of course, creativity.

Our activity began with a very special invitation: to "summon the creator within." Through a series of questions, participants explored aspects of their personality, their interests, and their way of seeing the world. With their answers, they were able to build a character that represented the creator living inside each of them.

The best part of the experience was that they could see it appear in real time on the screens of our own digital world. That way, an idea that started with a few answers ended up becoming a character right before their eyes.

After the experience, we had the chance to talk with them about Digital Creation: what we do, what we have achieved, who is part of our team and, above all, all the possibilities they will find by training as digital creators.

For us, Explora Unbosque has been much more than a space to present our program. It has been an opportunity to listen, to talk, and to get to know those who may very soon become part of our community.

We love meeting our future creators again and starting to imagine, together, everything they will be able to create.`,
      tagsEs: ["Admisiones", "Eventos", "Futuros estudiantes"],
      tagsEn: ["Admissions", "Events", "Prospective Students"],
    },
  },
];
