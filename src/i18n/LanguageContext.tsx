import { createContext, useContext, useState, type ReactNode } from 'react';
import translations, { type Lang, type Translations } from './translations';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const Ctx = createContext<LangCtx | null>(null);

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem('pcd-lang');
    if (stored === 'es' || stored === 'en') return stored;
  } catch { /* localStorage unavailable */ }
  return 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('pcd-lang', l); } catch { /* ignore */ }
  };

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
