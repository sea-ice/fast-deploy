import { resolve } from 'path'

const services_deploy_directory = resolve(__dirname, './tmp/server')

export default {
  services_deploy_directory,
  services_entry: 'server.bundle.js' || 'index.js',
  upload_service_port: 8000
}