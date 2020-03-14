/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors                       = require('../errors');
const err                          = require('../errors').errors;
const t                            = require('../tokenizer/tokenizer');
const rootScopeTokens              = require('./syntaxRoot').rootScopeTokens;
const procScopeTokens              = require('./syntaxProc').procScopeTokens;
const procNameScopeTokens          = require('./syntaxProcName').procNameScopeTokens;
const procParamsScopeTokens        = require('./syntaxProcParams').procParamsScopeTokens;
const recordScopeTokens            = require('./syntaxRecord').recordScopeTokens;
const addrScopeTokens              = require('./syntaxAddr').addrScopeTokens;
const moduleScopeTokens            = require('./syntaxModule').moduleScopeTokens;
const breakScopeTokens             = require('./syntaxBreak').breakScopeTokens;
const selectScopeTokens            = require('./syntaxSelect').selectScopeTokens;
const selectValueScopeTokens       = require('./syntaxSelectValue').selectValueScopeTokens;
const selectCaseValueScopeTokens   = require('./syntaxSelectCaseValue').selectCaseValueScopeTokens;
const selectDefaultScopeTokens     = require('./syntaxSelectDefault').selectDefaultScopeTokens;
const forToScopeTokens             = require('./syntaxForTo').forToScopeTokens;
const forToAssignmentScopeTokens   = require('./syntaxForToAssignment').forToAssignmentScopeTokens;
const numericAssignmentScopeTokens = require('./syntaxNumericAssignment').numericAssignmentScopeTokens;
const booleanScopeTokens           = require('./syntaxBoolean').booleanScopeTokens;
const assignmentScopeTokens        = require('./syntaxAssignment').assignmentScopeTokens;
const blockScopeTokens             = require('./syntaxBlock').blockScopeTokens;

let assignOperateScope = {
        name:      'number/string assignment',
        tokens:    assignmentScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };

let numericAssignOperateScope = {
        name:      'number assignment',
        tokens:    numericAssignmentScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };

// Record <identifier>
let recordScope = {
        name:      'record',
        tokens:    recordScopeTokens(),
        endLexeme: [t.LEXEME_END]
    };

// Addr <identifier>
let addrScope = {
        name:      'address',
        tokens:    addrScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };

// Module <const>, <const>
let moduleScope = {
        name:      'mod',
        tokens:    moduleScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };

// Break <label>
let breakScope = {
        name:      'break',
        tokens:    breakScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };

// Block
let blockScope = {};
blockScope[t.LEXEME_IF        ] = function() { return [ifScope,     ifScopeCondition   ]; };
blockScope[t.LEXEME_ELSEIF    ] = function() { return [ifScope,     ifScopeCondition   ]; };
blockScope[t.LEXEME_SELECT    ] = function() { return [selectScope, selectValueScope   ]; };
blockScope[t.LEXEME_WHILE     ] = function() { return [whileScope,  whileScopeCondition]; };
blockScope[t.LEXEME_FOR       ] = function() { return [forScope,    toScope            ]; };
blockScope[t.LEXEME_REPEAT    ] = function() { return [repeatScope              ];        };
blockScope[t.LEXEME_RECORD    ] = function() { return [recordScope              ];        };
blockScope[t.LEXEME_ADDR      ] = function() { return [addrScope                ];        };
blockScope[t.LEXEME_MOD       ] = function() { return [moduleScope              ];        };
blockScope[t.LEXEME_BREAK     ] = function() { return [breakScope               ];        };
blockScope[t.LEXEME_ASSIGN    ] = function() { return [assignOperateScope       ];        };
blockScope[t.LEXEME_ASSIGN_ADD] = function() { return [assignOperateScope       ];        };
blockScope[t.LEXEME_ASSIGN_SUB] = function() { return [numericAssignOperateScope];        };
blockScope[t.LEXEME_ASSIGN_MUL] = function() { return [numericAssignOperateScope];        };
blockScope[t.LEXEME_ASSIGN_DIV] = function() { return [numericAssignOperateScope];        };

// If <expression>
let ifScope = {
        name:      'if',
        tokens:    blockScopeTokens(),
        endLexeme: [t.LEXEME_END],
        scope:     blockScope
    };
let ifScopeCondition = {
        name:      'if condition',
        tokens:    booleanScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };

// Select <expression> case <value>
let selectCaseValueScope = {
        name:      'case value',
        tokens:    selectCaseValueScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };
let selectCaseScope = {
        name:      'case',
        tokens:    blockScopeTokens(),
        endLexeme: [t.LEXEME_CASE, t.LEXEME_DEFAULT, t.LEXEME_END],
        scope:     blockScope
    };
let selectDefaultScope = {
        name:      'default',
        tokens:    selectDefaultScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };
let selectValueScope = {
        name:      'select value',
        tokens:    selectValueScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };
let selectScope = {
        name:      'select',
        tokens:    selectScopeTokens(),
        endLexeme: [t.LEXEME_END],
        popParent: t.LEXEME_END, // Pop case and select!
        scope:     {}
    };
selectScope.scope[t.LEXEME_CASE   ] = function() { return [selectCaseScope, selectCaseValueScope]; };
selectScope.scope[t.LEXEME_DEFAULT] = function() { return [selectCaseScope, selectDefaultScope  ]; };

// Repeat
let repeatScope = {
        name:      'repeat',
        tokens:    blockScopeTokens(),
        endLexeme: [t.LEXEME_END],
        scope:     blockScope
    };

// While <expression>
let whileScope = {
        name:      'while',
        tokens:    blockScopeTokens(),
        endLexeme: [t.LEXEME_END],
        scope:     blockScope
    };
let whileScopeCondition = {
        name:      'while condition',
        tokens:    booleanScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE]
    };

// For <assignment> to <expression> step <expression>
let toScope = {
        name:      'to expression',
        tokens:    forToScopeTokens(),
        endLexeme: [t.LEXEME_NEWLINE, t.LEXEME_STEP],
        scope:     {}
    };
toScope.scope[t.LEXEME_ASSIGN] = function() {
    return [
        {
            name:      'to assignment value',
            tokens:    forToAssignmentScopeTokens(),
            endLexeme: [t.LEXEME_TO, t.LEXEME_DOWNTO, t.LEXEME_NEWLINE]
        }
    ];
};

let forScope = {
        name:      'for block',
        tokens:    blockScopeTokens(),
        endLexeme: [t.LEXEME_END],
        scope:     blockScope
    };

// Proc <params>
let procScope = {
        name:      'proc',
        tokens:    procScopeTokens(),
        endLexeme: [t.LEXEME_END],
        scope:     blockScope
    };
let procNameScope = {
        name:      'proc name',
        tokens:    procNameScopeTokens(),
        endLexeme: [t.LEXEME_PARENTHESIS_OPEN]
    };
let procParamsScope = {
        name:      'proc params',
        tokens:    procParamsScopeTokens(),
        endLexeme: [t.LEXEME_PARENTHESIS_CLOSE]
    };

let rootScope = {
        name:      'root',
        tokens:    rootScopeTokens(),
        endLexeme: [],
        scope:     {}
    };
rootScope.scope[t.LEXEME_RECORD] = function() { return [recordScope];                               };
rootScope.scope[t.LEXEME_PROC  ] = function() { return [procScope, procParamsScope, procNameScope]; };

exports.SyntaxValidator = class {
    findInExpect(token, expect) {
        for (let i in expect) {
            if ((i !== 'e') && (token.cls === expect[i].token)) {
                if ('lexeme' in expect[i]) {
                    if (expect[i].lexeme.indexOf(token.lexeme) !== -1) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    validate(tokens) {
        let i          = 0;
        let scopeStack = [];
        scopeStack.push(rootScope);
        while (i < tokens.length - 1) {
            let token1 = tokens[i++];
            if (!token1.done) {
                let token2 = tokens[i];
                while (i < tokens.length) {
                    token2 = tokens[i];
                    if ((!token2.done && (token2.cls !== t.TOKEN_WHITE_SPACE)) || token2.is(t.LEXEME_NEWLINE)) {
                        break;
                    }
                    i++;
                }
                let currentScope = scopeStack[scopeStack.length - 1];
                if (currentScope.endLexeme.indexOf(token1.lexeme) !== -1) {
                    // Pop the scope so that this lexeme can be validated in the previous scope!
                    scopeStack.pop();
                    currentScope = scopeStack[scopeStack.length - 1];
                    if (currentScope.popParent === token1.lexeme) {
                        scopeStack.pop();
                        currentScope = scopeStack[scopeStack.length - 1];
                    }
                } else {
                    currentScope = scopeStack[scopeStack.length - 1];
                    let currentTokens = currentScope.tokens;
                    if (currentTokens[token1.cls]) {
                        if (currentTokens[token1.cls].e && currentTokens[token1.cls][token1.lexeme]) {
                            let expect = currentTokens[token1.cls][token1.lexeme];
                            if (!this.findInExpect(token2, expect)) {
                                console.log('1)', token1.lexeme, '/', token2.lexeme, '/', currentScope.name);
                                throw errors.createError(err.SYNTAX_ERROR, token1, 'Syntax error.');
                            }
                        } else {
                            let expect = currentTokens[token1.cls];
                            if (!this.findInExpect(token2, expect)) {
                                console.log('2)', token1.lexeme, '/', token2.lexeme, '/', currentScope.name);
                                throw errors.createError(err.SYNTAX_ERROR, token1, 'Syntax error.');
                            }
                        }
                    } else if (token1.cls !== t.TOKEN_WHITE_SPACE) {
                        console.log('3)', token1.lexeme, '/', token2.lexeme, '/', currentScope.name);
                        throw errors.createError(err.SYNTAX_ERROR, token1, 'Syntax error.');
                    }
                }
                if (currentScope.scope && (token1.lexeme in currentScope.scope)) {
                    currentScope.scope[token1.lexeme]().forEach(function(scope) {
                        scopeStack.push(scope);
                    });
                }
            }
        }
    }
};
