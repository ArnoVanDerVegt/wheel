/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../js/frontend/lib/dispatcher').dispatcher;
const UIState    = require('../../js/frontend/lib/UIState').UIState;
const assert     = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test UIState',
    () => {
        it(
            'Should create UIState',
            () => {
                let uiState = new UIState();
                assert.notEqual(uiState, null);
            }
        );
        it(
            'Should get next uiId',
            () => {
                let uiState = new UIState();
                assert.equal(uiState.getNextUIId(), 2);
            }
        );
        it(
            'Should get active uiId with empty stack',
            () => {
                let uiState = new UIState();
                assert.equal(uiState.getActiveUIId(), 1);
            }
        );
        it(
            'Should get meta key down',
            () => {
                let uiState = new UIState();
                assert.equal(uiState.getKeyMetaDown(), false);
            }
        );
        it(
            'Should get control key down',
            () => {
                let uiState = new UIState();
                assert.equal(uiState.getKeyControlDown(), false);
            }
        );
        it(
            'Should emit Global.UIId on push',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.UIId',
                    this,
                    () => {
                        assert.equal(uiState.getActiveUIId(), 17);
                        done();
                    }
                );
                uiState.pushUIId(17);
            }
        );
        it(
            'Should emit Global.UIId on pop',
            function(done) {
                let uiState = new UIState();
                uiState.pushUIId(17);
                uiState.on(
                    'Global.UIId',
                    this,
                    () => {
                        // The stack is empty again...
                        assert.equal(uiState.getActiveUIId(), 1);
                        done();
                    }
                );
                uiState.popUIId();
            }
        );
        it(
            'Should emit Global.UIId on pop with an item left on the stack',
            function(done) {
                let uiState = new UIState();
                uiState.pushUIId(13);
                uiState.pushUIId(17);
                uiState.on(
                    'Global.UIId',
                    this,
                    () => {
                        // The stack is not empty...
                        assert.equal(uiState.getActiveUIId(), 13);
                        done();
                    }
                );
                uiState.popUIId();
            }
        );
        it(
            'Should emit Global.Mouse.Down',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.Mouse.Down',
                    this,
                    (event) => {
                        assert.equal(event, 'testMouseDown');
                        done();
                    }
                );
                uiState.onMouseDown('testMouseDown');
            }
        );
        it(
            'Should emit Global.Mouse.Move',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.Mouse.Move',
                    this,
                    (event) => {
                        assert.equal(event, 'testMouseMove');
                        done();
                    }
                );
                uiState.onMouseMove('testMouseMove');
            }
        );
        it(
            'Should emit Global.Mouse.Up',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.Mouse.Up',
                    this,
                    (event) => {
                        assert.equal(event, 'testMouseUp');
                        done();
                    }
                );
                uiState.onMouseUp('testMouseUp');
            }
        );
        it(
            'Should emit Global.Key.Up',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.Key.Up',
                    this,
                    (event) => {
                        assert.equal(event.key, 'testKeyUp');
                        done();
                    }
                );
                uiState.onKeyUp({key: 'testKeyUp', preventDefault: () => {}});
            }
        );
        it(
            'Should emit Global.Key.Down',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.Key.Down',
                    this,
                    (event) => {
                        assert.equal(event.key, 'testKeyDown');
                        done();
                    }
                );
                uiState.onKeyDown({key: 'testKeyDown', preventDefault: () => {}});
            }
        );
        it(
            'Should emit Global.Window.Blur',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.Window.Blur',
                    this,
                    (event) => {
                        assert.equal(event, 'testWindowBlur');
                        done();
                    }
                );
                uiState.onBlur('testWindowBlur');
            }
        );
        it(
            'Should emit Global.Window.Focus',
            function(done) {
                let uiState = new UIState();
                uiState.on(
                    'Global.Window.Focus',
                    this,
                    (event) => {
                        assert.equal(event, 'testWindowFocus');
                        done();
                    }
                );
                uiState.onFocus('testWindowFocus');
            }
        );
    }
);
