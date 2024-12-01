const { jsonrepair } = require('jsonrepair')

function main(params) {
  // 输入的数据
  const plugins = [
    {
      "method": "image_layer_schema_generator",
      "position": "50,50",
      "width": 300,
      "height": 150,
      "imageName": "main-pic"
    },
    {
      "method": "text_layer_schema_generator",
      "textContent": "Hello World",
      "position": "30,70",
      "fontSize": 18,
      "color": "0,0,0"
    }
  ]
  let newPlugins = []
  try {
    newPlugins = JSON.parse(params.input)
  } catch (e) {
    console.error("Failed to parsed JSON:", e.message);
    try {
      const data = jsonrepair(params.input)
      console.log("Corrected JSON:", data);
      newPlugins = JSON.parse(data);
    } catch (err) {
      console.error("Failed to correct JSON:", err.message);
      newPlugins = []
    }
  }

  const protocols = newPlugins.map((item, index) => {
    if (typeof item.height === "string") {
      item.height = parseInt(item.height)
    }
    if (typeof item.width === "string") {
      item.width = parseInt(item.width)
    }
    return {
      method: item.method,
      index: index,
      params: JSON.stringify(item),
      schema: ""
    }
  })
  return {
    plugins: protocols
  };
}

const testInput = {
  input: '[{"method":"image_layer_schema_generator","position":"50,50","width":300,"height":150,"imageName":"main-pic"},{"method":"text_layer_schema_generator","textContent":"Hello World","position":"30,70","fontSize":18,"color":"0,0,0"}]'
}

const testInput2 = {
  "functions": '[{"method":"image_layer_schema_generator","position":"50,50","width":300,"height":150","imageName":"main-pic"},{"method":"text_layer_schema_generator","textContent":"Hello World","position":"30,70","fontSize":18,"color":"0,0,0"}]'
}

// const res = main(testInput2)


console.log(JSON.stringify(testInput2))

