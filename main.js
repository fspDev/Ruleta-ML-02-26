const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'favicon.ico')
  });

  // Load index.html from the build folder
  win.loadFile(path.join(__dirname, 'build', 'index.html'));
}

ipcMain.on('save-participant', (event, data) => {
  const filePath = path.join(__dirname, 'participantes.txt');
  // Formato: Nombre, Email, Empresa, Fecha
  const entry = `Nombre: ${data.nombre}, Email: ${data.email}, Empresa: ${data.empresa}, Fecha: ${new Date().toLocaleString()}\n`;
  
  try {
    fs.appendFileSync(filePath, entry, 'utf8');
    console.log('Participante guardado en:', filePath);
  } catch (err) {
    console.error('Error al guardar el participante:', err);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

