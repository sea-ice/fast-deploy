# fast-deploy

To deploy your application like static resources or node.js application quickly. If you deploy node.js application, the fast-deploy server will restart your node.js application on remote server.

## config

### client config

In `client/config.js`:

```js
export default {
  fe_resources_path: path_to_your_local_resources_root_directory, // for example, `path/to/dist/` where there are index.html and some static resources under dist/
  services_path: path_to_your_local_server_root_directory, // the local root directory of your backend application(Node.js or others) you want to deploy
  server_address: 'http://localhost', // the domain or IP of your remote server
  upload_service_port: 8000, // port for upload files to your remote server
  fe_resources_deploy_directory: fe_resouces_deploy_directory_on_remote_server,
  services_deploy_directory: node_application_deploy_directory_on_remote_server,
}
```

### server config

In `server/config.js`:

```js
export default {
  services_deploy_directory, // same as `services_deploy_directory` in client/config.js
  services_entry: 'index.js', // the entry file of your node.js application
  upload_service_port: 8000 // same as `upload_service_port` in client/config.js
}
```

### license

MIT