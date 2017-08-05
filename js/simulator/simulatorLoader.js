(function() {
    function createFiles(files) {

        function createFile(lines) {
            return {
                getData: function(callback) {
                    var data = lines.join('\n');
                    callback && callback(data);
                    return data;
                }
            };
        }

        var _list    = [];
        var _files   = {};
        var _content = [];

        for (var i = 0; i < files.length; i++) {
            var file  = files[i];
            _list.push(i);
            _files[file.name] = i;
            _content[i]       = file.content;
        }

        return {
            _list:  _list,
            _files: _files,
            exists: function(path, filename) {
                var files = this._files;
                if (filename in files) {
                    return files[filename];
                }
                var f = path + filename;
                if (f in files) {
                    return files[f];
                }
                return false;
            },
            getFile: function(index) {
                return createFile(_content[index]);
            }
        };
    }

    var simulator;
    var vm;
    var compiler;
    var outputTitle    = null;
    var outputCommands = null;
    var compilerData   = null;

    var compileAndRun = function(title, src) {
            var files = createFiles(
                    [
                        {
                            name:    'main.whl',
                            content: src.split("\n")
                        },
                        {
                            name:    'lib/standard.whl',
                            content: wheel.simulator.includes.standard
                        },
                        {
                            name:    'lib/screen.whl',
                            content: wheel.simulator.includes.screen
                        },
                        {
                            name:    'lib/math.whl',
                            content: wheel.simulator.includes.math
                        },
                        {
                            name:    'lib/light.whl',
                            content: wheel.simulator.includes.light
                        },
                        {
                            name:    'lib/buttons.whl',
                            content: wheel.simulator.includes.buttons
                        },
                        {
                            name:    'lib/sound.whl',
                            content: wheel.simulator.includes.sound
                        }
                    ]
                );

            compiler = new wheel.compiler.Compiler({});
            vm       = new wheel.vm.VM({});

            var preProcessor = new wheel.compiler.preprocessor.PreProcessor({files: files});

            preProcessor.process(
                'main.whl',
                function(includes) {
                    try {
                        outputTitle    = title;
                        outputCommands = compiler.compile(includes);
                        compilerData   = compiler.getCompilerData();
                        simulator.getDisplay().drawLoaded(title);
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
        };

    var setRunProgramTitle = function(title) {
            document.querySelector('#runProgram').value = title;
        };

    var getOutputCommands = function() {
            function leadingChar(s, c, length) {
                s += '';
                while (s.length < length) {
                    s = c + s;
                }
                return s;
            }

            var items  = outputCommands.outputCommands().split('\r');
            var lines  = outputCommands.getLines();
            var result = [];

            var i = 0;
            while (i < items.length) {
                var line = items[i++];
                if (line === '#COMMANDS') {
                    var offset = 0;
                    var number = 0;
                    while (i + 1 < items.length) {
                        var ret = ((items[i] === '4') && (items[i + 1] === '1') && (items[i + 2] === '3'));

                        line = leadingChar(items[i++] || '', '0', 2) + ' ';
                        for (var j = 0; j < 4; j++) {
                            line += leadingChar(items[i++] || '', ' ', 3) + ' ';
                        }
                        result.push(line + '    |    ' + lines[offset++]);

                        if (ret) {
                            result.push('----------------------+---------------------------------------------');
                        }
                    }
                }
            }
            return result;
        };

    var run = function() {
            if (!outputCommands || !compilerData || !vm) {
                return;
            }

            if (vm.getRunning()) {
                stop();
            }
            setRunProgramTitle('Stop');

            simulator.getDisplay().clearScreen();
            simulator.getDisplay().reset();

            vm.run(
                outputCommands,
                compilerData.getStringList(),
                compilerData.getGlobalConstants(),
                compilerData.getGlobalOffset(),
                function() {
                    setRunProgramTitle('Run');
                }
            );
        };

    var stop = function() {
            if (!outputCommands || !compilerData || !vm) {
                return;
            }

            setRunProgramTitle('Run');

            vm.stop();
            simulator.getLight().off();
            simulator.getDisplay().drawLoaded(outputTitle);
        };

    var compile = function() {
            var source = document.querySelector('#source').value;
            compileAndRun(false, source);
            document.querySelector('#runProgram').className = 'button';
            var element = document.querySelector('.editor pre');
            element.innerHTML = getOutputCommands().join('\n');
            window._wheel.updateElement(element);
        };

    function loadPre() {
        var aList = document.querySelectorAll('h5 a');
        for (var i = 0; i < aList.length; i++) {
            (function(a) {
                a.addEventListener(
                    'mousedown',
                    function() {
                        var programId  = a.getAttribute('data-program');
                        var wheelDemos = window.wheelDemos;
                        if (programId in wheelDemos) {
                            var title         = a.getAttribute('data-title') || '?';
                            var activeProgram = document.querySelector('.active-program');
                            activeProgram && (activeProgram.innerHTML = 'Program: <span>' + title + '</span>');
                            document.querySelector('#runProgram').className = 'button';
                            compileAndRun(title, wheelDemos[programId]);
                        }
                    }
                );
            })(aList[i]);
        }
    }

    function initButtons() {
        var buttons = [
                {
                    element: document.getElementById('sourceButton'),
                    target:  document.querySelector('.editor textarea')
                },
                {
                    element: document.getElementById('vmCodeButton'),
                    target:  document.querySelector('.editor pre')
                }
            ];
        var activeButton = 0;
        var onClick      = function(index) {
                activeButton = index;
                buttons.forEach(function(button, index) {
                    button.element.className    = (index === activeButton) ? 'active' : '';
                    button.target.style.display = (index === activeButton) ? 'block' : 'none';
                });
            };

        buttons.forEach(function(button, index) {
            button.element && button.element.addEventListener(
                'click',
                function() {
                    onClick(index);
                }
            );
        });
    }

    function start() {
         initButtons();
        loadPre();

        var runButton = document.querySelector('#runProgram');
        runButton && runButton.addEventListener('click', run);

        var compileButton = document.querySelector('.compile');
        compileButton && compileButton.addEventListener('click', compile);

        simulator = new wheel.simulator.Simulator({
            parentNode: document.querySelector('.ev3-background'),
            onStop:     stop
        });
    }

    window.addEventListener(
        'DOMContentLoaded',
        function() {
            start();
        }
    )
})();
