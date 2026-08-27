import { useCallback, useEffect, useState } from 'react';

/**
 * Hash routing rather than history routing: the docs are a static bundle that
 * has to work from any sub-path (GitHub Pages, a preview URL, `file://`) with
 * no server rewrite rules.
 */
const read = () => globalThis.location.hash.replace(/^#\/?/, '') || '';

export const useRoute = () => {
  const [path, setPath] = useState(read);

  useEffect(() => {
    const onChange = () => setPath(read());
    globalThis.addEventListener('hashchange', onChange);
    return () => globalThis.removeEventListener('hashchange', onChange);
  }, []);

  return path;
};

export const navigate = (path: string) => {
  globalThis.location.hash = `#/${path}`;
};

/** Scrolls to the top on every route change, the way a real page load would. */
export const useScrollReset = (key: string) => {
  useEffect(() => {
    globalThis.scrollTo({ top: 0 });
  }, [key]);
};

export const useHashLink = () => {
  return useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href') ?? '';
    if (!href.startsWith('#')) return;
    event.preventDefault();
    globalThis.location.hash = href;
  }, []);
};
