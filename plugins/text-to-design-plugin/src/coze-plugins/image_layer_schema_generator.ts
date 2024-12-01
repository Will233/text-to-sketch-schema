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
  const { position , width, height, imageName, imageRef } = input;
  const [xPosition, yPosition] = position.split(",").map(Number);
  // 生成随机的 do_objectID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 生成 Sketch JSON Schema
  const schema = {
    _class: "bitmap",
    do_objectID: generateUUID(),
    booleanOperation: -1,
    isFixedToViewport: false,
    isFlippedHorizontal: false,
    isFlippedVertical: false,
    isLocked: false,
    isTemplate: false,
    isVisible: true,
    hasCustomPrototypeVisibility: false,
    prototypeVisibility: 1,
    prototypeVisibilityTrigger: 2,
    layerListExpandedType: 1,
    name: imageName || "main-pic",
    nameIsFixed: true,
    resizingConstraint: 63,
    resizingType: 0,
    rotation: 0,
    shouldBreakMaskChain: false,
    exportOptions: {
      _class: "exportOptions",
      includedLayerIds: [],
      layerOptions: 0,
      shouldTrim: false,
      exportFormats: []
    },
    frame: {
      _class: "rect",
      constrainProportions: true,
      x: xPosition,
      y: yPosition,
      width: width,
      height: height
    },
    clippingMaskMode: 0,
    hasClippingMask: false,
    prototypeScrolling: 0,
    style: {
      _class: "style",
      do_objectID: generateUUID(),
      endMarkerType: 0,
      miterLimit: 10,
      startMarkerType: 0,
      windingRule: 1,
      blur: {
        _class: "blur",
        isEnabled: false,
        center: "{0.5, 0.5}",
        motionAngle: 0,
        radius: 10,
        saturation: 1,
        type: 0
      },
      borderOptions: {
        _class: "borderOptions",
        isEnabled: true,
        dashPattern: [],
        lineCapStyle: 0,
        lineJoinStyle: 0
      },
      borders: [],
      colorControls: {
        _class: "colorControls",
        isEnabled: false,
        brightness: 0,
        contrast: 1,
        hue: 0,
        saturation: 1
      },
      contextSettings: {
        _class: "graphicsContextSettings",
        blendMode: 0,
        opacity: 1
      },
      fills: [],
      innerShadows: [],
      shadows: []
    },
    clippingMask: "{{0, 0}, {1, 1}}",
    fillReplacesImage: false,
    image: {
      _class: "MSJSONFileReference",
      _ref_class: "MSImageData",
      _ref: `images/${imageRef}`
    },
    intendedDPI: 72,
    topLeftCornerRadius: 0,
    topRightCornerRadius: 0,
    bottomRightCornerRadius: 0,
    bottomLeftCornerRadius: 0,
    cornerRadiusBehavior: 1,
    cornerStyle: 0
  };

  // 打印日志
  logger.info("Generated image schema:", schema);

  // 返回生成的 Sketch JSON Schema
  return {
    schema: JSON.stringify(schema, null, 2)
  };
};
