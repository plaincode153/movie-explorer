import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
    mode: "development",
    dotenv: true,
    entry: {
        index: "./src/index.js",
        details: "./src/details.js",
    }, devtool: "eval-source-map",

    output: {
        filename: "[name].js",
        path: path.resolve(import.meta.dirname, "dist"),
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/details.html",
            filename: "details.html",
            chunks: ["details"],
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.svg$/i,
                type: "asset/resource",
            },
        ],
    },
    devServer: {
        watchFiles:
            ["./src/index.html", "./src/details.html"]
    },
};
