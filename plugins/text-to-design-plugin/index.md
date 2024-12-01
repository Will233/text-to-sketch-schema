```bash
#!/bin/sh

SKETCH=$(mdfind kMDItemCFBundleIdentifier=='com.bohemiancoding.sketch3' | head -n 1)

# pass on all given arguments
"$SKETCH/Contents/MacOS/sketchtool" "$@"

```

## 使用sketchtool 检查格式
```bash
 /Applications/Sketch.app/Contents/MacOS/sketchtool export --output=schemas/model-1015.json 大模型通赛平台-支持本地化.sketch
```

## 打包命令
```bash
/Applications/Sketch.app/Contents/MacOS/sketchtool create --output=demo1.sketch document.json meta.json pages/page_01.json
```

## RAG data 


## 