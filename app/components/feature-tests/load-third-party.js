import { modifier } from 'ember-modifier';

// Feature test third-party-scripts (hand-rolled): wait for the load event and an
// idle moment, then inject the script (like Next's lazyOnload). vite-ember-ssr
// runs modifiers against its server DOM, so skip SSR explicitly: the server HTML
// must carry no <script> for it.
export default modifier((element, [src]) => {
  if (import.meta.env.SSR) return;
  let cancelled = false;
  const inject = () => {
    if (cancelled || document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.head.appendChild(s);
    element.setAttribute('data-script-injected', 'true');
  };
  const idle = () => (window.requestIdleCallback || setTimeout)(inject);
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener('load', idle);
  };
});
