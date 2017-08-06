(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.helpers.scriptHelper',
        {
            addBreaks: function(output, loopItem, breakLabelIndex) {
                var label = '_____break' + breakLabelIndex++;
                loopItem.breaks.forEach(function(item) {
                    output[item] = 'jmp ' + label;
                });
                return label;
            },

            updateLabelOffsets: function(labels, outputOffset) {
                for (var i = 0; i < labels.length; i++) {
                    labels[i].offset += outputOffset;
                }
            },

            compilePointerDeref: function(result, tempVar) {
                result.push('set REG_SRC,REG_STACK');
                result.push('set REG_STACK,' + tempVar);
                result.push('set REG_DEST,%REG_STACK');
                result.push('set REG_STACK,REG_SRC');
            }
        }
    );
})();
