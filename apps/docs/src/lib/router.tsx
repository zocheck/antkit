import { useEffect, useState } from 'react';

/**
 * Path routing over the History API. The docs are still a static bundle, so
 * whatever serves them has to answer every path with `index.html` — Vite's dev
 * server and `vite preview` already do, and the build emits a `404.html` copy
 * for hosts that fall back to one.
 */

/** Vite's `base`, minus its trailing slash — `''` when served from the root. */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** `/components/button` → `components/button`, so routes stay slash-free. */
const trim = (path: string) => path.replace(/^\/+|\/+$/g, '');

/** A URL's pathname as a route: base stripped, slashes trimmed. */
const toRoute = (pathname: string) =>
  trim(pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname);

const read = () => toRoute(globalThis.location.pathname);

/** `popstate` only fires for back and forward, so `navigate` says so itself. */
const ROUTE_EVENT = 'antkit:route';

export const useRoute = () => {
  const [path, setPath] = useState(read);

  useEffect(() => {
    const onChange = () => setPath(read());

    globalThis.addEventListener('popstate', onChange);
    globalThis.addEventListener(ROUTE_EVENT, onChange);

    return () => {
      globalThis.removeEventListener('popstate', onChange);
      globalThis.removeEventListener(ROUTE_EVENT, onChange);
    };
  }, []);

  return path;
};

/** The `href` a route wants on an `<a>`. Empty path is the landing page. */
export const href = (path = '') => `${BASE}/${trim(path)}`;

export const navigate = (path: string) => {
  globalThis.history.pushState(null, '', href(path));
  globalThis.dispatchEvent(new Event(ROUTE_EVENT));
};

/**
 * Turns in-app anchors into client-side navigations. Delegated from the
 * document rather than handed out as a `<Link>`, so a link written inside a
 * guide's prose routes exactly like one in the chrome — and so an `<a>` still
 * carries a real `href` for middle-click, "open in new tab" and crawlers.
 */
export const useLinkRouting = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Let the browser have the clicks that mean "not here": modified,
      // middle, already handled, or aimed at another tab.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor || anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      const url = new URL(anchor.href, globalThis.location.href);
      if (url.origin !== globalThis.location.origin) return;
      // A bare `#id` — or a demo's inert `href="#"` — belongs to the browser.
      if (url.hash && url.pathname === globalThis.location.pathname) return;

      event.preventDefault();
      navigate(toRoute(url.pathname));
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
};
