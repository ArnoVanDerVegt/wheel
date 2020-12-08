/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SourceFormatter = require('../../../js/frontend/ide/source/SourceFormatter').SourceFormatter;
const assert          = require('assert');

describe(
    'Test SourceFormatter',
    () => {
        describe(
            'Test SourceFormatter functions',
            () => {
                it(
                    'Should make length',
                    () => {
                        let sourceFormatter = new SourceFormatter({});
                        assert.equal(sourceFormatter.toLength('abc', 6), 'abc   ');
                        assert.equal(sourceFormatter.toLength('abcd', 3), 'abcd');
                    }
                );
                it(
                    'Should split into parts',
                    () => {
                        let sourceFormatter = new SourceFormatter({});
                        assert.deepEqual(sourceFormatter.split('a b c', 3), ['a', 'b', 'c']);
                        assert.deepEqual(sourceFormatter.split('a b c d', 3), ['a', 'b', 'c d']);
                        assert.deepEqual(sourceFormatter.split('a b c d', 2), ['a', 'b c d']);
                    }
                );
            }
        );
        describe(
            'Test meta',
            () => {
                it(
                    'Should format #define',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#define TEST 1',
                                '#define TEST_STRING "Hello world"',
                                '#define TEST_WITH_COMMENT 1245 ; This is a comment...'
                            ].join('\n'));
                        let s2 = [
                                '#define TEST              1',
                                '#define TEST_STRING       "Hello world"',
                                '#define TEST_WITH_COMMENT 1245          ; This is a comment...'
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
    }
);
