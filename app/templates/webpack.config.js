var path = require('path');
module.exports = {
    entry: './source/javascript/app.js',
    output: {
        path: __dirname,
        filename: 'public/javascript/main.js'
    },
    module: {
        loaders: [
            { loader: 'babel-loader' }
        ]
    }
};
