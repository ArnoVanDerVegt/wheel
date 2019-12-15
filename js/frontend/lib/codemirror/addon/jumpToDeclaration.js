/* eslint-disable */
(function(mod) { mod(CodeMirror); })(function(CodeMirror) {
    CodeMirror.commands.jumpToDeclaration = function(cm) {
        let line  = cm.getCursor().line;
        let ch    = cm.getCursor().ch;
        let start = cm.findWordAt({line: line, ch: ch}).anchor.ch;
        let end   = cm.findWordAt({line: line, ch: ch}).head.ch;
        console.log('Jump:', cm.getRange({line: line, ch: start}, {line: line, ch: end}));
    };

    CodeMirror.keyMap['default']['Ctrl-Enter'] = 'jumpToDeclaration';
});
