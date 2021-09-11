const { ipcMain, dialog, BrowserWindow } = require( 'electron' )
const remote = require ("electron").remote;
const ipc = require( "../ipc" )

const DEFAULT_SUCCESS_MESSAGE = 'The operation completed successfully!'

/**
 * show a message box (modal or non-modal)
 */
function _showSuccessDialog(browserWindow, successMessage = DEFAULT_SUCCESS_MESSAGE, successDetail = '' ) {
  const options = {
    type: 'info',
    buttons: ['Ok'],
    defaultId: 0,
    title: 'Success',
    message: successMessage,
    detail: successDetail
  };
  dialog.showMessageBox( browserWindow, options );
}

/** 
 * show a non-modal message box for 'Success' confirmation
 **/
function showSuccess( successMessage = DEFAULT_SUCCESS_MESSAGE, successDetail = '' ) {
  _showSuccessDialog(null, successMessage, successDetail)
};

/** 
 * show a modal message box for 'Success' confirmation
 **/
 function showSuccessModal( successMessage = DEFAULT_SUCCESS_MESSAGE, successDetail = '' ) {
  _showSuccessDialog(BrowserWindow.getFocusedWindow(), successMessage, successDetail)
};

ipcMain.on(ipc.messages.showSuccessDialog, (event, successMessage, successDetail) => {
  showSuccessModal( successMessage, successDetail )
});

module.exports.showSuccess = showSuccess
module.exports.showSuccessModal = showSuccessModal
