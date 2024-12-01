
/**
 * 提取页面数据, 打包成 sketch 文件
 * 
 */

const fs = require('fs')
const path = require('path');
const archiver = require('archiver')
const data = require('../output/page.json');
const SKETCH_PROJECT_TEMPLATE_DIR = './output/sketch-project-template'
const SKETCH_FILES_OUTPUT = './output/sketch-files'

const extractPageSchema = (data) => {
  const pageSchema = JSON.parse(data.output);
  fs.writeFileSync(`${SKETCH_PROJECT_TEMPLATE_DIR}/pages/${pageSchema.do_objectID}.json`, JSON.stringify(pageSchema))
}


/**
 * 递归获取目录中的所有文件，忽略隐藏文件
 * @param {string} dirPath 目录路径
 * @param {Array} fileList 文件数组
 * @returns {Array} 文件路径列表
 */
function getFilesInDirectory(dirPath, fileList = [], basePath = '') {
  console.log('getFilesInDirectory => ', dirPath)
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    // 忽略隐藏文件和隐藏目录
    if (file.startsWith('.')) {
      return;
    }

    // 目录本身也加入列表
    if (stat.isDirectory()) {
      fileList.push({ dir: filePath, relativePath: path.relative(basePath, filePath) });
      // 递归添加目录内的文件
      getFilesInDirectory(filePath, fileList, basePath);
    } else {
      fileList.push({ file: filePath, relativePath: path.relative(basePath, filePath) });
    }
  });

  return fileList;
}


/**
 * 打包文件到 zip
 * @param {Array} files 待打包的文件
 * @param {string} zipPath zip 文件路径
 */
function createZip(files, zipPath) {
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
  });

  // 监听事件，完成时输出信息
  archive.on('error', err => {
    throw err;
  });

  output.on('close', () => {
    console.log(`打包完成，生成文件：${zipPath}`);
  });

  archive.pipe(output);

  // 添加文件到压缩包
  files.forEach(item => {
    if (item.file) {
      archive.file(item.file, { name: item.relativePath });
    } else if (item.dir) {
      // 对于目录，确保目录结构存在
      archive.directory(item.dir, item.relativePath);
    }
  });

  // 完成压缩
  archive.finalize();
}


/**
 * 修改文件后缀
 * @param {string} oldPath 原文件路径
 * @param {string} newExt 新扩展名
 */
function renameFileExtension(oldPath, newExt) {
  const newPath = oldPath.replace(/\.zip$/, newExt);
  fs.renameSync(oldPath, newPath);
  console.log(`文件重命名为：${newPath}`);
}

/**
 * 生成带有日期（MM-DD）和时间戳的文件名
 * @returns {string} 生成的文件名
 */
function generateFileName() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，+1
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = Date.now(); // 当前时间戳
  return `${month}-${day}_${timestamp}.zip`; // 格式：MM-DD_时间戳.zip
}
// 主函数
function main() {
  // 提取文件
  extractPageSchema(data)

  const zipFilePath = `${SKETCH_FILES_OUTPUT}/${generateFileName()}`;  // 输出的 zip 文件路径

  // 获取目录下的所有文件
  const files = getFilesInDirectory(SKETCH_PROJECT_TEMPLATE_DIR,[], SKETCH_PROJECT_TEMPLATE_DIR);
  
  if (files.length === 0) {
    console.log('没有文件可以打包');
    return;
  }

  // 创建 zip 文件并重命名
  createZip(files, zipFilePath);
  
  // 等待 zip 文件打包完成后重命名为 .sketch
  setTimeout(() => {
    renameFileExtension(zipFilePath, '.sketch');
  }, 2000); // 等待 2 秒，确保 zip 文件已生成
}


main()