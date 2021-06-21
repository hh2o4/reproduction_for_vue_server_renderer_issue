// server.js
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { createBundleRenderer } = require('vue-server-renderer');

const server = require('express')();
let renderer;

const templatePath = './src/index.template.html';
const template = fs.readFileSync(path.resolve(templatePath), 'utf-8');

function createRenderer(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(
    bundle,
    {
      ...options,
      template,
      runInNewContext: false,
    }
  );
}
let readyPromiseFunc = require('./build/setup-dev-server.js');
let readyPromise = readyPromiseFunc(server, (bundle, options) => {
  renderer = createRenderer(bundle, options);
});

server.get('*', (req, res) => {
  const context = { url: req.url }
  readyPromise.then(() => {
    renderer.renderToString(context, (err, html) => {
      res.send(html)
    })
  });
});

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
