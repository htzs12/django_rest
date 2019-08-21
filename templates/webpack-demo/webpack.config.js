// 这个配置文件,通过node中的模块操作,向外暴露了一个配置对象.

const path = require('path');

const webpack = require('webpack');

const htmlwebpackplugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, './src/main.js'), // 入口,表示要使用webpack打包哪个文件
    output: {
        path: path.join(__dirname, './dist'), // 指定打包好的文件,输入到哪个目录中去
        filename: 'bundle.js', // 这里指定 输出的文件名,.
    },
    plugins: [ // 配置插件的节点
        new htmlwebpackplugin({
            // 创建一个内存中生成html页面
            template: path.join(__dirname, './src/index.html'),
            filename: 'index123.html'
        })
    ],
    module: { // 这个节点,配置所有第三方模块的加载器
        rules: [
            // 匹配规则
            {test: /\.css$/, use: ['style-loader', 'css-loader']}, // 用户配置css文件规则
            {test: /\.(jpg|png|gif|jpeg|bmp)$/, use: 'url-loader'}, // 用户配置css样式background图片规则 (url-loader?limit=1024 可配置大小)
            {test:/\.js$/, use: 'babel-loader', exclude: /node_modules/}, // 配置babel来转化es6高级语法
        ]
    }
};
