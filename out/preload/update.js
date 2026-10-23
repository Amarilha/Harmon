"use strict";
const electron = require("electron");
const UPDATE_CHANNELS = {
  payload: "maestri:update:payload",
  respond: "maestri:update:respond",
  openExternal: "maestri:update:openExternal",
  height: "maestri:update:height"
};
const api = {
  payload() {
    return electron.ipcRenderer.invoke(UPDATE_CHANNELS.payload);
  },
  respond(choice) {
    electron.ipcRenderer.send(UPDATE_CHANNELS.respond, choice);
  },
  openExternal(url) {
    electron.ipcRenderer.send(UPDATE_CHANNELS.openExternal, url);
  },
  reportHeight(height) {
    electron.ipcRenderer.send(UPDATE_CHANNELS.height, height);
  }
};
electron.contextBridge.exposeInMainWorld("maestriUpdate", api);
