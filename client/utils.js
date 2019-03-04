import archiver from 'archiver'
import path from 'path'
import { request } from 'http'
import config from './config'
import { createWriteStream } from 'fs'

// node提供的zlib模块无法压缩文件夹
export function zip_and_upload_resources(resources_path, deploy_directory) {
  let buffers = []
  const basename = path.basename(resources_path)
  const archive = archiver('zip', {
    zlib: { level: 4 }
  })

  archive.on('data', chunk => {
    buffers.push(chunk) // chunk为Buffer类型
  })
  archive.on('end', () => {
    console.log('zip done!')
    upload_files(buffers, deploy_directory)
  })

  archive.directory(resources_path, basename)
  archive.finalize()
}

export function formatDate(date) {
  return [
    date.getFullYear(), fixNumber(date.getMonth() + 1),
    fixNumber(date.getDate()), fixNumber(date.getHours()),
    fixNumber(date.getMinutes()), fixNumber(date.getSeconds())
  ].join('_')
}

export function fixNumber(num, fix = 2) {
  return num < 10 ? `0${num}` : '' + num
}

function upload_files(buffers, deploy_directory) {
  const { server_address, upload_service_port } = config
  const req = request(
    `${server_address}:${upload_service_port}/upload_zipped_files`, {
      method: 'POST',
  })

  req.on('error', err => console.log(`upload files error: ${err}`))
  req.on('response', res => {
    get_response_json(res).then(
      res => console.log(res)
    ).catch(err => console.log(err))
  })
  console.log('header X-Deploy-Directory:' + deploy_directory)
  req.setHeader('X-Deploy-Directory', deploy_directory.replace(/\\/g, '/'))
  req.write(Buffer.concat(buffers))
  req.end()
}

function get_response_json(res) {
  return new Promise((resolve, reject) => {
    let json = ''
    res.setEncoding('utf-8')
    res.on('data', chunk => json += chunk)
    res.on('end', () => {
      try { json = JSON.parse(json) } catch {
        reject(new Error('response is not in json format'))
      }
      resolve(json)
    })
    res.on('error', err => reject(err))
  })
}