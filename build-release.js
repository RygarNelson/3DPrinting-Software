import archiver from "archiver";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const executeCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {
    // Use spawn with shell: true and stdio: 'inherit' to let the child process write directly to stdout/stderr
    // This is more robust for long-running processes with large output
    const child = spawn(command, { cwd, shell: true, stdio: "inherit" });

    // No need for data listeners when using stdio: 'inherit'

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
};

const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
};

const main = async () => {
  try {
    // 1. Ask for zip file name
    const zipName = await new Promise((resolve) => {
      rl.question("Enter the zip file name (without extension): ", (answer) => {
        resolve(answer.trim());
      });
    });
    rl.close();

    if (!zipName) {
      console.error("Zip name is required!");
      process.exit(1);
    }

    const buildDir = path.join(__dirname, "build");
    const clientDir = path.join(__dirname, "client");
    const serverDir = path.join(__dirname, "server");
    const distClientDir = path.join(clientDir, "dist", "apollo-ng", "browser");

    // Delete the dist folder in the client if it exists
    if (fs.existsSync(distClientDir)) {
      console.log("Removing existing dist folder...");
      fs.rmSync(distClientDir, { recursive: true, force: true });
    }

    // 2. Run npm run build in client folder
    console.log("Building client...");
    await executeCommand("npm run build", clientDir);

    // 3. Remove build folder if exists
    if (fs.existsSync(buildDir)) {
      console.log("Removing existing build folder...");
      fs.rmSync(buildDir, { recursive: true, force: true });
    }

    // 4. Create build folder
    console.log("Creating build folder...");
    fs.mkdirSync(buildDir);

    // 5. Create build/client and copy files
    console.log("Copying client files...");
    const buildClientDir = path.join(buildDir, "client");
    if (fs.existsSync(distClientDir)) {
      copyRecursiveSync(distClientDir, buildClientDir);
    } else {
      throw new Error(
        `Client dist copy failed: ${distClientDir} does not exist`
      );
    }

    // 6. Create build/server and copy files
    console.log("Copying server files...");
    const buildServerDir = path.join(buildDir, "server");
    const serverFilesToCopy = [
      "src",
      ".gitignore",
      "package-lock.json",
      "package.json",
      "README.md",
      "server.js",
    ];

    serverFilesToCopy.forEach((file) => {
      const srcPath = path.join(serverDir, file);
      const destPath = path.join(buildServerDir, file);
      if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, destPath);
      } else {
        console.warn(`Warning: ${file} not found in server directory.`);
      }
    });

    // 7. Create zip file
    console.log(`Creating ${zipName}.zip...`);
    const zipPath = path.join(buildDir, `${zipName}.zip`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    await new Promise((resolve, reject) => {
      output.on("close", () => {
        console.log(`${archive.pointer()} total bytes`);
        resolve();
      });

      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          console.warn(err);
        } else {
          reject(err);
        }
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.pipe(output);

      // Append files from build/client and build/server
      // We want them to appear at the root of the zip as 'client' and 'server'
      archive.directory(path.join(buildDir, "client"), "client");
      archive.directory(path.join(buildDir, "server"), "server");

      archive.finalize();
    });

    console.log("Build and packaging complete!");
    console.log(`Zip file created at: ${zipPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
};

main();
