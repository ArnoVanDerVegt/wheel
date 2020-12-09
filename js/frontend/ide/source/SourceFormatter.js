/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t        = require('../../compiler/tokenizer/tokenizer');
const Iterator = require('../../compiler/tokenizer/TokenIterator').Iterator;

exports.SourceFormatter = class {
    constructor() {
        this._indentStack = [];
        this._output      = [];
    }

    toLength(s, length) {
        while (s.length < length) {
            s += ' ';
        }
        return s;
    }

    splitAtSpace(s, count) {
        let parts = [];
        let i     = 0;
        while ((i < s.length) && (parts.length < count - 1)) {
            while ((i < s.length) && (s[i] === ' ')) {
                i++;
            }
            let part = '';
            while ((i < s.length) && (s[i] !== ' ')) {
                if (s[i] === '"') { // Check if it's a string...
                    part += s[i];
                    i++;
                    while ((i < s.length) && (s[i] !== '"')) {
                        part += s[i];
                        i++;
                    }
                    part += s[i];
                    i++;
                    if (i >= s.length) {
                        break;
                    }
                }
                part += s[i];
                i++;
            }
            parts.push(part);
        }
        if (i < s.length) {
            parts.push(s.substr(i - s.length).trim());
        }
        return parts;
    }

    splitAtSpaceFilrered(s, count) {
        return this.splitAtSpace(s, count).filter((part) => part.length);
    }

    splitComment(s) {
        let i = 0;
        while (i < s.length) {
            if (s[i] === ';') {
                return {
                    line:    s.substr(0, i),
                    comment: s.substr(i + 1 - s.length).trim()
                };
            } else if (s[i] === '"') {
                i++;
                while ((i < s.length - 2) && (s[i] !== '"')) {
                    i++;
                }
            }
            i++;
        }
        return false;
    }

    splitAssignement(s) {
        let ignoreLexemes = [
                t.LEXEME_FOR,
                t.LEXEME_IF,
                t.LEXEME_ELSEIF,
                t.LEXEME_WHILE
            ];
        for (let i = 0; i < ignoreLexemes.length; i++) {
            if (s.trim().substr(0, ignoreLexemes[i].length) === ignoreLexemes[i]) {
                return false;
            }
        }
        let assignments = [
                t.LEXEME_ASSIGN,
                t.LEXEME_ASSIGN_ADD,
                t.LEXEME_ASSIGN_SUB,
                t.LEXEME_ASSIGN_MUL,
                t.LEXEME_ASSIGN_DIV
            ];
        let i = 1;
        while (i < s.length - 2) {
            if (s[i] === '"') {
                i++;
                while ((i < s.length - 2) && (s[i] !== '"')) {
                    i++;
                }
            } else {
                for (let j = 0; j < assignments.length; j++) {
                    let assignment = assignments[j];
                    if (s.substr(i, assignment.length) === assignment) {
                        return {
                            assignment: assignment,
                            dest:       s.substr(0, i).trim(),
                            source:     s.substr(i - s.length + assignment.length).trim()
                        };
                    }
                }
            }
            i++;
        }
        return false;
    }

    startsWith(s, items) {
        s = s.trim();
        for (let i = 0; i < items.length; i++) {
            if (s.indexOf(items[i]) === 0) {
                return true;
            }
        }
        return false;
    }

    addToOutput(s) {
        let output = this._output;
        if (output.length) {
            output[output.length - 1] += s;
        } else {
            output.push(s);
        }
    }

    addLineToOutput(s) {
        this._output.push(s || '');
        return this;
    }

    getLastLine() {
        let output = this._output;
        if (output.length) {
            return output[output.length - 1];
        }
        return null;
    }

    getIndentSpace() {
        let space = '';
        this._indentStack.forEach((item) => {
            for (let i = 0; i < item.popCount; i++) {
                space += '    ';
            }
        });
        return space;
    }

    incIndent(popCount, isProc) {
        let indentStack = this._indentStack;
        if (isProc !== undefined) {
            indentStack.push({popCount: popCount, isProc: isProc});
        } else if (indentStack.length > 0) {
            indentStack.push({popCount: popCount, isProc: indentStack[indentStack.length - 1].isProc});
        } else {
            indentStack.push({popCount: popCount, isProc: false});
        }
        return this;
    }

    decIndent() {
        if (this._indentStack.length) {
            let popCount = this._indentStack.pop().popCount;
            if (popCount > 1) {
                this._indentStack.pop();
            }
        }
        return this;
    }

    rtrim(s) {
        while (s.length && ([' ', '\n', '\r', '\t'].indexOf(s[s.length - 1]) !== -1)) {
            s = s.substr(0, s.length - 1);
        }
        return s;
    }

    hasAssignment(s) {
        let lineAndComment = this.splitComment(s);
        if (lineAndComment) {
            s = lineAndComment.line;
        }
        return !!this.splitAssignement(s);
    }

    formatExpressionUntilEol(iterator, token) {
        let line = '';
        while (token.lexeme !== t.LEXEME_NEWLINE) {
            token = iterator.next();
            if (!token) {
                break;
            }
            switch (token.cls) {
                case t.TOKEN_NUMERIC_OPERATOR:
                    line += ' ' + token.lexeme + ' ';
                    break;
                case t.TOKEN_BOOLEAN_OPERATOR:
                    line += ' ' + token.lexeme + ' ';
                    break;
                case t.TOKEN_ASSIGNMENT_OPERATOR:
                    line += ' ' + token.lexeme + ' ';
                    break;
                case t.TOKEN_COMMA:
                    line += token.lexeme + ' ';
                    break;
                default:
                    if (token.cls !== t.TOKEN_WHITE_SPACE) {
                        line += token.lexeme;
                    }
                    break;
            }
        }
        if (token && token.comment) {
            if (line.trim() === '') {
                line = ' ; ' + this.rtrim(token.comment);
            } else {
                line = this.rtrim(line) + ' ; ' + token.comment.trim();
            }
        }
        return line;
    }

    formatProcToken(iterator, token) {
        let indentStack = this._indentStack;
        let line        = token.lexeme + ' ';
        let expectType  = true;
        if (indentStack.length && indentStack[indentStack.length - 1].isProc) {
            this.addLineToOutput(this.getIndentSpace() + line + this.formatExpressionUntilEol(iterator, token));
            return;
        }
        iterator.skipWhiteSpace();
        token = iterator.next();
        line += token.lexeme;
        token = iterator.peek();
        // Check if it's an object method...
        if (token.cls === t.TOKEN_DOT) {
            token = iterator.next();
            line += token.lexeme;
            token = iterator.next();
            if (token) {
                line += token.lexeme;
            }
        }
        while (token && (token.lexeme !== t.LEXEME_NEWLINE)) {
            token = iterator.next();
            switch (token.cls) {
                case t.TOKEN_IDENTIFIER:
                    line += token.lexeme;
                    if (expectType) {
                        line += ' ';
                        expectType = false;
                    }
                    break;
                case t.TOKEN_TYPE:
                    line += token.lexeme;
                    if (expectType) {
                        line += ' ';
                        expectType = false;
                    }
                    break;
                case t.TOKEN_COMMA:
                    line += token.lexeme + ' ';
                    expectType = true;
                    break;
                default:
                    if (token.cls !== t.TOKEN_WHITE_SPACE) {
                        line += token.lexeme;
                    }
                    break;
            }
        }
        if (token && token.comment) {
            line += ' ; ' + token.comment.trim();
        }
        this
            .addLineToOutput(line)
            .incIndent(1, true);
    }

    formatRepeatToken(iterator, token) {
        let line = token.lexeme;
        this
            .addLineToOutput(this.getIndentSpace() + line)
            .incIndent(1);
        iterator.next();
    }

    formatTokenAndExpression(iterator, token) {
        this.addLineToOutput(this.getIndentSpace() + token.lexeme + ' ' + this.formatExpressionUntilEol(iterator, token));
    }

    formatTokenAndExpressionIncIndent(iterator, token) {
        this
            .addLineToOutput(this.getIndentSpace() + token.lexeme + ' ' + this.formatExpressionUntilEol(iterator, token))
            .incIndent(1);
    }

    formatElseifToken(iterator, token) {
        let indent = this.getIndentSpace();
        if (indent.length > 4) {
            indent = indent.substr(0, indent.length - 4);
        }
        this.addLineToOutput(indent + token.lexeme + ' ' + this.formatExpressionUntilEol(iterator, token));
    }

    formatSelectToken(iterator, token) {
        this
            .addLineToOutput(this.getIndentSpace() + token.lexeme + ' ' + this.formatExpressionUntilEol(iterator, token))
            .incIndent(2);
    }

    formatCaseToken(iterator, token) {
        let indent = this.getIndentSpace();
        if (indent.length >= 4) {
            indent = indent.substr(4, indent.length - 4);
        }
        this.addLineToOutput(indent + token.lexeme + ' ' + this.formatExpressionUntilEol(iterator, token));
    }

    formatForToken(iterator, token) {
        let line = token.lexeme;
        while (token && (token.lexeme !== t.LEXEME_NEWLINE)) {
            token = iterator.next();
            if (token.cls !== t.TOKEN_WHITE_SPACE) {
                line += ' ' + token.lexeme;
            }
        }
        this
            .addLineToOutput(this.getIndentSpace() + line)
            .incIndent(1);
    }

    formatSingleToken(iterator, token) {
        let line = token.lexeme;
        iterator.skipWhiteSpaceWithoutNewline();
        token = iterator.next();
        if (token && (token.lexeme === t.LEXEME_NEWLINE) && token.comment) {
            line += ' ; ' + token.comment.trim();
        }
        this
            .decIndent()
            .addLineToOutput(this.getIndentSpace() + line)
            .incIndent(1);
    }

    formatEndToken(iterator, token) {
        let line     = token.lexeme;
        let popCount = 0;
        if (this._indentStack.length) {
            let popCount = this._indentStack.pop();
        }
        iterator.skipWhiteSpaceWithoutNewline();
        token = iterator.peek();
        if (token && (token.lexeme === t.LEXEME_NEWLINE) && token.comment) {
            line += ' ; ' + token.comment.trim();
            token.comment = false;
        }
        this.addLineToOutput(this.getIndentSpace() + line);
        if (popCount > 1) {
            this._indentStack.pop();
        }
        iterator.next();
    }

    formatKeywordToken(iterator, token) {
        switch (token.lexeme) {
            case t.LEXEME_UNION:  this.formatSingleToken                (iterator, token); break;
            case t.LEXEME_ELSE:   this.formatSingleToken                (iterator, token); break;
            case t.LEXEME_PROC:   this.formatProcToken                  (iterator, token); break;
            case t.LEXEME_REPEAT: this.formatRepeatToken                (iterator, token); break;
            case t.LEXEME_OBJECT: this.formatTokenAndExpressionIncIndent(iterator, token); break;
            case t.LEXEME_RECORD: this.formatTokenAndExpressionIncIndent(iterator, token); break;
            case t.LEXEME_WHILE:  this.formatTokenAndExpressionIncIndent(iterator, token); break;
            case t.LEXEME_IF:     this.formatTokenAndExpressionIncIndent(iterator, token); break;
            case t.LEXEME_WITH:   this.formatTokenAndExpressionIncIndent(iterator, token); break;
            case t.LEXEME_RET:    this.formatTokenAndExpression         (iterator, token); break;
            case t.LEXEME_BREAK:  this.formatTokenAndExpression         (iterator, token); break;
            case t.LEXEME_ELSEIF: this.formatElseifToken                (iterator, token); break;
            case t.LEXEME_SELECT: this.formatSelectToken                (iterator, token); break;
            case t.LEXEME_CASE:   this.formatCaseToken                  (iterator, token); break;
            case t.LEXEME_FOR:    this.formatForToken                   (iterator, token); break;
            case t.LEXEME_END:    this.formatEndToken                   (iterator, token); break;
            default:
                console.error('Unsupported keyword token:', token.lexeme);
                break;
        }
    }

    formatIdentifierToken(iterator, token) {
        let line = token.lexeme;
        iterator.skipWhiteSpace();
        token = iterator.next();
        if (token) {
            switch (token.cls) {
                case t.TOKEN_PARENTHESIS_OPEN:
                    line += token.lexeme;
                    break;
                case t.LEXEME_BRACKET_OPEN:
                    line += token.lexeme;
                    break;
                case t.TOKEN_ASSIGNMENT_OPERATOR:
                    line += ' ' + token.lexeme + ' ';
                    break;
                default:
                    line += ' ' + token.lexeme;
                    break;
            }
        }
        this.addLineToOutput(this.getIndentSpace() + line + this.formatExpressionUntilEol(iterator, token))
    }

    formatPointerIdentifierToken(iterator, token) {
        let line = token.lexeme;
        iterator.skipWhiteSpace();
        token = iterator.next();
        if (token) {
            line += token.lexeme;
            token = iterator.next();
        }
        if (token) {
            switch (token.cls) {
                case t.TOKEN_PARENTHESIS_OPEN:
                    line += token.lexeme;
                    break;
                case t.LEXEME_BRACKET_OPEN:
                    line += token.lexeme;
                    break;
                case t.TOKEN_ASSIGNMENT_OPERATOR:
                    line += ' ' + token.lexeme + ' ';
                    break;
                default:
                    line += ' ' + token.lexeme;
                    break;
            }
        }
        this.addLineToOutput(this.getIndentSpace() + line + this.formatExpressionUntilEol(iterator, token))
    }

    formatMeta(meta, firstLine) {
        let i          = firstLine;
        let output     = this._output;
        let parts      = [];
        let maxLength1 = 0;
        let maxLength2 = 0;
        while ((i < output.length) && (output[i].trim().indexOf(meta) === 0)) {
            let line           = output[i];
            let comment        = '';
            let lineAndComment = this.splitComment(line);
            if (lineAndComment) {
                comment = lineAndComment.comment;
                line    = lineAndComment.line;
            }
            let p    = this.splitAtSpaceFilrered(line, 3);
            let part = {p1: p[1] || '', p2: p[2] || '', comment: comment};
            parts.push(part);
            maxLength1 = Math.max(part.p1.length, maxLength1);
            maxLength2 = Math.max(part.p2.length, maxLength2);
            i++;
        }
        parts.forEach((part, index) => {
            output[firstLine + index] = (meta + ' ' +
                this.toLength(part.p1, maxLength1) + ' ' +
                this.toLength(part.p2, maxLength2) + ' ' +
                (part.comment ? ('; ' + part.comment) : '')).trim();
        });
        return i;
    }

    formatVars(firstLine) {
        let i          = firstLine;
        let output     = this._output;
        let parts      = [];
        let maxLength0 = 0;
        let maxLength1 = 0;
        while ((i < output.length) && (this.splitAtSpaceFilrered(output[i], 2).length >= 2)) {
            if (this.startsWith(output[i], ['end', 'union', 'proc', '#', ';'])) {
                break;
            }
            let line           = output[i];
            let comment        = '';
            let lineAndComment = this.splitComment(line);
            if (lineAndComment) {
                comment = lineAndComment.comment;
                line    = lineAndComment.line;
            }
            let p    = this.splitAtSpaceFilrered(line, 2);
            let part = {p0: p[0] || '', p1: p[1] || '', comment: comment};
            parts.push(part);
            maxLength0 = Math.max(part.p0.length, maxLength0);
            maxLength1 = Math.max(part.p1.length, maxLength1);
            i++;
        }
        parts.forEach((part, index) => {
            // Keep the original indentation...
            let line   = output[firstLine + index];
            let indent = '';
            let i      = 0;
            while ((i < line.length) && (line[i] === ' ')) {
                indent += ' ';
                i++;
            }
            output[firstLine + index] = indent + (this.toLength(part.p0, maxLength0) + ' ' +
                this.toLength(part.p1, maxLength1) + ' ' + (part.comment ? ('; ' + part.comment) : '')).trim();
        });
        return i;
    }

    formatAssignment(firstLine) {
        let i                = firstLine;
        let output           = this._output;
        let parts            = [];
        let maxLength0       = 0;
        let maxLength1       = 0;
        let assignmentLength = 1;
        while ((i < output.length) && this.hasAssignment(output[i])) {
            let line           = output[i];
            let lineAndComment = this.splitComment(line);
            let assignment     = this.splitAssignement(lineAndComment ? lineAndComment.line : line);
            assignment.comment = lineAndComment ? lineAndComment.comment : false;
            parts.push(assignment);
            maxLength1       = Math.max(assignment.dest.length,       maxLength1);
            maxLength0       = Math.max(assignment.source.length,     maxLength0);
            assignmentLength = Math.max(assignment.assignment.length, assignmentLength);
            i++;
        }
        parts.forEach((part, index) => {
            // Keep the original indentation...
            let line   = output[firstLine + index];
            let indent = '';
            let i      = 0;
            while ((i < line.length) && (line[i] === ' ')) {
                indent += ' ';
                i++;
            }
            output[firstLine + index] = indent + (this.toLength(part.dest, maxLength1) + ' ' +
                (part.assignment + ' ').substr(0, assignmentLength) + ' ' +
                this.toLength(part.source, maxLength0) + ' ' + (part.comment ? ('; ' + part.comment) : '')).trim();
        });
        return i;
    }

    formatOutput() {
        let output = this._output;
        let i      = 0;
        while (i < output.length) {
            let line = output[i];
            if (line.trim().indexOf('#define') === 0) {
                i = this.formatMeta('#define', i);
            } else if (line.trim().indexOf('#include') === 0) {
                i = this.formatMeta('#include', i);
            } else if (line.trim().indexOf('#data') === 0) {
                i = this.formatMeta('#data', i);
            } else if (line.trim().indexOf('#line') === 0) {
                i = this.formatMeta('#line', i);
            } else if ((line.trim().indexOf('record') === 0) || (line.trim().indexOf('object') === 0)) {
                i = this.formatVars(i + 1);
            } else if (this.hasAssignment(line)) {
                i = this.formatAssignment(i);
            } else if (!this.startsWith(line, [t.LEXEME_END, t.LEXEME_PROC, t.LEXEME_IF, t.LEXEME_ELSEIF, t.LEXEME_WHILE, '#', ';']) &&
                (this.splitAtSpaceFilrered(line, 2).length >= 2)) {
                i = this.formatVars(i);
            }
            i++;
        }
    }

    format(source) {
        let lastToken;
        let tokens   = new t.Tokenizer().tokenize(source).getTokens();
        let iterator = new Iterator({tokens: tokens});
        let line;
        while (true) {
            let token = iterator.next();
            if (!token) {
                break;
            }
            switch (token.cls) {
                case t.TOKEN_WHITE_SPACE:
                    if (token.lexeme === t.LEXEME_NEWLINE) {
                        if (token.comment) {
                            this.addLineToOutput(';' + this.rtrim(token.comment));
                        } else if (this.getLastLine() !== '') {
                            this.addLineToOutput('');
                        }
                    } else if (token.comment) {
                        this.addLineToOutput(';' + this.rtrim(token.comment));
                    }
                    break;
                case t.TOKEN_TYPE:
                    this.formatIdentifierToken(iterator, token);
                    break;
                case t.TOKEN_META:
                    line      = token.lexeme;
                    lastToken = null;
                    while (token && (token.lexeme !== t.LEXEME_NEWLINE)) {
                        token = iterator.next();
                        if (token && (token.cls !== t.TOKEN_WHITE_SPACE)) {
                            lastToken = token;
                            line += ' ' + token.lexeme;
                        }
                    }
                    if (lastToken && lastToken.comment) {
                        line += ' ; ' + lastToken.comment.trim();
                    } else if (token && token.comment) {
                        line += ' ; ' + token.comment.trim();
                    }
                    this.addLineToOutput(line);
                    break;
                case t.TOKEN_KEYWORD:
                    this.formatKeywordToken(iterator, token);
                    break;
                case t.TOKEN_POINTER:
                    this.formatPointerIdentifierToken(iterator, token);
                    break;
                case t.TOKEN_IDENTIFIER:
                    this.formatIdentifierToken(iterator, token);
                    break;
            }
        }
        this.formatOutput();
        return this._output.join('\n') + '\n';
    }
};
