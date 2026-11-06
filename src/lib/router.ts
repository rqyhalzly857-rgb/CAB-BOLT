import { useEffect, useState } from 'react';

function readPath(): string {
  const path = window.location.hash.replace(/^#/, '');
  return path || '/';
}

export function useRoute(): string {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const handleChange = () => setPath(readPath());
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return path;
}

export function navigate(path: string): void {
  window.location.hash = path;
}
