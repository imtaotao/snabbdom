const fs = require('fs')
const gaze = require('gaze')

function add (filepath) {
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) throw err
    if (!data.match(/import .* from/g)) return
    let newData = data.replace(/(import .* from\s+['"])(.*)(?=['"])/g, '$1$2.js')

    fs.writeFile(filepath, newData, (err) => {
      if (err) throw err
      console.log('complete: ' + filepath)
    })
  })
}

// 监视编译后的文件，然后给补上 .js 后缀
gaze('./es/*.js', (err, watcher) => {
  if (err) throw err
  watcher.on('added', filepath => add(filepath))
  watcher.on('changed', filepath => add(filepath))
})

// 运行编译 tsc 命令
require('child_process').exec('yarn dev')