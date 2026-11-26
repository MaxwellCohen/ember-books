import { modifier } from 'ember-modifier';
import { prefetchBook } from '../lib/book/load-catalog';

export default modifier((element, [id, searchParams]) => {
  const warm = () => prefetchBook(id, searchParams);
  element.addEventListener('pointerenter', warm, { once: true });
  element.addEventListener('focus', warm, { once: true });
  return () => {
    element.removeEventListener('pointerenter', warm);
    element.removeEventListener('focus', warm);
  };
});
