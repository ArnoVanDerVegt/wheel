/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const assert       = require('assert');
const PreProcessor = require('../../js/frontend/compiler/preprocessor/PreProcessor').PreProcessor;
const compiler     = require('../../js/frontend/compiler/Compiler');
const Linter       = require('../../js/frontend/compiler/linter/Linter');

const compileWithLinter = function(source, linter, done) {
        let getFileData = function(filename, token, callback) {
                callback(source.join('\n'));
            };
        let preProcessor = new PreProcessor({getFileData: getFileData, linter: linter});
        let preProcessed = () => {
                let tokens = preProcessor.getDefinedConcatTokens();
                new compiler.Compiler({preProcessor: preProcessor, linter: linter}).buildTokens(tokens);
                done();
            };
        preProcessor.processFile({filename: 'main.whl', token: null}, 0, 0, preProcessed);
    };

describe(
    'Test linter',
    () => {
        it(
            'Should lint define',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        '#define something 5',
                        'proc main()',
                        '    number n',
                        '    n = something',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 1);
                        let message = messages[0];
                        assert.equal(message.type,             Linter.DEFINE);
                        assert.equal(message.token.origLexeme, 'something');
                    }
                );
            }
        );
        it(
            'Should lint record',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'record point',
                        '    number x, y',
                        'end',
                        'proc main()',
                        '    point p',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 1);
                        let message = messages[0];
                        assert.equal(message.type,             Linter.RECORD);
                        assert.equal(message.token.origLexeme, 'point');
                    }
                );
            }
        );
        it(
            'Should lint field',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'record Point',
                        '    number X, Y',
                        'end',
                        'proc main()',
                        '    Point p',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 2);
                        let message = messages[0];
                        assert.equal(message.type,             Linter.FIELD);
                        assert.equal(message.token.origLexeme, 'X');
                        message = messages[1];
                        assert.equal(message.type,             Linter.FIELD);
                        assert.equal(message.token.origLexeme, 'Y');
                    }
                );
            }
        );
        it(
            'Should lint var',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'proc main()',
                        '    number Number',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 1);
                        let message = messages[0];
                        assert.equal(message.type,             Linter.VAR);
                        assert.equal(message.token.origLexeme, 'Number');
                    }
                );
            }
        );
        it(
            'Should lint var',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'proc main()',
                        '    number my_number',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 1);
                        let message = messages[0];
                        assert.equal(message.type,             Linter.VAR);
                        assert.equal(message.expected,         'myNumber');
                        assert.equal(message.token.origLexeme, 'my_number');
                        linter.reset();
                        assert.equal(messages.length, 0);
                    }
                );
            }
        );
        it(
            'Should lint proc',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'proc Test()',
                        '    number i',
                        'end',
                        'proc main()',
                        '    Test()',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 1);
                        let message = messages[0];
                        assert.equal(message.type,             Linter.PROC);
                        assert.equal(message.token.origLexeme, 'Test');
                    }
                );
            }
        );
        it(
            'Should lint param',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'proc test(number Param)',
                        '    number i',
                        'end',
                        'proc main()',
                        '    test(3)',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 1);
                        let message = messages[0];
                        assert.equal(message.type,             Linter.PARAM);
                        assert.equal(message.token.origLexeme, 'Param');
                    }
                );
            }
        );
        it(
            'Should lint whitespace',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'proc main()',
                        '     number n',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 1);
                        let message = messages[0];
                        assert.equal(message.type,              Linter.WHITE_SPACE);
                        assert.equal(message.expected.found,    5);
                        assert.equal(message.expected.expected, 4);
                    }
                );
            }
        );
        it(
            'Should lint tab',
            () => {
                let linter = new Linter.Linter();
                let source = [
                        'proc main()',
                        '\t' + 'number n',
                        'end'
                    ];
                compileWithLinter(
                    source,
                    linter,
                    () => {
                        let messages = linter.getMessages();
                        assert.equal(messages.length, 2);
                        let message = messages[0];
                        assert.equal(message.type,              Linter.WHITE_SPACE);
                        assert.equal(message.expected.found,    1);
                        assert.equal(message.expected.expected, 0);
                        message = messages[1];
                        assert.equal(message.type,              Linter.TAB);
                    }
                );
            }
        );
    }
);
