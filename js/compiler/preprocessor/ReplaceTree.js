(function() {
    var wheel = require('../../utils/base.js').wheel;

    var ReplaceTree = wheel.Class(function() {
            this.init = function(opts) {
                this.reset();
            };

            this.reset = function() {
                this._root = {
                    value:    '',
                    children: {}
                };
            };

            this.add = function(key, value) {
                var node = this._root;
                for (var i = 0, j = key.length - 1; i <= j; i++) {
                    var c = key[i];
                    if (c in node.children) {
                        node = node.children[c];
                    } else {
                        var child = {
                                children: {},
                                value:    ''
                            };
                        node.children[c] = child;
                        node             = child;
                    }
                }
                node.value = value;
            };

            this.update = function(line) {
                var i = 0;
                while (i < line.length) {
                    var c = line[i++];
                    if (c in this._root.children) {
                        var node = this._root.children[c];
                        var j    = i;

                        while (j < line.length) {
                            c = line[j++];
                            if (c in node.children) {
                                node = node.children[c];
                            } else {
                                break;
                            }
                        }
                        line = line.substr(0, i - 1) + node.value + line.substr(j - 1 - line.length);
                        i    = i + node.value.length;
                    }
                }

                return line;
            };
        });

    wheel('compiler.preprocessor.ReplaceTree', ReplaceTree);
})();