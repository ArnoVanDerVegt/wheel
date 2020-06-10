/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../../lib/dispatcher').dispatcher;
const path             = require('../../lib/path');
const errors           = require('../errors');
const err              = require('../errors').errors;
const Iterator         = require('../tokenizer/TokenIterator').Iterator;
const t                = require('../tokenizer/tokenizer');
const ProjectResources = require('../resources/ProjectResources').ProjectResources;
const FormResource     = require('../resources/FormResource').FormResource;
const Defines          = require('./Defines').Defines;
const MetaCompiler     = require('./MetaCompiler');
const Tokenizer        = t.Tokenizer;

const removePadding = function(s) {
    return s.substr(1, s.length - 2);
};

exports.PreProcessor = class PreProcessor {
    constructor(opts) {
        this._documentPath      = opts.documentPath || '';
        this._projectFilename   = opts.projectFilename;
        this._projectPath       = path.getPathAndFilename(opts.projectFilename || '').path;
        this._linter            = opts.linter;
        this._getFileData       = opts.getFileData;
        this._getEditorFileData = opts.getEditorFileData;
        this._filesDone         = {};
        this._fileCount         = 0;
        this._sortedFiles       = null;
        this._defines           = new Defines();
        this._lineCount         = 0;
        this._resources         = new ProjectResources({
            projectFilename:   this._projectFilename,
            getFileData:       this._getFileData,
            getEditorFileData: this._getEditorFileData
        });
    }

    compileInclude(iterator, token, tokenFilename, includes) {
        token.done = true;
        token      = iterator.skipWhiteSpace().next(true);
        token.done = true;
        if (token.cls !== t.TOKEN_STRING) {
            token.filename = tokenFilename;
            throw errors.createError(err.FILENAME_EXPECTED, token, 'Filename expected.');
        }
        let filename = removePadding(token.lexeme);
        includes.push({filename: filename, token: token});
        MetaCompiler.checkRestTokens(iterator, 'include');
    }

    processIncludes(fileItem, data) {
        let tokenizer    = new Tokenizer();
        let tokens       = tokenizer.tokenize(data).getTokens();
        let includes     = [];
        let iterator     = new Iterator(tokens);
        let metaCompiler = new MetaCompiler.MetaCompiler(this._defines, this._resources, this._linter);
        let token        = true;
        this._tokens = tokens;
        this._lineCount += tokenizer.getLineNum();
        if (this._linter) {
            this._linter.addTokens(tokens);
        }
        while (token) {
            token = iterator.skipWhiteSpace().next(true);
            if (!token) {
                break;
            }
            switch (token.cls) {
                case t.TOKEN_META:
                    switch (token.lexeme) {
                        case '#include':  this.compileInclude(iterator, token, fileItem.filename, includes); break;
                        case '#define':   metaCompiler.compileDefine  (iterator, token, fileItem.filename);  break;
                        case '#image':    metaCompiler.compileImage   (iterator, token, fileItem.filename);  break;
                        case '#text':     metaCompiler.compileText    (iterator, token, fileItem.filename);  break;
                        case '#resource': metaCompiler.compileResource(iterator, token, fileItem.filename);  break;
                    }
                    break;
            }
        }
        fileItem.tokens   = tokens;
        fileItem.includes = includes;
    }

    processFile(includeItem, depth, index, finishedCallback) {
        let filesDone = this._filesDone;
        let filename  = this.getBaseFilename(includeItem.filename);
        if (filename in filesDone) {
            filesDone[filename].depth += depth;
            return;
        }
        this._fileCount++;
        let fileItem = {
                depth:    depth,
                index:    index,
                tokens:   null,
                filename: path.join(this._documentPath, filename)
            };
        filesDone[filename] = fileItem;
        this._getFileData(
            filename,
            includeItem.token,
            this.onFileData.bind(this, fileItem, depth, finishedCallback)
        );
    }

    processResources(finishedCallback) {
        let filesDone    = this._filesDone;
        let resources    = this._resources.getResources();
        let projectPath  = this._projectPath;
        let index        = 0;
        let loadResource = function() {
                let resource = resources[index++];
                if (resource) {
                    if (resource.neededBeforeCompile()) {
                        resource
                            .setProjectPath(projectPath)
                            .getData(loadResource);
                    } else {
                        loadResource();
                    }
                } else {
                    finishedCallback(filesDone);
                }
            };
        loadResource();
    }

    onFileData(fileItem, depth, finishedCallback, data) {
        this._fileCount--;
        if (fileItem.tokens === null) {
            this.processIncludes(fileItem, data);
        }
        let filesDone = this._filesDone;
        let includes  = fileItem.includes;
        for (let i = 0; i < includes.length; i++) {
            let include = includes[i];
            if (include in filesDone) {
                let fileDone = filesDone[include];
                fileDone.depth += depth;
            } else {
                this.processFile(include, depth + 1, i, finishedCallback);
            }
        }
        if (this._fileCount === 0) {
            this.processResources(finishedCallback);
        }
    }

    getBaseFilename(filename) {
        let documentPath = this._documentPath;
        let projectPath  = this._projectPath;
        if ((documentPath === '') && (projectPath === '')) {
            return filename;
        }
        if ((documentPath !== '') && filename.indexOf(documentPath) === 0) {
            return filename.substr(documentPath.length + 1 - filename.length);
        }
        if (filename.indexOf('/') === -1) {
            filename = path.join(projectPath.substr(documentPath.length + 1 - projectPath.length), filename);
        }
        return filename;
    }

    getTokens() {
        return this._tokens;
    }

    getLineCount() {
        return this._lineCount;
    }

    getSortedFiles() {
        if (this._sortedFiles) {
            return this._sortedFiles;
        }
        let filesDone = this._filesDone;
        let files     = [];
        for (let i in filesDone) {
            let fileDone = filesDone[i];
            fileDone.toString = function() {
                this.sortIndex = ('00000000' + (256 - fileDone.depth)).substr(-8) + ('0000' + fileDone.index).substr(-4);
                return this.sortIndex;
            };
            files.push(fileDone);
        }
        files.sort();
        this._sortedFiles = files;
        return files;
    }

    getDefines() {
        return this._defines;
    }

    getDefinedOffsetTokens(tokens, offset, fileIndex) {
        if (!tokens) {
            return [];
        }
        let defines = this._defines;
        tokens.forEach(function(token) {
            token.index += offset;
            if (token.cls === t.TOKEN_IDENTIFIER) {
                let value = defines.get(token.lexeme);
                if (value !== false) {
                    if (!isNaN(parseInt(value, 10)) && (parseInt(value, 10) === value)) {
                        token.value = parseInt(value, 10);
                        token.cls   = t.TOKEN_NUMBER;
                    } else if (!isNaN(parseFloat(value))) {
                        token.value = parseFloat(value);
                        token.cls   = t.TOKEN_NUMBER;
                    } else {
                        token.cls   = t.TOKEN_STRING;
                    }
                    token.lexeme = value;
                }
            }
            token.fileIndex = fileIndex;
        });
        return tokens;
    }

    getDefinedConcatTokens() {
        let tokens      = [];
        let tokenOffset = 0;
        let files       = this.getSortedFiles();
        dispatcher.dispatch('PreProcessor.Database', {defines: this._defines, files: files});
        files.forEach(
            function(file, fileIndex) {
                tokens = tokens.concat(this.getDefinedOffsetTokens(file.tokens, tokenOffset, fileIndex));
                tokenOffset += file.tokens.length;
            },
            this
        );
        return tokens;
    }

    getResources() {
        return this._resources;
    }

    getFormResources() {
        let result = [];
        this._resources.getResources().forEach(function(resource) {
            if (resource instanceof FormResource) {
                result.push(resource);
            }
        });
        return result;
    }
};
