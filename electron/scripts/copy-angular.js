import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const sourcePath = path.join(__dirname, '../../client/dist/apollo-ng/browser');
const targetPath = path.join(__dirname, '../../server/client_static_files');

console.log('Copying Angular build files...');
console.log('From:', sourcePath);
console.log('To:', targetPath);

// Function to copy directory recursively
function copyDirectory(source, target) {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    // Read source directory
    const files = fs.readdirSync(source);

    files.forEach(file => {
        const sourceFile = path.join(source, file);
        const targetFile = path.join(target, file);
        const stat = fs.statSync(sourceFile);

        if (stat.isDirectory()) {
            // Recursively copy subdirectories
            copyDirectory(sourceFile, targetFile);
        } else {
            // Copy file
            fs.copyFileSync(sourceFile, targetFile);
            console.log(`Copied: ${file}`);
        }
    });
}

try {
    // Check if source exists
    if (!fs.existsSync(sourcePath)) {
        console.error('Error: Angular build directory not found at:', sourcePath);
        console.error('Make sure to run "npm run build:client" first');
        process.exit(1);
    }

    // Remove target directory if it exists
    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log('Removed existing target directory');
    }

    // Copy files
    copyDirectory(sourcePath, targetPath);
    
    console.log('✅ Angular files copied successfully!');
    console.log(`📁 Files are now available at: ${targetPath}`);
    
} catch (error) {
    console.error('❌ Error copying Angular files:', error);
    process.exit(1);
} 