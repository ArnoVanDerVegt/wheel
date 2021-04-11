/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const forceWebVersion = function() {
        return (typeof document === 'object') &&
            ((document.location.host === 'arnovandervegt.github.io') || (document.location.href.indexOf('pu') !== -1));
    };

exports.isElectron = function() {
    return !forceWebVersion() && (typeof window === 'object') && ('electron' in window);
};

exports.isNode = function() {
    return !forceWebVersion() && (typeof document === 'object') && (document.location.hostname === '127.0.0.1');
};

exports.isWeb = function() {
    return !exports.isElectron() && !exports.isNode();
};

exports.forceWebVersion = forceWebVersion;
