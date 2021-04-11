/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Emitter    = require('../../lib/Emitter').Emitter;

exports.DefinesState = class {
    constructor(opts) {
        this._list     = [];
        this._settings = opts.settings;
        dispatcher
            .on('Settings.Define.DeleteByIndex', this, this._deleteByIndex)
            .on('Settings.Define.UpdateByIndex', this, this._updateByIndex)
            .on('Settings.Define.Add',           this, this._add);
    }

    load(list) {
        let items = [];
        list.forEach((item) => {
            item.type     = isNaN(item.value * 1) ? 'string' : 'number';
            item.toString = function() {
                return this.key + '';
            };
            items.push(item);
        });
        this._list = items;
    }

    _getItemFromDefine(define) {
        return {
            key:    define.key,
            value:  define.value,
            active: define.active,
            type:   isNaN(define.value * 1) ? 'string' : 'number',
            toString: function() {
                return this.key;
            }
        };
    }

    _deleteByIndex(index) {
        let list = this._list;
        if ((index < 0) || (index >= list.length)) {
            return;
        }
        list.splice(index, 1);
        this._settings
            .save()
            .emit('Settings.Defines', this.getList());
    }

    _updateByIndex(define, index) {
        let list = this._list;
        if ((index < 0) || (index >= list.length)) {
            return;
        }
        list[index] = this._getItemFromDefine(define);
        this._settings
            .save()
            .emit('Settings.Defines', this.getList());
    }

    _add(define) {
        this._list.push(this._getItemFromDefine(define));
        this._settings
            .save()
            .emit('Settings.Defines', this.getList());
    }

    getList() {
        this._list.sort();
        return JSON.parse(JSON.stringify(this._list));
    }

    getGlobalDefines() {
        let result = {};
        this._list.forEach((define) => {
            if (define.active) {
                let value = define.value;
                result[define.key] = (define.type === 'string') ? ('"' + value + '"') : value;
            }
        });
        return result;
    }

    toJSON() {
        this._list.sort();
        let result = [];
        this._list.forEach((define) => {
            result.push({
                key:    define.key,
                value:  define.value,
                active: define.active
            });
        });
        return result;
    }
};
