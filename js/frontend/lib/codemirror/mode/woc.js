// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function() {
    CodeMirror.defineMode(
        'woc',
        function() {
            function words(str) {
                let obj   = {};
                let words = str.split(' ');
                for (let i = 0; i < words.length; ++i) {
                    obj[words[i]] = true;
                }
                return obj;
            }
            let keyword = words('@keyword @end @subject @for @example @error @section @see @load');

            function tokenBase(stream, state) {
                let ch = stream.next();
                stream.eatWhile(/[\w\$_]/);
                let cur = stream.current();
                if (keyword.propertyIsEnumerable(cur)) {
                    return 'woc-keyword';
                }
                return 'woc-default';
            }

            function tokenString(quote) {
                return function(stream, state) {
                    let escaped = false;
                    let next;
                    let end = false;
                    while ((next = stream.next()) !== null) {
                        if ((next === quote) && !escaped) {
                            end = true;
                            break;
                        }
                        escaped = !escaped && (next === '\\');
                    }
                    if (end || !escaped) {
                        state.tokenize = null;
                    }
                    return 'string';
                };
            }

            // Interface
            return {
                startState: function() {
                    return {tokenize: null};
                },
                token: function(stream, state) {
                    if (stream.eatSpace()) {
                        return null;
                    }
                    let style = (state.tokenize || tokenBase)(stream, state);
                    if ((style === 'comment') || (style === 'meta')) {
                        return style;
                    }
                    return style;
                },

                electricChars: false
            };
        }
    );
    CodeMirror.defineMIME('text/x-woc', 'woc');
})();
