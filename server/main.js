require('@babel/register')({
  presets: [
    '@babel/preset-env'
  ]
})

const { resolve } = require('path')
const { fork } = require('child_process')
const chokidar = require('chokidar')

const config = require('./config').default

const upload_zip_process = fork('./worker.js')

const { services_deploy_directory, services_entry } = config
if (services_deploy_directory) {
  const service_entry_script = resolve(
    services_deploy_directory, services_entry)
  let service_process = fork(service_entry_script)
  const watcher = chokidar.watch(services_deploy_directory, {
    awaitWriteFinish: true // 等到拷贝的文件写入完成之后再触发回调，使得文件拷贝过程中只触发一次回调
  })

  watcher.on('change', (path) => {
    console.log('change path: ' + path)
    service_process.kill('SIGKILL')
    console.log('detect files change, restarting service...')
    service_process = fork(service_entry_script)
    console.log('restart service successfully')
  })
}
