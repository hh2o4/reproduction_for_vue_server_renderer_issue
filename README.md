## Build Setup

**Requires Node.js 8+**

``` bash
# install dependencies
yarn install

# serve in dev mode, with hot reload at localhost:8080
yarn dev
```
## Reproduction Steps

1. Do the build setup above.
2. To see the output in console, and you will see there's a warning like the image below:
![vue-server-renderer-warning](https://user-images.githubusercontent.com/20169617/122743548-aab98600-d2b9-11eb-81c2-ffa97e288895.png)
 
3. Check the code in node_modules/vue-server-renderer/server-plugin.js, to see line 24(like the image below), you can find that logic to verify version of webpack is not proper, because both [webpack4](https://v4.webpack.js.org/configuration/output/#outputlibrary) and [webpack5](https://webpack.js.org/configuration/output/#outputlibrary) has `output.library` in config, it can not simply say Webpack >= 5.0.0 if `ouput.library` is in config.
![vue-server-renderer-code](https://user-images.githubusercontent.com/20169617/122745286-6dee8e80-d2bb-11eb-8cd5-1aaef7b7341d.png)
  
