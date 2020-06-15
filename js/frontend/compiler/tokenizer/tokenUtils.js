/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t = require('./tokenizer');

exports.ASSIGMMENT                 = 0;
exports.ASSIGMMENT_RECORD          = 1;
exports.ASSIGNMENT_ARRAY           = 2;
exports.ASSIGNMENT_MATH_EXPRESSION = 3;

exports.getIndexAfterTokenPairs = function(expression, index, blockPair) {
    let indexExpression = [];
    let open            = 1;
    while ((index < expression.tokens.length) && open) {
        let token = expression.tokens[index];
        indexExpression.push(token);
        if (token.cls === blockPair[0]) {
            open++;
        } else if (token.cls === blockPair[1]) {
            open--;
        }
        index++;
    }
    indexExpression.pop();
    return {
        index:      index,
        expression: indexExpression
    };
};

exports.getLineFromToken = function(token, tokens) {
    if (!tokens) {
        return {left: '', lexeme: token.lexeme, right: ''};
    }
    let left        = '';
    let right       = '';
    let min         = 0;
    let max         = tokens.length - 1;
    let found       = false;
    let searchIndex = token.index;
    let index;
    // Do a binary search to find the item with the given index...
    while (!found) {
        if (min === max) {
            index = min;
            break;
        }
        let half = min + Math.floor((max - min) / 2);
        let t    = tokens[half];
        if (t.index === searchIndex) {
            index = half;
            break;
        } else if (searchIndex < t.index) {
            max = half;
        } else {
            min = half;
        }
    }
    // Get the left and right part of the line...
    let lineNum = token.lineNum;
    let t       = token;
    let i       = index;
    while (i > 0) {
        t = tokens[--i];
        if (t && (t.lineNum === lineNum)) {
            left = t.lexeme + left;
        } else {
            break;
        }
    }
    i = index;
    while (i < tokens.length) {
        t = tokens[++i];
        if (t && (t.lineNum === lineNum)) {
            right += t.lexeme;
        } else {
            break;
        }
    }
    return {
        left:   (left         + '').split('~').join('.'),
        lexeme: (token.lexeme + '').split('~').join('.'),
        right:  (right        + '').split('~').join('.')
    };
};

exports.removeParenthesis = function(tokens, startIndex, endIndex) {
    let found = false;
    if ((tokens[startIndex].cls === t.TOKEN_PARENTHESIS_OPEN) &&
        (tokens[endIndex - 1].cls === t.TOKEN_PARENTHESIS_CLOSE)) {
        let index = startIndex + 1;
        let open  = 1;
        while ((index < endIndex) && open) {
            switch (tokens[index].cls) {
                case t.TOKEN_PARENTHESIS_OPEN:
                    open++;
                    break;
                case t.TOKEN_PARENTHESIS_CLOSE:
                    open--;
                    break;
            }
            index++;
        }
        if (index === endIndex) {
            startIndex++;
            endIndex--;
            found = true;
        }
    }
    if (found) {
        return exports.removeParenthesis(tokens, startIndex, endIndex);
    }
    return {
        startIndex: startIndex,
        endIndex:   endIndex
    };
};

exports.getTokensFromRange = function(tokens, startIndex, endIndex) {
    let result = [];
    for (let index = startIndex; index < endIndex; index++) {
        result.push(tokens[index]);
    }
    return result;
};

exports.getTokensWithoutParenthesis = function(tokens) {
    let index = exports.removeParenthesis(tokens, 0, tokens.length);
    return exports.getTokensFromRange(tokens, index.startIndex, index.endIndex);
};

exports.assignmentType = function(tokens) {
    let token;
    let open;
    let i = 0;
    while (i < tokens.length) {
        token = tokens[i];
        if (token.cls !== t.TOKEN_WHITE_SPACE) {
            break;
        }
        i++;
    }
    switch (token.cls) {
        case t.TOKEN_BRACKET_OPEN:
            return exports.ASSIGNMENT_ARRAY;
        case t.TOKEN_CURLY_OPEN:
            return exports.ASSIGMMENT_RECORD;
    }
    while (i < tokens.length) {
        token = tokens[i++];
        switch (token.cls) {
            case t.TOKEN_BRACKET_OPEN:
                open = 1;
                while (open && (i < tokens.length)) {
                    token = tokens[i++];
                    switch (token.cls) {
                        case t.TOKEN_BRACKET_OPEN:
                            open++;
                            break;
                        case t.TOKEN_BRACKET_CLOSE:
                            open--;
                            break;
                    }
                }
                break;
            case t.TOKEN_PARENTHESIS_OPEN:
                open = 1;
                while (open && (i < tokens.length)) {
                    token = tokens[i++];
                    switch (token.cls) {
                        case t.TOKEN_PARENTHESIS_OPEN:
                            open++;
                            break;
                        case t.TOKEN_PARENTHESIS_CLOSE:
                            open--;
                            break;
                    }
                }
                break;
            case t.TOKEN_NUMERIC_OPERATOR:
                return exports.ASSIGNMENT_MATH_EXPRESSION;
        }
    }
    return exports.ASSIGMMENT;
};
