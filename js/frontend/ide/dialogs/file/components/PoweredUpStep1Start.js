/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../../lib/dom').DOMNode;
const Button       = require('../../../../lib/components/Button').Button;
const Dropdown     = require('../../../../lib/components/Dropdown').Dropdown;
const getImage     = require('../../../data/images').getImage;
const Step         = require('./Step').Step;

exports.PoweredUpStep1Start = class extends Step {
    initContent() {
        return {
            className: 'abs dialog-cw dialog-l dialog-b step-content step1',
            children: [
                {
                    className: 'abs dialog-l text',
                    children: [
                        {
                            className: 'no-select',
                            innerHTML: 'With this wizard you can create a Powered up project. It helps you setup the following items:'
                        },
                        {
                            type: 'ul',
                            children: [
                                {
                                    type:      'li',
                                    className: 'no-select',
                                    innerHTML: 'A project file'
                                },
                                {
                                    type:      'li',
                                    className: 'no-select',
                                    innerHTML: 'Code to connect to different Powered Up devices'
                                },
                                {
                                    type:      'li',
                                    className: 'no-select',
                                    innerHTML: 'Code to connect to different motors and sensors'
                                },
                                {
                                    type:      'li',
                                    className: 'no-select',
                                    innerHTML: 'An -optional- application form'
                                },
                                {
                                    type:      'li',
                                    className: 'no-select',
                                    innerHTML: 'Include library files in your project'
                                }
                            ]
                        }
                    ]
                },
                {
                    type:      'img',
                    className: 'no-select abs dialog-r',
                    src:       getImage('images/poweredup/technicHub256.png')
                }
            ]
        };
    }
};
