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
    var outputCommands = null;
    var compilerData   = null;

    var compileAndRun = function(src) {
            var files = createFiles(
                    [
                        {
                            name:    'main.whl',
                            content: src.split("\n")
                        },
                        {
                            name:    'lib/screen.whl',
                            content: wheel.simulator.includes.screen
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
                    outputCommands = compiler.compile(includes);
                    compilerData   = compiler.getCompilerData();
                }
            );
        };

    var run = function() {
            if (!outputCommands || !compilerData) {
                return;
            }
            simulator.getDisplay().clearScreen();
            vm.runAll(
                outputCommands,
                compilerData.getStringList(),
                compilerData.getGlobalConstants(),
                compilerData.getGlobalOffset()
            );
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
                            document.querySelector('.active-program').innerHTML = 'Program: <span>' + a.getAttribute('data-title') + '</span>';
                            document.querySelector('#runProgram').className = 'button';
                            compileAndRun(wheelDemos[programId]);
                        }
                    }
                );
            })(aList[i]);
        }
    }

    function start() {
        loadPre();

        document.querySelector('#runProgram').addEventListener('click', run);

        simulator = new wheel.simulator.Simulator({parentNode: document.querySelector('.ev3-background')});
    }

    window.addEventListener(
        'DOMContentLoaded',
        function() {
            start();
        }
    )
})();
