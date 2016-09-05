(function() {
    var wheel = require('../../utils/base.js');

    function init() {
        var compiler    = new wheel.compiler.Compiler({});
        var motors      = new wheel.vm.Motors({});
        var sensors     = new wheel.vm.Sensors({});
        var vm          = new wheel.vm.VM({motors: motors, sensors: sensors});
        var files       = new wheel.Files({});

        ReactDOM.render(
            utilsReact.fromJSON({
                props: {
                    className: 'container-events'
                },
                children: [
                    {
                        type: wheel.components.editor.EditorComponent,
                        props: {
                            compiler: compiler,
                            vm:       vm,
                            files:    files,
                            motors:   motors,
                            sensors:  sensors
                        }
                    }
                ]
            }),
            document.getElementById('container')
        );
    }

    window.addEventListener(
        'load',
        function() {
            init();
        }
    );
})();