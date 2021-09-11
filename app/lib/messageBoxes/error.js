
const { ipcMain, dialog, app } = require('electron')
const ipc = require( "../ipc" )

const DEFAULT_ERROR_MESSAGE = 'Something went wrong!'
const DEFAULT_ERROR_DETAILS = 'An unknown error occured. Please consider reporting errors to the application author(s).'

/** 
 * show a modal message box to display information about an error
 **/
function showError(errorMessage = DEFAULT_ERROR_MESSAGE, errorDetail = DEFAULT_ERROR_DETAILS){
  dialog.showErrorBox(errorMessage, errorDetail)
}

ipcMain.on(ipc.messages.showErrorDialog, (event, errorMessage, errorDetail) => {
  showError(errorMessage, errorDetail)
});

module.exports.showError = showError
