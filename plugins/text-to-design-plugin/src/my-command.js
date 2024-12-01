const BrowserWindow = require('sketch-module-web-view')
const { getWebview } = require('sketch-module-web-view/remote')
const DataSupplier = require('sketch/data-supplier')
const UI = require('sketch/ui')
const { version } = require('../package.json')
const { Document, Text, Artboard, Rectangle, Style, Group } = require('sketch/dom')

const webviewIdentifier = 'text-to-design-plugin.webview'

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 375,
    height: 667,
    show: false
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message(`UI loaded! ${version}`)
    // 这里执行你自己的逻辑
    webContents
    .executeJavaScript(`setVersion(${version})`)
    .catch(console.error)
  })

  // add a handler for a call from web content's javascript
  webContents.on('submit', s => {
    // UI.message(s)
    UI.message(`processing...${s}`);
    // 
    const schema = {
      layers: [{
        "_class": "text",
        "do_objectID": "2d0f6688-a4e3-41ea-a0b5-f2e0326e0a8d",
        "name": "请输入验证码",
        "frame": {
          "_class": "rect",
          "x": 20,
          "y": 240,
          "width": 335,
          "height": 40
        },
        "style": {
          "_class": "style",
          "textStyle": {
            "_class": "textStyle",
            "encodedAttributes": {
              "paragraphStyle": {
                "_class": "paragraphStyle",
                "allowsDefaultTighteningForTruncation": 0,
                "alignment": 0
              },
              "MSAttributedStringFontAttribute": {
                "_class": "fontDescriptor",
                "attributes": {
                  "name": "PingFangSC-Thin",
                  "size": 16
                }
              },
              "MSAttributedStringColorAttribute": {
                "_class": "color",
                "red": 0.4,
                "green": 0.4,
                "blue": 0.4,
                "alpha": 1
              },
              "textStyleVerticalAlignmentKey": 0,
              "kerning": 0
            },
            "verticalAlignment": 0
          }
        },
        "attributedString": {
          "_class": "attributedString",
          "string": "请输入验证码",
          "attributes": [
            {
              "_class": "stringAttribute",
              "location": 0,
              "length": 6,
              "attributes": {
                "MSAttributedStringFontAttribute": {
                  "_class": "fontDescriptor",
                  "attributes": {
                    "name": "PingFangSC-Thin",
                    "size": 16
                  }
                },
                "MSAttributedStringColorAttribute": {
                  "_class": "color",
                  "red": 0.4,
                  "green": 0.4,
                  "blue": 0.4,
                  "alpha": 1
                },
                "kerning": 0,
                "textStyleVerticalAlignmentKey": 0,
                "paragraphStyle": {
                  "_class": "paragraphStyle",
                  "allowsDefaultTighteningForTruncation": 0,
                  "alignment": 0
                }
              }
            }
          ]
        }
      }]
    }
    try {
      UI.message('typeof Doc', typeof Document);
      const doc = Document.getSelectedDocument();
      const page = doc.selectedPage;
      // 寻找 Artboard
      const artboard = page.layers.find((layer) => layer.type === 'Artboard');
      schema.layers.forEach((layer) => {
        // page.layers.push(new Text(layer));
        // 向artboard中添加文本图层
        artboard.layers.push(new Text(layer));
      });
      UI.message('Sketch project created successfully!');
    } catch (e) {
      UI.message('Error creating Sketch project: ' + e.message);
    }
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

export function onStartup() {
  DataSupplier.registerDataSupplier(
    'public.text',
    'My Custom Data',
    'SupplyKey'
  )
}
// onSupplyKeyNeeded would be the handler for
// the `SupplyKey` action defined in the manifest.json
export function onSupplyKeyNeeded(context) {
  var count = context.data.items.count()
  var key = context.data.key

  var data = Array.from(Array(count)).map(i => 'foo')

  DataSupplier.supplyData(key, data)
  UI.message('SupplyKey' + data)
}
// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
  DataSupplier.deregisterDataSuppliers()
}
