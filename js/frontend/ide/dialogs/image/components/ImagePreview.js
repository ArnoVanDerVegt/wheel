/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../lib/dom').DOMNode;

exports.ImagePreview = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode, opts.owner);
    }

    initDOM(parentNode, owner) {
        this.create(
            parentNode,
            {
                className: 'image-preview',
                children: [
                    {
                        id:        owner.setImageContentElement.bind(owner),
                        className: 'image-content',
                        children: [
                            {
                                id:        owner.setImageContainerElement.bind(owner),
                                className: 'image-container',
                                children: [
                                    {
                                        id:   owner.setImageElement.bind(owner),
                                        type: 'img'
                                    },
                                    {
                                        id:        owner.addSelectedElement.bind(owner),
                                        className: 'selected1'
                                    },
                                    {
                                        id:        owner.addSelectedElement.bind(owner),
                                        className: 'selected2'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
    }
};
