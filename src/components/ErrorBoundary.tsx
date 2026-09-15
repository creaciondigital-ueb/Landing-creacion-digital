import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Red de seguridad para toda la SPA. Antes de esto, cualquier error de
 * renderizado no capturado (un dato mal formado, un componente que
 * revienta) dejaba la pantalla completamente en blanco, sin aviso ni
 * forma de recuperarse — hallazgo de la auditoría de sep. 2026.
 *
 * Deliberadamente NO depende de LanguageContext ni de las clases de
 * programa.css: si el árbol de la app falló, no podemos asumir que esos
 * providers/estilos siguen en pie. Por eso usa estilos inline y texto
 * bilingüe fijo.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Error no controlado en la app:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '48px 24px',
          fontFamily: "'Zalando Sans', -apple-system, 'Segoe UI', sans-serif",
          background: '#faf8f4',
          color: '#171310',
        }}
      >
        <p style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 12 }}>
          Creación Digital · Universidad El Bosque
        </p>
        <h1 style={{ fontFamily: "'DM Serif Text', Georgia, serif", fontSize: 'clamp(22px, 4vw, 32px)', margin: '0 0 12px', maxWidth: '20ch' }}>
          Algo salió mal cargando esta página
        </h1>
        <p style={{ maxWidth: '46ch', margin: '0 0 28px', opacity: 0.75, lineHeight: 1.6 }}>
          No es tu culpa — ocurrió un error inesperado. Intenta volver al inicio; si el
          problema sigue, cuéntanos qué estabas haciendo cuando pasó.
          <br />
          <span style={{ fontSize: 13, opacity: 0.65 }}>
            Something went wrong loading this page. Try going back home, and let us know if it keeps happening.
          </span>
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          style={{
            border: '1.5px solid #171310',
            background: '#171310',
            color: '#faf8f4',
            borderRadius: 999,
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Volver al inicio · Go home
        </button>
      </div>
    );
  }
}
