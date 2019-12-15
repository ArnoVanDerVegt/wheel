/* eslint-disable */
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function() {
    CodeMirror.defineMode(
        'lms',
        function() {
            function words(str) {
                let obj   = {};
                let words = str.split(' ');
                for (let i = 0; i < words.length; ++i) {
                    obj[words[i]] = true;
                }
                return obj;
            }
            let types    = words(
                    'DATA8 DATA16 DATA32 DATAS DATAF HANDLE ' +
                    'OUT_8 OUT_16 OUT_32 OUT_F IN_8 IN_16 IN_32 IN_F IO_8 IO_16 IO_32 IO_F'
                );
            let meta     = words('CALL FILE UI_DRAW UI_BUTTON ARRAY MATH LED STRINGS');
            let keywords = words(
                    'subcall vmthread ' +
                    'RETURN ' +
                    'MOVE8_8 MOVE8_16 MOVE8_32 MOVE8_F MOVE16_8 MOVE16_16 MOVE16_32 MOVE16_F ' +
                    'MOVE32_8 MOVE32_16 MOVE32_32 MOVE32_F MOVEF_8 MOVEF_16 MOVEF_32 MOVEF_F ' +
                    'WRITE8 WRITE16 WRITE32 WRITEF ' +
                    'ADD8 ADD16 ADD32 ADDF SUB8 SUB16 SUB32 SUBF MUL8 MUL16 MUL32 MULF DIV8 DIV16 DIV32 DIVF ' +
                    'OR8 OR16 OR32 AND8 AND16 AND32 XOR8 XOR16 XOR32 RL8 RL16 RL32 ' +
                    'CP_LT8 CP_LT16 CP_LT32 CP_LTF CP_GT8 CP_GT16 CP_GT32 ' +
                    'CP_GTF CP_EQ8 CP_EQ16 CP_EQ32 CP_EQF CP_NEQ8 CP_NEQ16 ' +
                    'CP_NEQ32 CP_NEQF CP_LTEQ8 CP_LTEQ16 CP_LTEQ32 CP_LTEQF ' +
                    'CP_GTEQ8 CP_GTEQ16 CP_GTEQ32 CP_GTEQF ' +
                    'JR_LT8 JR_LT16 JR_LT32 JR_LTF JR_GT8 JR_GT16 JR_GT32 ' +
                    'JR_GTF JR_EQ8 JR_EQ16 JR_EQ32 JR_EQF JR_NEQ8 JR_NEQ16 ' +
                    'JR_NEQ32 JR_NEQF JR_LTEQ8 JR_LTEQ16 JR_LTEQ32 ' +
                    'JR_LTEQF JR_GTEQ8 JR_GTEQ16 JR_GTEQ32 JR_GTEQF' +
                    'GET_VBATT GET_IBATT GET_OS_VERS GET_EVENT GET_TBATT ' +
                    'GET_IMOTOR GET_STRING GET_HW_VERS GET_FW_VERS GET_FW_BUILD ' +
                    'GET_OS_BUILD GET_ADDRESS GET_CODE KEY GET_SHUTDOWN ' +
                    'GET_WARNING GET_LBATT TEXTBOX_READ DESTINATION GET_VERSION ' +
                    'GET_IP GET_SDCARD GET_USBSTICK GET_FW_BUILD ' +
                    'UI_FLUSH UI_READ UI_WRITE KEEP_ALIVE ' +
                    'INFO COM_GET COM_SET'
                );
            let defines = words(
                    'FILLWINDOW UPDATE ' +
                    'WAIT_FOR_PRESS ' +
                    'CREATE8 CREATE16 CREATE32 CREATEF RESIZE DELETE ' +
                    'GET_HANDLE OPEN_READ READ_TEXT ' +
                    'STRING_TO_VALUE ' +
                    // UI_DRAW:
                    'UPDATE PIXEL LINE CIRCLE ICON PICTURE VALUE FILLRECT RECT ' +
                    'NOTIFICATION QUESTION BROWSE INVERSERECT SELECT_FONT TOPLINE ' +
                    'FILLWINDOW VIEW_VALUE VIEW_UNIT FILLCIRCLE STORE RESTORE ' +
                    'ICON_QUESTION BMPFILE GRAPH_SETUP GRAPH_DRAW TEXTBOX ' +
                    // UI_WRITE:
                    'WRITE_FLUSH FLOATVALUE PUT_STRING VALUE8 VALUE16 ' +
                    'VALUE32 VALUEF DOWNLOAD_END SCREEN_BLOCK TEXTBOX_APPEND ' +
                    'SET_BUSY SET_TESTPIN INIT_RUN LED POWER TERMINAL ' +
                    'SHORTPRESS LONGPRESS WAIT_FOR_PRESS FLUSH PRESS RELEASE ' +
                    'GET_HORZ GET_VERT PRESSED SET_BACK_BLOCK GET_BACK_BLOCK ' +
                    'TESTSHORTPRESS TESTLONGPRESS GET_BUMBED GET_CLICK'
                );

            function tokenBase(stream, state) {
                let editor   = stream.lineOracle.doc.cm;
                let database = (editor && editor.getCodeDatabase) ? editor.getCodeDatabase() : null;
                let ch       = stream.next();
                if (ch === '\'') {
                    state.tokenize = tokenString(ch);
                    return state.tokenize(stream, state);
                }
                if (/\d/.test(ch)) {
                    stream.eatWhile(/[\w\.]/);
                    return 'number';
                }
                if ((ch == '/') && stream.eat('/')) {
                    stream.skipToEnd();
                    return 'comment';
                }
                if ('{}():,@'.indexOf(ch) !== -1) {
                    return 'operator';
                }
                stream.eatWhile(/[\w\$_]/);
                let cur = stream.current();
                if (keywords.propertyIsEnumerable(cur)) {
                    return 'keyword';
                }
                if (defines.propertyIsEnumerable(cur)) {
                    return 'define';
                }
                if (types.propertyIsEnumerable(cur)) {
                    return 'type';
                }
                if (meta.propertyIsEnumerable(cur)) {
                    return 'meta';
                }
                return 'variable';
            }

            function tokenString(quote) {
                return function(stream, state) {
                    let escaped = false;
                    let next;
                    let end     = false;
                    while ((next = stream.next()) != null) {
                        if (next == quote && !escaped) {
                            end = true;
                            break;
                        }
                        escaped = !escaped && next == '\\';
                    }
                    if (end || !escaped) {
                        state.tokenize = null;
                    }
                    return 'string';
                };
            }

            // Interface
            return {
                startState: function() {
                    return {tokenize: null};
                },

                token: function(stream, state) {
                    if (stream.eatSpace()) {
                        return null;
                    }
                    let style = (state.tokenize || tokenBase)(stream, state);
                    if ((style === 'comment') || (style === 'meta')) {
                        return style;
                    }
                    return style;
                },

                electricChars: '{}'
            };
        }
    );
    CodeMirror.defineMIME('text/x-lms', 'lms');
})();
