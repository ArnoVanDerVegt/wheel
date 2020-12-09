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
                        assert.deepEqual(sourceFormatter.splitAtSpace('a b c', 3), ['a', 'b', 'c']);
                        assert.deepEqual(sourceFormatter.splitAtSpace('a b c d', 3), ['a', 'b', 'c d']);
                        assert.deepEqual(sourceFormatter.splitAtSpace('a b c d', 2), ['a', 'b c d']);
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
        describe(
            'Test global var',
            () => {
                it(
                    'Should format var',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     number    n'
                            ].join('\n'));
                        let s2 = [
                                'number n',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format var with comment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     number    n  ;    With comment...'
                            ].join('\n'));
                        let s2 = [
                                'number n ; With comment...',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record vars',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     Record    r',
                                '  LongerName lN'
                            ].join('\n'));
                        let s2 = [
                                'Record     r',
                                'LongerName lN',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record vars with array',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     Record    r [ 10 ]',
                                '  LongerName lN'
                            ].join('\n'));
                        let s2 = [
                                'Record     r[10]',
                                'LongerName lN',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record vars with pointers',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     ^Record    r [ 10 ]',
                                '  LongerName ^ lN'
                            ].join('\n'));
                        let s2 = [
                                '^Record    r[10]',
                                'LongerName ^lN',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record vars with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '     Record    r [ 10 ] ; First comment',
                                '  LongerName lN ; Second comment'
                            ].join('\n'));
                        let s2 = [
                                'Record     r[10] ; First comment',
                                'LongerName lN    ; Second comment',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test local var',
            () => {
                it(
                    'Should format local var',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '     number    n',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    number n',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format local var with comment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '     number    n  ;    With comment...',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    number n ; With comment...',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format local record vars with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '     Record    r [ 10 ] ; First comment',
                                '  LongerName lN ; Second comment',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    Record     r[10] ; First comment',
                                '    LongerName lN    ; Second comment',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test record field',
            () => {
                it(
                    'Should format record fields',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'record Rec',
                                '      number    f1',
                                '        number    f123',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'record Rec',
                                '    number f1',
                                '    number f123',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record fields with record type',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'record Rec',
                                '      RecA    f1',
                                '        LongerRec    f123',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'record Rec',
                                '    RecA      f1',
                                '    LongerRec f123',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record fields with record type and pointers',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'record Rec',
                                '      ^RecA    f1',
                                '        LongerRec    ^f123',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'record Rec',
                                '    ^RecA     f1',
                                '    LongerRec ^f123',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record fields with record type and pointers and array',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'record Rec',
                                '      ^RecA    f1[10]',
                                '        LongerRec    ^f123',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'record Rec',
                                '    ^RecA     f1[10]',
                                '    LongerRec ^f123',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record fields and comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'record Rec',
                                '      ^RecA    f1[10]   ;    First comment',
                                '        LongerRec    ^f123456   ;  Second comment',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'record Rec',
                                '    ^RecA     f1[10]   ; First comment',
                                '    LongerRec ^f123456 ; Second comment',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record fields with a union',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'record Rec',
                                '      number    f1',
                                '        number    f123',
                                '   union',
                                '      number    ab1',
                                '        number    abc123',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'record Rec',
                                '    number f1',
                                '    number f123',
                                'union',
                                '    number ab1',
                                '    number abc123',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format record fields with pointers, array, union and comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'record Rec',
                                '  number f1 ; Hello world',
                                '    number    f123 ; Hello hello world',
                                '  union   ; Test union comment...',
                                '      ^RecA    f1[10]   ;          First comment',
                                '        LongerRec    ^f123456   ;        Second comment',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'record Rec',
                                '    number f1   ; Hello world',
                                '    number f123 ; Hello hello world',
                                'union ; Test union comment...',
                                '    ^RecA     f1[10]   ; First comment',
                                '    LongerRec ^f123456 ; Second comment',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test assignment',
            () => {
                it(
                    'Should format assignment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '      i   =   j',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    i = j',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format assignments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '      i   =   jjjjj',
                                '       aaa   =   b',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    i   = jjjjj',
                                '    aaa = b',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format assignments with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '      i   =   jjjjj ; With first comment....',
                                '       aaa   =   b      ; And second comment',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    i   = jjjjj ; With first comment....',
                                '    aaa = b     ; And second comment',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format assignment and assignment operator',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '      i   =   jjjjj',
                                '       aaa   +=   b',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    i   =  jjjjj',
                                '    aaa += b',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format assignment and assignment operator with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '      i   =   jjjjj     ; With first comment....',
                                '       aaa   +=   b  ; And second comment',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    i   =  jjjjj ; With first comment....',
                                '    aaa += b     ; And second comment',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format assignments followed by for statement',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '      i   =   jjjjj     ; With first comment....',
                                '       aaa   +=   b  ; And second comment',
                                '   for    counter     =    0   to   10',
                                '  end',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    i   =  jjjjj ; With first comment....',
                                '    aaa += b     ; And second comment',
                                '    for counter = 0 to 10',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test if',
            () => {
                it(
                    'Should format if',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '    if       i   ==  0',
                                '    end',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    if i == 0',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format if...else',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '       if      i        ==         0',
                                '            i      =  5',
                                '       else',
                                '             i      =     10',
                                '    end',
                                'end',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    if i == 0',
                                '        i = 5',
                                '    else',
                                '        i = 10',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format if...elseif...else',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '       if      i        ==         0',
                                '            i      =  5',
                                '       elseif   i   == 7',
                                '               i    = 3',
                                '       else',
                                '             i      =     10',
                                '    end',
                                'end',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    if i == 0',
                                '        i = 5',
                                '    elseif i == 7',
                                '        i = 3',
                                '    else',
                                '        i = 10',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format if...elseif...else with boolean operator',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '       if      i        ==         0   or j != 4',
                                '            i      =  5',
                                '       elseif   i   == 7    and j    !=   2',
                                '               i    = 3',
                                '       else',
                                '             i      =     10',
                                '    end',
                                'end',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    if i == 0 or j != 4',
                                '        i = 5',
                                '    elseif i == 7 and j != 2',
                                '        i = 3',
                                '    else',
                                '        i = 10',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format if...elseif...else with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '       if      i        ==         0      ;    If comment...',
                                '            i      =  5',
                                '       elseif   i   == 7      ;    Elseif comment...',
                                '               i    = 3',
                                '       else ;      Else comment...',
                                '             i      =     10',
                                '    end',
                                'end',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    if i == 0 ; If comment...',
                                '        i = 5',
                                '    elseif i == 7 ; Elseif comment...',
                                '        i = 3',
                                '    else ; Else comment...',
                                '        i = 10',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format if...elseif...else with boolean operator and comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '       if      i        ==         0    or    j < 4   ;    If comment...',
                                '            i      =  5',
                                '       elseif   i   == 7    and j  >   10   ;    Elseif comment...',
                                '               i    = 3',
                                '       else ;      Else comment...',
                                '             i      =     10',
                                '    end',
                                'end',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    if i == 0 or j < 4 ; If comment...',
                                '        i = 5',
                                '    elseif i == 7 and j > 10 ; Elseif comment...',
                                '        i = 3',
                                '    else ; Else comment...',
                                '        i = 10',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test repeat',
            () => {
                it(
                    'Should format repeat',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '  repeat',
                                '      end',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    repeat',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format repeat with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '  repeat    ;    First comment...',
                                '      end      ;  Second comment...',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    repeat ; First comment...',
                                '    end ; Second comment...',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format repeat with nested if and comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '  repeat    ;    First comment...',
                                '     if i    !=   1',
                                '       break    ;   Break',
                                '  end',
                                '      end      ;  Second comment...',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    repeat ; First comment...',
                                '        if i != 1',
                                '            break ; Break',
                                '        end',
                                '    end ; Second comment...',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test while',
            () => {
                it(
                    'Should format while',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '   while    i',
                                '      end',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    while i',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format while with comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '   while    i      ;     First comment...',
                                ';This is a nested comment...',
                                '      end    ;     Second comment...   ',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    while i ; First comment...',
                                '        ; This is a nested comment...',
                                '    end ; Second comment...',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format while with nested if and comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '   while    i      ;     First comment...',
                                ' if i > 3',
                                '    break  ;    Break',
                                '    end',
                                '      end    ;     Second comment...   ',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    while i ; First comment...',
                                '        if i > 3',
                                '            break ; Break',
                                '        end',
                                '    end ; Second comment...',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test select',
            () => {
                it(
                    'Should format select',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '   select    i',
                                '  case    5:',
                                '    j = 3',
                                '  case    15:',
                                '    j = 90',
                                '      default:',
                                ' j = 0',
                                '      end',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    select i',
                                '        case 5:',
                                '            j = 3',
                                '        case 15:',
                                '            j = 90',
                                '        default:',
                                '            j = 0',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format select with nested statements',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '   select    i',
                                '  case    5:',
                                '    if  j    ==   1',
                                '    j = 3',
                                ' end',
                                '  case    15:',
                                '     while        j',
                                '    j = 90',
                                ' end',
                                '      default:',
                                '     repeat',
                                '    j = 0',
                                '    end',
                                '      end',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    select i',
                                '        case 5:',
                                '            if j == 1',
                                '                j = 3',
                                '            end',
                                '        case 15:',
                                '            while j',
                                '                j = 90',
                                '            end',
                                '        default:',
                                '            repeat',
                                '                j = 0',
                                '            end',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format select with nested statements and comments',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                'proc test()',
                                '   select    i    ;     This is a select comment',
                                '  case    5:    ;     This is a case comment',
                                ' ; This is a nested comment...',
                                '    if  j    ==   1',
                                '    j = 3',
                                ' end',
                                '  case    15:',
                                '     while        j',
                                '    j = 90',
                                ' end',
                                '      default:   ;      This is a default comment',
                                '     repeat',
                                '    j = 0',
                                '    end',
                                '      end',
                                'end'
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    select i ; This is a select comment',
                                '        case 5: ; This is a case comment',
                                '            ; This is a nested comment...',
                                '            if j == 1',
                                '                j = 3',
                                '            end',
                                '        case 15:',
                                '            while j',
                                '                j = 90',
                                '            end',
                                '        default:  ; This is a default comment',
                                '            repeat',
                                '                j = 0',
                                '            end',
                                '    end',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test addr',
            () => {
                it(
                    'Should format addr',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc test()',
                                '     addr x.y.z',
                                '    end',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    addr x.y.z',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format addr with comment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc test()',
                                '     addr x.y.z     ;  This is a comment... ',
                                '    end',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    addr x.y.z ; This is a comment...',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
            }
        );
        describe(
            'Test ret',
            () => {
                it(
                    'Should format ret',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc test()',
                                '     ret x.y.z',
                                '    end',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    ret x.y.z',
                                'end',
                                ''
                            ].join('\n');
                        assert.equal(s1, s2);
                    }
                );
                it(
                    'Should format ret with comment',
                    () => {
                        let sf = new SourceFormatter({});
                        let s1 = sf.format([
                                '  proc test()',
                                '     ret x.y.z     ;  This is a comment... ',
                                '    end',
                                '',
                            ].join('\n'));
                        let s2 = [
                                'proc test()',
                                '    ret x.y.z ; This is a comment...',
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
