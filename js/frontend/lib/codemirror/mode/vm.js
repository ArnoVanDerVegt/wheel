// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

CodeMirror.defineMode(
    'vm',
    function() {
        function words(str) {
            let obj   = {};
            let words = str.split(' ');
            for (let i = 0; i < words.length; ++i) {
                obj[words[i]] = true;
            }
            return obj;
        }
        let keywords  = words('copy jmpc cmp mod set setf sets add adds sub mul div and or call ret jump');
        let registers = words('stack src dest ptr code return range1 range2 flags eq neq l le g ge');
        let meta      = words('#NAME #LAYERS #CODE #VERSION #STRINGS #CONSTANTS #HEAP #REG_CODE #REG_STACK');

        function tokenBase(stream, state) {
            let ch = stream.next();
            if (ch === '"') {
                state.tokenize = tokenString(ch);
                return state.tokenize(stream, state);
            }
            if (/\d/.test(ch)) {
                stream.eatWhile(/[\w\.]/);
                return 'number';
            }
            if (ch === ';') {
                stream.skipToEnd();
                return 'comment';
            }
            if (',[]+.'.indexOf(ch) !== -1) {
                return 'operator';
            }
            stream.eatWhile(/[\w\$_]/);
            let cur = stream.current();
            if (keywords.propertyIsEnumerable(cur)) {
                return 'keyword';
            }
            if (registers.propertyIsEnumerable(cur)) {
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

            electricChars: '{}'
        };
    }
);
CodeMirror.defineMIME('text/x-vm', 'vm');
