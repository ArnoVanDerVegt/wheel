/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../lib/dom').DOMNode;
const ListItem = require('../../../../lib/components/list/ListItem').ListItem;

exports.ListItem = class extends ListItem {
    initDOM(parentNode) {
        let item = this._item;
        if (typeof item === 'string') {
            this.create(
                parentNode,
                {
                    id:        this.setElement.bind(this),
                    className: 'list-item',
                    children: [
                        {
                            id:        this.setLinkElement.bind(this),
                            type:      'a',
                            tabIndex:  this._tabIndex,
                            href:      '#',
                            innerHTML: item
                        }
                    ]
                }
            );
            return;
        }
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'list-item',
                children: [
                    {
                        id:        this.setLinkElement.bind(this),
                        type:      'a',
                        tabIndex:  this._tabIndex,
                        href:      '#',
                        children: [
                            item.image ?
                                {
                                    type:      'img',
                                    src:       item.image
                                } :
                                null,
                            item.label ?
                                {
                                    type:      'span',
                                    innerHTML: item.label
                                } :
                                null,
                            item.title ?
                                {
                                    type:      'span',
                                    className: 'item-title',
                                    innerHTML: item.title
                                } :
                                null,
                            item.subTitle ?
                                {
                                    type:      'span',
                                    className: 'item-sub-title',
                                    innerHTML: this._settings.getDeviceAlias(item.subTitle) + ' (' + item.subTitle + ')',
                                    title:     item.subTitle
                                } :
                                null,
                            {
                                className: 'item-status ' + (item.connected ? 'green' : 'red'),
                                innerHTML: item.connected ? 'Connected' : 'Disconnected'
                            }
                        ]
                    }
                ]
            }
        );
    }
};
