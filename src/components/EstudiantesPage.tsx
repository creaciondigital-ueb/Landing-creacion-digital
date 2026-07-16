import { useState, useEffect } from 'react';
import {
  initAuth, onAuthStateChange, getMe,
  fetchAllStudentsWithSkills,
  type Profile,
  type StudentWithSkills,
} from '../lib/api';
import StudentCard from './StudentCard';
import SkillsEditor from './SkillsEditor';

export default function EstudiantesPage() {
  const [students, setStudents] = useState<StudentWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { user, profile: p } = await initAuth();
      if (!isMounted) return;

      if (user && p) setProfile(p);

      try {
        const data = await fetchAllStudentsWithSkills();
        if (isMounted) setStudents(data);
      } catch (err) {
        console.error('Error loading students:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const unsub = onAuthStateChange(async (user) => {
      if (!isMounted) return;
      if (user) {
        const p = await getMe();
        if (isMounted) setProfile(p);
      } else {
        if (isMounted) setProfile(null);
      }
    });

    init();

    return () => { isMounted = false; unsub(); };
  }, []);

  const handleSaved = async () => {
    const data = await fetchAllStudentsWithSkills();
    setStudents(data);
  };

  if (loading) {
    return (
      <div className="estudiantes-loading">
        <span className="estudiantes-loading-dot" />
        <span className="estudiantes-loading-dot" />
        <span className="estudiantes-loading-dot" />
      </div>
    );
  }

  return (
    <>
      {/* Editorial Rebrand v3.4.0 — Sprint 4: hero corto editorial para
          /estudiantes, mismo lenguaje que /galeria pero compacto. */}
      <header className="hero hero--estudiantes">
        <div className="hero-eyebrow">
          <span>Estudio de Creación Digital 4</span>
          <span className="hero-eyebrow-dot">●</span>
          <span>Cohorte 2026-1</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-line hero-row-1">
            <em className="hero-word hero-word--galeria">Estudiantes</em>
            <span className="hero-tag">
              <span className="hero-tag-num">№ {students.length.toString().padStart(2, '0')}</span>
              <span className="hero-tag-rule"></span>
              <span className="hero-tag-label">Autores</span>
            </span>
          </span>
        </h1>
        <p className="hero-desc">
          Habilidades, links y obras de cada autor. Cada hexágono mapea seis ejes
          de práctica — desde modelado y texturizado hasta render y XR.
        </p>
      </header>

      <main className="estudiantes-main">
        {isAdmin && students.length > 0 && (
          <SkillsEditor students={students} onSaved={handleSaved} />
        )}

        {students.length === 0 ? (
          <div className="estudiantes-empty">
            <p>No hay estudiantes registrados aún.</p>
          </div>
        ) : (
          <div className="estudiantes-grid">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} currentUserId={profile?.id} isAdmin={isAdmin} onDeleted={handleSaved} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
