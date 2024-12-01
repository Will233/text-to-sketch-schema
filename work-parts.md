Demo拆分方案：
模块1：用户输入 & 文本解析
目标： 从用户的文本需求中提取关键信息，生成结构化的设计需求。
工具： OpenAI/ChatGPT API 或 LangChain
任务：

收集需求：

设计一个简单的前端（如HTML表单）用于接收用户输入的设计需求（如“创建一个助农主题页面，包括头图、农产品展示、优惠券按钮”）。
文本解析 & 需求抽取：

使用 ChatGPT API 或 LangChain 从输入文本中抽取关键要素，如：
页面结构（头图、商品列表、按钮）。
UI 组件的大小、位置。
色彩主题或字体风格。
将这些信息转为一个初步的结构化需求。
示例输出：需求JSON

json
复制代码
{
  "header": {
    "text": "助农活动",
    "fontSize": 48,
    "alignment": "center"
  },
  "productList": [
    {"name": "大米", "price": "¥29"},
    {"name": "苹果", "price": "¥15"}
  ],
  "button": {
    "text": "领取优惠券",
    "color": "#FF6347",
    "position": "bottom"
  }
}
模块2：将结构化需求转为 Sketch JSON Schema
目标： 将需求JSON转换为Sketch所需的JSON Schema，符合.sketch文件格式。
工具： 使用 Python 或 Node.js，结合 Sketch JSON 模板。

任务：

创建基础的Sketch JSON模板：

准备一个简单的页面模板，包含头图、商品展示、按钮等基本组件。
模板文件结构：
bash
复制代码
/pages
  - page_1.json
document.json
meta.json
生成动态页面层级结构：

根据用户需求动态填充 page_1.json，生成如下结构：

json
复制代码
{
  "_class": "page",
  "do_objectID": "PAGE-001",
  "name": "助农活动",
  "layers": [
    {
      "_class": "artboard",
      "do_objectID": "ARTBOARD-001",
      "name": "活动页面",
      "frame": { "x": 0, "y": 0, "width": 750, "height": 1200 },
      "layers": [
        {
          "_class": "text",
          "do_objectID": "HEADER-TITLE-001",
          "name": "标题",
          "frame": { "x": 50, "y": 100, "width": 650, "height": 80 },
          "attributedString": {
            "string": "金秋收获季·助农直供"
          }
        }
      ]
    }
  ]
}
自动化打包为 .sketch 文件：

将所有 JSON 文件压缩为 ZIP 包并重命名为 .sketch。
Python 代码示例：
python
复制代码
import json
import zipfile
import os

def save_as_sketch(json_data, output_path="output.sketch"):
    # 将 JSON 文件保存到 pages 目录
    os.makedirs("pages", exist_ok=True)
    with open("pages/page_1.json", "w") as f:
        json.dump(json_data, f)

    # 创建 meta.json 和 document.json（示例内容）
    with open("meta.json", "w") as f:
        f.write('{"version": 135, "compatibilityVersion": 109}')
    with open("document.json", "w") as f:
        f.write('{"pages": [{"_ref": "pages/page_1.json"}]}')

    # 打包为 ZIP 文件并重命名为 .sketch
    with zipfile.ZipFile(output_path, "w") as zf:
        zf.write("meta.json")
        zf.write("document.json")
        zf.write("pages/page_1.json")

# 示例调用
demo_data = { "header": { "text": "助农活动", "fontSize": 48 } }
save_as_sketch(demo_data)
模块3：利用 LLM 优化设计布局
目标： 基于初步生成的 Sketch JSON 文件，提供进一步的智能布局和美学建议。
工具： OpenAI API，React/HTML 页面展示效果。

任务：

分析布局问题：

使用大语言模型（LLM）检查 JSON Schema 是否符合常见的设计规范（如元素对齐、色彩搭配）。
生成优化建议：

使用 ChatGPT 生成可改进方案，如：
改善按钮位置，避免遮挡关键内容。
提供配色方案建议。
示例交互：

在 Web 前端显示设计效果，用户可以手动微调布局。
用户调整后，将新参数回传给 LLM 进行最终优化。
模块4：集成前端预览与用户反馈
目标： 将生成的 Sketch 文件在前端展示，并允许用户直接预览或调整。

任务：

搭建简单的前端界面（React/HTML）：

实现文件上传与预览功能。
用户可以上传生成的 .sketch 文件并查看布局效果。
提供下载与修改功能：

用户满意后，可以下载最终的 .sketch 文件或将其进一步导出为 HTML/CSS/JS。
Demo 开发的时间与任务安排
任务	预计时间	参与角色
搭建用户输入界面	1 天	前端工程师
实现文本解析与需求提取	2 天	后端开发/AI 工程师
编写 Sketch JSON 生成逻辑	2 天	后端开发工程师
打包并生成 .sketch 文件	1 天	后端开发工程师
实现 LLM 优化与建议生成	2 天	AI 工程师
前端预览与用户反馈功能开发	3 天	前端工程师
总结：
通过以上模块化拆分，你可以逐步完成从文本到设计稿的生成流程。核心工作包括：

文本需求的解析与抽取（使用 ChatGPT）。
动态生成符合 Sketch 格式的 JSON Schema。
利用 LLM 优化设计布局和结构。
这种方式不仅能快速生成 Demo，也能为后续扩展打下良好的基础。




生成格式:
<description>生成的描述</description>
<tips>提示</tips>
<content>生成的json 内容</content>




文生 svg 用户prompt


你是一位专业的 UI/UX 设计生成助手，根据用户提供的设计需求生成 SVG 格式的线框原型设计稿。输出格式为 JSON 对象，包含 `svg`、`info` 和 `theme` 字段。

**输出格式**：
```json
{
  "svg": "<svg>...</svg>",
  "info": "内容描述",
  "theme": "主题"
}
用户需求： 适配 iPhone 14（390x844）的保险营销海报。

顶部放置产品名称（大字体）。
下方区域为四个产品亮点（用文本表示）。
中间是产品图片占位。
底部包含公司名称和二维码占位符。
背景色浅灰，文字深灰，按钮蓝色。 主题：保险营销海报