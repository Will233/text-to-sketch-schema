/**
 * Each file needs to export a function named `handler`. This function is the entrance to the Tool.
 * @param {Object} args.input - input parameters, you can get test input value by input.xxx.
 * @param {Object} args.logger - logger instance used to print logs, injected by runtime
 * @returns {*} The return data of the function, which should match the declared output parameters.
 * 
 * Remember to fill in input/output in Metadata, it helps LLM to recognize and use tool.
 */

export async function handler({ input, logger }: Args<Input>): Promise<Output> {
  // 解构输入参数
  const { textContent, xPosition, yPosition, fontName, fontSize, red, green, blue } = input;

  // 生成随机的 do_objectID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 计算文本长度
  const textLength = textContent.length;

  // 生成 Sketch JSON Schema
  const schema = {
    _class: "text",
    do_objectID: generateUUID(),
    name: textContent,
    frame: {
      _class: "rect",
      x: xPosition,
      y: yPosition,
      width: 100, // 默认宽度
      height: 20  // 默认高度
    },
    style: {
      _class: "style",
      textStyle: {
        _class: "textStyle",
        encodedAttributes: {
          paragraphStyle: {
            _class: "paragraphStyle",
            allowsDefaultTighteningForTruncation: 0,
            alignment: 2  // 默认居中对齐
          },
          MSAttributedStringFontAttribute: {
            _class: "fontDescriptor",
            attributes: {
              name: fontName,
              size: fontSize
            }
          },
          MSAttributedStringColorAttribute: {
            _class: "color",
            red: red,
            green: green,
            blue: blue,
            alpha: 1
          },
          textStyleVerticalAlignmentKey: 0,
          kerning: 0
        },
        verticalAlignment: 0  // 顶部对齐
      }
    },
    attributedString: {
      _class: "attributedString",
      string: textContent,
      attributes: [
        {
          _class: "stringAttribute",
          location: 0,
          length: textLength,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: "fontDescriptor",
              attributes: {
                name: fontName,
                size: fontSize
              }
            },
            MSAttributedStringColorAttribute: {
              _class: "color",
              red: red,
              green: green,
              blue: blue,
              alpha: 1
            },
            kerning: 0,
            textStyleVerticalAlignmentKey: 0,
            paragraphStyle: {
              _class: "paragraphStyle",
              allowsDefaultTighteningForTruncation: 0,
              alignment: 2
            }
          }
        }
      ]
    }
  };

  // 打印日志
  logger.info("Generated schema:", schema);

  // 返回生成的 Sketch JSON Schema
  return {
    schema: JSON.stringify(schema, null, 2)
  };
};
