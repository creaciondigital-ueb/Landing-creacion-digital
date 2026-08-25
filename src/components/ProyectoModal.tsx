import { useEffect, useRef, useState, useCallback } from 'react';
import type { Proyecto } from '../data/proyectos';

interface Props {
  proyecto: Proyecto;
  lang: 'es' | 'en';
  onClose: () => void;
}

export default function ProyectoModal({ proyecto, lang, onClose }: Props) {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const m = proyecto.modal!;
  const images = m.images;

  const title = lang === 'en' ? (m.titleEn ?? m.titleEs ?? proyecto.captionEn ?? proyecto.caption) : (m.titleEs ?? proyecto.caption);
  const caption = lang === 'en' ? (proyecto.captionEn ?? proyecto.caption) : proyecto.caption;
  const subject = lang === 'en' ? (proyecto.subjectEn ?? proyecto.subject) : proyecto.subject;
  const description = lang === 'en' ? m.descriptionEn : m.descriptionEs;
  const skills = lang === 'en' ? (m.skillsEn ?? []) : (m.skillsEs ?? []);

  const labels = lang === 'en'
    ? { project: 'Project', subject: 'Subject', professor: 'Faculty', students: 'Students', year: 'Year', skills: 'Skills developed' }
    : { project: 'Proyecto', subject: 'Materia', professor: 'Docente', students: 'Estudiantes', year: 'Año', skills: 'Habilidades desarrolladas' };

  const professorFull = proyecto.professor
    ?.replace('C. Cardozo', 'Camilo Cardozo')
    .replace('A. Rozo', 'A. Rozo')
    .replace('J. Suárez', 'J. Suárez');

  const next = useCallback(() => setSlide((s) => (s + 1) % images.length), [images.length]);
  const prev = useCallback(() => setSlide((s) => (s - 1 + images.length) % images.length), [images.length]);

  // Auto-advance
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // Reset timer on manual navigation
  const goTo = (i: number) => { setSlide(i); startTimer(); };
  const handlePrev = () => { prev(); startTimer(); };
  const handleNext = () => { next(); startTimer(); };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Split description on \n\n for paragraphs
  const paragraphs = description.split('\n\n').filter(Boolean);

  return (
    <div className="proy-modal__overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="proy-modal__panel" onClick={(e) => e.stopPropagation()}>

        {/* CLOSE */}
        <button className="proy-modal__close" onClick={onClose} aria-label="Cerrar">×</button>

        <div className="proy-modal__inner">

          {/* LEFT — carrusel */}
          <div className="proy-modal__left">
            <div className="proy-modal__carousel">
              {images.map((src, i) => (
                <img
                  key={src}
                  className={`proy-modal__slide${i === slide ? ' proy-modal__slide--active' : ''}`}
                  src={src}
                  alt={`${caption} — imagen ${i + 1}`}
                />
              ))}
              {images.length > 1 && (
                <>
                  <button className="proy-modal__nav proy-modal__nav--prev" onClick={handlePrev} aria-label="Anterior">‹</button>
                  <button className="proy-modal__nav proy-modal__nav--next" onClick={handleNext} aria-label="Siguiente">›</button>
                  <div className="proy-modal__dots">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={`proy-modal__dot${i === slide ? ' proy-modal__dot--active' : ''}`}
                        onClick={() => goTo(i)}
                        aria-label={`Imagen ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="proy-modal__divider" />

          {/* RIGHT — info */}
          <div className="proy-modal__right">
            <h2 className="proy-modal__title">{title}</h2>
            <hr className="proy-modal__rule" />

            {/* Ficha técnica */}
            <dl className="proy-modal__sheet">
              <div className="proy-modal__sheet-row">
                <dt>{labels.project}</dt>
                <dd>{caption}</dd>
              </div>
              <div className="proy-modal__sheet-row">
                <dt>{labels.subject}</dt>
                <dd>{subject}</dd>
              </div>
              {professorFull && (
                <div className="proy-modal__sheet-row">
                  <dt>{labels.professor}</dt>
                  <dd>{professorFull}</dd>
                </div>
              )}
              {proyecto.student && (
                <div className="proy-modal__sheet-row">
                  <dt>{labels.students}</dt>
                  <dd>{proyecto.student}</dd>
                </div>
              )}
              <div className="proy-modal__sheet-row">
                <dt>{labels.year}</dt>
                <dd>{proyecto.year}</dd>
              </div>
            </dl>

            <hr className="proy-modal__rule" />

            {/* Descripción y skills — columna derecha */}
            <div className="proy-modal__body-col">
              {paragraphs.map((p, i) => (
                <p key={i} className="proy-modal__desc">{p}</p>
              ))}
              {skills.length > 0 && (
                <>
                  <p className="proy-modal__skills-label">{labels.skills}</p>
                  <div className="proy-modal__skills">
                    {skills.map((s) => (
                      <span key={s} className="proy-modal__skill">{s}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
