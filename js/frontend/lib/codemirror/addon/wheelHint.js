/* eslint-disable */
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {mod(CodeMirror);})(function(CodeMirror) {

let Pos        = CodeMirror.Pos;
let database   = null;
let completions = null;

function scriptHint(editor, getToken, options) {
    database = editor.getCodeDatabase ? editor.getCodeDatabase() : null;
    // Find the token at the cursor
    let cur = editor.getCursor(), token = getToken(editor, cur);
    if (/\b(?:string|comment)\b/.test(token.type)) {
        return;
    }
    let innerMode = CodeMirror.innerMode(editor.getMode(), token.state);
    if (innerMode.mode.helperType === 'json') {
        return;
    }
    token.state = innerMode.state;

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
        token = {
            start:  cur.ch,
            end:    cur.ch,
            string: '',
            state:  token.state,
            type:   token.string == '.' ? 'property' : null
        };
    } else if (token.end > cur.ch) {
        token.end    = cur.ch;
        token.string = token.string.slice(0, cur.ch - token.start);
    }

    let tprop   = token;
    let context = [];
    /*
    // If it is a property, find out what it is a property of.
    while (tprop.type == 'property') {
        tprop = getToken(editor, Pos(cur.line, tprop.start));
        if (tprop.string != '.') {
            return;
        }
        tprop = getToken(editor, Pos(cur.line, tprop.start));
        if (!context) {
            let context = [];
        }
        context.push(tprop);
    }
    */
    return {
        list: getCompletions(token, context, options),
        from: Pos(cur.line, token.start),
        to:   Pos(cur.line, token.end)
    };
}

const wheelLexemes = [
        'namespace',
        'addr',
        'and',
        'break',
        'case',
        'default',
        'downto',
        'else',
        'end',
        'for',
        'if',
        'main',
        'mod',
        'number',
        'or',
        'proc',
        'record',
        'repeat',
        'ret',
        'select',
        'step',
        'string',
        'to',
        'while'
    ];

function wheelHint(editor, options) {
    return scriptHint(
        editor,
        function (e, cur) {return e.getTokenAt(cur);},
        options
    );
};
CodeMirror.registerHelper('hint', 'wheel', wheelHint);

class Completions {
    constructor() {
        this._infoLength = 0;
    }

    getSpan(s, className) {
        this._infoLength += s.length;
        return '<span class="' + className + '">' + s + '</span>';
    }

    getVarString(vr) {
        let vrString = '';
        let type     = vr.getType();
        if (typeof type === 'string') {
            vrString = this.getSpan(type, 'type');
        } else {
            vrString = this.getSpan(type.getName(), 'record');
        }
        vrString += ' ';
        if (vr.getPointer()) {
            vrString += this.getSpan('^', 'operator');
        }
        vrString += this.getSpan(vr.getName(), 'variable');
        if (vr.getArraySize() !== false) {
            vrString += this.getSpan('[', 'operator') + this.getSpan(vr.getArraySize(), 'number') + this.getSpan(']', 'operator')
        }
        return vrString;
    }

    getProcCompletions(found, list, s) {
        for (let i = 0; i < list.length; i++) {
            let proc = list[i];
            let name = proc.getName();
            if (name.indexOf(s) === 0) {
                let params    = proc.getVars();
                let paramList = [];
                let hasMore   = false;
                this._infoLength = name.length + 1;
                for (let j = 2; j < proc.getParamCount() + 2; j++) {
                    if (this._infoLength > 20) {
                        hasMore = true;
                        break;
                    }
                    this._infoLength += 2;
                    paramList.push(this.getVarString(params[j]));
                }
                let hint = this.getSpan(name, 'proc') + this.getSpan('(', 'operator') + paramList.join(', ');
                if (hasMore) {
                    hint += '...';
                } else {
                    hint += this.getSpan(')', 'operator');
                }
                found.push({
                    keyword:  name,
                    title:    'proc',
                    hint:     hint,
                    toString: function() { return this.keyword; }
                });
            }
        }
    }

    getRecordCompletions(found, list, s) {
        for (let i = 0; i < list.length; i++) {
            let record = list[i];
            let name   = record.getName();
            if (name.indexOf(s) === 0) {
                let fields    = record.getVars();
                let fieldList = [];
                let hasMore   = false;
                this._infoLength = name.length + 3;
                for (let j = 0; j < fields.length; j++) {
                    if (this._infoLength > 60) {
                        hasMore = true;
                        break;
                    }
                    this._infoLength += 2;
                    fieldList.push(this.getVarString(fields[j]));
                }
                let hint = this.getSpan(name, 'record') + ' - ' + fieldList.join(', ');
                if (hasMore) {
                    hint += '...';
                }
                found.push({
                    keyword:  name,
                    title:    'record',
                    hint:     hint,
                    toString: function() { return this.keyword; }
                });
            }
        }
    }

    getDefineCompletions(found, list, s) {
        for (let i = 0; i < list.length; i++) {
            let define = list[i];
            let key    = define.key;
            if (key.indexOf(s) === 0) {
                let hint  = this.getSpan(define.key, 'define') + ' = ';
                let value = define.value + '';
                if (value.substr(0, 1) === '"') {
                    hint += this.getSpan(value, 'string');
                } else {
                    hint += this.getSpan(value, 'number');
                }
                found.push({
                    keyword:  key,
                    title:    'define',
                    hint:     hint,
                    toString: function() { return this.keyword; }
                });
            }
        }
    }
}

function getCompletions(token, context, options) {
    if (!completions) {
        completions = new Completions();
    }
    let found = [];
    let s     = token.string;
    if (s.trim() === '') {
        return found;
    }

    for (let i = 0; i < wheelLexemes.length; i++) {
        let wheelLexeme = wheelLexemes[i];
        if (wheelLexeme.indexOf(s) === 0) {
            found.push({
                keyword:  wheelLexeme,
                title:    wheelLexeme,
                toString: function() { return this.keyword; }
            });
        }
    }
    found.sort();
    if (database.compiler) {
        // Procedures...
        let procList = [];
        completions.getProcCompletions(procList, database.compiler.getProc(), s);
        procList.sort();
        found = found.concat(procList);
        // Records...
        let recordList = [];
        completions.getRecordCompletions(recordList, database.compiler.getRecords(), s);
        recordList.sort();
        found = found.concat(recordList);
    }
    if (database.defines) {
        // Defines...
        let defineList = [];
        completions.getDefineCompletions(defineList, database.defines.getList(), s);
        defineList.sort();
        found = found.concat(defineList);
    }

    return found;
}

});