const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('trendResearch', {
  getVersion: () => ipcRenderer.invoke('app:version')
});
