/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const path       = require('../../path');
const Component  = require('../Component').Component;
const File       = require('./File').File;
const FileDetail = require('./FileDetail').FileDetail;

exports.Files = class extends Component {
    constructor(opts) {
        super(opts);
        this._filter         = opts.filter;
        this._element        = opts.parentNode;
        this._canSelect      = opts.canSelect;
        this._loaded         = false;
        this._loading        = false;
        this._selected       = null;
        this._documentPath   = null;
        this._path           = '';
        this._getFiles       = opts.getFiles;
        this._getImage       = opts.getImage;
        this._files          = [];
        this._fileElements   = [];
        this._detail         = opts.detail;
        this._colCount       = opts.colCount;
        this._colCountDetail = opts.colCountDetail;
        this._onPath         = opts.onPath;
        this._onFile         = opts.onFile;
        this._onSelect       = opts.onSelect;
        this.initDOM();
    }

    initDOM() {
        this.create(
            this._element,
            {
                id:        this.setFilesElement.bind(this),
                className: 'files' + (this._className ? ' ' + this._className : ''),
                children: [
                    {
                        className: 'files-content'
                    }
                ]
            }
        );
    }

    initFilesList() {
        this._fileElements.length = 0;
        let detail       = this._detail;
        let fileBoxCount = 0;
        let createFileBox = function() {
                fileBoxCount++;
                return {
                    className: 'file-box' + (detail ? ' detail' : ''),
                    children: []
                };
            };
        let child    = createFileBox();
        let element  = this._filesElement.querySelector('.files-content');
        let colCount = this._detail ? (this._colCountDetail || 7) : (this._colCount || 15);
        this.getSortedFiles().forEach(
            function(file, index) {
                if (child.children.length > colCount) {
                    this.create(element, child);
                    child = createFileBox();
                }
                child.children.push({
                    id:       this.addFileElement.bind(this),
                    type:     detail ? FileDetail : File,
                    tabIndex: this._tabIndex + index,
                    files:    this,
                    file:     file,
                    getImage: this._getImage,
                    index:    index
                });
            },
            this
        );
        if (child.children.length) {
            this.create(element, child);
        }
        element.style.width = ((detail ? 256 : 180) * fileBoxCount + 8) + 'px';
    }

    clear() {
        let element = this._filesElement.querySelector('.files-content');
        while (element.childNodes.length) {
            element.removeChild(element.childNodes[0]);
        }
        return this;
    }

    load(refresh) {
        if (!refresh && this._loaded) {
            return;
        }
        this._loaded = true;
        this.setLoading(true);
        this._getFiles(false, false, this.onShowFiles.bind(this));
    }

    updateClassName() {
        this._filesElement.className = 'files' +
            (this._className ? ' ' + this._className : '') +
            (this._loading   ? ' loading'            : '');
    }

    setLoading(loading) {
        this._loading = loading;
        this.updateClassName();
    }

    setFilesElement(element) {
        this._filesElement = element;
        this.updateClassName();
    }

    getPath() {
        return this._path;
    }

    getFilename() {
        return this._selected ? this._selected.filename : null;
    }

    setFilter(filter) {
        this._filter = filter;
        return this;
    }

    getSortedFiles() {
        let files = [];
        this._files.forEach(
            function(file) {
                file.toString = function() {
                    return (this.directory ? 'aaaaaaaaaaaaa' : 'zzzzzzzzzzzzz') + this.name;
                };
                if (file.directory) {
                    if ((this._documentPath === this._path) && (file.name === '..')) {
                        return;
                    }
                    if (file.name.substr(-1) === '/') {
                        file.name = file.name.substr(0, file.name.length - 1);
                    }
                    files.push(file);
                } else {
                    if (this._filter === '*') {
                        files.push(file);
                    } else if (this._filter.indexOf(path.getExtension(file.name)) !== -1) {
                        files.push(file);
                    }
                }
            },
            this
        );
        files.sort();
        return files;
    }

    getFiles() {
        return this._files;
    }

    setPrevActive(index) {
        if (index === 0) {
            return;
        }
        this._fileElements[index - 1].focus();
    }

    setNextActive(index) {
        let fileElements = this._fileElements;
        if (index < fileElements.length - 1) {
            fileElements[index + 1].focus();
        }
    }

    setDisabled(disabled) {
        this._fileElements.forEach((fileElement) => {
            fileElement.setDisabled(disabled);
        });
    }

    getDetail() {
        return this._detail;
    }

    setDetail(detail) {
        if (this._detail !== detail) {
            this._detail = detail;
            this
                .clear()
                .initFilesList();
        }
    }

    setDocumentPath(documentPath) {
        this._documentPath = documentPath;
        return this;
    }

    addFileElement(element) {
        this._fileElements.push(element);
    }

    onGlobalUIId() {
        this.setDisabled(this._uiId !== this._ui.getActiveUIId());
    }

    onClickFile(event, file) {
        this.onCancelEvent(event);
        let sameClicked = !this._canSelect;
        let element     = event.target;
        if ((element.className + '').indexOf('file') === -1) {
            element = event.target.parentNode;
        }
        if (this._selected) {
            let className = this._selected.element.className;
            let i         = className.indexOf(' ');
            if (i !== -1) {
                this._selected.element.className = className.substr(0, i) + (this._detail ? ' detail' : '');
            }
            sameClicked = (file.name === this._selected.filename);
        }
        if (this._canSelect) {
            this._selected = {
                directory: file.directory,
                filename:  file.name,
                path:      this._path,
                element:   element
            };
            element.className = 'file' + (this._detail ? ' detail' : '') + ' selected';
            element.querySelector('a').focus();
        }
        if (file.directory) {
            if (sameClicked) {
                this.setLoading(true);
                this._getFiles(file.name, false, this.onShowFiles.bind(this));
                this._onFile && this._onFile(null);
            }
        } else {
            this._onFile && this._onFile(file);
        }
        this._onSelect && this._onSelect(this._selected);
    }

    onShowFiles(path, files) {
        if (this._selected) {
            this._selected.element.className = 'file' + (this._detail ? ' detail' : '');
            this._selected                   = null;
            this._onSelect && this._onSelect(null);
        }
        this._path  = path;
        this._files = files;
        this
            .clear()
            .initFilesList();
        this._onPath && this._onPath(this._path);
        this.setLoading(false);
        if (this._fileElements.length) {
            this._fileElements[0].focus();
        }
    }
};
