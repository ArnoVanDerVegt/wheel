/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Emitter    = require('../../lib/Emitter').Emitter;

exports.PoweredUpAutoConnectState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._settings    = opts.settings;
        this._autoConnect = [];
        dispatcher.on(
            'Settings.Set.PoweredUpAutoLoad',    this, this._setAutoLoad,
            'Settings.Remove.PoweredUpAutoLoad', this, this._removeAutoLoad
        );
    }

    load(data) {
        if (!Array.isArray(data)){
            return;
        }
        this._autoConnect = [];
        data.forEach((item) => {
            if (('index' in item) && ('uuid' in item)) {
                this._autoConnect.push(item);
            }
        });
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this._autoConnect));
    }

    getAutoConnect(index, uuid) {
        let autoConnect = this._autoConnect;
        for (let i = 0; i < autoConnect.length; i++) {
            if ((autoConnect[i].uuid === uuid) && (autoConnect[i].index === index)) {
                return true;
            }
        }
        return false;
    }

    getAutoConnectByUuid() {
        let result = {};
        this._autoConnect.forEach(function(item) {
            result[item.uuid] = JSON.parse(JSON.stringify(item));
        });
        return result;
    }

    _setAutoLoad(opts) {
        this._removeAutoLoad(opts);
        this._autoConnect.push({
            index: opts.index,
            uuid:  opts.uuid
        });
        this._settings.save();
    }

    _removeAutoLoad(opts) {
        let autoConnect = this._autoConnect;
        let i           = 0;
        while (i < autoConnect.length) {
            if (opts.uuid === autoConnect[i].uuid) {
                autoConnect.splice(i, 1);
            } else {
                i++;
            }
        }
        this._settings.save();
    }
};
