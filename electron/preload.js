import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    getServerStatus: () => ipcRenderer.invoke('get-server-status'),
    restartServer: () => ipcRenderer.invoke('restart-server'),
    // Add any other APIs you need to expose to the renderer
}); 