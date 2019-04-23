var path = require('path');
var webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const config = {
  entry: {
    app: ['./src/app.js', './src/scss/app.scss'],
    vendors: './src/vendors.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build/js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      filename:  "vendors.js"
    }),
    new ExtractTextPlugin({
      filename:  '../css/app.css',
      allChunks: true
    })
  ],
  module: {
    rules: [
      {
  	test: /\.(jpe?g|png|gif)$/i,   //to support eg. background-image property 
  	loader:"file-loader",
  	query:{
          name:'[name].[ext]',
          outputPath:'images/'
          //the images will be emmited to public/assets/images/ folder 
          //the images will be put in the DOM <style> tag as eg. background: url(assets/images/image.png); 
  	}
      },
      {
  	test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,    //to support @font-face rule 
  	loader: "url-loader",
  	query:{
          limit:'10000',
          name:'[name].[ext]',
          outputPath:'fonts/'
          //the fonts will be emmited to public/assets/fonts/ folder 
          //the fonts will be put in the DOM <style> tag as eg. @font-face{ src:url(assets/fonts/font.ttf); }  
  	}
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  }
};

module.exports = config;
