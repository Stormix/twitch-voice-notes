import { useEffect, useState } from 'react';

const getCurrentLocation = () => ({
  pathname: window.location.pathname,
  search: window.location.search,
  href: window.location.href,
});

const listeners: Array<() => void> = [];

/**
 * Notifies all location listeners. Can be used if the history state has been manipulated
 * in by another module. Effectifely, all components using the 'useLocation' hook will
 * update.
 */
export const notify = () => {
  listeners.forEach(listener => listener());
};

export function useLocation() {
  const [{ pathname, search, href }, setLocation] = useState(getCurrentLocation());

  useEffect(() => {
    window.addEventListener('popstate', handleChange);
    return () => window.removeEventListener('popstate', handleChange);
  }, []);

  useEffect(() => {
    listeners.push(handleChange);
    const handler = listeners.splice(listeners.indexOf(handleChange), 1)?.[0];
    return () => handler();
  }, []);

  const handleChange = () => {
    setLocation(getCurrentLocation());
  };

  const push = (url: string) => {
    window.history.pushState(null, null, url);
    notify();
  };

  const replace = (url: string) => {
    window.history.replaceState(null, null, url);
    notify();
  };

  return {
    push,
    replace,
    pathname,
    search,
    href,
  };
}
