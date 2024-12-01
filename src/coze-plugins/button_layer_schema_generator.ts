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
  const {
    position,
    size,
    gradient,
    shadow,
    borderRadius,
    textContent,
    textColor,
    fontSize,
    fontName
  } = input;

  const [x, y] = position.split(',').map(i => Number(i));
  const [width, height] = size.split(',').map(i => Number(i));
  const [fromColor, toColor, angle] = gradient.split('|'); // 例如 "255,255,255,100|0,0,0,100|90"
  const [shadowX, shadowY, shadowBlur, shadowSpread, shadowColor] = shadow.split('|'); // 例如 "0|5|10|0|0,0,0,40"

  // 生成随机的 do_objectID
  const generateUUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  // 构建按钮的形状图层（背景）
  const buttonBackground = {
    _class: 'shapePath',
    do_objectID: generateUUID(),
    name: 'Button Background',
    frame: {
      _class: 'rect',
      x: parseFloat(x),
      y: parseFloat(y),
      width: parseFloat(width),
      height: parseFloat(height)
    },
    style: {
      _class: 'style',
      fills: [
        {
          _class: 'fill',
          isEnabled: true,
          fillType: 1, // 渐变
          gradient: {
            _class: 'gradient',
            gradientType: 0, // 线性渐变
            from: `{0.5, 0}`,
            to: `{0.5, 1}`,
            stops: [
              {
                _class: 'gradientStop',
                position: 0,
                color: {
                  _class: 'color',
                  red: parseInt(fromColor.split(',')[0]) / 255,
                  green: parseInt(fromColor.split(',')[1]) / 255,
                  blue: parseInt(fromColor.split(',')[2]) / 255,
                  alpha: parseInt(fromColor.split(',')[3]) / 100,
                }
              },
              {
                _class: 'gradientStop',
                position: 1,
                color: {
                  _class: 'color',
                  red: parseInt(toColor.split(',')[0]) / 255,
                  green: parseInt(toColor.split(',')[1]) / 255,
                  blue: parseInt(toColor.split(',')[2]) / 255,
                  alpha: parseInt(toColor.split(',')[3]) / 100,
                }
              }
            ]
          }
        }
      ],
      shadows: [
        {
          _class: 'shadow',
          isEnabled: true,
          blurRadius: parseFloat(shadowBlur),
          offsetX: parseFloat(shadowX),
          offsetY: parseFloat(shadowY),
          spread: parseFloat(shadowSpread),
          color: {
            _class: 'color',
            red: parseInt(shadowColor.split(',')[0]) / 255,
            green: parseInt(shadowColor.split(',')[1]) / 255,
            blue: parseInt(shadowColor.split(',')[2]) / 255,
            alpha: parseFloat(shadowColor.split(',')[3])/100
          }
        }
      ]
    },
    fixedRadius: parseFloat(borderRadius)
  };

  // 构建按钮的文本图层
  const buttonText = {
    _class: 'text',
    do_objectID: generateUUID(),
    name: 'Button Text',
    frame: {
      _class: 'rect',
      x: x + width / 4,
      y: y + height / 4,
      width: width / 2,
      height: height / 2
    },
    style: {
      _class: 'style',
      textStyle: {
        _class: 'textStyle',
        encodedAttributes: {
          MSAttributedStringFontAttribute: {
            _class: 'fontDescriptor',
            attributes: {
              name: fontName,
              size: fontSize
            }
          },
          MSAttributedStringColorAttribute: {
            _class: 'color',
            red: parseInt(textColor.split(',')[0]) / 255,
            green: parseInt(textColor.split(',')[1]) / 255,
            blue: parseInt(textColor.split(',')[2]) / 255,
            alpha: parseInt(textColor.split(',')[3]) / 100,
          }
        }
      }
    },
    attributedString: {
      _class: 'attributedString',
      string: textContent,
      attributes: [
        {
          _class: 'stringAttribute',
          location: 0,
          length: textContent.length,
          attributes: {
            MSAttributedStringFontAttribute: {
              _class: 'fontDescriptor',
              attributes: {
                name: fontName,
                size: parseFloat(fontSize)
              }
            },
            MSAttributedStringColorAttribute: {
              _class: 'color',
              red: parseInt(textColor.split(',')[0]) / 255,
              green: parseInt(textColor.split(',')[1]) / 255,
              blue: parseInt(textColor.split(',')[2]) / 255,
              alpha: parseInt(textColor.split(',')[3]) / 100,
            }
          }
        }
      ]
    }
  };

  // 打印日志
  logger.info('Generated button layers:', { buttonBackground, buttonText });

  // 返回生成的按钮图层
  return {
    layers: [buttonText, buttonBackground]
  };
};
