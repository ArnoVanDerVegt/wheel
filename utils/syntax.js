(function() {
    var keywords = ['proc', 'for', 'to', 'downto', 'end', 'endp', 'ends', 'add', 'sub', 'mul', 'div', 'mod', 'inc', 'dec', 'struct', 'ret', 'set'];
    var types    = ['number', 'string'];
    var sign     = ['=', '(', ')', ','];
    var meta     = ['#project', '#define', '#include'];

    function parseLine(line) {
        var result  = '';
        var word    = '';
        var comment = '';

        var i = line.indexOf(';');
        if (i !== -1) {
            comment = line.substr(i - line.length);
            line    = line.substr(0, i);
        }

        var addWord = function(w) {
                w = w || word;
                if (isNaN(w)) {
                    if (keywords.indexOf(w) !== -1) {
                        result += '<span class="orange">' + w + '</span>';
                    } else if (sign.indexOf(w) !== -1) {
                        result += '<span class="black">' + w + '</span>';
                    } else if (types.indexOf(w) !== -1) {
                        result += '<span class="purple italic bold">' + w + '</span>';
                    } else if (meta.indexOf(w) !== -1) {
                        result += '<span class="purple bold">' + w + '</span>';
                    } else {
                        result += '<span class="blue">' + w + '</span>';
                    }
                } else {
                    result += '<span class="dark-blue">' + w + '</span>';
                }

                word = '';
            };

        var i = 0;
        while (i < line.length) {
            var c = line[i];

            switch (c) {
                case ' ':
                    (word === '') || addWord(word);
                    result += ' ';
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
            result += '<span class="purple italic">' + comment + '</span>';
        }

        return result;
    }

    function parseLines(lines) {
        var result    = '';
        var minLength = 256;

        lines.forEach(function(line, index) {
            if ((index !== 0) && (index !== line.length - 1) && (line[0] === ' ')) {
                var i = 0;
                while (line[i] === ' ') {
                    i++;
                }
                if (i < line.length) {
                    minLength = Math.min(minLength, i);
                }
            }
        });

        minLength = Math.max(minLength - 4, 0);

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
