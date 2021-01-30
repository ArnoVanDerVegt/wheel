/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path             = require('../../../shared/lib/path');
const dispatcher       = require('../../lib/dispatcher').dispatcher;
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
        this._projectPath         = path.getPathAndFilename(opts.projectFilename || '').path;
        this._globalDefines       = opts.globalDefines || {};
        this._documentPath        = opts.documentPath  || '';
        this._projectFilename     = opts.projectFilename;
        this._linter              = opts.linter;
        this._onGetFileData       = opts.onGetFileData;
        this._onGetFileDataError  = opts.onGetFileDataError;
        this._onGetEditorFileData = opts.onGetEditorFileData;
        this._onError             = opts.onError;
        this._onFinished          = opts.onFinished;
        this._filesDone           = {};
        this._fileCount           = 0;
        this._sortedFiles         = null;
        this._error               = false;
        this._defines             = new Defines();
        this._lineCount           = 0;
        this._includeRoot         = {
            filename: ''
        };
        this._resources           = new ProjectResources({
            projectFilename:     this._projectFilename,
            onGetEditorFileData: this._onGetEditorFileData,
            onGetFileData:       this._onGetFileData
        });
    }

    compileInclude(iterator, token, tokenFilename, includes) {
        token.done = true;
        token      = iterator.skipWhiteSpace().next();
        token.done = true;
        if (token.cls !== t.TOKEN_STRING) {
            token.filename = tokenFilename;
            throw errors.createError(err.FILENAME_EXPECTED, token, 'Filename expected.');
        }
        let filename = removePadding(token.lexeme);
        includes.push({filename: filename, token: token});
        if (this._onError) {
            try {
                MetaCompiler.checkRestTokens(iterator, 'include');
            } catch (error) {
                this._onError({
                    type:    'Error',
                    message: '<i class="error">Invalid tokens after include.</i>',
                    tolen:   token
                });
            }
        } else {
            MetaCompiler.checkRestTokens(iterator, 'include');
        }
    }

    processIncludes(fileItem, data) {
        let tokenizer    = new Tokenizer();
        let tokens       = tokenizer.tokenize(data).getTokens();
        let includes     = [];
        let token        = true;
        let iterator     = new Iterator({tokens: tokens, compiler: this});
        let metaCompiler = new MetaCompiler.MetaCompiler({
                defines:       this._defines,
                globalDefines: this._globalDefines,
                resources:     this._resources,
                linter:        this._linter
            });
        this._tokens = tokens;
        this._lineCount += tokenizer.getLineNum();
        if (this._linter) {
            this._linter.addTokens(tokens);
        }
        while (token) {
            token = iterator.skipWhiteSpace().next();
            if (!token) {
                break;
            }
            switch (token.cls) {
                case t.TOKEN_META:
                    switch (token.lexeme) {
                        case t.LEXEME_META_INCLUDE:
                            this.compileInclude(iterator, token, fileItem.filename, includes);
                            break;
                        case t.LEXEME_META_IFDEF:
                            metaCompiler.compileIfdef(iterator, token, this._defines);
                            break;
                        case t.LEXEME_META_DEFINE:
                            metaCompiler.compileDefine(iterator, token, fileItem.filename);
                            break;
                        case t.LEXEME_META_IMAGE:
                            metaCompiler.compileImage(iterator, token, fileItem.filename);
                            break;
                        case t.LEXEME_META_TEXT:
                            metaCompiler.compileText(iterator, token, fileItem.filename);
                            break;
                        case t.LEXEME_META_RESOURCE:
                            metaCompiler.compileResource(iterator, token, fileItem.filename);
                            break;
                    }
                    break;
            }
        }
        fileItem.tokens   = tokens;
        fileItem.includes = includes;
    }

    processFile(includeItem, includeNode) {
        if (!includeNode) {
            includeNode          = this._includeRoot;
            includeNode.filename = includeItem.filename;
        }
        let filesDone = this._filesDone;
        let filename  = this.getBaseFilename(includeItem.filename);
        if (filename in filesDone) {
            return;
        }
        this._fileCount++;
        let fileItem = {
                tokens:      null,
                projectPath: this._projectPath,
                filename:    filename
            };
        filesDone[filename] = fileItem;
        this._onGetFileData(
            filename,
            includeItem.token,
            this.onFileData.bind(this, fileItem, includeNode)
        );
    }

    processResources() {
        let filesDone    = this._filesDone;
        let resources    = this._resources.getResources();
        let projectPath  = this._projectPath;
        let index        = 0;
        let loadResource = () => {
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
                    this.getSortedFiles();
                    this._onFinished(filesDone, this._error);
                }
            };
        loadResource();
    }

    onFileData(fileItem, includeNode, data) {
        if (data === null) {
            this._onGetFileDataError && this._onGetFileDataError(fileItem);
            return;
        }
        this._fileCount--;
        if (fileItem.tokens === null) {
            this.processIncludes(fileItem, data);
        }
        let filesDone = this._filesDone;
        let includes  = fileItem.includes;
        includes.forEach((include) => {
            if (include in filesDone) {
                return;
            }
            let newNode = {filename: include.filename};
            if (!includeNode.includes) {
                includeNode.includes = [];
            }
            includeNode.includes.push(newNode);
            this.processFile(include, newNode);
        });
        if (this._fileCount === 0) {
            this.processResources(this._onFinished);
        }
    }

    getDepth() {
        return 0;
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

    /**
     * Build an include file tree and return the depth of the file relative to the root of the project...
    **/
    getDepthByFilename() {
        let projectPath        = this._projectPath;
        let includesByFilename = {};
        let includeByFilename  = {}; // To check for circular includes...
        let depthByFilename    = {};
        const makeNodeByFilename = (node) => {
                if (node.includes) {
                    includesByFilename[node.filename] = node.includes;
                    node.includes.forEach((node) => {
                        makeNodeByFilename(node);
                    });
                }
            };
        const makeIncludes = (node) => {
                if (this._error) {
                    return;
                }
                if (node.includes) {
                    node.includes.forEach((includeNode) => {
                        let filename1 = path.removePath(projectPath, node.filename);
                        let filename2 = includeNode.filename;
                        let index1    = filename1 + '!' + filename2;
                        let index2    = filename2 + '!' + filename1;
                        if ((index1 in includeByFilename) || (index2 in includeByFilename)) {
                            if (!this._error) {
                                if (this._onError) {
                                    this._onError({
                                        type:    'Error',
                                        message: 'Circular include in ' +
                                            '<i class="error">"' + filename1 + '"</i> and ' +
                                            '<i class="error">' + filename2 + '"</i>.'
                                    });
                                }
                                this._error = true;
                            }
                            return;
                        }
                        includeByFilename[index1] = true;
                        makeIncludes(includeNode);
                    });
                } else if (node.filename in includesByFilename) {
                    node.includes = includesByFilename[node.filename];
                }
            };
        const makeIncludeOrder = (node, depth) => {
                if (node.filename in depthByFilename) {
                    depthByFilename[node.filename] = Math.max(depthByFilename[node.filename], depth);
                } else {
                    depthByFilename[node.filename] = depth;
                }
                if (node.includes) {
                    node.includes.forEach((node) => {
                        makeIncludeOrder(node, depth + 1);
                    });
                }
            };
        makeNodeByFilename(this._includeRoot);
        makeIncludes(this._includeRoot);
        if (!this._error) {
            makeIncludeOrder(this._includeRoot, 0);
        }
        return this._error ? null : depthByFilename;
    }

    getSortedFiles() {
        if (this._sortedFiles) {
            return this._sortedFiles;
        }
        let depthByFilename = this.getDepthByFilename();
        let documentPath    = this._documentPath;
        let projectPath     = this._projectPath;
        let filesDone       = this._filesDone;
        let files           = [];
        if (!depthByFilename) {
            return [];
        }
        for (let i in filesDone) {
            let fileDone = filesDone[i];
            fileDone.toString = function() {
                let depth    = 0;
                let filename = this.filename;
                if (this.filename in depthByFilename) {
                    depth = depthByFilename[filename];
                } else {
                    filename = path.removePath(projectPath, path.join(documentPath, filename));
                    if (filename in depthByFilename) {
                        depth = depthByFilename[filename];
                    }
                }
                this.sortIndex = ('00000000' + (99999999 - depth)).substr(-8);
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
        tokens.forEach((token) => {
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
                tokens = tokens.concat(this.getDefinedOffsetTokens(file.tokens || [], tokenOffset, fileIndex));
                tokenOffset += file.tokens ? file.tokens.length : 0;
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
        this._resources.getResources().forEach((resource) => {
            if (resource instanceof FormResource) {
                result.push(resource);
            }
        });
        return result;
    }
};
