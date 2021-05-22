---
title: DJI大疆PPK后差分处理文件导入像控预处理
top: false
cover: false
toc: false
mathjax: false
comment: true
date: 2020-09-22 19:08:38
author:
keywords:
img:
coverImg:
password:
summary:
categories:
  - tools
tags:
  - tools
---

{% raw %}

  <style lang="text/css">
      * {
        margin: 0;
        padding: 0;
        font-family: 'Avenir Next', 'Helvetica Neue', sans-serif, Arial,
        'Source Sans Pro', -apple-system, Roboto, BlinkMacSystemFont, 'Segoe UI' !important;
        font-size: 16px;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
        color: #000;
      }

      .container{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        flex-direction: column;
      }
      .prefix{
        width: 100%;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        /* background-color: aquamarine; */
      }
      .prefix p {
        padding: 5px;
        font-size: medium;
        font-weight: bold;
      }
      .file{
        width: 100%;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        /* background-color: bisque; */
      }
      .file p {
        margin-top: 20px;
        padding: 5px;
        font-size: medium;
        font-weight: bold;
      }
    </style>

  <div class="container">
      <div class="prefix">
        <p>影像文件名前缀</p>
        <input id="prefix" name="prefix" type="text" />
      </div>
      <div class="file">
        <p>选择大疆PPK原始文件[result.csv]</p>
        <input accept=".csv" id="contained" name="csvfile" type="file" />
      </div>
  </div>

  <script>
      function handleUpload(e) {
        var file = e.target.files[0]
        fileReader.readAsText(file)
      }

      function handleCsv(csv) {
        let lines = csv.split(/[\n]/)
        let count = lines.length
        let output = []
        let prefix = document.querySelector('#prefix').value

        for (let i = 1; i < count; i++) {
          let line = lines[i]
          if (line === '' || line === null || line === undefined) {
            break
          }
          let datas = line.split(',')
          let id = datas[0]
          let latitude = datas[3]
          let longitude = datas[4]
          let height = datas[5]
          let Q = datas[9]
          if (Q !== '50') {
            alert('Some data not fixed!')
          }
          output.push(id)
          output.push(',')
          output.push(latitude)
          output.push(',')
          output.push(longitude)
          output.push(',')
          output.push(height)
          output.push(',')
          output.push(prefix)
          output.push(id.padStart(4, '0'))
          output.push('.JPG')
          output.push('\r\n')
        }
        return output.join('')
      }

      function saveFile(data, filename) {
        var file = new Blob([data])
        console.log(file)
        if (window.navigator.msSaveOrOpenBlob) {
          // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename)
        } else {
          // Others
          var a = document.createElement('a'),
            url = URL.createObjectURL(file)
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          setTimeout(function () {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          }, 0)
        }
      }

      let fileReader = new FileReader()
      fileReader.onload = function () {
        let result = this.result
        let newCsv = handleCsv(result)

        let nowDate = new Date()
        let year = nowDate.getFullYear()
        let month = (nowDate.getMonth() + 1).toString().padStart(2, '0')
        let day = nowDate.getDate().toString().padStart(2, '0')
        let dateStr = year + '-' + month + '-' + day

        saveFile(newCsv, 'result_JTEdited' + dateStr + '.csv')
      }

      let contained = document.querySelector('#contained')
      contained.addEventListener('change', handleUpload)
  </script>

{% endraw %}

显示效果不好，点击下面打开单独的网页

[独立网页的版本](/html/ppk/)

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
