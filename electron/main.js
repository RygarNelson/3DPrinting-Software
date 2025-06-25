import { spawn } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let loadingWindow;
let serverProcess;

// Function to get the correct server path
function getServerPath() {
    if (app.isPackaged) {
        // In production, server is unpacked from asar
        return path.join(process.resourcesPath, 'server', 'server.js');
    } else {
        // In development, use relative path
        return path.join(__dirname, '../server/server.js');
    }
}

// Function to create the loading window
function createLoadingWindow() {
    loadingWindow = new BrowserWindow({
        width: 400,
        height: 400,
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, './assets/icon.png'),
        title: 'Loading...'
    });

    // Load the loading screen HTML
    loadingWindow.loadFile(path.join(__dirname, 'loading.html'));

    // Prevent closing the loading window
    loadingWindow.on('close', (e) => {
        if (!mainWindow) {
            e.preventDefault();
        }
    });
}

// Function to create the main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, './assets/icon.png'),
        title: '3D Printing Software',
        show: false // Don't show until ready
    });

    // Load the Angular app from the Express server
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
        // In development, load from Angular dev server
        mainWindow.loadURL('http://localhost:4200');
        mainWindow.webContents.openDevTools();
    } else {
        // In production, load from the Express server
        mainWindow.loadURL('http://localhost:3000');
    }

    // Show the main window when it's ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Close the loading window
        if (loadingWindow) {
            loadingWindow.close();
            loadingWindow = null;
        }
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Function to check if server is ready
function checkServerReady() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET',
            timeout: 1000
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve();
            } else {
                reject(new Error(`Server responded with status: ${res.statusCode}`));
            }
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Server check timeout'));
        });

        req.end();
    });
}

// Function to wait for server to be ready
async function waitForServer() {
    const maxAttempts = 30; // 30 seconds max
    const interval = 1000; // Check every second
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await checkServerReady();
            console.log(`Server is ready after ${attempt} attempts`);
            return true;
        } catch (error) {
            console.log(`Server not ready yet (attempt ${attempt}/${maxAttempts}): ${error.message}`);
            if (attempt === maxAttempts) {
                console.error('Server failed to start within timeout period');
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
    return false;
}

// Function to start the Express server
function startServer() {
    return new Promise((resolve, reject) => {
        const serverPath = getServerPath();
        
        // Set environment variables for the server
        const env = {
            ...process.env,
            NODE_ENV: 'production',
            SERVER_PORT: '3000',
            SERVER_ADDRESS: 'localhost',
            ELECTRON_APP_DATA_PATH: app.getPath('userData')
        };

        // Start the server process
        serverProcess = spawn('node', [serverPath], {
            env,
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: app.isPackaged ? path.join(process.resourcesPath, 'server') : path.join(__dirname, '../server')
        });

        let serverStarted = false;

        // Handle server output
        serverProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('Server stdout:', output);
            
            // Check for server ready indicators
            if (output.includes('HTTP server at localhost:3000') || 
                output.includes('HTTPS server at localhost:3000') ||
                output.includes('Server is running')) {
                serverStarted = true;
            }
        });

        serverProcess.stderr.on('data', (data) => {
            const output = data.toString();
            console.log('Server stderr:', output);
            
            // Check for server ready indicators in stderr too
            if (output.includes('HTTP server at localhost:3000') || 
                output.includes('HTTPS server at localhost:3000') ||
                output.includes('Server is running')) {
                serverStarted = true;
            }
        });

        // Handle server process exit
        serverProcess.on('close', (code) => {
            console.log(`Server process exited with code ${code}`);
            if (code !== 0 && !serverStarted) {
                reject(new Error(`Server process exited with code ${code}`));
            }
        });

        // Handle server process error
        serverProcess.on('error', (error) => {
            console.error('Failed to start server:', error);
            reject(error);
        });

        // Wait a bit for the process to start, then check if server is ready
        setTimeout(async () => {
            try {
                const isReady = await waitForServer();
                if (isReady) {
                    resolve();
                } else {
                    reject(new Error('Server failed to start within timeout'));
                }
            } catch (error) {
                reject(error);
            }
        }, 1000);
    });
}

// Function to stop the server
function stopServer() {
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
        serverProcess = null;
    }
}

// App event handlers
app.whenReady().then(async () => {
    // Create loading window first
    createLoadingWindow();
    
    try {
        // Start the server and wait for it to be ready
        await startServer();
        console.log('Server is ready, creating main window...');
        
        // Create main window once server is ready
        createWindow();
    } catch (error) {
        console.error('Failed to start server:', error);
        app.quit();
    }

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createLoadingWindow();
            try {
                await startServer();
                createWindow();
            } catch (error) {
                console.error('Failed to restart server:', error);
                app.quit();
            }
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        stopServer();
        app.quit();
    }
});

app.on('before-quit', () => {
    stopServer();
});

// IPC handlers for communication between main and renderer processes
ipcMain.handle('get-server-status', () => {
    return serverProcess ? 'running' : 'stopped';
});

ipcMain.handle('restart-server', () => {
    stopServer();
    setTimeout(() => {
        startServer();
    }, 1000);
    return 'restarting';
}); 