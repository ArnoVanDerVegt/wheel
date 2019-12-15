/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const tokenUtils = require('../../js/frontend/compiler/tokenizer/tokenUtils');
const assert     = require('assert');

describe(
    'Test tokenUtils',
    function() {
        describe(
            'Test getLineFromToken',
            function() {
                let tokens = [
                        {index: 0, lineNum: 0, lexeme: 'a'},
                        {index: 1, lineNum: 0, lexeme: 'b'},
                        {index: 2, lineNum: 0, lexeme: 'c'},
                        {index: 3, lineNum: 1, lexeme: 'd'},
                        {index: 4, lineNum: 1, lexeme: 'e'},
                        {index: 5, lineNum: 1, lexeme: 'f'},
                        {index: 6, lineNum: 2, lexeme: 'g'},
                        {index: 7, lineNum: 2, lexeme: 'h'},
                        {index: 8, lineNum: 3, lexeme: 'i'}
                    ];
                it(
                    'Should get line from middle index',
                    function() {
                        let line = tokenUtils.getLineFromToken(tokens[4], tokens);
                        assert.deepEqual(line, {left: 'd', lexeme: 'e', right: 'f'});
                    }
                );
                it(
                    'Should get line from start index',
                    function() {
                        let line = tokenUtils.getLineFromToken(tokens[3], tokens);
                        assert.deepEqual(line, {left: '', lexeme: 'd', right: 'ef'});
                    }
                );
                it(
                    'Should get line from end index',
                    function() {
                        let line = tokenUtils.getLineFromToken(tokens[5], tokens);
                        assert.deepEqual(line, {left: 'de', lexeme: 'f', right: ''});
                    }
                );
            }
        );
    }
);
