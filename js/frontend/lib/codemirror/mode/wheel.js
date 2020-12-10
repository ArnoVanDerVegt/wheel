/* eslint-disable */
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function() {
    CodeMirror.defineMode(
        'wheel',
        function() {
            function words(str) {
                let obj   = {};
                let words = str.split(' ');
                for (let i = 0; i < words.length; ++i) {
                    obj[words[i]] = true;
                }
                return obj;
            }
            let keywords = words(
                    'proc record union and select case to downto else elseif end for if not or repeat until while break default mod addr step ret ' +
                    'static with object self extends public private protected super namespace'
                );
            let types    = words('number string');
            let meta     = words('#format #noformat #define #include #image #heap #datatype #optimizer #rangecheck #data #project #break #display #resource #text #line #stringlength #stringcount');

            function tokenBase(stream, state) {
                let editor   = stream.lineOracle.doc.cm;
                let database = (editor && editor.getCodeDatabase) ? editor.getCodeDatabase() : null;
                let ch       = stream.next();
                if (ch === '"') {
                    state.tokenize = tokenString(ch);
                    return state.tokenize(stream, state);
                }
                if (/[\d\.]/.test(ch)) {
                    stream.backUp(1)
                    if (stream.match(/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i)) {
                        return 'number';
                    }
                    stream.next()
                }
                if (ch === ';') {
                    stream.skipToEnd();
                    return 'comment';
                }
                if ('!:@^{}()[]+-/*<>=,.'.indexOf(ch) !== -1) {
                    return 'operator';
                }
                stream.eatWhile(/[\w\$_]/);
                let cur = stream.current();
                if (keywords.propertyIsEnumerable(cur)) {
                    return 'keyword';
                }
                if (database && database.compiler) {
                    if (database.compiler.findRecord(cur)) {
                        return 'record';
                    }
                    if (database.compiler.findProc(cur)) {
                        return 'proc';
                    }
                    if (database.defines.get(cur) !== false) {
                        return 'define';
                    }
                }
                if (types.propertyIsEnumerable(cur)) {
                    return 'type';
                }
                if (meta.propertyIsEnumerable(cur)) {
                    return 'meta';
                }
                return 'variable';
            }

            function tokenString(quote) {
                return function(stream, state) {
                    let escaped = false;
                    let next;
                    let end     = false;
                    while ((next = stream.next()) != null) {
                        if (next == quote && !escaped) {
                            end = true;
                            break;
                        }
                        escaped = !escaped && next == '\\';
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

                electricChars: '{}'
            };
        }
    );
    CodeMirror.defineMIME('text/x-wheel', 'wheel');
})();
