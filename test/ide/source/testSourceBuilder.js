/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SourceBuilder       = require('../../../js/frontend/ide/source/SourceBuilder').SourceBuilder;
const formEditorConstants = require('../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test SourceBuilder',
    () => {
        it(
            'Should set and get lines',
            () => {
                let sourceBuilder = new SourceBuilder({});
                assert.equal(sourceBuilder.setSource('a\nb\n').getSource(), 'a\nb\n');
            }
        );
    }
);
