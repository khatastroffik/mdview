// const { MenuItem } = require('electron');
const fs = require( "fs" )
const iconv = require( "iconv-lite" )
const path = require( 'path' )
const common = require( "./common" )
// const { app, Menu } = require('electron')
const ApplicationSettings = require( './settings/application-settings' )

// let _applicationSettings

function _readBytesSync( filePath, filePosition, numBytesToRead ) {
  // Based on https://stackoverflow.com/a/51033457 (Reading data a block at a time, synchronously)
  const buffer = Buffer.alloc( numBytesToRead, 0 )
  let fd
  let bytesRead = 0
  try {
    fd = fs.openSync( filePath, "r" )
    bytesRead = fs.readSync( fd, buffer, 0, numBytesToRead, filePosition )
  } finally {
    if ( fd ) {
      fs.closeSync( fd )
    }
  }
  return {
    bytesRead: bytesRead,
    buffer: buffer,
  }
}

function isMarkdown (filePath) {
  return common.FILE_EXTENSIONS.map( ext => "." + ext ).some( ext => filePath.toLowerCase().endsWith( ext ) );
}

function isText (filePath) {
  const BYTECOUNT = 50000
  let data
  try {
    data = _readBytesSync( filePath, 0, BYTECOUNT )
  } catch ( err ) {
    console.error( err.message )
    return false
  }
  // It is not expected that an ASCII file contains control characters.
  // Space character is the first printable ASCII character.
  // Line breaks (LF = 10, CR = 13) and tabs (TAB = 9) are common in text files.
  return data.buffer
    .slice( 0, data.bytesRead - 1 )
    .every( byte => byte >= 32 || [10, 13, 9].includes( byte ) )
}

function openEncodedFile( filePath, encoding ) { 
  return iconv.decode( fs.readFileSync( filePath ), encoding );
}

function changeFileExtension( filePath, newFileExtension ) {
  return path.format( { ...path.parse( filePath ), base: undefined, ext: newFileExtension } )
}

function generateLastFilesMenuTemplate(){
  let _applicationSettings = new ApplicationSettings();
  let allFiles = _applicationSettings.lastOpenedFiles;
  let lastfilesSubMenu = [];
  let fileCounter = 0;
  allFiles.forEach(file => {
    fileCounter++;
    lastfilesSubMenu.push( {
      label: `&${fileCounter % 10}: ${file}`, 
      type: "normal",
      id: file
    } ) 
  });
  // add a separator at the first position if there's any "last file"
  if (lastfilesSubMenu.length > 0) {
    lastfilesSubMenu.unshift( { type: "separator" } );
  }
  return lastfilesSubMenu
}

module.exports.isMarkdown = isMarkdown
module.exports.isText = isText
module.exports.openEncodedFile = openEncodedFile
module.exports.changeFileExtension = changeFileExtension
module.exports.generateLastFilesMenuTemplate = generateLastFilesMenuTemplate
