/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;
const path       = require('../path');
const getImage   = require('../../ide/data/images').getImage;

exports.Hint = class extends Component {
    constructor(opts) {
        super(opts);
        this._settings      = opts.settings;
        this._baseClassName = 'hint';
        this._hidden        = true;
        this._hint          = '';
        this._hintImage     = false;
        this._database      = {preProcessor: null, compiler: null};
        this.initDOM(opts.parentNode);
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
                        ref:       this.setRef('imageWrapper'),
                        className: 'image-wrapper',
                        children: [
                            {
                                ref:  this.setRef('image'),
                                type: 'img'
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('title'),
                        className: 'title'
                    },
                    {
                        ref:       this.setRef('namespace'),
                        className: 'namespace'
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

    getSpan(hintInfo, s, className) {
        hintInfo.length += s.length;
        return '<span class="' + className + '">' + s + '</span>';
    }

    getVarString(hintInfo, vr) {
        let vrString = '';
        let type     = vr.getType();
        if (typeof type === 'string') {
            vrString = this.getSpan(hintInfo, type, 'type');
        } else {
            vrString = this.getSpan(hintInfo, type.getName(), 'record');
        }
        vrString += ' ';
        if (vr.getPointer()) {
            vrString += this.getSpan(hintInfo, '^', 'operator');
        }
        vrString += this.getSpan(hintInfo, vr.getName(), 'variable');
        if (vr.getArraySize() !== false) {
            vrString += this.getSpan(hintInfo, '[', 'operator') +
                this.getSpan(hintInfo, vr.getArraySize(), 'number') +
                this.getSpan(hintInfo, ']', 'operator');
        }
        return vrString;
    }

    getHintFromProc(hintInfo, proc) {
        let params    = proc.getVars();
        let paramList = [];
        let nameParts = proc.getName().split('~');
        let name      = nameParts[nameParts.length - 1];
        let namespace = false;
        if (nameParts.length > 1) {
            nameParts.pop();
            namespace = nameParts.join('.');
        }
        hintInfo.type      = 'proc';
        hintInfo.namespace = namespace;
        hintInfo.token     = proc.getToken();
        hintInfo.hasMore   = false;
        hintInfo.length    = name.length + 1;
        for (let i = 2; i < proc.getParamCount() + 2; i++) {
            if (hintInfo.length > 80) {
                hintInfo.hasMore = true;
                break;
            }
            hintInfo.length += 2;
            paramList.push(this.getVarString(hintInfo, params[i]));
        }
        hintInfo.hint = this.getSpan(hintInfo, name, 'proc') +
            this.getSpan(hintInfo, '(', 'operator') + paramList.join(', ');
        if (hintInfo.hasMore) {
            hintInfo.hint += '...';
        } else {
            hintInfo.hint += this.getSpan(hintInfo, ')', 'operator');
        }
    }

    getHintFromRecord(hintInfo, record) {
        let fields    = record.getVars();
        let fieldList = [];
        let nameParts = proc.getName().split('~');
        let name      = nameParts[nameParts.length - 1];
        let namespace = false;
        if (nameParts.length > 1) {
            nameParts.pop();
            namespace = nameParts.join('.');
        }
        hintInfo.type      = 'record';
        hintInfo.namespace = namespace;
        hintInfo.token     = record.getToken();
        hintInfo.hasMore   = false;
        hintInfo.length    = name.length + 3;
        for (let i = 0; i < fields.length; i++) {
            if (hintInfo.length > 80) {
                hintInfo.hasMore = true;
                break;
            }
            hintInfo.length += 2;
            fieldList.push(this.getVarString(hintInfo, fields[i]));
        }
        hintInfo.hint = this.getSpan(hintInfo, name, 'record') + ' - ' + fieldList.join(', ');
        if (hintInfo.hasMore) {
            hintInfo.hint += '...';
        }
    }

    getHintFromDefine(hintInfo, define) {
        let value = define.value + '';
        let token = define.token;
        hintInfo.token  = token;
        hintInfo.hint   = this.getSpan(hintInfo, define.key, 'define') + this.getSpan(hintInfo, ' = ', 'operator');
        if (token.tag && (token.tag.name === 'image')) {
            this._hintImage = token.tag.data;
        }
        if (value.substr(0, 1) === '"') {
            hintInfo.hint += this.getSpan(hintInfo, value, 'string');
        } else {
            hintInfo.hint += this.getSpan(hintInfo, value, 'number');
        }
    }

    getHint(opts) {
        let hintInfo = {
                length:  0,
                hasMore: false,
                token:   null,
                type:    '',
                hint:    ''
            };
        let database = this._database;
        let proc     = database.compiler.findProc(opts.hint) || database.compiler.findProc(opts.altHint);
        if (proc) {
            this.getHintFromProc(hintInfo, proc);
        } else {
            let record = database.compiler.findRecord(opts.hint) || database.compiler.findRecord(opts.altHint);
            if (record) {
                this.getHintFromRecord(hintInfo, record);
            } else {
                hintInfo.type = 'define';
                let define = database.defines.getFullInfo(opts.hint);
                if (define !== false) {
                    this.getHintFromDefine(hintInfo, define);
                }
            }
        }
        let refs = this._refs;
        if (hintInfo.hint !== '') {
            if (hintInfo.namespace) {
                refs.namespace.innerHTML     = 'namespace: <i>' + hintInfo.namespace + '</>';
                refs.namespace.style.display = 'block';
            } else {
                refs.namespace.style.display = 'none';
            }
            refs.title.innerHTML            = hintInfo.type;
            this._locationElement.innerHTML = this.getLocationInfo(hintInfo.token);
        }
        return hintInfo.hint;
    }

    onCompilerDatabase(database) {
        this._database.compiler = database;
    }

    onPreProcessorDatabase(database) {
        this._database.defines = database.defines;
        this._database.files   = database.files;
    }

    showImage(hintImage) {
        let refs         = this._refs;
        let image        = refs.image;
        let imageWrapper = refs.imageWrapper;
        if (this._hintImage) {
            imageWrapper.style.display = 'block';
            image.src                  = getImage(this._hintImage);
        } else {
            imageWrapper.style.display = 'none';
        }
    }

    onShow(opts) {
        if (!this._database.compiler) {
            return;
        }
        let measure = false;
        if (this._hint !== opts.hint) {
            this._hintImage     = false;
            let hint = this.getHint(opts);
            if (hint === '') {
                return;
            }
            this.showImage(this._hintImage);
            this._baseClassName        = 'hint' + (this._hintImage ? ' with-image' : '');
            this._element.className    = this.getClassName();
            this._preElement.innerHTML = hint;
            measure                    = true;
        }
        let element = this._element;
        let x       = opts.event.clientX + 8;
        let y       = opts.event.clientY + 8;
        this.setHidden(false);
        if (measure) {
            x = Math.max(8, x - Math.round(this._element.offsetWidth / 2));
        }
        element.style.left = x + 'px';
        element.style.top  = y + 'px';
    }

    onHide(event) {
        this.setHidden(true);
    }
};
