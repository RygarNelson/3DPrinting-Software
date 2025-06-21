import { spawn } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
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
        icon: path.join(__dirname, '../assets/icon.png'),
        title: '3D Printing Software'
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

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Function to start the Express server
function startServer() {
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

    // Handle server output
    serverProcess.stdout.on('data', (data) => {
        console.log('Server stdout:', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
        console.log('Server stderr:', data.toString());
    });

    // Handle server process exit
    serverProcess.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
        if (code !== 0) {
            app.quit();
        }
    });

    // Handle server process error
    serverProcess.on('error', (error) => {
        console.error('Failed to start server:', error);
        app.quit();
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
app.whenReady().then(() => {
    // Start the server first
    startServer();
    
    // Wait a bit for server to start, then create window
    setTimeout(() => {
        createWindow();
    }, 2000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
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