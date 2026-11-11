import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('@/')) {
      let candidate;
      if (specifier.startsWith('@/')) {
        candidate = path.resolve(process.cwd(), 'app', 'src', specifier.slice(2));
      } else {
        const parentURL = context.parentURL;
        if (parentURL && parentURL.startsWith('file:')) {
          const parentDir = path.dirname(fileURLToPath(parentURL));
          candidate = path.resolve(parentDir, specifier);
        }
      }
      if (candidate) {
        for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js']) {
          const target = candidate + ext;
          if (fs.existsSync(target) && fs.statSync(target).isFile()) {
            return nextResolve(pathToFileURL(target).href, context);
          }
        }
      }
    }
    throw err;
  }
}
