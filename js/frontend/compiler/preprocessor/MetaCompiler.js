/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path   = require('../../lib/path');
const t      = require('../tokenizer/tokenizer');
const errors = require('../errors');
const err    = require('../errors').errors;

const removePadding = function(s) {
        return s.substr(1, s.length - 2);
    };

exports.checkRestTokens = function(iterator, after) {
        let restTokens = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        if (restTokens.tokens.length) {
            throw errors.createError(err.UNEXPECTED_CODE_AFTER_META, restTokens.tokens[0], 'Unexpected code after "#' + after + '".');
        }
    };

exports.MetaCompiler = class {
    constructor(defines, resources, linter) {
        this._defines   = defines;
        this._resources = resources;
        this._linter    = linter;
    }

    compileDefine(iterator, token, tokenFilename) {
        token.done      = true;
        token           = iterator.skipWhiteSpace().next();
        if (token.cls !== t.TOKEN_IDENTIFIER) {
            token.filename = tokenFilename;
            throw errors.createError(err.IDENTIFIER_EXPECTED, token, 'Identifier expected.');
        }
        this._linter && this._linter.addDefine(token);
        token.done      = true;
        let defineKey   = token.lexeme;
        token           = iterator.skipWhiteSpace().next();
        token.done      = true;
        if ([t.TOKEN_NUMBER, t.TOKEN_STRING].indexOf(token.cls) === -1) {
            token.filename = tokenFilename;
            throw errors.createError(err.NUMBER_OR_STRING_CONSTANT_EXPECTED, token, 'Number or string constant expected.');
        }
        if (token.cls === t.TOKEN_NUMBER) {
            this._defines.add(token, defineKey, token.value);
        } else {
            this._defines.add(token, defineKey, token.lexeme);
        }
        exports.checkRestTokens(iterator, 'define');
    }

    compileImage(iterator, token, tokenFilename) {
        token.done = true;
        token      = iterator.skipWhiteSpace().next();
        token.done = true;
        if (token.cls !== t.TOKEN_STRING) {
            token.filename = tokenFilename;
            throw errors.createError(err.FILENAME_EXPECTED, token, 'Filename expected.');
        }
        let filename = removePadding(token.lexeme);
        if (filename.substr(-4) !== '.rgf') {
            token.filename = tokenFilename;
            throw errors.createError(err.RGF_EXTENSION_EXPECTED, token, '".rgf" Extension expected.');
        }
        let p = iterator.skipWhiteSpace().peek();
        if ((p.cls !== t.TOKEN_META) || (p.lexeme !== t.LEXEME_META_DATA)) {
            token.filename = tokenFilename;
            throw errors.createError(err.DATA_EXPECTED, token, '"' + t.LEXEME_META_DATA + '" Expected.');
        }
        let hasData   = true;
        let dataWidth = null;
        let image     = {filename: filename, data: []};
        while (hasData) {
            token      = iterator.skipWhiteSpace().next();
            token.done = true;
            token      = iterator.skipWhiteSpace().next();
            if (token.cls !== t.TOKEN_STRING) {
                token.filename = tokenFilename;
                throw errors.createError(err.DATA_STRING_EXPECTED, token, 'Data string expected.');
            }
            token.done = true;
            let dataString = removePadding(token.lexeme);
            if (!dataString.length) {
                token.filename = tokenFilename;
                throw errors.createError(err.DATA_STRING_EMPTY, token, 'Data string is empty.');
            }
            if (dataWidth === null) {
                dataWidth = dataString.length;
            } else if (dataString.length !== dataWidth) {
                token.filename = tokenFilename;
                throw errors.createError(err.DATA_STRING_LENGTH_MISMATCH, token, 'Data string length mismatch.');
            }
            let dataLine = [];
            for (let i = 0; i < dataString.length; i++) {
                if ('01'.indexOf(dataString[i]) === -1) {
                    token.filename = tokenFilename;
                    throw errors.createError(err.DATA_STRING_INVALID_CHARACTER, token, 'Data string can only contain "0" or "1".');
                }
                dataLine.push(dataString[i] === '0' ? 0 : 1);
            }
            image.data.push(dataLine);
            hasData = (iterator.skipWhiteSpace().peek().lexeme === t.LEXEME_META_DATA);
        }
        this._resources.add(image.filename, image.data, token);
    }

    compileText(iterator, token, tokenFilename) {
        token.done = true;
        token      = iterator.skipWhiteSpace().next();
        token.done = true;
        if (token.cls !== t.TOKEN_STRING) {
            token.filename = tokenFilename;
            throw errors.createError(err.FILENAME_EXPECTED, token, 'Filename expected.');
        }
        let filename = removePadding(token.lexeme);
        if (filename.substr(-4) !== '.rtf') {
            token.filename = tokenFilename;
            throw errors.createError(err.RTF_EXTENSION_EXPECTED, token, '".rtf" Extension expected.');
        }
        let p = iterator.skipWhiteSpace().peek();
        if ((p.cls !== t.TOKEN_META) || (p.lexeme !== t.LEXEME_META_LINE)) {
            token.filename = tokenFilename;
            throw errors.createError(err.LINE_EXPECTED, token, '"' + t.LEXEME_META_LINE + '" Expected.');
        }
        let hasLines = true;
        let text     = {filename: filename, lines: []};
        while (hasLines) {
            token      = iterator.skipWhiteSpace().next();
            token.done = true;
            token      = iterator.skipWhiteSpace().next();
            if (token.cls !== t.TOKEN_STRING) {
                token.filename = tokenFilename;
                throw errors.createError(err.LINE_STRING_EXPECTED, token, 'Line string expected.');
            }
            token.done = true;
            text.lines.push(removePadding(token.lexeme));
            hasLines = (iterator.skipWhiteSpace().peek().lexeme === t.LEXEME_META_LINE);
        }
        this._resources.add(text.filename, text.lines.join(String.fromCharCode(0x0D)), token);
    }

    compileResource(iterator, token, tokenFilename) {
        token.done = true;
        token      = iterator.skipWhiteSpace().next();
        token.done = true;
        if (token.cls !== t.TOKEN_STRING) {
            token.filename = tokenFilename;
            throw errors.createError(err.FILENAME_EXPECTED, token, 'Filename expected.');
        }
        let filename = removePadding(token.lexeme);
        if (['.rgf', '.rsf', '.rtf', '.rbf', '.wfrm'].indexOf(path.getExtension(filename)) === -1) {
            token.filename = tokenFilename;
            throw errors.createError(err.INVALID_RESOURCE, token, 'Invalid resource.');
        }
        this._resources.add(filename, null, token);
    }
};
