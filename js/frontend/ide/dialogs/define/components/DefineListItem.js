/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const ListItem   = require('../../../../lib/components/list/ListItem').ListItem;
const Checkbox   = require('../../../../lib/components/input/Checkbox').Checkbox;

exports.DefineListItem = class extends ListItem {
    initDOM(parentNode) {
        let item = this._item;
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'flt rel max-w list-item',
                children: [
                    {
                        id:        this.setLinkElement.bind(this),
                        tabIndex:  this._tabIndex,
                        type:      'a',
                        href:      '#',
                        className: 'flt rel max-w max-h list-item-item',
                        children: [
                            {
                                type:     Checkbox,
                                ref:      this.setRef('active'),
                                ui:       this._ui,
                                uiId:     this._uiId,
                                tabIndex: this._tabIndex + 1,
                                onChange: this.onChangeActive.bind(this, item),
                                checked:  item.active
                            },
                            {
                                type:      'span',
                                className: 'no-select item-title',
                                innerHTML: item.key
                            },
                            {
                                type:      'span',
                                className: 'no-select item-sub-title',
                                innerHTML: item.value,
                                title:     item.value
                            },
                            {
                                className: 'item-state green',
                                innerHTML: item.type
                            }
                        ]
                    }
                ]
            }
        );
    }

    onChangeActive(item) {
        item.active = this._refs.active.getValue();
        dispatcher.dispatch('Settings.Define.UpdateByIndex', item, this._index);
    }

    setDisabled(disabled) {
        this._linkElement.tabIndex = disabled ? -1 : this._tabIndex;
        this._refs.active.setDisabled(disabled);
    }
};
