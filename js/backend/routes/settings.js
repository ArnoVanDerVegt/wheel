/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const fs = require('fs');

exports.loadFromFile = function() {
    if (!fs.existsSync('wheel.json')) {
        return false;
    }
    try {
        let data = fs.readFileSync('wheel.json');
        return JSON.parse(data.toString());
    } catch (error) {
    }
    return false;
};

exports.loadFromLocalStorage = function() {
    try {
        let data = localStorage.getItem('WHEEL_SETTINGS');
        return JSON.parse(data.toString());
    } catch (error) {
    }
    return false;
};

exports.saveToFile = function(settings) {
    try {
        fs.writeFileSync('wheel.json', JSON.stringify(settings));
        return true;
    } catch (error) {
    }
    return false;
};

exports.saveToLocalStorage = function(settings) {
    try {
        localStorage.setItem('WHEEL_SETTINGS', JSON.stringify(settings));
        return true;
    } catch (error) {
    }
    return false;
};
