/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.DirectoryList = class {
    constructor() {
        this._list = [];
    }

    addItem(name, directory, readonly) {
        let list = this._list;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === name) {
                return;
            }
        }
        list.push({
            toString: function() {
                return (this.directory ? 'aaaaaaaaaaaaaaaa' : 'zzzzzzzzzzzzzzzz') + this.name;
            },
            name:      name,
            directory: directory,
            readonly:  readonly
        });
    }

    getList() {
        this._list.sort();
        return this._list;
    }
};
