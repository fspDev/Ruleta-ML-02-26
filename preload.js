const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveParticipant: (data) => ipcRenderer.send('save-participant', data)
});
