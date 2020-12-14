/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentStyle = require('../../../js/frontend/lib/components/component/componentStyle');
const assert         = require('assert');

describe(
    'Test componentStyle',
    () => {
        describe(
            'Test init',
            () => {
                it(
                    'Should init empty component style',
                    () => {
                        assert.deepEqual(
                            componentStyle.init({}),
                            {
                                width:        null,
                                height:       null,
                                position:     null,
                                zIndex:       null,
                                left:         null,
                                top:          null,
                                fontSize:     null,
                                hAlign:       null,
                                radius:       null,
                                borderRadius: null,
                                borderColor:  null,
                                borderWidth:  null,
                                fillColor:    null
                            }
                        );
                    }
                );
                it(
                    'Should init values',
                    () => {
                        assert.deepEqual(
                            componentStyle.init({
                                width:        1,
                                height:       2,
                                position:     3,
                                zIndex:       4,
                                left:         5,
                                top:          6,
                                fontSize:     7,
                                hAlign:       8,
                                radius:       9,
                                borderRadius: 10,
                                borderWidth:  11
                            }),
                            {
                                width:        1,
                                height:       2,
                                position:     3,
                                zIndex:       4,
                                left:         5,
                                top:          6,
                                fontSize:     7,
                                hAlign:       8,
                                radius:       9,
                                borderRadius: 10,
                                borderColor:  null,
                                borderWidth:  11,
                                fillColor:    null
                            }
                        );
                    }
                );
                it(
                    'Should not accept a primitve for a color value',
                    () => {
                        assert.deepEqual(
                            componentStyle.init({
                                fillColor:   true,
                                borderColor: true
                            }),
                            {
                                width:        null,
                                height:       null,
                                position:     null,
                                zIndex:       null,
                                left:         null,
                                top:          null,
                                fontSize:     null,
                                hAlign:       null,
                                radius:       null,
                                borderRadius: null,
                                borderColor:  null,
                                borderWidth:  null,
                                fillColor:    null
                            }
                        );
                    }
                );
                it(
                    'Should accept an object for a color value',
                    () => {
                        assert.deepEqual(
                            componentStyle.init({
                                fillColor:   {red: 1, grn: 2, blu: 3},
                                borderColor: {red: 4, grn: 5, blu: 6}
                            }),
                            {
                                width:        null,
                                height:       null,
                                position:     null,
                                zIndex:       null,
                                left:         null,
                                top:          null,
                                fontSize:     null,
                                hAlign:       null,
                                radius:       null,
                                borderRadius: null,
                                borderColor:  {red: 4, grn: 5, blu: 6},
                                borderWidth:  null,
                                fillColor:    {red: 1, grn: 2, blu: 3}
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Test update',
            () => {
                it(
                    'Should update position',
                    () => {
                        let style = {};
                        componentStyle.update(style, {x: 10, y: 11});
                        assert.deepEqual(
                            style,
                            {
                                left: 10,
                                top:  11
                            }
                        );
                    }
                );
                it(
                    'Should update properties',
                    () => {
                        let style = {};
                        componentStyle.update(
                            style,
                            {
                                width:        1,
                                height:       2,
                                zIndex:       3,
                                fontSize:     4,
                                hAlign:       5,
                                radius:       6,
                                borderRadius: 7,
                                borderWidth:  8,
                                borderColor:  9,
                                fillColor:    10
                            }
                        );
                        assert.deepEqual(
                            style,
                            {
                                width:        1,
                                height:       2,
                                zIndex:       3,
                                fontSize:     4,
                                hAlign:       5,
                                radius:       6,
                                borderRadius: 7,
                                borderWidth:  8,
                                borderColor:  9,
                                fillColor:    10
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Test apply',
            () => {
                it(
                    'Should apply properties',
                    () => {
                        let style = {};
                        componentStyle.apply(
                            style,
                            componentStyle.init({
                                position:     1,
                                zIndex:       2,
                                hAlign:       3,
                                borderRadius: 4
                            })
                        );
                        assert.deepEqual(
                            style,
                            {
                                position:     1,
                                zIndex:       2,
                                textAlign:    3,
                                borderRadius: 4
                            }
                        );
                    }
                );
                it(
                    'Should apply left and top',
                    () => {
                        let style = {};
                        componentStyle.apply(style, componentStyle.init({left: 60, top: 70}));
                        assert.deepEqual(
                            style,
                            {
                                left: '60px',
                                top:  '70px'
                            }
                        );
                    }
                );
                it(
                    'Should apply radius',
                    () => {
                        let style = {};
                        componentStyle.apply(style, componentStyle.init({radius: 25}));
                        assert.deepEqual(
                            style,
                            {
                                width:        '50px',
                                height:       '50px',
                                borderRadius: '25px'
                            }
                        );
                    }
                );
                it(
                    'Should apply width and height',
                    () => {
                        let style = {};
                        componentStyle.apply(style, componentStyle.init({width: 30, height: 40}));
                        assert.deepEqual(
                            style,
                            {
                                width:  '30px',
                                height: '40px'
                            }
                        );
                    }
                );
                it(
                    'Should apply font size',
                    () => {
                        let style = {};
                        componentStyle.apply(style, componentStyle.init({fontSize: 16}));
                        assert.deepEqual(
                            style,
                            {
                                fontSize: '16px'
                            }
                        );
                    }
                );
                it(
                    'Should apply border',
                    () => {
                        let style = {};
                        componentStyle.apply(style, componentStyle.init({borderWidth: 2}));
                        assert.deepEqual(
                            style,
                            {
                                border: '2px solid black'
                            }
                        );
                        style = {};
                        componentStyle.apply(style, componentStyle.init({borderWidth: 3, borderColor: {red: 1, grn: 2, blu: 3}}));
                        assert.deepEqual(
                            style,
                            {
                                border: '3px solid rgb(1,2,3)'
                            }
                        );
                    }
                );
                it(
                    'Should apply fill color',
                    () => {
                        let style = {};
                        componentStyle.apply(style, componentStyle.init({fillColor: {red: 1, grn: 2, blu: 3}}));
                        assert.deepEqual(
                            style,
                            {
                                backgroundColor: 'rgb(1,2,3)'
                            }
                        );
                    }
                );
            }
        );
    }
);
