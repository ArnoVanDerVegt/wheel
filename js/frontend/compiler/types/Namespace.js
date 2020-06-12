/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t = require('../tokenizer/tokenizer');

exports.Namespace = class {
    constructor(opts) {
        this._namespace        = {};
        this._currentNamespace = '';
        this._currentFileIndex = -1;
    }

    reset() {
        this._currentNamespace = '';
        this._currentFileIndex = -1;
    }

    checkCurrentFileIndex(token) {
        if (('fileIndex' in token) && (this._currentFileIndex !== token.fileIndex)) {
            this._currentFileIndex = token.fileIndex;
            this._currentNamespace = '';
        }
    }

    setNamespace(namespace) {
        if ((namespace.length === 1) && (namespace[0] === 'main')) {
            this._currentNamespace = '';
            return;
        }
        let n = this._namespace;
        namespace.forEach(function(name) {
            if (!(name in n)) {
                n[name] = {};
            }
            n = n[name];
        });
        this._currentNamespace = namespace.join('~') + '~';
    }

    getNamespace(namespace) {
        return this._namespace[namespace] || null;
    }

    getCurrentNamespace() {
        return this._currentNamespace;
    }

    compileNamespace(tokens, namespacedTokens, index) {
        let done = false;
        let ns   = [];
        while ((index < tokens.length) && !done) {
            let token = tokens[index++];
            namespacedTokens.push(token);
            switch (token.lexeme) {
                case t.LEXEME_DOT:
                    break;
                case t.LEXEME_NEWLINE:
                    done = true;
                    break;
                default:
                    if (token.cls === t.TOKEN_IDENTIFIER) {
                        ns.push(token.lexeme);
                    }
                    break;
            }
        }
        this.setNamespace(ns);
        return index;
    }

    compileNamespaces(tokens) {
        let namespaceAllowed = false;
        let namespacedTokens = [];
        let i                = 0;
        let skipWhitespace   = function() {
                while (tokens[i] && (tokens[i].cls === t.TOKEN_WHITE_SPACE)) {
                    i++;
                }
            };
        while (i < tokens.length) {
            let token = tokens[i];
            if (token.lexeme === t.LEXEME_NAMESPACE) {
                i = this.compileNamespace(tokens, namespacedTokens, i);
                i--;
            } else if (token.lexeme === t.LEXEME_NEWLINE) {
                // A namespace is allowed at the start of a new line...
                namespaceAllowed = true;
                namespacedTokens.push(token);
            } else if (token.lexeme[0] === t.LEXEME_SPACE) {
                // Don't reset the namespaceAllowed here...
                namespacedTokens.push(token);
            } else if ([ // A namespace can only appear after certain tokens...
                    t.TOKEN_COMMA,               // ", namespace."
                    t.TOKEN_PARENTHESIS_OPEN,    // "(namespace."
                    t.TOKEN_BRACKET_OPEN,        // "[namespace."
                    t.TOKEN_NUMERIC_OPERATOR,    // "* namespace."
                    t.TOKEN_BOOLEAN_OPERATOR,    // "and namespace."
                    t.TOKEN_ASSIGNMENT_OPERATOR  // "+= namespace."
                ].indexOf(token.cls) !== -1) {
                namespaceAllowed = true;
                namespacedTokens.push(token);
            } else if ((token.cls === t.TOKEN_KEYWORD) && (token.lexeme === t.LEXEME_RET)) {
                namespaceAllowed = true;
                namespacedTokens.push(token);
            } else if (namespaceAllowed) {
                let n = this.getNamespace(token.lexeme);
                if (n && tokens[i + 1] && (tokens[i + 1].lexeme === t.LEXEME_DOT)) {
                    let namespaceParts = [token.lexeme];
                    i += 2;
                    while (i < tokens.length) {
                        skipWhitespace();
                        token = tokens[i++];
                        if (token && (token.lexeme in n)) {
                            namespaceParts.push(token.lexeme);
                            n = n[token.lexeme];
                        } else {
                            i--;
                            break;
                        }
                        skipWhitespace();
                        if (tokens[i].lexeme !== t.LEXEME_DOT) {
                            break;
                        }
                        i++;
                    }
                    token        = tokens[i];
                    token.lexeme = namespaceParts.join('~') + '~' + token.lexeme;
                }
                namespacedTokens.push(token);
                namespaceAllowed = false;
            } else {
                namespacedTokens.push(token);
            }
            i++;
        }
        namespacedTokens.forEach(function(token, index) {
            token.index = index;
        });
        return namespacedTokens;
    }
};
