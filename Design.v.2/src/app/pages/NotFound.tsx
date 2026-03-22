import { Link } from 'react-router';

export function NotFound() {
  return (
    <div style={{ padding: '48px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/" 
        style={{ 
          color: '#F76902', 
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        Go back home
      </Link>
    </div>
  );
}
