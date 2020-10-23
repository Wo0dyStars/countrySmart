const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const fse = require("fs-extra");

class CopyRemainingFiles {
	apply(compiler) {
		compiler.hooks.done.tap('Copy files', function() {
            fse.copySync('./css/external', './dist/css/external');
            fse.copySync('./js/external', './dist/js/external');
            fse.copySync('./php', './dist/php');
            fse.copySync('./public', './dist/public');
		});
	}
}

module.exports = {
    entry: './js/index.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader?url=false'
                    },
                    { 
                        loader: "postcss-loader", 
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require("postcss-import"),
                                    require("autoprefixer"),
                                    require("cssnano")
                                ]
                            }
                        } 
                    }
                    
                ]
            }
        ]
    },
    optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: 'styles.[chunkhash].css' }),
        new HtmlWebpackPlugin({ template: "./index.html", minify: false }),
        new CopyRemainingFiles()
    ]
};