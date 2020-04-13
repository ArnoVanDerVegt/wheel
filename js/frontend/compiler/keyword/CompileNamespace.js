/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t            = require('../tokenizer/tokenizer');
const CompileScope = require('../compiler/CompileScope').CompileScope;
const CompileBlock = require('../compiler/CompileBlock').CompileBlock;

exports.CompileNamespace = class extends CompileBlock {
    compile(iterator) {
        // !this.checkNotInGlobalScope(iterator);
        let namespaceExpression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        if (namespaceExpression.tokens.length) {
            let tokens    = namespaceExpression.tokens;
            let namespace = [];
            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                if (token.lexeme !== t.LEXEME_DOT) {
                    namespace.push(token.lexeme);
                }
            }
            this._compiler.setNamespace(namespace);
        } else {
            // Todo: throw error...
        }
    }
};
