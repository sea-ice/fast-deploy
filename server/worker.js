require('@babel/register')({
  presets: [
    '@babel/preset-env'
  ]
})

const { resolve } = require('path')
const { createReadStream, createWriteStream } = require('fs')
const { createServer } = require('http')
const unzip = require('node-unzip-2')

const config = require('./config').default
const { formatDate } = require('./utils')

// const tmp_directory = resolve(__dirname, './tmp')
const deploy_processing = {}
const upload_queues = []

const server = createServer((req, res) => {
  // req为http.IncomingMessage类型
  switch (req.url) {
    case '/upload_zipped_files':
      const { headers } = req
      const deploy_directory = headers['x-deploy-directory']
      console.log(deploy_directory)
      if (deploy_processing[deploy_directory]) {
        let response = { code: 1000, message: 'deploy task is running' }
        res.end(JSON.stringify(response))
        return
      }
      deploy_processing[deploy_directory] = true

      // const zip_filename = `${formatDate(new Date)}_${Math.random().toString(36).substr(2, 8)}.zip`
      const unzip_output = unzip.Extract({ path: deploy_directory })
      req.on('error', err => res.end(
        JSON.stringify({ code: 1001, message: 'deploy error' })))
      unzip_output.on('error', err => { console.log(err) })
      unzip_output.on('close', () => {
        console.log('unzip done!')
        deploy_processing[deploy_directory] = false
        res.end(JSON.stringify({ code: 0 }))
      })

      req.pipe(unzip_output)
      break
    default: break
  }
})

server.listen({ port: config.upload_service_port }, err => {
  if (err) {
    console.log('server start error!')
    return
  }
  console.log(`server has listened on port ${config.upload_service_port}!`)
})

