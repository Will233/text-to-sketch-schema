const { convert } = require('convert-svg-to-png');
const fs = require('fs');

async function convertSvgToPng() {
  try {
    // 读取 SVG 文件内容
    const svgContent = fs.readFileSync('./海报模版/draft.svg', 'utf-8');
    
    // 转换为 PNG
    const pngBuffer = await convert(svgContent, {
      width: 390,   // 设置 PNG 图像的宽度
      height: 844   // 设置 PNG 图像的高度
    });

    // 将 PNG 内容写入文件
    fs.writeFileSync('/海报模版/draft.png', pngBuffer);
    console.log('SVG 已成功转换为 PNG 格式！');
  } catch (error) {
    console.error('转换失败：', error);
  }
}

convertSvgToPng();
