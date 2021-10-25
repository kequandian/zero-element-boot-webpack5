var webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist'),
        clean: true
    },
    module:{
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
              test: /\.css$/,
              use: ['style-loader','css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/samples/index.html'
        }), 
        new webpack.ProvidePlugin({
            "React": "react",
        })
    ],
    devServer: {
        port: 8000,
        hot: true,
        static: 'dist' // 如果出错，请将 contentBase 替换为 static
      },
};