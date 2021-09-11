const electron = require( "electron" )
const { BrowserWindow } = require( 'electron' )
const  os  = require( 'os' )
const fs = require( "fs" )
const  path  = require( "path" )
const { showSuccessModal } = require( './messageBoxes/success' )
const { showError } = require( './messageBoxes/error' )
const { changeFileExtension } = require( './file' )
const navigation = require( "./navigation/navigationMain" )

function printToPDF() {
  const PDF_OPTIONS = { 
    // headerFooter: { title: "", url: "printed by MDview"}, // not working properly
    scaleFactor: 90,
    marginsType: 0, 
    pageSize: 'A4', 
    printBackground: true, // the "code" background is not visible otherwise
    printSelectionOnly: false,
    landscape: false
  }
  const ERROR_MESSAGE = 'The PDF document could not be generated';
  const DEFAULT_FILEPATH = path.join( os.homedir(), 'Desktop', 'mdview-export.pdf' )
  const FILEPATH = navigation.hasCurrentLocation() ? changeFileExtension( navigation.getCurrentLocation().filePath, '.pdf' ) : DEFAULT_FILEPATH;
  const FOCUSED_WINDOW = BrowserWindow.getFocusedWindow()

  electron.dialog.showSaveDialog( {
    title: 'Save the PDF file as',
    defaultPath: FILEPATH,
    filters: [{ name: 'PDF files', extensions: ['pdf'] },],
    properties: []
  } )
    .then( file => {
      if ( !file.canceled ) {
        let pdfFilePath = file.filePath.toString();
        let win = FOCUSED_WINDOW;
        win.webContents.printToPDF( PDF_OPTIONS ).then( data => {
          fs.writeFile( pdfFilePath, data, function ( err ) {
            if ( err ) {
              showError( ERROR_MESSAGE, error.message )
              console.error( err );
            } else {
              showSuccessModal( 'The PDF document has been successfully generated', pdfFilePath );
            }
          } );
        } ).catch( error => {
          showError( ERROR_MESSAGE, error.message )
          console.error( error )
        } );

      }
    } ).catch( err => {
      showError( ERROR_MESSAGE, error.message )
      console.error( err )
    } );
}

module.exports.printToPDF = printToPDF;
