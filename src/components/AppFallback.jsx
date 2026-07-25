/*
 * Shown when a failure escapes every boundary further in. Styled inline so it
 * does not depend on the stylesheet having loaded, and it always offers a way
 * to get in touch rather than a dead end.
 */
const AppFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      color: '#E0E0E0',
      fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    }}
  >
    <div style={{ maxWidth: '32rem' }}>
      <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
        Joel van Hees
      </p>
      <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: '1.5rem' }}>
        Something went wrong loading this page. Reloading usually fixes it.
      </p>
      <a href="mailto:kontakt@joelvanhees.de" style={{ color: '#C7FF2E' }}>
        kontakt@joelvanhees.de
      </a>
    </div>
  </div>
);

export default AppFallback;
