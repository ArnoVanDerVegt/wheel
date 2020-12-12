/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Slider             = require('../components/input/Slider').Slider;
const ComponentContainer = require('./ComponentContainer').ComponentContainer;

exports.Toolbar = class extends ComponentContainer {
    addFileSaved(owner) {
        return {
            id:        owner.setFileSavedElement.bind(owner),
            className: 'bottom-options hidden',
            children: [
                {
                    className: 'file-saved',
                    children: [
                        {
                            className: 'saved-icon'
                        },
                        {
                            id:   owner.setFilenameSavedElement.bind(owner),
                            type: 'span'
                        }
                    ]
                }
            ]
        };
    }

    addCursorInfo(owner) {
        return {
            ref:       owner.setRef('cursorPosition'),
            className: 'cursor-info'
        };
    }

    addZoom(owner, tabIndex, value, ref) {
        return {
            ref:       ref,
            className: 'bottom-options right',
            children: [
                {
                    innerHTML: 'Zoom:',
                    className: 'no-select label'
                },
                {
                    type:     Slider,
                    ui:       this._ui,
                    tabIndex: tabIndex,
                    value:    value,
                    maxValue: 3,
                    onChange: owner.onSelectZoom.bind(owner)
                }
            ]
        };
    }
};
