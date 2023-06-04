const { contextBridge , ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('collectAPI',function (data,type){
	return ipcRenderer.sendSync("collect",data,type);
});
contextBridge.exposeInMainWorld('shortcutAPI',function (code1,code2,code3,code4){
	return ipcRenderer.sendSync("shortcut",code1,code2,code3,code4);
});
contextBridge.exposeInMainWorld('openAPI',function (url){
	return ipcRenderer.sendSync("open",url);
});