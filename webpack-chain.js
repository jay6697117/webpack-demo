const Config = require('webpack-chain');
const config = new Config();
const path = require("path");

config
    .mode("development")
    .context(path.resolve(__dirname, "./src"))
    .entry("app")
        .add("./index.js")
        .end()
    .output
        .path(path.join(process.cwd(), "lib"))
        .pathinfo(true)
        .filename("[name].[contenthash:16].[fullhash:16].[id].js")
        .chunkFilename("[id].js")
        .end()
    .set("experiments",{})
    .module
        .noParse(/babel-polyfill/)
        .rule("vue")
            .test(/\.vue$/)
            .use("vue-loader")
                .loader("vue-loader")
                .end()
            .end()
        .rule("sass")
            .test( /\.(sass|scss)$/)
            .use("style-loader")
                .loader("style-loader")
                .end()
            .use("css-loader")
                .loader("css-loader")
                .end()
            .use("postcss-loader")
                .loader("postcss-loader")
                .options( {
                    config: {
                        path: path.resolve(__dirname, "./postcss.config.js")
                    }
                })
                .end()
            .use("sass-loader")
                .loader("sass-loader")
                .end()
            .end()
        .rule("png")
            .test(/\.png$/)
            .oneOf("png-loader")
                .rule("url-loader")
                    .resourceQuery(/inline/)
                    .use("url-loader")
                        .loader("url-loader")
                        .options({
                            limit: 1024 * 1024 * 10
                        })
                        .end()
                    .end()
                .rule("file-loader")
                    .resourceQuery(/external/)
                    .use("file-loader")
                        .loader("file-loader")
                        .end()
                    .end()
                .end()
            .end()
        .end()
    .resolve
        .alias
            .set("DemoVue", path.resolve(__dirname, "./src/demo-vue.vue"))
            .end()
        .extensions
            .add(".wasm").add(".mjs").add(".js").add(".json").add(".vue")
            .end()
        .modules
            .add(path.resolve(__dirname, "src")).add("node_modules")
            .end()
        .unsafeCache(/demo-publicpath/)
        .end()
    .plugin("vue-loader-plugin")
        .use(require("vue-loader-plugin"),[])
        .end()
    .devServer
        .before((app, server, compiler)=>{
            app.get("/login",(req,res,next)=>{
                req.query.name="hello "+req.query.name;
                next();
            });
        })
        .after((app, server, compiler)=>{
            app.get("/login",(req,res,next)=>{
                res.json({msg: req.query.name});
            });
        })
        .clientLogLevel("info")
        .allowedHosts
            .add("localhost")
            .end()
        .contentBase(path.join(process.cwd(), "lib"))
        .filename(/app\.js/)
        .headers({
            'X-Custom-Foo': 'bar'
        })
        .historyApiFallback(true)
        .host("0.0.0.0")
        .port("8090")
        .hot(true)
        .set("liveReload", true)
        .open(true)
        .useLocalIp(true)
        .overlay(true)
        .end()
    .performance
        .hints("warning")
        .end();
module.exports = config.toConfig();