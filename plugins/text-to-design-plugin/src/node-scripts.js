const fs = require('fs');
const path = require('path');

// 定义要创建的文件和目录
const structure = {
  'document.json': {
    content: JSON.stringify({
      // 添加您的 document.json 结构
      _class: "document",
      pages: []
    }, null, 2) // 格式化 JSON
  },
  'meta.json': {
    content: JSON.stringify({
      // 添加您的 meta.json 结构
      _class: "meta",
      version: "1.0.0"
    }, null, 2)
  },
  'user.json': {
    content: JSON.stringify({
      // 添加您的 user.json 结构
      _class: "user",
      name: "用户名称",
      email: "user@example.com"
    }, null, 2)
  },
  'pages': {},
  'previews': {}
};

// 创建目录和文件
function createStructure(basePath, structure) {
  for (const [name, value] of Object.entries(structure)) {
    const filePath = path.join(basePath, name);

    if (value.content) {
      // 如果有内容，则创建文件并写入
      fs.writeFileSync(filePath, value.content);
      console.log(`Created file: ${filePath}`);
    } else {
      // 否则创建目录
      fs.mkdirSync(filePath, { recursive: true });
      console.log(`Created directory: ${filePath}`);
    }
  }
}

// 检查 JSON 文件是否合法
function validateJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    JSON.parse(data); // 尝试解析 JSON
    console.log(`Valid JSON: ${filePath}`);
  } catch (error) {
    console.error(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

// 检查指定目录中的所有 JSON 文件
function validateJSONFilesInDirectory(directory) {
  const files = fs.readdirSync(directory);
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && path.extname(file) === '.json') {
      validateJSONFile(filePath);
    } else if (stat.isDirectory()) {
      validateJSONFilesInDirectory(filePath); // 递归检查子目录
    }
  });
}


function main() {
  // 运行创建结构的函数
  createStructure(path.resolve(__dirname, '../sketch-projects'), structure);

  validateJSONFilesInDirectory(path.resolve(__dirname, '../sketch-projects'));
}

// run main function
main()
