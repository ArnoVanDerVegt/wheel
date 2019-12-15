/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getDataProvider = require('../lib/dataprovider/dataProvider').getDataProvider;
const dispatcher      = require('./dispatcher').dispatcher;

class DirectoryWatcher {
    constructor() {
        this.watchDirectory();
    }

    watchDirectory() {
        setTimeout(this.getChanges.bind(this), 100);
    }

    onGetChanges(data) {
        try {
            data = JSON.parse(data);
            if (data.length) {
                dispatcher.dispatch('Directory.Change', data);
            }
        } catch (error) {
        }
        this.watchDirectory();
    }

    getChanges() {
        getDataProvider().getData('get', 'ide/changes', {}, this.onGetChanges.bind(this));
    }
}

exports.init = function() {
    new DirectoryWatcher();
};
