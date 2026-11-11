import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useSeo } from '../hooks/useSeo';
import { PAUTA } from '../data/pauta';
import { pautaSeo } from '../seo/pages';
import '../styles/pauta.css';

/**
 * Página de pauta (/pauta): a ella llegan los clics de los anuncios de
 * TikTok, Facebook e Instagram. Spec: CDCopyMastery/landing-pauta-spec.md.
 *
 * Es oculta: noindex, fuera del sitemap y sin enlaces desde el resto del
 * sitio; no lleva menú ni el botón flotante de charla (App.tsx lo quita en
 * esta ruta). El texto está copiado tal cual del spec; los datos que llena la
 * dirección del programa viven en src/data/pauta.ts y, mientras falten, el
 * bloque que los necesita no aparece.
 */

const IMG = '/programa/img';
type Variante = 'casilla' | 'juego' | 'puedes';
type Soy = 'Aspirante' | 'Mamá o papá de un aspirante';

const HEROS: Record<Variante, { linea1: ReactNode; linea2: string; apoyo: ReactNode; largo?: boolean }> = {
  casilla: {
    linea1: <>Diseño <s>o</s> código <s>o</s> negocio</>,
    linea2: 'Todo en una carrera',
    apoyo: <>Diseño, ingeniería, mercadeo o comunicación: a los 17 te piden escoger una. En Creación Digital juntas las cuatro en el mismo proyecto y te gradúas con un título que dice lo que eres: <strong>Creador digital</strong>.</>,
  },
  juego: {
    linea1: 'Tu personaje merece',
    linea2: 'su propio videojuego',
    apoyo: 'Ese personaje que dibujas desde el colegio merece un mundo. En Creación Digital lo programas, lo animas en 3D, le escribes la historia y lo llevas al mercado. Te gradúas como Creador digital.',
  },
  puedes: {
    linea1: 'Código, contenido, producto y negocio.',
    linea2: 'Sí puedes',
    apoyo: 'En Creación Digital aprendes a hacerlo todo en el mismo proyecto: lo programas, lo diseñas, lo cuentas y lo vendes. Te gradúas como Creador digital.',
    largo: true,
  },
};

// ── medición ──────────────────────────────────────────────────────────────
type Fn = (...args: unknown[]) => void;
declare global {
  interface Window { gtag?: Fn; fbq?: Fn & Record<string, unknown>; ttq?: Record<string, Fn> & unknown[] }
}

/** Carga el píxel de Meta y el de TikTok si hay ID (snippets oficiales, sin cambios de lógica). */
function usePixels() {
  useEffect(() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return;
    const { metaPixelId, tiktokPixelId } = PAUTA;
    if (metaPixelId && !window.fbq) {
      /* eslint-disable */
      (function (f: any, b: Document, e: string, v: string) {
        if (f.fbq) return; const n: any = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
        const t = b.createElement(e) as HTMLScriptElement; t.async = true; t.src = v; b.head.appendChild(t);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq!('init', metaPixelId);
      window.fbq!('track', 'PageView');
    }
    if (tiktokPixelId && !window.ttq) {
      /* eslint-disable */
      (function (w: any, d: Document, t: string) {
        w.TiktokAnalyticsObject = t; const ttq = w[t] = w[t] || [];
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
        ttq.setAndDefer = function (o: any, m: string) { o[m] = function () { o.push([m].concat(Array.prototype.slice.call(arguments, 0))); }; };
        for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.load = function (id: string) {
          const u = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          ttq._i = ttq._i || {}; ttq._i[id] = []; ttq._i[id]._u = u; ttq._t = ttq._t || {}; ttq._t[id] = +new Date();
          const s = d.createElement('script'); s.async = true; s.src = u + '?sdkid=' + id + '&lib=' + t; d.head.appendChild(s);
        };
      })(window, document, 'ttq');
      /* eslint-enable */
      (window.ttq as any).load(tiktokPixelId);
      (window.ttq as any).page();
    }
  }, []);
}

function track(kind: 'lead' | 'whatsapp', v: string) {
  if (kind === 'lead') {
    window.gtag?.('event', 'generate_lead', { v });
    window.fbq?.('track', 'Lead');
    (window.ttq as any)?.track?.('SubmitForm');
  } else {
    window.gtag?.('event', 'whatsapp_click', { v });
    window.fbq?.('track', 'Contact');
    (window.ttq as any)?.track?.('Contact');
  }
}

function waUrl(v: string) {
  const msg = `Hola, vi el anuncio de Creación Digital (${v}) y quiero saber más.`;
  return `https://wa.me/${PAUTA.whatsapp}?text=${encodeURIComponent(msg)}`;
}

/** Celular colombiano: 10 dígitos que empiezan en 3. Acepta espacios, guiones y el +57. */
function normalizarCelular(raw: string): string | null {
  let d = raw.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('57')) d = d.slice(2);
  return /^3\d{9}$/.test(d) ? d : null;
}

// ── formulario ────────────────────────────────────────────────────────────
interface FormProps {
  id?: string;
  variante: 'hero' | 'cierre';
  v: string;
  utm: Record<string, string>;
  soy: Soy;
  setSoy: (s: Soy) => void;
}

function Formulario({ id, variante, v, utm, soy, setSoy }: FormProps) {
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'enviado' | 'error'>('listo');
  const [errorCel, setErrorCel] = useState(false);
  const uid = variante;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cel = normalizarCelular(String(fd.get('whatsapp') ?? ''));
    if (!cel) { setErrorCel(true); return; }
    setErrorCel(false);
    if (!PAUTA.formEndpoint) { setEstado('error'); return; }
    setEstado('enviando');
    const datos = new URLSearchParams({
      nombre: String(fd.get('nombre') ?? '').trim(),
      whatsapp: cel,
      soy,
      ...utm,
      v,
      formulario: variante,
      pagina: window.location.href,
    });
    try {
      // Apps Script no devuelve CORS: el envío va en modo no-cors y la
      // respuesta es opaca. Si la red no falla, el dato llegó.
      await fetch(PAUTA.formEndpoint, { method: 'POST', mode: 'no-cors', body: datos });
      setEstado('enviado');
      track('lead', v);
    } catch {
      setEstado('error');
    }
  }

  if (estado === 'enviado') {
    return (
      <div className={`pt-form pt-form--${variante} pt-form--ok`} id={id} role="status">
        <h3>Listo.</h3>
        <p className="pt-form__ok">
          {PAUTA.horasRespuesta
            ? `Te escribimos por WhatsApp en menos de ${PAUTA.horasRespuesta}.`
            : 'Te escribimos por WhatsApp.'}
        </p>
        {PAUTA.whatsapp && (
          <a className="pt-pill pt-pill--acid" href={waUrl(v)} target="_blank" rel="noopener" onClick={() => track('whatsapp', v)}>
            Abrir WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form className={`pt-form pt-form--${variante}`} id={id} onSubmit={onSubmit}>
      <h3>Conoce la carrera</h3>
      <p>Déjanos tu WhatsApp y te contamos todo, sin compromiso.</p>
      <label htmlFor={`nombre-${uid}`}><span className="pt-mono">Tu nombre</span></label>
      <input id={`nombre-${uid}`} name="nombre" type="text" autoComplete="name" required />
      <label htmlFor={`cel-${uid}`}><span className="pt-mono">Tu WhatsApp</span></label>
      <input
        id={`cel-${uid}`} name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required
        aria-invalid={errorCel} aria-describedby={errorCel ? `cel-err-${uid}` : undefined}
        onChange={() => errorCel && setErrorCel(false)}
      />
      {errorCel && <span className="pt-form__err" id={`cel-err-${uid}`}>Escribe un celular de 10 dígitos, por ejemplo 300 123 4567.</span>}
      <label htmlFor={`soy-${uid}`}><span className="pt-mono">Soy</span></label>
      <select id={`soy-${uid}`} name="soy" value={soy} onChange={(e) => setSoy(e.target.value as Soy)} required>
        <option>Aspirante</option>
        <option>Mamá o papá de un aspirante</option>
      </select>
      <label className="pt-check">
        <input type="checkbox" name="autorizacion" required />
        <span>{PAUTA.autorizacionTexto ?? 'Autorizo el tratamiento de mis datos según la política de la Universidad El Bosque.'}</span>
      </label>
      <button className="pt-pill pt-pill--ink" type="submit" disabled={estado === 'enviando'}>
        {estado === 'enviando' ? 'Enviando…' : 'Quiero que me cuenten'}
      </button>
      {estado === 'error' && (
        <p className="pt-form__err" role="alert">
          No pudimos enviar tus datos.{PAUTA.whatsapp ? ' Escríbenos por WhatsApp con el botón verde.' : ' Intenta de nuevo en un momento.'}
        </p>
      )}
    </form>
  );
}

// ── página ────────────────────────────────────────────────────────────────
function Label({ children }: { children: string }) {
  return <span className="pt-label pt-mono">{children}</span>;
}

export default function PautaPage() {
  useSeo(pautaSeo());
  usePixels();

  // noindex mientras se esté en esta ruta (el HTML prerenderizado ya lo trae).
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => { m.remove(); };
  }, []);

  const { v, utm } = useMemo(() => {
    const q = new URLSearchParams(window.location.search);
    const raw = q.get('v') ?? '';
    const utm: Record<string, string> = {};
    for (const k of ['utm_source', 'utm_campaign', 'utm_content']) utm[k] = q.get(k) ?? '';
    return { v: raw in HEROS ? raw : 'casilla', utm };
  }, []);
  const hero = HEROS[v as Variante];
  const [soy, setSoy] = useState<Soy>('Aspirante');
  const formProps = { v, utm, soy, setSoy };

  const irAlFormulario = (e: React.MouseEvent, preseleccion?: Soy) => {
    e.preventDefault();
    if (preseleccion) setSoy(preseleccion);
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bonos = [
    PAUTA.bonoSabado && { t: 'Sábado de creación', d: `Un día de taller antes de matricularte. Sales con una pieza hecha con IA. ${PAUTA.bonoSabado}` },
    PAUTA.bonoPioneros && { t: 'Conversación con los pioneros', d: `Media hora con estudiantes de semestres avanzados, tú y tu familia. ${PAUTA.bonoPioneros}` },
    PAUTA.bonoMapa && { t: 'Mapa de los 8 semestres', d: `Qué construyes en cada semestre, cuándo es la práctica y la movilidad. ${PAUTA.bonoMapa}` },
  ].filter(Boolean) as { t: string; d: string }[];

  const faqs: [string, string][] = [
    ['¿Es una carrera nueva?', 'Recibe estudiantes desde 2024-2 y va en su quinta cohorte. Tiene registro calificado del Ministerio de Educación vigente hasta 2030 (Resolución 022151 de 2023).'],
    ['¿En qué voy a trabajar?', 'En el escenario digital de sectores como educación, banca, salud, sector público, transformación digital e industria tech, o en tu propio emprendimiento.'],
    ['¿Para qué 8 semestres si hay tutoriales?', 'Los tutoriales enseñan herramientas. La carrera te enseña a juntarlas en un proyecto completo, con criterio, profesores de la industria, prácticas y un título profesional.'],
    ['¿Y si en primer semestre no es lo mío?', 'La dirección del programa te acompaña a decidir tu siguiente paso, y lo que hayas aprobado se estudia para reconocerlo en otra carrera de El Bosque (Reglamento Estudiantil, art. 40).'],
  ];
  if (PAUTA.requisitosAdmision) faqs.push(['¿Qué necesito para entrar?', PAUTA.requisitosAdmision]);
  if (PAUTA.financiacion) faqs.push(['¿Hay opciones de financiación?', PAUTA.financiacion]);

  return (
    <div className="pt">
      {/* 0 · Barra superior */}
      <header className="pt-top">
        <img className="pt-top__logo" src={`${IMG}/Label_UEB_CreacionDigital_Horizontal.png`} alt="Universidad El Bosque · Creación Digital" width="180" height="32" />
        <a className="pt-pill pt-pill--acid pt-pill--small" href="#contacto" onClick={(e) => irAlFormulario(e)}>Saber más</a>
      </header>

      <main>
        {/* 1 · Hero */}
        <section className="pt-hero">
          <div className="pt-wrap">
            <div className="pt-hero__meta pt-mono"><span>Pregrado · 8 semestres</span><span>Presencial · Bogotá</span></div>
            <h1 className={hero.largo ? 'pt-h1--largo' : undefined}>
              {hero.linea1}
              <em>{hero.linea2}<span className="pt-dot">.</span></em>
            </h1>
            <div className="pt-hero__grid">
              <div>
                <p className="pt-hero__sub">{hero.apoyo}</p>
                <a className="pt-pill pt-pill--acid pt-hero__cta" href="#contacto" onClick={(e) => irAlFormulario(e)}>Quiero conocer la carrera</a>
                {PAUTA.video && (
                  <video
                    className="pt-video" src={PAUTA.video.src} poster={PAUTA.video.poster}
                    muted playsInline autoPlay loop preload="metadata" aria-label={PAUTA.video.descripcion}
                  />
                )}
              </div>
              <Formulario id="contacto" variante="hero" {...formProps} />
            </div>
          </div>
        </section>

        {/* 2 · La casilla */}
        <section className="pt-sec">
          <div className="pt-wrap">
            <Label>01 · La casilla</Label>
            <h2>Te piden escoger <em>una sola</em>.</h2>
            <div className="pt-boxes" aria-hidden="true">
              <div className="pt-box pt-box--on"><i /><span>Diseño</span></div>
              <div className="pt-box pt-box--off"><i /><span>Ingeniería</span></div>
              <div className="pt-box pt-box--off"><i /><span>Mercadeo</span></div>
              <div className="pt-box pt-box--off"><i /><span>Comunicación</span></div>
            </div>
            <div className="pt-scenes">
              <p>El formulario de inscripción tiene cuatro casillas y te deja marcar una.</p>
              <p>Te gusta editar video, pero también programar y vender lo que haces.</p>
              <p>Y si escoges diseño, te van a preguntar: ¿diseño de qué?</p>
            </div>
          </div>
        </section>

        {/* 3 · Lo de siempre */}
        <section className="pt-sec pt-sec--tight">
          <div className="pt-wrap">
            <Label>02 · Lo de siempre</Label>
            <h2>Lo de siempre <em>se queda corto</em>.</h2>
            <div className="pt-cards3">
              <div className="pt-card"><span className="pt-mono">Una carrera de una casilla</span><p>Te enseña una parte del proyecto. El resto lo aprendes solo, después de graduarte.</p></div>
              <div className="pt-card"><span className="pt-mono">Los tutoriales</span><p>Te enseñan a usar una herramienta. Juntar el código con la historia y el negocio queda por tu cuenta.</p></div>
              <div className="pt-card"><span className="pt-mono">Un curso corto</span><p>Te da una habilidad. Ocho semestres te dan criterio, una red y un título profesional.</p></div>
            </div>
          </div>
        </section>

        {/* 4 · Cómo se estudia */}
        <section className="pt-sec pt-dark">
          <div className="pt-wrap">
            <Label>03 · Cómo se estudia</Label>
            <h2>Aprendes a <em>orquestar</em> lo digital.</h2>
            <p className="pt-lead">Un mismo proyecto pasa por todas las áreas. Lo programas, le das forma, cuentas su historia y lo llevas a negocio.</p>
            <div className="pt-worlds">
              <div className="pt-world pt-world--cont"><h3>Contenido</h3><p>Fotografía, producción audiovisual, guion, redes, métricas y pauta digital.</p></div>
              <div className="pt-world pt-world--3d"><h3>Mundo 3D</h3><p>Personajes, modelado, animación y videojuegos completos.</p></div>
              <div className="pt-world pt-world--prod"><h3>Producto</h3><p>Aplicaciones y páginas web con JavaScript, Figma y prototipos.</p></div>
              <div className="pt-world pt-world--neg"><h3>Negocio</h3><p>Cómo convertir lo que creas en un producto que se vende.{PAUTA.asignaturasNegocio ? ` ${PAUTA.asignaturasNegocio}` : ''}</p></div>
            </div>
            <div className="pt-ia"><span className="pt-mono">Con IA en cada paso:</span><span className="pt-chip">Claude Code</span><span className="pt-chip">Codex</span><span className="pt-chip">Higgsfield</span></div>
          </div>
        </section>

        {/* 5 · Qué recibes */}
        <section className="pt-sec">
          <div className="pt-wrap pt-split">
            <div>
              <Label>04 · Qué recibes</Label>
              <h2>Una carrera <em>de verdad</em>.</h2>
            </div>
            <ul className="pt-list">
              <li><strong>Título: Creador digital</strong><span>SNIES 116265 · 128 créditos · registro calificado vigente hasta 2030</span></li>
              <li><strong>Profesores de la industria</strong><span>Vienen de Rappi, Mercado Libre, Globant y fintech</span></li>
              <li><strong>Prácticas profesionales</strong><span>Desde la mitad de la carrera, en el plan de estudios</span></li>
              <li><strong>Movilidad académica</strong><span>Alemania, España, México, Francia, Italia y cinco países más</span></li>
              <li><strong>Tu portafolio</strong><span>Proyectos propios que construyes semestre a semestre</span></li>
            </ul>
          </div>
          {bonos.length > 0 && (
            <div className="pt-wrap">
              <div className="pt-bonos">
                {bonos.map((b) => <div className="pt-bono" key={b.t}><strong>{b.t}</strong><span>{b.d}</span></div>)}
              </div>
            </div>
          )}
        </section>

        {/* 6 · Quiénes ya la estudian */}
        <section className="pt-sec pt-sec--tight">
          <div className="pt-wrap">
            <Label>05 · Quiénes ya la estudian</Label>
            <h2>Ya va en su <em>quinta cohorte</em>.</h2>
            <div className="pt-stats">
              <div className="pt-stat"><b>5</b><span>cohortes desde 2024-2</span></div>
              <div className="pt-stat"><b>20</b><span>grupos en el Global Hack que ganaron</span></div>
              <div className="pt-stat"><b>2030</b><span>registro calificado vigente</span></div>
            </div>
            {PAUTA.fotos.length > 0 && (
              <div className="pt-gallery">
                {PAUTA.fotos.map((f) => <img key={f.src} src={f.src} alt={f.alt} width="400" height="500" loading="lazy" decoding="async" />)}
              </div>
            )}
            {PAUTA.citaAutorizada && (
              <>
                <p className="pt-quote">“Siento que somos los pioneros.”</p>
                <span className="pt-mono pt-quote__by">Estudiante de Creación Digital</span>
              </>
            )}
            {PAUTA.globalHackAutorizado && (
              <div className="pt-hack">
                <strong>Ganadores del Global Hack{PAUTA.globalHackAnio ? ` ${PAUTA.globalHackAnio}` : ''}</strong>
                Estudiantes de Creación Digital ganaron una competencia de productos digitales frente a 20 grupos de varias universidades del país.
              </div>
            )}
          </div>
        </section>

        {/* 7 · Para mamás y papás */}
        <section className="pt-sec pt-papas">
          <div className="pt-wrap">
            <Label>06 · Para mamás y papás</Label>
            <h2>Así se cuida a tu hijo <em>desde el primer semestre</em>.</h2>
            <div className="pt-red">
              <span className="pt-mono">Primer semestre con red</span>
              <p>Si en su primer semestre siente que Creación Digital no es lo suyo, la dirección del programa lo acompaña a decidir su siguiente paso. Lo que haya aprobado se estudia para reconocerlo en otra carrera de El Bosque, como lo dice el Reglamento Estudiantil (art. 40).</p>
            </div>
            <div className="pt-care">
              <div><b>Club de padres</b><span>Encuentros mensuales y cápsulas por WhatsApp. Hoy participan 900 familias.</span></div>
              <div><b>Salud desde el primer día</b><span>Medicina y psicología gratis, y el programa SaludableMente.</span></div>
              <div><b>Expedición UEB</b><span>Una inducción premiada por el Ministerio de Educación, con 95 estudiantes que acompañan a los nuevos.</span></div>
              <div><b>Si viene de otra ciudad</b><span>El proyecto Awala lo acompaña a adaptarse a la universidad y a Bogotá.</span></div>
            </div>
            <a className="pt-pill pt-pill--ink" href="#contacto" onClick={(e) => irAlFormulario(e, 'Mamá o papá de un aspirante')}>Quiero hablar con la dirección</a>
          </div>
        </section>

        {/* 8 · Valor y siguiente paso */}
        <section className="pt-sec">
          <div className="pt-wrap pt-split">
            <div>
              <Label>07 · Valor y siguiente paso</Label>
              <h2>Qué pasa cuando <em>nos escribes</em>.</h2>
            </div>
            <div>
              {PAUTA.valorSemestre && (
                <div className="pt-price"><span className="pt-mono">Valor del semestre 2027-1</span><b>{PAUTA.valorSemestre}</b></div>
              )}
              <ol className="pt-steps">
                {PAUTA.horasRespuesta && <li>Te escribimos por WhatsApp en menos de {PAUTA.horasRespuesta}.</li>}
                <li>Te invitamos al día de puertas abiertas o al Sábado de creación.</li>
                <li>Si te convence, haces tu inscripción. Si no, quedas con toda la información.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 9 · Preguntas */}
        <section className="pt-sec pt-sec--tight">
          <div className="pt-wrap">
            <Label>08 · Preguntas</Label>
            <h2>Lo que <em>todos preguntan</em>.</h2>
            <div className="pt-faq">
              {faqs.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>

        {/* 10 · Cierre */}
        <section className="pt-sec pt-close">
          <div className="pt-wrap pt-split">
            <div>
              <Label>09 · Inscripciones 2027-1</Label>
              {PAUTA.fechaCierre && <h2>Las inscripciones cierran el <em>{PAUTA.fechaCierre}</em>.</h2>}
              {PAUTA.fechaPuertasAbiertas && <p className="pt-lead">Escríbenos hoy y alcanzas a venir al día de puertas abiertas antes del cierre.</p>}
            </div>
            <Formulario variante="cierre" {...formProps} />
          </div>
        </section>
      </main>

      {/* 11 · Pie */}
      <footer className="pt-foot">
        <div className="pt-wrap">
          <span>Universidad El Bosque · Facultad de Creación y Comunicación · Usaquén, Bogotá</span>
          {(PAUTA.politicaDatosUrl || PAUTA.terminosUrl) && (
            <span>
              {PAUTA.politicaDatosUrl && <a href={PAUTA.politicaDatosUrl} target="_blank" rel="noopener">Política de tratamiento de datos</a>}
              {PAUTA.politicaDatosUrl && PAUTA.terminosUrl && ' · '}
              {PAUTA.terminosUrl && <a href={PAUTA.terminosUrl} target="_blank" rel="noopener">Términos</a>}
            </span>
          )}
        </div>
      </footer>

      {PAUTA.whatsapp && (
        <a className="pt-wa" href={waUrl(v)} target="_blank" rel="noopener" onClick={() => track('whatsapp', v)}>
          <i aria-hidden="true" />Escríbenos
        </a>
      )}
    </div>
  );
}
