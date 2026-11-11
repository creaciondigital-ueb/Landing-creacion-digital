import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSeo } from '../hooks/useSeo';
import { PAUTA } from '../data/pauta';
import { pautaSeo } from '../seo/pages';
import { CHARLA_URL } from '../seo/site';
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
/** Formulario de inscripción al open day. */
const OPEN_DAY_URL = 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=UMLAdHccXUCbHprB9Qir46Y7lCPhW7lJkki-ENr8U1pUOFMxSlNCSEJYMEdHQ0hWQ0VFS1o1NjZCUS4u&origin=lprLink&route=shorturl';
type Variante = 'casilla' | 'juego' | 'puedes';

const HEROS: Record<Variante, { linea1: ReactNode; linea2: string; apoyo: ReactNode; largo?: boolean }> = {
  casilla: {
    linea1: 'Diseño, software, contenido y negocios.',
    linea2: 'En una sola carrera',
    largo: true,
    apoyo: 'Creas tu marca, programas una app, modelas un personaje en 3D y conviertes tus ideas en negocio. Aprendes con profes que vienen de la industria y con las herramientas más avanzadas.',
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

function trackWhatsapp(v: string) {
  window.gtag?.('event', 'whatsapp_click', { v });
  window.fbq?.('track', 'Contact');
  (window.ttq as any)?.track?.('Contact');
}

/** Mensajes prellenados de WhatsApp: cada botón dice desde dónde escribe la persona. */
type Motivo = 'info' | 'workshop';
function waUrl(v: string, motivo: Motivo = 'info') {
  const anuncio = `vi el anuncio de Creación Digital (${v})`;
  const msg = {
    info: `Hola, ${anuncio} y quiero saber más.`,
    workshop: `Hola, ${anuncio} y quiero asistir al workshop de creación con IA.`,
  }[motivo];
  return `https://wa.me/${PAUTA.whatsapp}?text=${encodeURIComponent(msg)}`;
}

/** Botón que abre WhatsApp. Mientras no haya número en src/data/pauta.ts, no aparece. */
function BotonWa({ v, motivo, className, children }: { v: string; motivo?: Motivo; className: string; children: ReactNode }) {
  if (!PAUTA.whatsapp) return null;
  return (
    <a className={className} href={waUrl(v, motivo)} target="_blank" rel="noopener" onClick={() => trackWhatsapp(v)}>
      {children}
    </a>
  );
}

/**
 * Segunda línea del titular escrita letra por letra, con cursor. Las letras
 * que faltan ya ocupan su lugar (invisibles), así que el titular no salta ni
 * empuja el botón mientras se escribe. Los lectores de pantalla leen la frase
 * completa, y con "reducir movimiento" aparece entera de una vez.
 */
function Tecleo({ texto }: { texto: string }) {
  const completo = `${texto}.`;
  const [n, setN] = useState(0);
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(completo.length); setCursor(false); return;
    }
    let i = 0;
    let timer = 0;
    const paso = () => {
      i += 1; setN(i);
      timer = i < completo.length
        ? window.setTimeout(paso, 75)
        : window.setTimeout(() => setCursor(false), 2400);
    };
    timer = window.setTimeout(paso, 450);
    return () => clearTimeout(timer);
  }, [completo]);

  const escrito = completo.slice(0, n);
  const conPunto = n === completo.length;
  return (
    <em aria-label={completo}>
      <span aria-hidden="true">
        {conPunto ? <>{texto}<span className="pt-dot">.</span></> : escrito}
        {cursor && <span className="pt-caret" />}
        <span className="pt-pendiente">{completo.slice(n)}</span>
      </span>
    </em>
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

  const v = useMemo(() => {
    const raw = new URLSearchParams(window.location.search).get('v') ?? '';
    return raw in HEROS ? raw : 'casilla';
  }, []);
  const hero = HEROS[v as Variante];

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
        <a className="pt-pill pt-pill--cobalt pt-pill--small" href="https://www.unbosque.edu.co/inscripciones/pregrado" target="_blank" rel="noopener">Inscríbete</a>
      </header>

      <main>
        {/* 1 · Hero */}
        <section className="pt-hero">
          <div className="pt-wrap">
            <div className="pt-hero__meta pt-mono"><span>Pregrado · 8 semestres</span><span>Presencial · Bogotá</span></div>
            <div className="pt-hero__titulo">
              <h1 className={hero.largo ? 'pt-h1--largo' : undefined}>
                {hero.linea1}
                <Tecleo texto={hero.linea2} />
              </h1>
              {/* La misma ilustración del hero de la página principal (CDN de Cloudflare). */}
              <img className="pt-hero__chica" src={`${IMG}/chica-laptop.png`} alt="" aria-hidden="true" width="606" height="656" decoding="async" />
            </div>
            <p className="pt-hero__sub">{hero.apoyo}</p>
            <a className="pt-pill pt-pill--acid pt-pill--titila pt-hero__cta" href={CHARLA_URL} target="_blank" rel="noopener">Agenda una charla con el director</a>
            {PAUTA.video && (
              <video
                className="pt-video" src={PAUTA.video.src} poster={PAUTA.video.poster}
                muted playsInline autoPlay loop preload="metadata" aria-label={PAUTA.video.descripcion}
              />
            )}
          </div>
        </section>

        {/* 2 · La casilla */}
        <section className="pt-sec">
          <div className="pt-wrap">
            <Label>01 · La casilla</Label>
            <h2>¿Te piden escoger <em>una sola carrera</em>?</h2>
            <div className="pt-boxes" aria-hidden="true">
              {['Diseño', 'Ingeniería', 'Mercadeo', 'Comunicación', 'Arte'].map((c) => (
                <div className="pt-box pt-box--off" key={c}><i /><span>{c}</span></div>
              ))}
            </div>
            <p className="pt-respuesta">
              <strong>Aquí no escoges.</strong> En Creación Digital formamos creadores que diseñan, programan, cuentan historias y las llevan a negocio, todo en una sola carrera.
            </p>
            <a className="pt-pill pt-pill--acid pt-pill--titila pt-sec__cta" href={OPEN_DAY_URL} target="_blank" rel="noopener">Visítanos en un open day</a>
          </div>
        </section>

        {/* 3 · Lo de siempre */}
        <section className="pt-sec pt-sec--tight">
          <div className="pt-wrap">
            <Label>02 · Lo de siempre</Label>
            <h2>Lo de siempre <em>se queda corto</em>.</h2>
            <div className="pt-cards3">
              <div className="pt-card"><span className="pt-mono">Una carrera de una casilla</span><p>Aquí tienes un perfil amplio: diseñas, programas, creas contenido y entiendes el negocio. Así te mueves entre industrias y te adaptas a lo que venga.</p></div>
              <div className="pt-card"><span className="pt-mono">Un curso corto</span><p>Un curso te enseña una habilidad. La carrera te da tu parche: compañeros, profes de la industria y contactos que te abren puertas.</p></div>
              <div className="pt-card"><span className="pt-mono">Los tutoriales</span><p>YouTube te enseña mucho, pero te toca buscar qué sirve. Aquí aprendes con expertos que te guían, haces prácticas en empresas reales y puedes irte de intercambio.</p></div>
            </div>
            <BotonWa v={v} motivo="workshop" className="pt-pill pt-pill--acid pt-pill--titila pt-sec__cta">Asiste a nuestro workshop de creación con IA</BotonWa>
          </div>
        </section>

        {/* 5 · Qué recibes */}
        <section className="pt-sec pt-sec--tight">
          <div className="pt-wrap pt-split">
            <div>
              <Label>03 · Qué recibes</Label>
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
          <div className="pt-wrap pt-redes">
            <a className="pt-pill pt-pill--ink" href="https://www.instagram.com/creaciondigital.ueb/" target="_blank" rel="noopener">Síguenos en Instagram</a>
            <a className="pt-pill pt-pill--ink" href="https://www.tiktok.com/@creaciondigital.ueb" target="_blank" rel="noopener">Síguenos en TikTok</a>
          </div>
        </section>

        {/* 6 · Quiénes ya la estudian */}
        <section className="pt-sec pt-sec--tight">
          <div className="pt-wrap">
            <Label>04 · Quiénes ya la estudian</Label>
            <h2>Llevamos 2 años <em>al aire</em>.</h2>
            <div className="pt-stats">
              <div className="pt-stat"><b>5</b><span>cohortes desde 2024-2</span></div>
              <div className="pt-stat"><b>2030</b><span>registro calificado vigente por el Ministerio de Educación Nacional</span></div>
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
          </div>
        </section>

        {/* 8 · Valor y siguiente paso */}
        <section className="pt-sec pt-sec--tight">
          <div className="pt-wrap pt-split">
            <div>
              <Label>05 · Valor y siguiente paso</Label>
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
            <Label>06 · Preguntas</Label>
            <h2>Lo que <em>todos preguntan</em>.</h2>
            <div className="pt-faq">
              {faqs.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>

        {/* 10 · Cierre: lleva a la página principal del programa */}
        <section className="pt-sec pt-close">
          <div className="pt-wrap">
            <Label>07 · Conoce más</Label>
            <h2>Visita <em>nuestra página</em>.</h2>
            <a className="pt-pill pt-pill--ink" href="https://creaciondigital-ueb.netlify.app/">Visita nuestra página</a>
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

      <BotonWa v={v} className="pt-wa"><i aria-hidden="true" />Escríbenos</BotonWa>
    </div>
  );
}
