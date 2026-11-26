// Feature test islands (hand-rolled): the only <script type="module"> on
// /feature-tests/islands. Mounts interactive components into their placeholders;
// the rest of the server-rendered page stays static HTML.
import { renderComponent } from '@ember/renderer';
import FavoriteButton from './components/feature-tests/favorite-button';

const islands = { 'favorite-button': FavoriteButton };

for (const el of document.querySelectorAll('[data-island]')) {
  const args = JSON.parse(el.dataset.args ?? '{}');
  el.replaceChildren(); // no hydration: drop the server markup, then render fresh
  renderComponent(islands[el.dataset.island], { into: el, args });
  el.setAttribute('data-island-mounted', 'true');
}
