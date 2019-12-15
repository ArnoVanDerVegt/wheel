/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.removeEmptyStrings = function(array) {
    let i = 0;
    while (i < array.length) {
        if (array[i] === '') {
            array.splice(i, 1);
        } else {
            i++;
        }
    }
    return array;
};

exports.addNewItem = function(array, item) {
    if (array.indexOf(item) === -1) {
        array.push(item);
    }
};

exports.forEachKey = function(object, callback) {
    for (let key in object) {
        callback(key);
    }
};

exports.sanitizeString = function(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};
