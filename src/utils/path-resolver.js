import { fileURLToPath } from 'url';
import path from 'path';

// Function to create a context with path utilities for the current module
export function createPathContext(importMetaUrl) {
    // Convert the import.meta.url to a file path
    const __filename = fileURLToPath(importMetaUrl);
    // Get the directory name of the current module
    const __dirname = path.dirname(__filename);
    
    // Function to resolve a given relative path to an absolute path based on the current module's directory
    function resolvePath(relativePath) {
        return path.resolve(__dirname, relativePath);
    }

    // Return the filename, directory name, and the resolvePath function as part of the context
    return { __filename, __dirname, resolvePath };
}