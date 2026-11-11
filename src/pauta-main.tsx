import { hydrateRoot } from 'react-dom/client';
import PautaPage from './pages/PautaPage';
import './styles/pauta-base.css';

/**
 * Entrada propia de /pauta (pauta.html). El HTML ya trae la página dibujada
 * (scripts/prerender.ts la renderiza con React); aquí solo se hidrata para que
 * funcionen la animación del titular, los píxeles y WhatsApp. No carga el
 * enrutador, global.css ni el resto del sitio.
 */
hydrateRoot(document.getElementById('root')!, <PautaPage />);
