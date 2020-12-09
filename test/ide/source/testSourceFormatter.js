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
            'Test comment',
            () => {
                it(
                    'Should format comment at start of line',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     ; This is a test comment',
                                '  ; One more comment...',
                                '',
                            ].join('\n'));
                        let s2 = [
                                '; This is a test comment',
                                '; One more comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should not remove spaces at beginning of comment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '; This is a table',
                                '; Id | Value',
                                '; ----------',
                                ';  0 | Ab',
                                ';  5 | Cde',
                                '; 15 | Fghi'
                            ].join('\n'));
                        let s2 = [
                                '; This is a table',
                                '; Id | Value',
                                '; ----------',
                                ';  0 | Ab',
                                ';  5 | Cde',
                                '; 15 | Fghi',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test meta',
            () => {
                it(
                    'Should format #project',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     ; This is a test project',
                                '  ; One more comment...',
                                '    #project       "My test project"',
                                '',
                            ].join('\n'));
                        let s2 = [
                                '; This is a test project',
                                '; One more comment...',
                                '#project "My test project"',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #optimizer',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#optimizer "on"',
                                '#optimizer "off" ; With comment...'
                            ].join('\n'));
                        let s2 = [
                                '#optimizer "on"',
                                '#optimizer "off" ; With comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #heap',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#heap 1024',
                                '#heap 20480 ; With comment...'
                            ].join('\n'));
                        let s2 = [
                                '#heap 1024',
                                '#heap 20480 ; With comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #rangecheck',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#rangecheck    "on"',
                                '#rangecheck        "off"; With comment...'
                            ].join('\n'));
                        let s2 = [
                                '#rangecheck "on"',
                                '#rangecheck "off" ; With comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #stringlength',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#stringlength    64',
                                '#stringlength        128; With comment...'
                            ].join('\n'));
                        let s2 = [
                                '#stringlength 64',
                                '#stringlength 128 ; With comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #stringcount',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#stringlength    50; With comment...',
                                '#stringlength        100'
                            ].join('\n'));
                        let s2 = [
                                '#stringlength 50 ; With comment...',
                                '#stringlength 100',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #include',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#include   "lib/standard.whl" ; Include.',
                                '#include "lib/motor.whl"',
                                '#include     "lib/sensor.whl"      ; With comment...'
                            ].join('\n'));
                        let s2 = [
                                '#include "lib/standard.whl"   ; Include.',
                                '#include "lib/motor.whl"',
                                '#include "lib/sensor.whl"     ; With comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #define',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#define     SINGLE     "abc"',
                                '',
                                '#define     AA     "aa" ; Info',
                                '#define     BB     "bbbb" ; More info...',
                                '',
                                '#define TEST 1',
                                '#define TEST_STRING "Hello world"',
                                '#define TEST_WITH_COMMENT 1245 ; This is a comment...'
                            ].join('\n'));
                        let s2 = [
                                '#define SINGLE "abc"',
                                '',
                                '#define AA "aa"   ; Info',
                                '#define BB "bbbb" ; More info...',
                                '',
                                '#define TEST              1',
                                '#define TEST_STRING       "Hello world"',
                                '#define TEST_WITH_COMMENT 1245          ; This is a comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #image and #data',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#image     "test.rfg"',
                                '#data    "01010101011"',
                                '#data       "11101000011"     ; This is a pixel row',
                                '#data     "00011111000"'
                            ].join('\n'));
                        let s2 = [
                                '#image "test.rfg"',
                                '#data "01010101011"',
                                '#data "11101000011"   ; This is a pixel row',
                                '#data "00011111000"',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format #text and #line',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '#text     "test.rtf"',
                                '#line    "The quick"',
                                '#line       "brown fox jumped"     ; This is a text line',
                                '#line     "over the lazy dogs back" ; Another line'
                            ].join('\n'));
                        let s2 = [
                                '#text "test.rtf"',
                                '#line "The quick"',
                                '#line "brown fox jumped"          ; This is a text line',
                                '#line "over the lazy dogs back"   ; Another line',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test proc',
            () => {
                it(
                    'Should format proc',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc myProc()',
                                '    end',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc myProc()',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format proc with comment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc myProc() ; With a comment',
                                '    end',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc myProc() ; With a comment',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format proc with comment after end',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc myProc()',
                                '    end      ;   With a comment',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc myProc()',
                                'end ; With a comment',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format two proc with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc myProc1()',
                                '    end ; With a comment',
                                '',
                                '  proc myProc2()     ; Start a new proc..',
                                '    end     ;     With another comment',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc myProc1()',
                                'end ; With a comment',
                                '',
                                'proc myProc2() ; Start a new proc..',
                                'end ; With another comment',
                                '',
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format method proc',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc Objct.myProc()',
                                '    end'
                            ].join('\n'));
                        let s2 = [
                                'proc Objct.myProc()',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format method proc with comment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc Objct.myProc(  Rec    ^rec  )     ; This is a method comment',
                                '    end'
                            ].join('\n'));
                        let s2 = [
                                'proc Objct.myProc(Rec ^rec) ; This is a method comment',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format a proc with a proc var',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc myProc(number   p,    number  pp  [4])',
                                '      proc procVar',
                                '    end',
                                '',
                                '  proc Objct.myMethod()',
                                '      proc procVar2    ;  With a comment...',
                                '    end'
                            ].join('\n'));
                        let s2 = [
                                'proc myProc(number p, number pp[4])',
                                '    proc procVar',
                                'end',
                                '',
                                'proc Objct.myMethod()',
                                '    proc procVar2 ; With a comment...',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
    }
);
