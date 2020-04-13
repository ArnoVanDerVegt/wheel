/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t = require('../tokenizer/tokenizer');

exports.Namespace = class {
    constructor(opts) {
        this._namespace        = {};
        this._currentNamespace = '';
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
            } else {
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
            }
            i++;
        }
        return namespacedTokens;
    }
}
