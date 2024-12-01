const Ajv = require('ajv')
const schemas  = require('@sketch-hq/sketch-file-format').default
const data = require('./output/4.json').data
const data5 = require('./output/5.json')
const points = require('../local_test_files/积分区块/document.json')
const data6 = require('./output/6.json')
const data7 = require('./output/7.json')
const data8 = require('./output/8.json')
console.log(JSON.stringify(Object.keys(schemas)))

const logger = console

function validateSchema(schema, data) {
  if (!data) return {
    isValid: false,
    result: data,
    message: 'schema 为空，不合法'
  }
  const ajv = new Ajv({ strict: false}); // 创建 Ajv 实例
  try {
    // 验证数据
    console.log(typeof schema)
    // 修改正则数据
    const schemaData = schema
    // logger.info('include =>', fixedSchema.indexOf('/^{-?\d+(.\d+)?(e-\d+)?, -?\d+(.\d+)?(e-\d+)?}$'))
    const patternReplacements = {
      // 路径1 => PointString
      "^{-?\\d+(.\\d+)?(e-\\d+)?, -?\\d+(.\\d+)?(e-\\d+)?}$": "^\\{-?\\d+(.\\d+)?(e-\\d+)?, -?\\d+(.\\d+)?(e-\\d+)?\\}$",
      // 路径2  => OverrideName
      // "OverrideName": {
      //   "title": "Override Name",
      //   "description": "Defines the valid string patterns for an override name",
      //   "oneOf": [
      //       {
      //           "type": "string",
      //           "pattern": "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_stringValue$)|\\/)"
      //       },
      //       {
      //           "type": "string",
      //           "pattern": "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_symbolID$)|\\/)"
      //       },
      //       {
      //           "type": "string",
      //           "pattern": "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_image$)|\\/)"
      //       },
      //       {
      //           "type": "string",
      //           "pattern": "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_layerStyle$)|\\/)"
      //       }
      //   ],
      //   "$id": "#OverrideName"
      "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_stringValue$)|\\/)": "[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}((_stringValue$)|\\/)",
      "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_symbolID$)|\\/)": "[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}((_symbolID$)|\\/)",
      "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_image$)|\\/)": "[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}((_image$)|\\/)",
      "[0-9A-F]{8}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{4}\\-[0-9A-F]{12}((_layerStyle$)|\\/)": "[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}((_layerStyle$)|\\/)",
      // 路径2 => PointListString
      //   "PointListString": {
      //     "title": "Point List String",
      //     "description": "A string representation of a series of 2D points, in the format {{x, y}, {x,y}}.",
      //     "type": "string",
      //     "pattern": "^{(({-?\\d+(.\\d+)?, -?\\d+(.\\d+)?}, )+)?{-?\\d+(.\\d+)?, -?\\d+(.\\d+)?}}$",
      //     "$id": "#PointListString"
      // },
      "^{(({-?\\d+(.\\d+)?, -?\\d+(.\\d+)?}, )+)?{-?\\d+(.\\d+)?, -?\\d+(.\\d+)?}}$": "^\\{-?\\d+(.\\d+)?(e-\\d+)?, -?\\d+(.\\d+)?(e-\\d+)?\\}$"
    }
    const stack = [schemaData]; // 使用栈结构来避免递归

    while (stack.length > 0) {
        const current = stack.pop();
        if (current && typeof current === "object") {
            for (const [key, value] of Object.entries(current)) {
                if (key === "pattern" && typeof value === "string") {
                    // 遍历所有替换规则，匹配并替换
                    for (const [oldPattern, newPattern] of Object.entries(patternReplacements)) {
                        if (oldPattern === value) {
                          logger.info('bingo =>', value)
                          current[key] = newPattern;
                        }
                    }
                } else if (typeof value === "object") {
                    stack.push(value); // 将嵌套对象添加到栈中
                }
            }
        }
    }
    // 修复数据
    const validate = ajv.compile(schemaData);
    const valid = validate(data);
    return {
      isValid: valid,
      result: data,
      message: valid ? '通过校验' : `参数不符合 schema 格式:" + ${JSON.stringify(validate.errors)}`,
    }
  } catch(e) {
    console.error(e)
    return {
      isValid: false,
      result: data,
      message: e.message
    }
  }
}

/**
 * 从给定的数据中提取 SVG 数据
 * @param {Object} data - 包含 SVG 数据的对象
 * @returns {Object} - 提取出的 SVG 数据
 */
function extractSvgData(data) {
  return data.svg
}


function extractSchema(data) {
  const jsonStr = data.output
  return JSON.parse(jsonStr)
}
// const res = validateSchema(schemas.document, data)

// console.log(res);
const res2 = validateSchema(schemas.page, require('./output/schema-1030.json'))
console.log(res2)


// const svg = extractSvgData(data7)
// console.log(svg)


// const schema = extractSchema(data8)
// console.log(JSON.stringify(schema))