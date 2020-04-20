/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.MockDataProvider = class {
    getData(method, path, params, callback) {
        switch (method + ':' + path) {
            case 'post:ide/file':
                callback(JSON.stringify({
                    success: true,
                    data:    {wfrm: JSON.stringify({filename: params.filename})}
                }));
                break;
        }
    }
};
