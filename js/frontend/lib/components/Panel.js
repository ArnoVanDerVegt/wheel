/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Panel = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'panel';
        super(opts);
        this._containerIdsForForm = opts.containerIdsForForm;
        this._settings            = opts.settings;
        this._containerIds        = opts.containerIds;
        this._getDataProvider     = opts.getDataProvider;
        this._getFormPath         = opts.getFormPath;
        this._panelConstructor    = opts.panelConstructor || 'div';
        this._panelOpts           = opts.panelOpts || {};
        this._width               = opts.width     || 128;
        this._height              = opts.height    ||  80;
        this._children            = opts.children  || [];
        this._tabs                = opts.tabs;
        this._panels              = [];
        this._active              = 0;
        this._events              = [];
        this.initDOM(opts.parentNode);
    }

    initPanel() {
        this._panels.length = 0;
        let opts = Object.assign({}, this._panelOpts);
        opts.containerIdsForForm = this._containerIdsForForm;
        opts.settings            = this._settings;
        opts.type                = this._panelConstructor;
        opts.id                  = this.addPanel.bind(this);
        opts.children            = this._children[0] || [];
        opts.containerId         = this._containerIds[0];
        opts.className           = 'panel-panel';
        return [opts];
    }

    initDOM(parentNode) {
        let style = this._style || {};
        style.width  = this._width  + 'px';
        style.height = this._height + 'px';
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                style:     style,
                className: this.getClassName(),
                children:  this.initPanel()
            }
        );
    }

    remove() {
        let events = this._events;
        while (events.length) {
            events.pop()();
        }
        super.remove();
    }

    addPanel(panel) {
        this._panels.push(panel);
    }

    onEvent(opts) {
        let element = this._element;
        let refs    = this._refs;
        if ('width' in opts) {
            element.style.width = Math.max(opts.width, 128) + 'px';
        }
        if ('height' in opts) {
            element.style.height = Math.max(opts.height, 80) + 'px';
        }
        super.onEvent(opts);
    }

    getActive() {
        return 0;
    }
};

exports.Component = exports.Panel;
