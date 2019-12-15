/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Files      = require('../files/Files');
const File       = require('../files/File');
const Item       = require('./Item').Item;

exports.File = class extends Item {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id: this.setElement.bind(this),
                className: 'file',
                children: [
                    File.getIcon(this._getImage, this._file),
                    {
                        id:        this.setNameElement.bind(this),
                        type:      'a',
                        href:      '#',
                        className: 'name',
                        innerHTML: this._file.name
                    }
                ]
            }
        );
    }

    setSelected(selected) {
        this._selected              = selected;
        this._nameElement.className = this.getNameClassName();
    }

    onClickName(event) {
        dispatcher.dispatch('Global.HideMenu');
        this.onCancelEvent(event);
        this._fileTree.onSelectFile(this);
        this._nameElement.focus();
    }

    onContextMenu(event) {
        dispatcher.dispatch('Global.HideMenu');
        this.onCancelEvent(event);
        this._nameElement.focus();
        let menuItems = this._contextMenu.getMenuItems();
        if ('electron' in window) {
            menuItems[0].setDisabled(false); // Rename
            menuItems[1].setDisabled(false); // Delete
            menuItems[2].setDisabled(false); // Copy path
            menuItems[3].setDisabled(false); // Reveal in finder
        } else {
            let file = this._file;
            menuItems[0].setDisabled(file.readonly); // Rename
            menuItems[1].setDisabled(file.readonly); // Delete
            menuItems[2].setDisabled(true);          // Copy path
            menuItems[3].setDisabled(true);          // Reveal in finder
        }
        this._contextMenu.show(event.pageX, event.pageY, this);
    }
};
