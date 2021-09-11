const { default: openAboutWindow } = require( 'about-window' )
const path = require( "path" )

function showAboutWindow(parentWindow) {
  let aboutWin = openAboutWindow( {
    icon_path: path.join( __dirname, '../../assets/icon.png' ),
    win_options: {
      parent: parentWindow,
      modal: true,
      resizable: false,
      skipTaskbar: true,
      title: "About ...",
      minimizable: false,
      maximizable: false
    },
    package_json_dir: path.join( __dirname, '../../../' )
  } );
  
  aboutWin.webContents.on( 'before-input-event', ( event, input ) => {
    if ( input.key == 'Escape' ) {
      aboutWin.close();
      event.preventDefault();
    }
  } )
  
}

module.exports.showAboutWindow = showAboutWindow
