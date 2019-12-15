exports.getSpan = function(value, className) {
    return '<span class="' + (className || '') + '">' + value + '</span>';
};

exports.getArrayIndex = function(index) {
    return exports.getSpan('[') + exports.getSpan(index, 'number') + exports.getSpan(']');
};

exports.getArrayRange = function(from, to) {
    return exports.getSpan('[') +
        exports.getSpan(from, 'number') +
        exports.getSpan('..') +
        exports.getSpan(to, 'number') +
    exports.getSpan(']');
};

exports.getRecord = function(name) {
    return exports.getSpan(name, 'record');
};

exports.getVariable = function(name) {
    return exports.getSpan(name, 'variable');
};

exports.getSpace = function() {
    return exports.getSpan('&nbsp;', '');
};

exports.getAssign = function() {
    return exports.getSpace() + exports.getSpan('=') + exports.getSpace();
};
