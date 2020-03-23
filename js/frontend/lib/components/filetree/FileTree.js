/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getDataProvider = require('../../dataprovider/dataProvider').getDataProvider;
const utils           = require('../../utils');
const dispatcher      = require('../../dispatcher').dispatcher;
const DOMNode         = require('../../dom').DOMNode;
const path            = require('../../path');
const CloseButton     = require('../CloseButton').CloseButton;
const Button          = require('../Button').Button;
const Resizer         = require('../Resizer').Resizer;
const ContextMenu     = require('../ContextMenu').ContextMenu;
const File            = require('./File').File;
const Directory       = require('./Directory').Directory;

exports.FileTree = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui             = opts.ui;
        this._uiId           = opts.uiId;
        this._settings       = opts.settings;
        this._tabIndex       = opts.tabIndex;
        this._tabIndexClose  = opts.tabIndexClose;
        this._getImage       = opts.getImage;
        this._selected       = null;
        this._fullPathLoaded = {};
        this._fullPathOpen   = {};
        this._fullPathItem   = {};
        this._changePath     = '';
        this._changeTimeout  = null;
        this._style          = null;
        this
            .initDOM(document.body)
            .initContextMenu();
        this._ui
            .addEventListener('Global.UIId',         this, this.onGlobalUIId)
            .addEventListener('Global.Window.Focus', this, this.onGlobalWindowFocus);
        dispatcher
            .on('Dialog.Confirm.DeleteFileConfirmed', this, this.onDeleteFileConfirmed)
            .on('Directory.Change',                   this, this.onChangeDirectory)
            .on('Compile.SaveOutput',                 this, this.onCompileSaveOutput)
            .on('Create.Directory',                   this, this.onAddDirectory);
        this._settings.on('Settings.View', this, this.onUpdateViewSettings);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'file-tree-wrapper',
                children: [
                    {
                        className: 'toolbar',
                        children: [
                            {
                                type:     CloseButton,
                                ui:       this._ui,
                                onClick:  this.onCloseFileTree.bind(this),
                                tabIndex: this._tabIndexClose
                            }
                        ]
                    },
                    {
                        id:        this.setFilesElement.bind(this),
                        className: 'files'
                    },
                    {
                        ref:       this.setRef('resizer'),
                        type:      Resizer,
                        ui:        this._ui,
                        direction: 'x',
                        varName:   '--file-tree-width',
                        size:      this._settings.getResizerFileTreeSize(),
                        minSize:   96,
                        dispatch:  'Settings.Set.Resizer.FileTreeSize',
                        onResize:  this.onResize.bind(this)
                    }
                ]
            }
        );
        return this;
    }

    initContextMenu() {
        this._fileContextMenu = new ContextMenu({
            ui:         this._ui,
            parentNode: document.body,
            options: [
                {title: 'Rename',           onClick: this.onContextMenuRename.bind(this)},
                {title: 'Delete',           onClick: this.onContextMenuDelete.bind(this)},
                {title: '-'},
                {title: 'Copy path',        onClick: this.onContextMenuCopyPath.bind(this)},
                {title: '-'},
                {title: 'Reveal in finder', onClick: this.onContextMenuRevealInFinder.bind(this)}
            ]
        });
        this._directoryContextMenu = new ContextMenu({
            ui:         this._ui,
            parentNode: document.body,
            options: [
                {title: 'New file',         onClick: this.onContextMenuNewFile.bind(this)},
                {title: 'New image',        onClick: this.onContextMenuNewImageFile.bind(this)},
                {title: 'New project',      onClick: this.onContextMenuNewProject.bind(this)},
                {title: '-'},
                {title: 'New directory',    onClick: this.onContextMenuNewDirectory.bind(this)},
                {title: '-'},
                {title: 'Copy path',        onClick: this.onContextMenuCopyPath.bind(this)},
                {title: '-'},
                {title: 'Rename',           onClick: this.onContextMenuRename.bind(this)},
                {title: 'Delete',           onClick: this.onContextMenuDelete.bind(this)},
                {title: '-'},
                {title: 'Reveal in finder', onClick: this.onContextMenuRevealInFinder.bind(this)}
            ]
        });
    }

    clear() {
        let filesElement = this._filesElement;
        while (filesElement.childNodes.length) {
            let childNode = filesElement.childNodes[0];
            delete this._fullPathItem[childNode._item.getFullPath()];
            filesElement.removeChild(childNode);
        }
    }

    onResize(width) {
        let settings = this._settings;
        if (!settings.getShowFileTree()) {
            width = 0;
        }
        let simulatorVisible = settings.getShowSimulator();
        let minWidth         = simulatorVisible ? 900 : 600;
        let css              = '@media screen and (min-width: calc(' + minWidth + 'px + ' + width + 'px)) { .home-screen-content { width:600px; }}';
        let head             = document.head || document.getElementsByTagName('head')[0];
        let style            = document.createElement('style');
        if (this._style) {
            head.removeChild(this._style);
        }
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
        this._style = style;
    }

    onUpdateViewSettings() {
        this.onResize(this._refs.resizer.getSize());
    }

    onContextMenuDelete(item) {
        this
            .onSelectFile(item)
            .onDeleteFile(item.isDirectory() ? 'directory' : 'file');
    }

    onContextMenuNewFile(item) {
        dispatcher.dispatch('Menu.File.NewFile', item.getFullPath());
    }

    onContextMenuNewImageFile(item) {
        dispatcher.dispatch('Menu.File.NewImageFile', item.getFullPath());
    }

    onContextMenuNewProject(item) {
        dispatcher.dispatch('Menu.File.NewProjectFile', item.getFullPath());
    }

    onContextMenuNewDirectory(item) {
        dispatcher.dispatch(
            'Dialog.DirectoryNew.Show',
            {
                validChars:      false,
                dispatchApply:   'Create.Directory',
                activeDirectory: item.getFullPath()
            }
        );
    }

    onContextMenuCopyPath(item) {
        const clipboard = require('electron').clipboard;
        clipboard.writeText(path.removePath(this._settings.getDocumentPath(), item.getFullPath()), 'selection');
    }

    onContextMenuRename(item) {
        dispatcher.dispatch(
            'Dialog.File.Rename.Show',
            'Rename ' + (item.isDirectory() ? 'directory' : 'file'),
            this._settings.getDocumentPath(),
            item.getFullPath(),
            function(filename) {
                let oldName         = item.getFullPath();
                let pathAndFilename = path.getPathAndFilename(oldName);
                let newName         = path.join(pathAndFilename.path, filename);
                getDataProvider().getData(
                    'post',
                    'ide/rename',
                    {
                        oldName: oldName,
                        newName: newName
                    },
                    function() {
                    }
                );
            }
        );
    }

    onContextMenuRevealInFinder(item) {
        let shell = require('electron').shell;
        shell.showItemInFolder(item.getPath() + '/' + item.getName());
    }

    onChangeDirectory(data) {
        for (let i = 0; i < data.length; i++) {
            let p = data[i].path.split('\\').join('/');
            if ((this._changePath === '') || (p.length > this._changePath.length)) {
                this._changePath = p;
            }
        }
        if (this._changeTimeout) {
            clearTimeout(this._changeTimeout);
        }
        this._changeTimeout = setTimeout(
            (function() {
                this._changeTimeout = null;
                this.onChangePath(this._changePath, function() {});
                this._changePath = '';
            }).bind(this),
            100
        );
    }

    onAddDirectory(directory) {
        getDataProvider().getData(
            'post',
            'ide/directory-create',
            {
                directory: directory
            },
            function(data) {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    return;
                }
                if (!data.success) {
                    dispatcher.dispatch(
                        'Dialog.Alert.Show',
                        {
                            title: 'Error',
                            lines: [data.error || 'Failed to create directory.']
                        }
                    );
                }
            }
        );
    }

    onCompileSaveOutput(outputFilename) {
        this.onChangeDirectory([{path: outputFilename}]);
    }

    onChangePath(p, callback) {
        let foundPath   = this.findLoadedPath(p);
        let directory   = this.findDirectoryItemFromPath(foundPath);
        let nodeToGet   = [foundPath];
        let filesInPath = [];
        let forEachKey  = function(object, callback) {
                for (let key in object) {
                    callback(key);
                }
            };
        let addNewItem = function(array, item) {
                if (array.indexOf(item) === -1) {
                    array.push(item);
                }
            };
        forEachKey(this._fullPathOpen, addNewItem.bind(utils, nodeToGet));
        // Add all files found in directory...
        let pathListCallback = (function(parentNode, p, fileList) {
                if ((p === foundPath) || this._fullPathLoaded[p]) {
                    filesInPath.push({path: p, fileList: fileList, toString: function() { return this.path; }});
                    fileList.forEach(
                        function(file) {
                            if (file.directory && (file.name !== '..')) {
                                let s = path.join(p, file.name);
                                if (this._fullPathLoaded[s]) {
                                    utils.addNewItem(nodeToGet, s);
                                }
                            }
                        },
                        this
                    );
                }
                getNode(); // Next directory...
            }).bind(this);
        // Load all files in directory...
        let nodeIndex = 0;
        let getNode   = (function() {
                if (nodeIndex < nodeToGet.length) {
                    this.getFiles(null, nodeToGet[nodeIndex], pathListCallback);
                    nodeIndex++;
                } else {
                    if (directory) {
                        directory.clear();
                        this.showFilesInPath(filesInPath);
                    }
                    callback();
                }
            }).bind(this);
        getNode();
    }

    onKeyDown(event) {
        let target = event.target;
        switch (event.keyCode) {
            case 8: // Backspace
                if (this._selected instanceof File) {
                    this.onDeleteFile(this._selected.isDirectory() ? 'directory' : 'file');
                }
                break;
            case 38: // Up
                if (target && target._prevItem && target._prevItem._item) {
                    target._prevItem.focus();
                }
                break;
            case 40: // Down
                if (target && target._nextItem && target._nextItem._item) {
                    target._nextItem.focus();
                }
                break;
        }
    }

    onDeleteFile(type) {
        let selected     = this._selected;
        let documentPath = this._settings.getDocumentPath();
        let p            = path.removePath(documentPath, selected.getPath() + '/' + selected.getName());
        this._deleteInfo = {
            path:     selected.getPath(),
            filename: selected.getName()
        };
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            'Confirm delete',
            [
                p,
                'Are you sure you want to delete this ' + (type || 'file') + '?'
            ],
            'Dialog.Confirm.DeleteFileConfirmed',
            'cancel'
        );
    }

    onDeleteFileConfirmed() {
        let path         = this._deleteInfo.path;
        let fullPathItem = this._fullPathItem;
        let selected     = this._selected;
        let callback     = (function(data) {
                try {
                    data = (typeof data === 'string') ? JSON.parse(data) : data;
                } catch (error) {
                    data = {success: false, error: 'Invalid delete response.'};
                }
                if (data.success) {
                    if (path in fullPathItem) {
                        let directory = fullPathItem[path].clear();
                        this._fullPathLoaded[path] = true;
                        this.getFiles(directory.getChildElement(), path, this.onGetFiles.bind(this));
                    } else {
                        this.clear();
                        this.getFiles(this._filesElement, false, this.onGetFiles.bind(this));
                    }
                } else {
                    dispatcher.dispatch(
                        'Dialog.Alert.Show',
                        {
                            title: 'Error',
                            lines: [data.error || 'Failed to delete item.']
                        }
                    );
                }
            }).bind(this);
        if (selected instanceof Directory) {
            getDataProvider().getData(
                'post',
                'ide/directory-delete',
                {
                    directory: selected.getPath() + '/' + selected.getName()
                },
                callback
            );
        } else {
            getDataProvider().getData(
                'post',
                'ide/file-delete',
                {
                    filename: path + '/' + this._deleteInfo.filename
                },
                callback
            );
        }
    }

    onCloseFileTree() {
        dispatcher.dispatch('Settings.Toggle.ShowFileTree');
    }

    onGetFiles(parentNode, p, files) {
        parentNode.style.paddingLeft = (p.split('/').length * 4) + 'px';
        files.forEach(
            function(file) {
                if (file.name[0] === '.') {
                    return;
                }
                let childNodes = parentNode.childNodes;
                let fullPath   = p + '/' + file.name;
                for (let i = 0; i < childNodes.length; i++) {
                    let item = childNodes[i]._item;
                    if (fullPath === item.getFullPath()) {
                        this._fullPathItem[item.getFullPath()] = item;
                        return;
                    }
                }
                if (file.directory) {
                    new Directory({
                        ui:          this._ui,
                        parentNode:  parentNode,
                        contextMenu: this._directoryContextMenu,
                        getImage:    this._getImage,
                        fileTree:    this,
                        file:        file,
                        path:        p
                    });
                } else {
                    new File({
                        ui:          this._ui,
                        parentNode:  parentNode,
                        contextMenu: this._fileContextMenu,
                        getImage:    this._getImage,
                        fileTree:    this,
                        file:        file,
                        path:        p
                    });
                }
            },
            this
        );
        this.setTabIndex(this._tabIndex);
    }

    onGlobalUIId() {
        this.setTabIndex(this._uiId === this._ui.getActiveUIId() ? this._tabIndex : -1);
    }

    onGlobalWindowFocus() {
        if (!this._selected) {
            let itemList = this._filesElement.querySelectorAll('a.name');
            if (itemList.length) {
                itemList[0].focus();
            }
            return;
        }
        this._selected.focus();
    }

    onSelectDirectory(directory) {
        if (this._selected === directory) {
            this._selected.setSelected(true);
        } else {
            if (this._selected) {
                this._selected.setSelected(false);
            }
            this._selected = directory;
            this._selected.setSelected(true);
        }
        let path = directory.getPath() + '/' + directory.getName();
        this._activeDirectory = path;
        if (directory.getOpen() && !(path in this._fullPathLoaded)) {
            this._fullPathLoaded[path] = true;
            this.getFiles(this._selected.getChildElement(), path, this.onGetFiles.bind(this));
        }
    }

    onSelectFile(file) {
        if (this._selected) {
            this._selected.setSelected(false);
        }
        if (this._selected === file) {
            dispatcher.dispatch('Dialog.File.Open', file.getPath() + '/' + file.getName());
        }
        this._selected = file;
        this._selected.setSelected(true);
        return this;
    }

    getFullPathItem() {
        return this._fullPathItem;
    }

    setFullPathItem(item, fullPath) {
        this._fullPathItem[fullPath] = item;
    }

    getFullPathLoaded() {
        return this._fullPathLoaded;
    }

    getFullPathOpen(path) {
        return (path in this._fullPathOpen) && this._fullPathOpen[path];
    }

    setFullPathOpen(path, open) {
        this._fullPathOpen[path] = open;
    }

    setTabIndex(tabIndex) {
        let itemList = this._filesElement.querySelectorAll('a.name');
        let lastItem = null;
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            if (lastItem) {
                lastItem._nextItem = item;
                item._prevItem     = lastItem;
            }
            item.tabIndex = (tabIndex === -1) ? -1 : tabIndex++;
            lastItem      = item;
        }
    }

    getChildElement() {
        return this._filesElement;
    }

    setFilesElement(element) {
        this._filesElement = element;
        this.getFiles(element, false, this.onGetFiles.bind(this));
    }

    getFiles(parentNode, path, callback) {
        let params = {index: 'filetree'};
        let that   = this;
        if (typeof path === 'string') {
            params.path = path;
        }
        getDataProvider().getData(
            'get',
            'ide/files',
            params,
            function(data) {
                try {
                    let json = (typeof data === 'string') ? JSON.parse(data) : data;
                    callback(parentNode, json.path, json.files);
                } catch (error) {
                }
            }
        );
    }

    showOpenDirectories() {
        let fullPathItem = this._fullPathItem;
        for (let fullPath in this._fullPathOpen) {
            if (fullPathItem[fullPath]) {
                fullPathItem[fullPath].setOpen(true);
            }
        }
    }

    showFilesInPath(filesInPath) {
        filesInPath.sort();
        for (let i = 0; i < filesInPath.length; i++) {
            let p         = filesInPath[i].path;
            let directory = this.findDirectoryItemFromPath(p);
            if (directory) {
                this.onGetFiles(directory.getChildElement(), p, filesInPath[i].fileList);
            }
        }
        this.showOpenDirectories();
    }

    removeEmptyStrings(array) {
        let i = 0;
        while (i < array.length) {
            if (array[i] === '') {
                array.splice(i, 1);
            } else {
                i++;
            }
        }
        return array;
    }

    findDirectoryItemFromPath(p) {
        let directory = this._fullPathItem[p];
        if (directory) {
            return directory;
        }
        if (p === this._settings.getDocumentPath()) {
            return this;
        }
        return null;
    }

    findLoadedPath(p) {
        let documentPath = this._settings.getDocumentPath();
        let foundPath    = documentPath;
        let findPath     = path.getPath(p);
        let parts        = this.removeEmptyStrings(findPath.split('/'));
        let s            = '';
        let index        = 0;
        // Find the last path part which was loaded to reload...
        while (index < parts.length) {
            if ((index === 0) && path.isWindowsRootPath(findPath)) {
                s = findPath.substr(0, 3);
                index++;
            } else if (s.substr(-1) !== '/') {
                s += '/' + parts[index++];
            } else {
                s += parts[index++];
            }
            if (this._fullPathLoaded[s]) {
                foundPath = s;
            }
        }
        return foundPath;
    }
};
