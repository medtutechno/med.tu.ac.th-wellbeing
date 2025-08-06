const { defineConfig } = require('@vue/cli-service');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,

  // ตั้งค่า publicPath ให้ตรงกับ Subdirectory บน Apache
  publicPath: '/wellbeing/',
  outputDir: 'dist',
  assetsDir: 'assets',
  productionSourceMap: false,  // ปิดการสร้าง Source Map สำหรับ Production
  filenameHashing: true,       // เปิดใช้ hashing กับไฟล์ .js และ .css

  // Enable PWA support
  pwa: {
    name: 'TU MED',
    themeColor: '#28bf7e',
    msTileColor: '#28bf7e',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  },

  // Configure webpack
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000
      }
    },
    plugins: [
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },

  // Chain webpack configuration
  chainWebpack: config => {
    // Enable source maps for development only
    if (process.env.NODE_ENV === 'development') {
      config.devtool('source-map');
    }

    // Set up image optimization
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        },
        webp: {
          quality: 75
        }
      });

    // Cache busting for assets
    if (process.env.NODE_ENV === 'production') {
      config.output.filename('assets/js/[name].[contenthash:8].js');
      config.output.chunkFilename('assets/js/[name].[contenthash:8].js');
      config.plugin('extract-css').tap(args => [{
        filename: 'assets/css/[name].[contenthash:8].css',
        chunkFilename: 'assets/css/[name].[contenthash:8].css'
      }]);
    }
  },

  // เพิ่มไฟล์ .htaccess ในโฟลเดอร์ dist สำหรับ Apache
  pluginOptions: {
    'generateHtaccess': {
      enable: true,
      contents: `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /wellbeing/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /wellbeing/index.html [L]
</IfModule>
      `
    }
  }
});
