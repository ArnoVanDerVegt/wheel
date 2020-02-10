/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;
const path       = require('../../lib/path');

const getVarString = function(vr, getSpan) {
    let vrString = '';
    let type     = vr.getType();
    if (typeof type === 'string') {
        vrString = getSpan(type, 'type');
    } else {
        vrString = getSpan(type.getName(), 'record');
    }
    vrString += ' ';
    if (vr.getPointer()) {
        vrString += getSpan('^', 'operator');
    }
    vrString += getSpan(vr.getName(), 'variable');
    if (vr.getArraySize() !== false) {
        vrString += getSpan('[', 'operator') + getSpan(vr.getArraySize(), 'number') + getSpan(']', 'operator');
    }
    return vrString;
};

exports.Hint = class extends Component {
    constructor(opts) {
        super(opts);
        this._settings      = opts.settings;
        this._baseClassName = 'hint';
        this._hidden        = true;
        this._hint          = '';
        this._database      = {preProcessor: null, compiler: null};
        this.initDOM(document.body);
        dispatcher
            .on('Hint.Show',             this, this.onShow)
            .on('Hint.Hide',             this, this.onHide)
            .on('Compiler.Database',     this, this.onCompilerDatabase)
            .on('PreProcessor.Database', this, this.onPreProcessorDatabase);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                children: [
                    {
                        ref:       this.setRef('title'),
                        className: 'title'
                    },
                    {
                        id:        this.setPreElement.bind(this),
                        type:      'pre',
                        className: 'wheel'
                    },
                    {
                        id:        this.setLocationElement.bind(this),
                        className: 'location'
                    }
                ]
            }
        );
    }

    setPreElement(element) {
        this._preElement = element;
    }

    setLocationElement(element) {
        this._locationElement = element;
    }

    getLocationInfo(token) {
        let documentPath = this._settings.getDocumentPath();
        let filename     = this._database.files[token.fileIndex].filename;
        if (filename.indexOf(documentPath) !== 0) {
            return filename + ':' + token.lineNum;
        }
        return filename.substr(documentPath.length - filename.length) + ':' + token.lineNum;
    }

    getHint(hint) {
        let infoLength;
        let result   = '';
        let database = this._database;
        let type     = '';
        let name;
        let hasMore;
        let token;
        let proc     = database.compiler.findProc(hint);
        const getSpan = function(s, className) {
                infoLength += s.length;
                return '<span class="' + className + '">' + s + '</span>';
            };
        if (proc) {
            let params     = proc.getVars();
            let paramList  = [];
            type    = 'proc';
            token   = proc.getToken();
            name    = proc.getName();
            hasMore = false;
            infoLength = name.length + 1;
            for (let j = 2; j < proc.getParamCount() + 2; j++) {
                if (infoLength > 60) {
                    hasMore = true;
                    break;
                }
                infoLength += 2;
                paramList.push(getVarString(params[j], getSpan));
            }
            hint = getSpan(name, 'proc') + getSpan('(', 'operator') + paramList.join(', ');
            if (hasMore) {
                hint += '...';
            } else {
                hint += getSpan(')', 'operator');
            }
        } else {
            let record = database.compiler.findRecord(hint);
            if (record) {
                let fields    = record.getVars();
                let fieldList = [];
                type    = 'record';
                token   = record.getToken();
                name    = record.getName();
                hasMore = false;
                infoLength = name.length + 3;
                for (let j = 0; j < fields.length; j++) {
                    if (infoLength > 20) {
                        hasMore = true;
                        break;
                    }
                    infoLength += 2;
                    fieldList.push(getVarString(fields[j], getSpan));
                }
                hint = getSpan(name, 'record') + ' - ' + fieldList.join(', ');
                if (hasMore) {
                    hint += '...';
                }
            } else {
                type = 'define';
                let value = database.defines.get(hint);
                if (value !== false) {
                    let list = database.defines.getList();
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].key === hint) {
                            token = list[i].token;
                            break;
                        }
                    }
                    hint = getSpan(hint, 'define') + getSpan(' = ', 'operator');
                    value += '';
                    if (value.substr(0, 1) === '"') {
                        hint += getSpan(value, 'string');
                    } else {
                        hint += getSpan(value, 'number');
                    }
                } else {
                    hint = '';
                }
            }
        }
        if (hint !== '') {
            this._refs.title.innerHTML      = type;
            this._locationElement.innerHTML = this.getLocationInfo(token);
        }
        return hint;
    }

    onCompilerDatabase(database) {
        this._database.compiler = database;
    }

    onPreProcessorDatabase(database) {
        this._database.defines = database.defines;
        this._database.files   = database.files;
    }

    onShow(event, hint, database) {
        if (!this._database.compiler) {
            return;
        }
        if (this._hint !== hint) {
            hint = this.getHint(hint);
            if (hint === '') {
                return;
            }
            this._preElement.innerHTML = hint;
        }
        let element = this._element;
        element.style.left = (event.clientX + 8) + 'px';
        element.style.top  = (event.clientY + 8) + 'px';
        this.setHidden(false);
    }

    onHide(event) {
        this.setHidden(true);
    }
};
