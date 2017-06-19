(function() {
    var keywords = [
            'proc',
            'for',
            'to',
            'downto',
            'end',
            'endp',
            'endr',
            'add',
            'sub',
            'mul',
            'div',
            'mod',
            'inc',
            'dec',
            'record',
            'ret',
            'set',
            'module',
            'addr',
            'return',
            'jmp',
            'if',
            'select',
            'case',
            'cmp',
            'jmpc',
            'copy',
            'else'
        ];

    var registers = [
            'stack',
            'src',
            'dest',
            'code'
        ];

    var types = [
            'number',
            'string'
        ];

    var sign = [
            '=',
            '(',
            ')',
            ',',
            '+',
            '-',
            '*',
            '/',
            '%',
            '[',
            '|',
            ']'
        ];

    var meta = [
            '#project',
            '#define',
            '#include'
        ];

    var defines = [];
    var records = [];

    function parseLine(line) {
        var result  = '';
        var word    = '';
        var comment = '';

        var i = line.indexOf(';');
        if (i !== -1) {
            comment = line.substr(i - line.length);
            line    = line.substr(0, i);
        }

        var i = 0;

        var addWord = function(w) {
                w = w || word;

                var grabNextWord = function() {
                        var j = i;
                        while ((j < line.length) && (line[j] === ' ')) {
                            j++;
                        }
                        while ((j < line.length) && (line[j] !== ' ')) {
                            j++;
                        }
                        return line.substr(i, j - i).trim();
                    };

                if (isNaN(w)) {
                    if (registers.indexOf(w) !== -1) {
                        result += '<span class="purple">' + w + '</span>';
                    } else if (defines.indexOf(w) !== -1) {
                        result += '<span class="green italic">' + w + '</span>';
                    } else if (records.indexOf(w) !== -1) {
                        result += '<span class="purple">' + w + '</span>';
                    } else if (keywords.indexOf(w) !== -1) {
                        if (w === 'record') {
                            var nextWord = grabNextWord();
                            (nextWord === '') || records.push(nextWord);
                        }
                        result += '<span class="orange">' + w + '</span>';
                    } else if (sign.indexOf(w) !== -1) {
                        result += '<span class="black">' + w + '</span>';
                    } else if (types.indexOf(w) !== -1) {
                        result += '<span class="purple bold">' + w + '</span>';
                    } else if (meta.indexOf(w) !== -1) {
                        if (w === '#define') {
                            var nextWord = grabNextWord();
                            (nextWord === '') || defines.push(nextWord);
                        }
                        result += '<span class="orange italic">' + w + '</span>';
                    } else {
                        result += '<span class="blue">' + w + '</span>';
                    }
                } else {
                    result += '<span class="green">' + w + '</span>';
                }

                word = '';
            };

        while (i < line.length) {
            var c = line[i];

            switch (c) {
                case ' ':
                    (word === '') || addWord(word);
                    result += ' ';
                    break;

                case '"':
                    var s = c;
                    i++;
                    while ((i < line.length) && (line[i] !== '"')) {
                        s += line[i++];
                    }
                    s += c;
                    result += '<span class="green italic">' + s + '</span>';
                    break;

                case ',':
                case '=':
                case '(':
                case ')':
                case '[':
                case ']':
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    (word === '') || addWord(word);
                    addWord(c);
                    break;

                default:
                    word += c;
                    break;
            }
            i++;
        }
        (word === '') || addWord(word);

        if (comment !== '') {
            result += '<span class="comment">' + comment + '</span>';
        }

        return result;
    }

    function parseLines(lines) {
        var result    = '';
        var minLength = 256;

        while (lines.length && (lines[lines.length - 1].trim() === '')) {
            lines.pop();
        }

        lines.forEach(function(line, index) {
            if ((index !== 0) && (index !== line.length - 1) && (line[0] === ' ') && line.trim().length) {
                var i = 0;
                while (line[i] === ' ') {
                    i++;
                }
                if (i < line.length) {
                    minLength = Math.min(minLength, i);
                }
            }
        });

        if (minLength === 256) {
            minLength = lines[0].length - lines[0].trim().length - 4;
        } else {
            minLength = Math.max(minLength - 4, 0);
        }

        lines.forEach(function(line, index) {
            if ((minLength !== 256) && (line[0] === ' ')) {
                line = line.substr(minLength - line.length);
            }
            if (!((index === lines.length - 1) && (line.trim() === ''))) {
                result += parseLine(line) + '\n';
            }
        });
        return result;
    }

    function updateElement(element) {
        var source = element.innerHTML;
        var lines  = source.split('\n');

        window.wheelDemos[element.id] = source;
        element.innerHTML             = parseLines(lines);
    }

    window._wheel = {updateElement: updateElement};

    window.addEventListener(
        'DOMContentLoaded',
        function() {
            window.wheelDemos = {};
            var list = document.querySelectorAll('pre');
            for (var i = 0; i < list.length; i++) {
                updateElement(list[i]);
            }
        }
    );
})();
