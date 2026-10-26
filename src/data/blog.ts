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
  {
    id: "artbo-2026-identidades-del-futuro",
    image: "/programa/img/blog/artbo-2026.webp",
    category: "Eventos",
    categoryEn: "Events",
    year: "2026",
    date: "24 al 27 de septiembre de 2026",
    dateEn: "September 24–27, 2026",
    title: "ARTBO 2026: así se imaginaron las identidades del futuro con inteligencia artificial",
    titleEn: "ARTBO 2026: this is how the identities of the future were imagined with artificial intelligence",
    excerpt: "Del 24 al 27 de septiembre, Creación Digital llevó a ARTBO una experiencia que construye identidades holográficas a partir de cómo las personas perciben la inteligencia artificial, con más de 1.200 visitantes en 4 días.",
    excerptEn: "From September 24 to 27, Digital Creation brought to ARTBO an experience that builds holographic identities from how people perceive artificial intelligence, with over 1,200 visitors in 4 days.",
    detail: {
      images: ["/programa/img/blog/artbo-2026.webp"],
      descriptionEs: `Del 24 al 27 de septiembre, el programa de Creación Digital de la Universidad El Bosque participó en ARTBO, dentro de ARTICULARTE, el espacio que la Facultad de Creación y Comunicación lleva a la feria. El equipo, conformado por Fabian Herrera (director del programa), Tatiana Flórez (coordinadora de Creación Digital) y Maria Paula Vasquez, desarrolló una experiencia que partía de una pregunta: ¿cómo se imaginan las identidades del futuro?

Cada visitante respondía siete preguntas sobre su percepción de la inteligencia artificial y compartía un nombre. A partir de esas respuestas nacía una "aparición": un ser de aspecto humano, vestido con bunny suits, construido con hologramas a partir de datos, inteligencia y percepción humana propia de cada persona. Así, quien llegaba como espectador terminaba convertido en creador de una nueva identidad.

La instalación combinó software, mapping, data e imagen, y en solo cuatro días recibió a más de 1.200 visitantes de distintas edades e intereses, desde el asombro y la curiosidad hasta el cuestionamiento frente a la inteligencia artificial.

Más allá de la cifra, lo más valioso fue abrir una conversación sobre la IA, la identidad, la creación y el futuro con personas de perspectivas muy distintas, pensando la tecnología no solo desde lo que puede hacer, sino desde lo que significa para las personas, para diseñar soluciones digitales con impacto, pero también con sentido humano.

Ahora empieza una nueva etapa: analizar los datos recogidos durante la feria para identificar patrones, diferencias y matices que ayuden a comprender mejor la relación entre la condición humana y la inteligencia artificial. Desde Creación Digital, el programa sigue explorando la tecnología como una herramienta para imaginar y cuestionar las posibilidades del mundo que se está creando.`,
      descriptionEn: `From September 24 to 27, Universidad El Bosque's Digital Creation program took part in ARTBO, as part of ARTICULARTE, the space the Facultad de Creación y Comunicación brings to the fair. The team, made up of Fabian Herrera (director of the program), Tatiana Flórez (Digital Creation's coordinator) and Maria Paula Vasquez, developed an experience built around one question: how do people imagine the identities of the future?

Each visitor answered seven questions about their perception of artificial intelligence and shared a name. From those answers an "apparition" was born: a human-like figure, dressed in bunny suits, built as a hologram out of each person's own data, intelligence and perception. In this way, whoever arrived as a spectator ended up becoming the creator of a new identity.

The installation combined software, mapping, data and imagery, and welcomed over 1,200 visitors of different ages and interests in just four days, ranging from wonder and curiosity to genuine questioning about artificial intelligence.

Beyond the number, what mattered most was opening a conversation about AI, identity, creation and the future with people from very different perspectives, thinking about technology not only for what it can do, but for what it means to people, in order to design digital solutions with impact, but also with human meaning.

A new stage now begins: analyzing the data collected during the fair to identify patterns, differences and nuances that help better understand the relationship between the human condition and artificial intelligence. Digital Creation continues exploring technology as a tool to imagine and question the possibilities of the world being created.`,
      tagsEs: ["Eventos", "Inteligencia Artificial", "ARTBO"],
      tagsEn: ["Events", "Artificial Intelligence", "ARTBO"],
    },
  },
  {
    id: "dia-del-unicornio-2026",
    image: "/programa/img/blog/dia-del-unicornio-2026.webp",
    category: "Eventos",
    categoryEn: "Events",
    year: "2026",
    date: "15 de octubre de 2026",
    dateEn: "October 15, 2026",
    title: "Así vivimos el segundo Día del Unicornio: dos años de Creación Digital",
    titleEn: "This is how we lived the second Día del Unicornio: two years of Digital Creation",
    excerpt: "El 15 de octubre celebramos nuestro segundo Día del Unicornio, un encuentro que reunió a creadores de todos los semestres para conmemorar los dos años del programa.",
    excerptEn: "On October 15 we celebrated our second Día del Unicornio, a gathering that brought together creators from every semester to mark the program's second anniversary.",
    detail: {
      images: ["/programa/img/blog/dia-del-unicornio-2026.webp"],
      descriptionEs: `El pasado 15 de octubre celebramos nuestro segundo Día del Unicornio, el encuentro con el que conmemoramos el segundo aniversario de Creación Digital. Durante esta jornada tan especial, reunimos a creadores de todos los semestres en un mismo espacio para compartir, aprender y celebrar juntos este camino que seguimos construyendo.

A lo largo del encuentro compartimos información sobre el programa y sobre cómo está evolucionando el mundo de la creación digital en la actualidad. También fue un espacio para escuchar testimonios en primera persona: estudiantes que han vivido prácticas, semilleros de investigación e intercambios académicos contaron de viva voz cómo estas experiencias han transformado su manera de crear.

Uno de los momentos más esperados fue el portfolio review, en el que contamos con la participación en vivo de Contra Studio, quienes compartieron comentarios y retroalimentación desde su experiencia como creadores dentro de la industria. De esta actividad salió también un ganador, reconocido con el premio al mejor portafolio de la carrera.

Nos emociona mucho poder compartir con toda nuestra comunidad espacios como este, donde nos encontramos, nos reconocemos y celebramos lo que significa ser creadores digitales. ¡Nos vemos el próximo año en el tercer Día del Unicornio!`,
      descriptionEn: `On October 15 we celebrated our second Día del Unicornio, the gathering where we mark Digital Creation's second anniversary. During this special day, we brought together creators from every semester in one space to share, learn, and celebrate this journey we keep building together.

Throughout the event we shared updates about the program and about how the world of digital creation is evolving today. It was also a space to hear first-hand testimonials: students who have gone through internships, research groups, and academic exchanges shared how these experiences have shaped the way they create.

One of the most anticipated moments was the portfolio review, where Contra Studio joined us live to share feedback and comments from their experience as creators within the industry. The activity also had a winner, recognized with the award for the program's best portfolio.

We're thrilled to share spaces like this with our whole community, where we come together, recognize each other, and celebrate what it means to be digital creators. See you next year at the third Día del Unicornio!`,
      tagsEs: ["Eventos", "Comunidad", "Portafolio"],
      tagsEn: ["Events", "Community", "Portfolio"],
    },
  },
];
