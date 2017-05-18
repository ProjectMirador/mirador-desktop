const { BrowserWindow, app, dialog } = require('electron');
const fs = require('fs');
const Handlebars = require('handlebars');
const sizeOf = require('image-size');
const mime = require('mime-types');
const path = require('path');
const urljoin = require('url-join');
const uuid = require('uuid/v4');  // random

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Mirador Desktop',
    width: 960,
    height: 600,
    webSecurity: false,  // needed to access local files
  });
  mainWindow.loadURL(urljoin('file://', __dirname, 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // mainWindow.webContents.openDevTools();
};

const fakeManifest = (filenames, uri, success, error) => {
  if (filenames) {
    fs.readFile(path.join(__dirname, 'manifest.tpl'), 'utf8', (err, source) => {
      if (err) {
        if (error) {
          error(err);
        } else {
          dialog.showErrorBox('Something happened while preparing the images :\'(', err);
        }
      }
      const files = filenames.map(filename => ({
        file: filename,
        dimensions: sizeOf(filename),
        mime: mime.lookup(filename),
      }));
      const label = filenames.map(filename => path.basename(filename)).join(', ');
      const template = Handlebars.compile(source);
      success(template({ files, uri, label }));
      return files;  // makes eslint happy
    });
  } else {
    error();
  }
};

const openImageFile = () => {
  if (!mainWindow) { return; }
  const files = dialog.showOpenDialog(mainWindow, {
    title: 'Select local images',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'bmp'] }],
  });
  if (!files) { return; }
  const manifestId = uuid();
  const manifestUri = urljoin('file://', __dirname, manifestId, 'manifest.json');
  fakeManifest(files, manifestUri, (content) => {
    mainWindow.webContents.send('manifest-file-opened', manifestUri, manifestId, files, content);
  });
};

const exportWorkspace = (contents) => {
  dialog.showSaveDialog(mainWindow, {
    properties: ['createDirectory', 'promptToCreate'],
    filters: [{ name: 'Workspace JSON', extensions: ['json'] }],
  }, (filename) => {
    if (filename === undefined) { return; }
    fs.writeFile(filename, contents, (err) => {
      if (err) {
        dialog.showErrorBox('Something happened while saving your workspace :\'(', err);
      }
    });
  });
};

const importWorkspace = () => {
  if (!mainWindow) { return; }
  const files = dialog.showOpenDialog(mainWindow, {
    title: 'Select workspace JSON',
    properties: ['openFile'],
    filters: [{ name: 'Workspace', extensions: ['json'] }],
  });
  if (!files) { return; }
  fs.readFile(files[0], 'utf8', (err, source) => {
    if (err) {
      dialog.showErrorBox('Something happened while opening your workspace :\'(', err);
    }
    mainWindow.webContents.send('workspace-file-opened', files[0], source);
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

exports.openImageFile = openImageFile;
exports.importWorkspace = importWorkspace;
exports.exportWorkspace = exportWorkspace;
