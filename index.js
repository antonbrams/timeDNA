
const {app, BrowserWindow} = require('electron')
const url  = require('url')
const path = require('path')
const env = require(`./dev/env.js`)
const server = require(`./server/build/index.js`)
let window = null

if (env == 'dev') require('electron-reload')(__dirname, {
	hardResetMethod : 'exit',
	electron        : `./node_modules/.bin/electron`
})

let createWindow = () => {
	window = new BrowserWindow({
	    titleBarStyle : 'hidden-inset',
		width		  : 1200,
		fullscreen	  : true
	})
	if (env == 'dev') {
		window.webContents.openDevTools()
		window.loadURL('http://localhost:8000/client')
	} else
		window.loadURL(url.format({
			pathname : path.join(__dirname, '/client/index.html'),
			protocol : 'file:',
			slashes  : true
		}))
	window.on('closed', () => window = null)
}

app.on('ready', createWindow)
app.on('activate', () => {if (window === null) createWindow()})
app.on('window-all-closed', () => {if (process.platform !== 'darwin') app.quit()})
