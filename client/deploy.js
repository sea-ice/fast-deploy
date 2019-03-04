require('@babel/register')({
  presets: [
    '@babel/preset-env'
  ]
})

const config = require('./config').default
const { zip_and_upload_resources } = require('./utils')

const {
  fe_resources_path,
  fe_resources_deploy_directory,
  services_path,
  services_deploy_directory
} = config

if (
  fe_resources_path &&
  fe_resources_deploy_directory
) zip_and_upload_resources(fe_resources_path, fe_resources_deploy_directory)
if (
  services_path &&
  services_deploy_directory
) zip_and_upload_resources(services_path, services_deploy_directory)





