const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const schemaSource = require('../schemas/source.json');
async function createSketchFile() {
  const zip = new JSZip();

  // 将 Sketch 文件的元数据写入 ZIP
  zip.file('document.json', JSON.stringify(schemaSource));
  
  // 保存 ZIP 文件
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(path.join(__dirname, '../output/output.sketch'), content);
  
  console.log('Sketch file created: output.sketch');
}

createSketchFile().catch(console.error);
