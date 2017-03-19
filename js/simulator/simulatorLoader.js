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
                            content: wheel.simulator.includes.buttons
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

            var preProcessor = new wheel.compiler.PreProcessor({files: files});

            preProcessor.process(
                '',
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

    var run = function() {
            if (!outputCommands || !compilerData || !vm) {
                return;
            }

            if (vm.getRunning()) {
                stop();
            } else {
                document.querySelector('#runProgram').value = 'Stop';

                simulator.getDisplay().clearScreen();
                vm.run(
                    outputCommands,
                    compilerData.getStringList(),
                    compilerData.getGlobalConstants(),
                    compilerData.getGlobalOffset(),
                    function() {
                        document.querySelector('#runProgram').value = 'Run';
                    }
                );
            }
        };

    var stop = function() {
            if (!outputCommands || !compilerData || !vm) {
                return;
            }

            document.querySelector('#runProgram').value = 'Run';

            vm.stop();
            simulator.getLight().off();
            simulator.getDisplay().drawLoaded(outputTitle);
        };

    function loadPre() {
        var aList = document.querySelectorAll('h4 a');
        for (var i = 0; i < aList.length; i++) {
            (function(a) {
                a.addEventListener(
                    'mousedown',
                    function() {
                        var programId  = a.getAttribute('data-program');
                        var wheelDemos = window.wheelDemos;
                        if (programId in wheelDemos) {
                            var title = a.getAttribute('data-title') || '?';
                            document.querySelector('.active-program').innerHTML = 'Program: <span>' + title + '</span>';
                            document.querySelector('#runProgram').className = 'button';
                            compileAndRun(title, wheelDemos[programId]);
                        }
                    }
                );
            })(aList[i]);
        }
    }

    function start() {
        loadPre();

        document.querySelector('#runProgram').addEventListener('click', run);

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
