(function() {
    var keywords = ['proc', 'number', 'for', 'to', 'downto', 'end', 'endp', 'ends', 'add', 'sub', 'mul', 'div', 'mod'];
    var sign     = ['=', '(', ')', ','];
    var meta     = ['#project', '#define'];

    function parseLine(line) {
        var result = '';
        var i      = 0;
        var word   = '';

        var addWord = function(w) {
                w = w || word;
                if (isNaN(w)) {
                    if (keywords.indexOf(w) !== -1) {
                        result += '<span class="orange">' + w + '</span>';
                    } else if (sign.indexOf(w) !== -1) {
                        result += '<span class="blue">' + w + '</span>';
                    } else if (meta.indexOf(w) !== -1) {
                        result += '<span class="light-green bold">' + w + '</span>';
                    } else {
                        result += '<span class="green">' + w + '</span>';
                    }
                } else {
                    result += '<span class="dark-green">' + w + '</span>';
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
        return result;
    }

    function parseLines(lines) {
        var result = '';
        lines.forEach(function(line) {
            result += parseLine(line) + '\n';
        });
        return result;
    }

    function updateElement(element) {
        var lines = element.innerHTML.split('\n');
        element.innerHTML = parseLines(lines);
    }

    window.addEventListener(
        'DOMContentLoaded',
        function() {
            var list = document.querySelectorAll('pre');
            for (var i = 0; i < list.length; i++) {
                updateElement(list[i]);
            }
        }
    );
})();
