import { fileURLToPath } from 'url';
import path from 'path';

export function getPathInfo(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);
  
  // Function to get the path of a module relative to the current file
  function getModulePath(relativePath) {
    return path.resolve(__dirname, relativePath);
  }

  return { __filename, __dirname, getModulePath };
}