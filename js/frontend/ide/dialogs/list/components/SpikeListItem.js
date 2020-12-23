/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../lib/dom').DOMNode;
const ListItem = require('../../../../lib/components/list/ListItem').ListItem;

exports.SpikeListItem = class extends ListItem {
    initDOM(parentNode) {
        let item = this._item;
        if (typeof item === 'string') {
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
                            className: 'no-select flt rel max-w max-h list-item-item',
                            innerHTML: item
                        }
                    ]
                }
            );
            return;
        }
        let stateColor;
        let stateText;
        if (item.connecting) {
            stateColor = 'yellow';
            stateText  = 'Connecting';
        } else if (item.connected) {
            stateColor = 'green';
            stateText  = 'Connected';
        } else {
            stateColor = 'red';
            stateText  = 'Disconnected';
        }
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
                            item.image ?
                                {
                                    type:      'img',
                                    className: 'no-select',
                                    src:       item.image
                                } :
                                null,
                            item.title ?
                                {
                                    type:      'span',
                                    className: 'no-select item-title',
                                    innerHTML: item.title
                                } :
                                null,
                            {
                                className: 'item-state ' + stateColor,
                                innerHTML: stateText
                            }
                        ]
                    }
                ]
            }
        );
    }
};
