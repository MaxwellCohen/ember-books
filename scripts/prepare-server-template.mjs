import { mkdir, rename } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const clientIndex = resolve(root, 'dist/client/index.html');
const serverTemplate = resolve(root, 'dist/server/template.html');

await mkdir(resolve(root, 'dist/server'), { recursive: true });
await rename(clientIndex, serverTemplate);
