const win32Escpos = function () {
  if (process.platform === 'win32') {
    const {GetDeviceList, PrintRaw, DisConnect} = require('./build/Release/addon.node');
    return {
      GetUsbDeviceList () {
        return GetDeviceList('USB');
      },
      GetComDeviceList() {
        return GetDeviceList('COM');
      },
      GetLptDeviceList () {
        return GetDeviceList('LPT').map((item, index) => {
          const matchs = item.path.match(/lpt\d/);
          let path;
          if (matchs) {
            path = matchs[0].toUpperCase() + ':';
          }
          path = `LPT${index+1}:`;
          item.path = path;
          return item;
        });
      },
      DisConnect (path) {
        return DisConnect(path);
      },
      GetDeviceList,
      PrintRaw 
    }
   }
   
   throw new Error("must be win32 platform to use");
}

/**
 * module namespace cache
 */
let moduleNameSpace;

/**
 * allow reload module(breaking changes)
 * 
 * @example in upstream module:
 * ```javascript
 * import escpos from 'node-escpos-addon'
 * // you can use `escpos.GetUsbDeviceList` ...
 * ```
 * 
 * @example in this module:
 * ```javascript
 * import getEscpos from 'node-escpos-addon'
 * const escpos = getEscpos(true)
 * // you can use `escpos.GetUsbDeviceList` ...
 * ```
 * @param {boolean} reload reload this native module
 */
module.exports = function (reload = false) {
  return reload || !moduleNameSpace
    ? (moduleNameSpace = win32Escpos())
    : moduleNameSpace
}
