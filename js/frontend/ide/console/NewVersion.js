/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../lib/dom').DOMNode;
const Button     = require('../../lib/components/Button').Button;
const Http       = require('../../lib/Http').Http;
const getImage   = require('../data/images').getImage;

exports.NewVersion = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui           = opts.ui;
        this._console      = opts.console;
        this._settings     = opts.settings;
        this._downloadLink = 'https://arnovandervegt.github.io/wheel/';
        let now   = new Date();
        let today = now.getYear() + '-' + now.getMonth() + '-' + now.getDate();
        if (this._settings.getLastVersionCheckDate() !== today) {
            dispatcher.dispatch('Settings.Set.LastVersionCheckDate', today);
            new Http({onLoad: this.onLoadNewVersionInfo.bind(this)}).get('http://127.0.0.1:3000/newVersion.json', {});
            this.initDOM(opts.parentNode);
        }
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'new-version',
                children: [
                    {
                        className: 'new-version-logo',
                        children: [
                            {
                                type:   'img',
                                src:    getImage('images/logos/logo.png'),
                                width:  144,
                                height: 144
                            }
                        ]
                    },
                    {
                        className: 'new-version-content',
                        ref:       this.setRef('newVersionContent')
                    }
                ]
            }
        );
    }

    onLoadNewVersionInfo(data) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            return;
        }
        if (this.getComparableVersion(data.version) < this.getComparableVersion(this._settings.getVersion())) {
            return;
        }
        if ('download' in data) {
            this._downloadLink = data.download;
        }
        this._console
            .addNewVersionTab()
            .onClickNewVersionTab();
        this.create(this._refs.newVersionContent, data.info);
        this.create(
            this._refs.newVersionContent,
            {
                type:    Button,
                ui:      this._ui,
                value:   'Download new version',
                onClick: this.onClickDownload.bind(this)
            }
        );
    }

    onClickDownload() {
        const shell = require('electron').shell;
        shell.openExternal(this._downloadLink);
    }

    getComparableVersion(version) {
        version = version.split('.');
        let result = '';
        version.forEach(function(v) {
            result += ('000' + v).substr(-3) + '-';
        });
        return result;
    }

    setElement(element) {
        this._element = element;
    }
};
