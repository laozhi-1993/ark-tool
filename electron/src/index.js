const { app, BrowserWindow, Menu, ipcMain ,globalShortcut ,shell } = require('electron');
const { spawn } = require('child_process');
const path   = require('path');
const fs     = require('fs');
const http   = require('http');
const keiapi = spawn("resources/api.exe");


const createWindow = () => {
	// 打开一个窗口
	const mainWindow = new BrowserWindow({
		width: 1080,
		height: 750,
		resizable: false,
		icon: path.join(__dirname, 'favicon.ico'),
		webPreferences:{
			preload: path.join(__dirname, 'index.preload.js')
		}
	});
	
	Menu.setApplicationMenu(null);              //关闭默认菜单
	mainWindow.loadFile('src_html/index.html'); //打开一个网址
	//mainWindow.webContents.openDevTools();      //打开控制台
	
	
	ipcMain.on("open",(e,url) => {
		shell.openExternal(url);
		e.returnValue = 'ok';
	});
	
	if (!fs.existsSync("resources/server.json"))
	{
		fs.writeFile("resources/server.json", JSON.stringify([]), "utf8", (err) => {
			if (err) {
				console.log(`写入文件时发生错误: ${err}`);
				return;
			}
			console.log('文件写入成功!');
		});
	}
	
	GlobalKeys();
	shortcut();
	collect();
};


function GlobalKeys()
{
	globalShortcut.register("`",function (){
		http.get("http://127.0.0.1:8066/auto_paste");
	});
	globalShortcut.register("f1",function (){
		fs.readFile('resources/shortcut.json', 'utf8', (err, data) => {
			if (err) {
				console.error('读取文件时发生错误：', err);
				return;
			}
			
			
			shortcut = JSON.parse(data);
			http.get(`http://127.0.0.1:8066/auto_code?value=${shortcut[0]}`);
		});
	});
	globalShortcut.register("f2",function (){
		fs.readFile('resources/shortcut.json', 'utf8', (err, data) => {
			if (err) {
				console.error('读取文件时发生错误：', err);
				return;
			}
			
			
			shortcut = JSON.parse(data);
			http.get(`http://127.0.0.1:8066/auto_code?value=${shortcut[1]}`);
		});
	});
	globalShortcut.register("f3",function (){
		fs.readFile('resources/shortcut.json', 'utf8', (err, data) => {
			if (err) {
				console.error('读取文件时发生错误：', err);
				return;
			}
			
			
			shortcut = JSON.parse(data);
			http.get(`http://127.0.0.1:8066/auto_code?value=${shortcut[2]}`);
		});
	});
	globalShortcut.register("f4",function (){
		fs.readFile('resources/shortcut.json', 'utf8', (err, data) => {
			if (err) {
				console.error('读取文件时发生错误：', err);
				return;
			}
			
			
			shortcut = JSON.parse(data);
			http.get(`http://127.0.0.1:8066/auto_code?value=${shortcut[3]}`);
		});
	});	
}


function shortcut()
{
	if (!fs.existsSync("resources/shortcut.json"))
	{
		fs.writeFile("resources/shortcut.json", JSON.stringify(["","","",""]), "utf8", (err) => {
			if (err) {
				console.log(`写入文件时发生错误: ${err}`);
				return;
			}
			console.log('文件写入成功!');
		});
	}
	ipcMain.on("shortcut",(e,code1,code2,code3,code4) => {
		fs.writeFile("resources/shortcut.json", JSON.stringify([code1,code2,code3,code4]), "utf8", (err) => {
			if (err) {
				e.returnValue = `写入文件时发生错误: ${err}`;
				return;
			}
			e.returnValue = '文件写入成功!';
		});
	});
}


function collect()
{
	if (!fs.existsSync("resources/collect.json"))
	{
		fs.writeFile("resources/collect.json", "[]", "utf8", (err) => {
			if (err) {
				console.log(`写入文件时发生错误: ${err}`);
				return;
			}
			console.log('文件写入成功!');
		});
	}
	ipcMain.on("collect",(e,message,type) => {
		fs.readFile("resources/collect.json", 'utf8', (err, data) => {
			if(type)
			{
				if (err)
				{
					config = [];
					config.push(message);
				}
				else
				{
					config = JSON.parse(data);
					config.push(message);
				}
			}
			else
			{
				if (err)
				{
					config = [];
				}
				else
				{
					config = JSON.parse(data);
					config.splice(message,1);
				}				
			}
			
			fs.writeFile("resources/collect.json", JSON.stringify(config), "utf8", (err) => {
				if (err) {
					e.returnValue = `写入文件时发生错误: ${err}`;
					return;
				}
				e.returnValue = '文件写入成功!';
			});
		});
	});
}


app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});