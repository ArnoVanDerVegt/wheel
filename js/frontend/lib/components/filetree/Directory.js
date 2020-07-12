/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform   = require('../../platform');
const dispatcher = require('../../dispatcher').dispatcher;
const Item       = require('./Item').Item;

exports.Directory = class extends Item {
    constructor(opts) {
        super(opts);
        this._open = opts.fileTree.getFullPathOpen(this._fullPath);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id: this.setElement.bind(this),
                children: [
                    {
                        className: 'file directory',
                        children: [
                            {
                                id:        this.setFolderImageElement.bind(this),
                                className: 'file-icon',
                                type:      'img',
                                src:       this.getFolderImage()
                            },
                            {
                                id:        this.setNameElement.bind(this),
                                type:      'a',
                                href:      '#',
                                className: 'name',
                                innerHTML: this._file.name
                            }
                        ]
                    },
                    {
                        id:        this.setChildElements.bind(this),
                        className: 'directory-content',
                        style: {
                            display: this._open ? 'block' : 'none'
                        }
                    }
                ]
            }
        );
    }

    getFolderImage() {
        return this._getImage('images/files/folder' + (this._open ? 'Open' : 'Close') + '.svg');
    }

    getChildElement() {
        return this._childElement;
    }

    setChildElements(element) {
        this._childElement = element;
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
    }

    setFolderImageElement(element) {
        this._folderImageElement = element;
    }

    setSelected(selected) {
        this._selected              = selected;
        this._nameElement.className = this.getNameClassName();
    }

    getOpen() {
        return this._open;
    }

    setOpen(open) {
        this._open                       = open;
        this._childElement.style.display = open ? 'block' : 'none';
        this._folderImageElement.src     = this.getFolderImage();
    }

    onClickName(event) {
        dispatcher.dispatch('Global.HideMenu');
        this.onCancelEvent(event);
        this._fileTree.onSelectDirectory(this);
        this._nameElement.focus();
    }

    isDirectory() {
        return true;
    }

    clear() {
        let childElement = this._childElement;
        let fullPathItem = this._fileTree.getFullPathItem();
        while (childElement.childNodes.length) {
            let childNode = childElement.childNodes[0];
            delete fullPathItem[childNode._item.getFullPath()];
            childElement.removeChild(childNode);
        }
        return this;
    }

    onContextMenu(event) {
        dispatcher.dispatch('Global.HideMenu');
        this.onCancelEvent(event);
        this._nameElement.focus();
        let menuItems = this._contextMenu.getMenuItems();
        if (platform.isElectron()) {
            menuItems[0].setDisabled(false); // New file
            menuItems[1].setDisabled(false); // New image
            menuItems[2].setDisabled(false); // New project
            menuItems[3].setDisabled(false); // New directory
            menuItems[4].setDisabled(false); // Copy path
            menuItems[5].setDisabled(false); // Rename
            menuItems[6].setDisabled(false); // Delete
            menuItems[7].setDisabled(false); // Reveal in finder
        } else {
            let file = this._file;
            menuItems[0].setDisabled(false);         // New file
            menuItems[1].setDisabled(false);         // New image
            menuItems[2].setDisabled(false);         // New project
            menuItems[3].setDisabled(false);         // New directory
            menuItems[4].setDisabled(true);          // Copy path
            menuItems[5].setDisabled(file.readonly); // Rename
            menuItems[6].setDisabled(file.readonly); // Delete
            menuItems[7].setDisabled(file.readonly); // Reveal in finder
        }
        this._contextMenu.show(event.pageX, event.pageY, this);
    }
};
