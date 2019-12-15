/* eslint-disable */
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
    mod(CodeMirror);
})(function(CodeMirror) {
    let HINT_ELEMENT_CLASS        = 'CodeMirror-hint';
    let ACTIVE_HINT_ELEMENT_CLASS = 'CodeMirror-hint-active';

    // This is the old interface, kept around for now to stay backwards-compatible.
    CodeMirror.showHint = function(cm, getHints, options) {
        if (!getHints) {
            return cm.showHint(options);
        }
        if (options && options.async) {
            getHints.async = true;
        }
        let newOpts = {hint: getHints};
        if (options) {
            for (let prop in options) {
                newOpts[prop] = options[prop];
            }
        }
        return cm.showHint(newOpts);
    };

    CodeMirror.defineExtension('showHint', function(options) {
        options = parseOptions(this, this.getCursor('start'), options);
        let selections = this.listSelections()
        if (selections.length > 1) {
            return;
        }
        // By default, don't allow completion when something is selected.
        // A hint function can have a `supportsSelection` property to indicate that it can handle selections.
        if (this.somethingSelected()) {
            if (!options.hint.supportsSelection) {
                return;
            }
            // Don't try with cross-line selections
            for (let i = 0; i < selections.length; i++) {
                if (selections[i].head.line != selections[i].anchor.line) {
                    return;
                }
            }
        }
        if (this.state.completionActive) {
            this.state.completionActive.close();
        }
        let completion = this.state.completionActive = new Completion(this, options);
        if (!completion.options.hint) {
            return;
        }
        CodeMirror.signal(this, 'startCompletion', this);
        completion.update(true);
    });

    CodeMirror.defineExtension('closeHint', function() {
        if (this.state.completionActive) {
            this.state.completionActive.close();
        }
    })

    function Completion(cm, options) {
        this.cm         = cm;
        this.options    = options;
        this.widget     = null;
        this.debounce   = 0;
        this.tick       = 0;
        this.startPos   = this.cm.getCursor('start');
        this.startLen   = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length;
        let self = this;
        cm.on('cursorActivity', this.activityFunc = function() { self.cursorActivity(); });
    }

    let requestAnimationFrame = window.requestAnimationFrame || function(fn) {
            return setTimeout(fn, 1000/60);
        };
    let cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

    Completion.prototype = {
        close: function() {
            if (!this.active()) {
                return;
            }
            this.cm.state.completionActive  = null;
            this.tick                       = null;
            this.cm.off('cursorActivity', this.activityFunc);
            if (this.widget && this.data) {
                CodeMirror.signal(this.data, 'close');
            }
            if (this.widget) this.widget.close();
            CodeMirror.signal(this.cm, 'endCompletion', this.cm);
        },

        active: function() {
            return this.cm.state.completionActive == this;
        },

        pick: function(data, i) {
            let completion = data.list[i].keyword;
            if (completion.hint) {
                completion.hint(this.cm, data, completion);
            } else {
                this.cm.replaceRange(
                    getText(completion),
                    completion.from || data.from,
                    completion.to || data.to, 'complete'
                );
            }
            CodeMirror.signal(data, 'pick', completion);
            this.close();
        },

        cursorActivity: function() {
            if (this.debounce) {
                cancelAnimationFrame(this.debounce);
                this.debounce = 0;
            }
            let pos  = this.cm.getCursor();
            let line = this.cm.getLine(pos.line);
            if (pos.line != this.startPos.line || line.length - pos.ch != this.startLen - this.startPos.ch ||
                pos.ch < this.startPos.ch || this.cm.somethingSelected() ||
                (!pos.ch || this.options.closeCharacters.test(line.charAt(pos.ch - 1)))) {
                this.close();
            } else {
                let self = this;
                this.debounce = requestAnimationFrame(function() {self.update();});
                if (this.widget) {
                    this.widget.disable();
                }
            }
        },

        update: function(first) {
            if (this.tick == null) {
                return
            }
            let self   = this;
            let myTick = ++this.tick
            fetchHints(
                this.options.hint,
                this.cm,
                this.options,
                function(data) {
                    if (self.tick == myTick) {
                        self.finishUpdate(data, first);
                    }
                }
            );
        },

        finishUpdate: function(data, first) {
            if (this.data) {
                CodeMirror.signal(this.data, 'update');
            }
            let picked = (this.widget && this.widget.picked) || (first && this.options.completeSingle);
            if (this.widget) {
                this.widget.close();
            }
            this.data = data;
            if (data && data.list.length) {
                if (picked && data.list.length == 1) {
                    this.pick(data, 0);
                } else {
                    this.widget = new Widget(this, data);
                    CodeMirror.signal(data, 'shown');
                }
            }
        }
    };

    function parseOptions(cm, pos, options) {
        let editor  = cm.options.hintOptions;
        let out     = {};
        for (let prop in defaultOptions) {
            out[prop] = defaultOptions[prop];
        }
        if (editor) {
            for (let prop in editor) {
                if (editor[prop] !== undefined) {
                    out[prop] = editor[prop];
                }
                if (options) {
                    for (let prop in options) {
                        if (options[prop] !== undefined) {
                            out[prop] = options[prop];
                        }
                    }
                }
            }
        }
        if (out.hint.resolve) {
            out.hint = out.hint.resolve(cm, pos)
        }
        return out;
    }

    function getText(completion) {
        if (typeof completion == 'string') {
            return completion;
        }
        return completion.text;
    }

    function buildKeyMap(completion, handle) {
        let baseMap = {
                Up:         function() {handle.moveFocus(-1);},
                Down:       function() {handle.moveFocus(1);},
                PageUp:     function() {handle.moveFocus(-handle.menuSize() + 1, true);},
                PageDown:   function() {handle.moveFocus(handle.menuSize() - 1, true);},
                Home:       function() {handle.setFocus(0);},
                End:        function() {handle.setFocus(handle.length - 1);},
                Enter:      handle.pick,
                Tab:        handle.pick,
                Esc:        handle.close
            };
        let mac = /Mac/.test(navigator.platform);
        if (mac) {
            baseMap['Ctrl-P'] = function() {handle.moveFocus(-1);};
            baseMap['Ctrl-N'] = function() {handle.moveFocus(1);};
        }
        let custom = completion.options.customKeys;
        let ourMap = custom ? {} : baseMap;
        function addBinding(key, val) {
            let bound;
            if (typeof val != 'string') {
                bound = function(cm) { return val(cm, handle); };
                // This mechanism is deprecated
            } else if (baseMap.hasOwnProperty(val)) {
                bound = baseMap[val];
            } else {
                bound = val;
            }
            ourMap[key] = bound;
        }
        if (custom) {
            for (let key in custom) {
                if (custom.hasOwnProperty(key)) {
                    addBinding(key, custom[key]);
                }
            }
        }
        let extra = completion.options.extraKeys;
        if (extra) {
            for (let key in extra) {
                if (extra.hasOwnProperty(key)) {
                    addBinding(key, extra[key]);
                }
            }
        }
        return ourMap;
    }

    function getHintElement(hintsElement, el) {
        while (el && el != hintsElement) {
            if (el.nodeName.toUpperCase() === 'LI' && el.parentNode == hintsElement) {
                return el;
            }
            el = el.parentNode;
        }
    }

    function Widget(completion, data) {
        this.completion = completion;
        this.data       = data;
        this.picked     = false;
        let widget          = this;
        let cm              = completion.cm;
        let ownerDocument   = cm.getInputField().ownerDocument;
        let parentWindow    = ownerDocument.defaultView || ownerDocument.parentWindow;
        let hints           = this.hints = ownerDocument.createElement('ul');
        let theme           = completion.cm.options.theme;
        let completions     = data.list;
        hints.className   = 'CodeMirror-hints ' + theme;
        this.selectedHint = data.selectedHint || 0;
        for (let i = 0; i < completions.length; ++i) {
            let element   = hints.appendChild(ownerDocument.createElement('li'));
            let title     = completions[i].title;
            let className = HINT_ELEMENT_CLASS + (i != this.selectedHint ? '' : ' ' + ACTIVE_HINT_ELEMENT_CLASS);
            element.className = className;
            let divElement = ownerDocument.createElement('div');
            divElement.className = 'title';
            divElement.innerHTML = title;
            element.appendChild(divElement);
            element.hintId = i;
            if (completions[i].hint) {
                let hintElement = ownerDocument.createElement('pre');
                hintElement.className = 'wheel';
                hintElement.innerHTML = completions[i].hint;
                element.appendChild(hintElement);
            }
        }
        let container   = completion.options.container || ownerDocument.body;
        let pos         = cm.cursorCoords(completion.options.alignWithWord ? data.from : null);
        let left        = pos.left, top = pos.bottom, below = true;
        let offsetLeft  = 0, offsetTop = 0;
        if (container !== ownerDocument.body) {
            // We offset the cursor position because left and top are relative to the offsetParent's top left corner.
            let isContainerPositioned   = ['absolute', 'relative', 'fixed'].indexOf(parentWindow.getComputedStyle(container).position) !== -1;
            let offsetParent            = isContainerPositioned ? container : container.offsetParent;
            let offsetParentPosition    = offsetParent.getBoundingClientRect();
            let bodyPosition            = ownerDocument.body.getBoundingClientRect();
            offsetLeft = (offsetParentPosition.left - bodyPosition.left - offsetParent.scrollLeft);
            offsetTop  = (offsetParentPosition.top - bodyPosition.top - offsetParent.scrollTop);
        }
        hints.style.left = (left - offsetLeft) + 'px';
        hints.style.top  = (top - offsetTop) + 'px';
        // If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
        let winW = parentWindow.innerWidth || Math.max(ownerDocument.body.offsetWidth, ownerDocument.documentElement.offsetWidth);
        let winH = parentWindow.innerHeight || Math.max(ownerDocument.body.offsetHeight, ownerDocument.documentElement.offsetHeight);
        container.appendChild(hints);
        let box         = hints.getBoundingClientRect(), overlapY = box.bottom - winH;
        let scrolls     = hints.scrollHeight > hints.clientHeight + 1
        let startScroll = cm.getScrollInfo();
        if (overlapY > 0) {
            let height = box.bottom - box.top;
            let curTop = pos.top - (pos.bottom - box.top);
            if (curTop - height > 0) { // Fits above cursor
                hints.style.top = (top = pos.top - height - offsetTop) + 'px';
                below           = false;
            } else if (height > winH) {
                hints.style.height  = (winH - 5) + 'px';
                hints.style.top     = (top = pos.bottom - box.top - offsetTop) + 'px';
                let cursor = cm.getCursor();
                if (data.from.ch != cursor.ch) {
                    pos                 = cm.cursorCoords(cursor);
                    hints.style.left    = (left = pos.left - offsetLeft) + 'px';
                    box                 = hints.getBoundingClientRect();
                }
            }
        }
        let overlapX = box.right - winW;
        if (overlapX > 0) {
            if (box.right - box.left > winW) {
                hints.style.width = (winW - 5) + 'px';
                overlapX -= (box.right - box.left) - winW;
            }
            hints.style.left = (left = pos.left - overlapX - offsetLeft) + 'px';
        }
        if (scrolls) {
            for (let node = hints.firstChild; node; node = node.nextSibling) {
                node.style.paddingRight = cm.display.nativeBarWidth + 'px'
            }
        }
        cm.addKeyMap(this.keyMap = buildKeyMap(completion, {
            moveFocus:  function(n, avoidWrap) { widget.changeActive(widget.selectedHint + n, avoidWrap); },
            setFocus:   function(n) { widget.changeActive(n); },
            menuSize:   function() { return widget.screenAmount(); },
            length:     completions.length,
            close:      function() { completion.close(); },
            pick:       function() { widget.pick(); },
            data:       data
        }));
        if (completion.options.closeOnUnfocus) {
            let closingOnBlur;
            cm.on('blur',  this.onBlur  = function() { closingOnBlur = setTimeout(function() { completion.close(); }, 100); });
            cm.on('focus', this.onFocus = function() { clearTimeout(closingOnBlur); });
        }
        cm.on('scroll', this.onScroll = function() {
            let curScroll   = cm.getScrollInfo(), editor = cm.getWrapperElement().getBoundingClientRect();
            let newTop      = top + startScroll.top - curScroll.top;
            let point       = newTop - (parentWindow.pageYOffset || (ownerDocument.documentElement || ownerDocument.body).scrollTop);
            if (!below) {
                point += hints.offsetHeight;
            }
            if (point <= editor.top || point >= editor.bottom) {
                return completion.close();
            }
            hints.style.top  = newTop + 'px';
            hints.style.left = (left + startScroll.left - curScroll.left) + 'px';
        });

        CodeMirror.on(hints, 'dblclick', function(e) {
            let t = getHintElement(hints, e.target || e.srcElement);
            if (t && t.hintId != null) {widget.changeActive(t.hintId); widget.pick();}
        });

        CodeMirror.on(hints, 'click', function(e) {
            let t = getHintElement(hints, e.target || e.srcElement);
            if (t && t.hintId != null) {
                widget.changeActive(t.hintId);
                if (completion.options.completeOnSingleClick) {
                    widget.pick();
                }
            }
        });

        CodeMirror.on(hints, 'mousedown', function() {
            setTimeout(function() {cm.focus();}, 20);
        });

        CodeMirror.signal(data, 'select', completions[this.selectedHint], hints.childNodes[this.selectedHint]);
        return true;
    }

    Widget.prototype = {
        close: function() {
            if (this.completion.widget != this) {
                return;
            }
            this.completion.widget = null;
            this.hints.parentNode.removeChild(this.hints);
            this.completion.cm.removeKeyMap(this.keyMap);
            let cm = this.completion.cm;
            if (this.completion.options.closeOnUnfocus) {
                cm.off('blur',  this.onBlur);
                cm.off('focus', this.onFocus);
            }
            cm.off('scroll', this.onScroll);
        },

        disable: function() {
            this.completion.cm.removeKeyMap(this.keyMap);
            let widget = this;
            this.keyMap = {Enter: function() { widget.picked = true; }};
            this.completion.cm.addKeyMap(this.keyMap);
        },

        pick: function() {
            this.completion.pick(this.data, this.selectedHint);
        },

        changeActive: function(i, avoidWrap) {
            if (i >= this.data.list.length) {
                i = avoidWrap ? this.data.list.length - 1 : 0;
            } else if (i < 0) {
                i = avoidWrap ? 0  : this.data.list.length - 1;
            }
            if (this.selectedHint == i) {
                return;
            }
            let node = this.hints.childNodes[this.selectedHint];
            if (node) {
                node.className = node.className.replace(' ' + ACTIVE_HINT_ELEMENT_CLASS, '');
            }
            node = this.hints.childNodes[this.selectedHint = i];
            node.className += ' ' + ACTIVE_HINT_ELEMENT_CLASS;
            if (node.offsetTop < this.hints.scrollTop) {
                this.hints.scrollTop = node.offsetTop - 3;
            } else if (node.offsetTop + node.offsetHeight > this.hints.scrollTop + this.hints.clientHeight) {
                this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3;
            }
            CodeMirror.signal(this.data, 'select', this.data.list[this.selectedHint].keyword, node);
        },

        screenAmount: function() {
            return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
        }
    };

    function applicableHelpers(cm, helpers) {
        if (!cm.somethingSelected()) {
            return helpers;
        }
        let result = []
        for (let i = 0; i < helpers.length; i++) {
            if (helpers[i].supportsSelection) {
                result.push(helpers[i]);
            }
        }
        return result
    }

    function fetchHints(hint, cm, options, callback) {
        if (hint.async) {
            hint(cm, callback, options)
        } else {
            let result = hint(cm, options)
            if (result && result.then) {
                result.then(callback)
            } else {
                callback(result)
            }
        }
    }

    function resolveAutoHints(cm, pos) {
        let helpers = cm.getHelpers(pos, 'hint');
        let words;
        if (helpers.length) {
            let resolved = function(cm, callback, options) {
                    let app = applicableHelpers(cm, helpers);
                    function run(i) {
                        if (i == app.length) {
                            return callback(null)
                        }
                        fetchHints(app[i], cm, options, function(result) {
                            if (result && result.list.length > 0) {
                                callback(result);
                            } else {
                                run(i + 1);
                            }
                        })
                    }
                    run(0)
                };
            resolved.async              = true;
            resolved.supportsSelection  = true;
            return resolved
        } else if (words = cm.getHelper(cm.getCursor(), 'hintWords')) {
            return function(cm) { return CodeMirror.hint.fromList(cm, {words: words}) }
        } else if (CodeMirror.hint.anyword) {
            return function(cm, options) { return CodeMirror.hint.anyword(cm, options) }
        }
        return function() {}
    }

    CodeMirror.registerHelper('hint', 'auto', {
        resolve: resolveAutoHints
    });

    CodeMirror.registerHelper('hint', 'fromList', function(cm, options) {
        let cur   = cm.getCursor();
        let token = cm.getTokenAt(cur)
        let term;
        let from  = CodeMirror.Pos(cur.line, token.start);
        let to    = cur;
        if (token.start < cur.ch && /\w/.test(token.string.charAt(cur.ch - token.start - 1))) {
            term = token.string.substr(0, cur.ch - token.start);
        } else {
            term = '';
            from = cur;
        }
        let found = [];
        for (let i = 0; i < options.words.length; i++) {
            let word = options.words[i];
            if (word.slice(0, term.length) == term) {
                found.push(word);
            }
        }
        if (found.length) {
            return {list: found, from: from, to: to};
        }
    });

    CodeMirror.commands.autocomplete = CodeMirror.showHint;

    let defaultOptions = {
            hint:                   CodeMirror.hint.auto,
            completeSingle:         true,
            alignWithWord:          true,
            closeCharacters:        /[\s()\[\]{};:>,]/,
            closeOnUnfocus:         true,
            completeOnSingleClick:  true,
            container:              null,
            customKeys:             null,
            extraKeys:              null
        };

    CodeMirror.defineOption('hintOptions', null);
});
