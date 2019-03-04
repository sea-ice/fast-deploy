import { resolve } from 'path'

const base_directory = 'F:/fe/seaice-blog/build'
const deploy_base_directory = resolve(__dirname, '../server/tmp')

export default {
  fe_resources_path: resolve(base_directory, './client'),
  services_path: resolve(base_directory, './server'),
  server_address: 'http://localhost',
  upload_service_port: 8000,
  fe_resources_deploy_directory: deploy_base_directory,
  services_deploy_directory: deploy_base_directory,
}