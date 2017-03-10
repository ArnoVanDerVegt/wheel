(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.Array',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
        	this.getBothNumberType = function(valueParam, arrayParam) {
                $ = wheel.compiler.command;
        		return $.isNumberType(valueParam) && $.isNumberType(arrayParam);
        	};
        })
    );
})();