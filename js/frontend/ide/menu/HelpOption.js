/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode     = require('../../lib/dom').DOMNode;
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const TextInput   = require('../../lib/components/TextInput').TextInput;
const tabIndex    = require('../tabIndex');
const getHelpData = require('../help/helpData').getHelpData;

class HelpOptionItem extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui         = opts.ui;
        this._settings   = opts.settings;
        this._title      = opts.title;
        this._tabIndex   = opts.tabIndex;
        this._keyword    = opts.keyword;
        this._fileIndex  = opts.fileIndex;
        this._helpOption = opts.helpOption;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                tabIndex:  this._tabIndex,
                className: 'help-menu-item',
                innerHTML: this._title
            }
        );
    }

    setElement(element) {
        element.addEventListener('click', this.onClick.bind(this));
    }

    onClick(event) {
        dispatcher.dispatch(
            'Dialog.Help.Show',
            {
                keyword:      this._keyword,
                fileIndex:    this._fileIndex,
                documentPath: this._settings
            }
        );
        this._helpOption.hide();
    }
}

exports.HelpOption = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui       = opts.ui;
        this._helpData = null;
        this._keywords = null;
        this._settings = opts.settings;
        this.initDOM(opts.parentNode);
        this.initEvents();
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'help',
                children: [
                    {
                        type:      'span',
                        className: 'label',
                        innerHTML: 'Help'
                    },
                    {
                        id:          this.setHelpInputElement.bind(this),
                        type:        TextInput,
                        ui:          this._ui,
                        uiId:        1,
                        tabIndex:    tabIndex.HELP,
                        onKeyUp:     this.onKeyUp.bind(this),
                        onMousedown: this.onCancelEvent.bind(this),
                        placeholder: 'Search...'
                    },
                    {
                        id:        this.setHelpMenuElement.bind(this),
                        className: 'help-menu'
                    }
                ]
            }
        );
    }

    initEvents() {
        this._ui.addEventListener('Global.Mouse.Down', this, this.onGlobalMouseDown);
    }

    initHelpList(find) {
        let found    = this.getHelpResults(find);
        let lastType = null;
        for (let i = 0; i < found.length; i++) {
            let f = found[i];
            if (f.type !== lastType) {
                lastType = f.type;
                let title = '';
                if (lastType === 'const') {
                    title = 'Constant';
                } else if (lastType === 'proc') {
                    title = 'Procedure';
                } else if (lastType === 'subject') {
                    title = 'Subject';
                }
                if (title) {
                    this.create(
                        this._helpMenuElement,
                        {
                            innerHTML: title,
                            className: 'help-category'
                        }
                    );
                }
            }
            this.create(
                this._helpMenuElement,
                {
                    type:       HelpOptionItem,
                    settings:   this._settings,
                    title:      f.title,
                    keyword:    f.keyword,
                    fileIndex:  f.item.fileIndex,
                    helpOption: this
               }
            );
        }
        this._helpMenuElement.style.display = 'block';
    }

    clearHelpList() {
        while (this._helpMenuElement.childNodes.length) {
            this._helpMenuElement.removeChild(this._helpMenuElement.childNodes[0]);
        }
        return this;
    }

    getHelpResults(find) {
        let helpData = this._helpData;
        let keywords = this._keywords;
        let found    = [];
        for (let i = 0; i < keywords.length; i++) {
            let keyword = keywords[i];
            if (keyword.toLowerCase().indexOf(find) !== -1) {
                let ids = helpData.keywords[keyword];
                for (let j = 0; j < ids.length; j++) {
                    let id = ids[j];
                    if (id in helpData.subjectById) {
                        let subject = helpData.subjectById[id];
                        let title   = (['const', 'proc'].indexOf(subject.type) !== -1) ? subject.description : keyword;
                        found.push({
                            type:    subject.type,
                            keyword: keyword,
                            item:    subject,
                            title:   keyword,
                            toString: function() {
                                return this.item.type + '_' + this.keyword;
                            }
                        });
                    }
                    if (id in helpData.sectionById) {
                        let section = helpData.sectionById[id];
                        let title   = section.title;
                        if (title !== '') {
                            found.push({
                                type:    'subject',
                                keyword: keyword,
                                item:    section,
                                title:   title,
                                toString: function() {
                                    return 'subject_' + this.title;
                                }
                            });
                        }
                    }
                }
            }
        }
        found.sort();
        return found;
    }

    setHelpInputElement(element) {
        this._helpInputElement = element;
    }

    setHelpMenuElement(element) {
        this._helpMenuElement = element;
    }

    onGlobalMouseDown() {
        setTimeout(this.hide.bind(this), 500);
    }

    onCancelEvent(event) {
        event.stopPropagation();
        return this;
    }

    onKeyUp(event) {
        if (!this._keywords) {
            let helpData = getHelpData();
            if (!('keywords' in helpData)) {
                return;
            }
            this._helpData = helpData;
            this._keywords = Object.keys(this._helpData.keywords);
        }
        if (event.keyCode === 27) {
            this.hide();
            return;
        }
        let find = this._helpInputElement.getValue().trim();
        if (find.length < 2) {
            this.hide();
            return;
        }
        this
            .clearHelpList()
            .initHelpList(find);
    }

    hide() {
        this._helpMenuElement.style.display = 'none';
    }
};
