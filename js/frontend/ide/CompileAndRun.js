/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                        = require('../lib/dispatcher').dispatcher;
const DOMUtils                          = require('../lib/dom').DOMUtils;
const Compiler                          = require('../compiler/Compiler').Compiler;
const PreProcessor                      = require('../compiler/preprocessor/PreProcessor').PreProcessor;
const VM                                = require('../vm/VM').VM;
const FileSystem                        = require('../vm/modules/local/FileSystem'                            ).FileSystem;
const LocalStandardModule               = require('../vm/modules/local/StandardModule'                        ).StandardModule;
const LocalScreenModule                 = require('../vm/modules/local/ScreenModule'                          ).ScreenModule;
const LocalMotorModule                  = require('../vm/modules/local/MotorModule'                           ).MotorModule;
const LocalSensorModule                 = require('../vm/modules/local/SensorModule'                          ).SensorModule;
const LocalMathModule                   = require('../vm/modules/local/MathModule'                            ).MathModule;
const LocalLightModule                  = require('../vm/modules/local/LightModule'                           ).LightModule;
const LocalButtonModule                 = require('../vm/modules/local/ButtonModule'                          ).ButtonModule;
const LocalSoundModule                  = require('../vm/modules/local/SoundModule'                           ).SoundModule;
const LocalFileModule                   = require('../vm/modules/local/FileModule'                            ).FileModule;
const LocalSystemModule                 = require('../vm/modules/local/SystemModule'                          ).SystemModule;
const LocalStringModule                 = require('../vm/modules/local/StringModule'                          ).StringModule;
const LocalBitModule                    = require('../vm/modules/local/BitModule'                             ).BitModule;
const LocalPspModule                    = require('../vm/modules/local/PspModule'                             ).PspModule;
const LocalMultiplexerModule            = require('../vm/modules/local/MultiplexerModule'                     ).MultiplexerModule;
const LocalDeviceModule                 = require('../vm/modules/local/DeviceModule'                          ).DeviceModule;
const LocalPoweredUpModule              = require('../vm/modules/local/PoweredUpModule'                       ).PoweredUpModule;
const LocalComponentFormModule          = require('../vm/modules/local/components/ComponentFormModule'        ).ComponentFormModule;
const LocalComponentButtonModule        = require('../vm/modules/local/components/ComponentButtonModule'      ).ComponentButtonModule;
const LocalComponentSelectButtonModule  = require('../vm/modules/local/components/ComponentSelectButtonModule').ComponentSelectButtonModule;
const LocalComponentLabelModule         = require('../vm/modules/local/components/ComponentLabelModule'       ).ComponentLabelModule;
const LocalComponentCheckboxModule      = require('../vm/modules/local/components/ComponentCheckboxModule'    ).ComponentCheckboxModule;
const LocalComponentTextInputModule     = require('../vm/modules/local/components/ComponentTextInputModule'   ).ComponentTextInputModule;
const LocalComponentSliderModule        = require('../vm/modules/local/components/ComponentSliderModule'      ).ComponentSliderModule;
const LocalComponentStatusLightModule   = require('../vm/modules/local/components/ComponentStatusLightModule' ).ComponentStatusLightModule;
const LocalComponentPanelModule         = require('../vm/modules/local/components/ComponentPanelModule'       ).ComponentPanelModule;
const LocalComponentTabsModule          = require('../vm/modules/local/components/ComponentTabsModule'        ).ComponentTabsModule;
const LocalComponentRectangleModule     = require('../vm/modules/local/components/ComponentRectangleModule'   ).ComponentRectangleModule;
const LocalComponentCircleModule        = require('../vm/modules/local/components/ComponentCircleModule'      ).ComponentCircleModule;
const LocalComponentImageModule         = require('../vm/modules/local/components/ComponentImageModule'       ).ComponentImageModule;
const LocalComponentPUDeviceModule      = require('../vm/modules/local/components/ComponentPUDeviceModule'    ).ComponentPUDeviceModule;
const LocalComponentEV3MotorModule      = require('../vm/modules/local/components/ComponentEV3MotorModule'    ).ComponentEV3MotorModule;
const LocalComponentEV3SensorModule     = require('../vm/modules/local/components/ComponentEV3SensorModule'   ).ComponentEV3SensorModule;
const RemoteStandardModule              = require('../vm/modules/remote/StandardModule'                       ).StandardModule;
const RemoteScreenModule                = require('../vm/modules/remote/ScreenModule'                         ).ScreenModule;
const RemoteMotorModule                 = require('../vm/modules/remote/MotorModule'                          ).MotorModule;
const RemoteSensorModule                = require('../vm/modules/remote/SensorModule'                         ).SensorModule;
const RemoteMathModule                  = require('../vm/modules/remote/MathModule'                           ).MathModule;
const RemoteLightModule                 = require('../vm/modules/remote/LightModule'                          ).LightModule;
const RemoteButtonModule                = require('../vm/modules/remote/ButtonModule'                         ).ButtonModule;
const RemoteSoundModule                 = require('../vm/modules/remote/SoundModule'                          ).SoundModule;
const RemoteFileModule                  = require('../vm/modules/remote/FileModule'                           ).FileModule;
const RemoteSystemModule                = require('../vm/modules/remote/SystemModule'                         ).SystemModule;
const RemoteStringModule                = require('../vm/modules/remote/StringModule'                         ).StringModule;
const RemoteBitModule                   = require('../vm/modules/remote/BitModule'                            ).BitModule;
const RemotePspModule                   = require('../vm/modules/remote/PspModule'                            ).PspModule;
const RemoteMultiplexerModule           = require('../vm/modules/remote/MultiplexerModule'                    ).MultiplexerModule;
const RemoteDeviceModule                = require('../vm/modules/remote/DeviceModule'                         ).DeviceModule;
const RemotePoweredUpModule             = require('../vm/modules/remote/PoweredUpModule'                      ).PoweredUpModule;
const RemoteComponentFormModule         = LocalComponentFormModule;
const RemoteComponentButtonModule       = LocalComponentButtonModule;
const RemoteComponentSelectButtonModule = LocalComponentSelectButtonModule;
const RemoteComponentLabelModule        = LocalComponentLabelModule;
const RemoteComponentCheckboxModule     = LocalComponentCheckboxModule;
const RemoteComponentTextInputModule    = LocalComponentTextInputModule;
const RemoteComponentSliderModule       = LocalComponentSliderModule;
const RemoteComponentStatusLightModule  = LocalComponentStatusLightModule;
const RemoteComponentPanelModule        = LocalComponentPanelModule;
const RemoteComponentTabsModule         = LocalComponentTabsModule;
const RemoteComponentRectangleModule    = LocalComponentRectangleModule;
const RemoteComponentCircleModule       = LocalComponentCircleModule;
const RemoteComponentImageModule        = LocalComponentImageModule;
const RemoteComponentPUDeviceModule     = LocalComponentPUDeviceModule;
const RemoteComponentEV3MotorModule     = LocalComponentEV3MotorModule;
const RemoteComponentEV3SensorModule    = LocalComponentEV3SensorModule;
const Simulator                         = require('./simulator/Simulator').Simulator;
const SimulatorModules                  = require('./simulator/SimulatorModules').SimulatorModules;
const pluginUuid                        = require('./plugins/pluginUuid');

exports.CompileAndRun = class extends DOMUtils {
    constructor(opts) {
        super();
        let settings  = opts.settings;
        let ev3       = opts.ev3;
        let poweredUp = opts.poweredUp;
        this._ev3                 = ev3;
        this._poweredUp           = poweredUp;
        this._settings            = opts.settings;
        this._outputPath          = '';
        this._projectFilename     = '';
        this._source              = '';
        this._sortedFiles         = null;
        this._tokens              = null;
        this._preProcessor        = null;
        this._program             = null;
        this._vm                  = null;
        this._changedWhileRunning = false;
        this._localModules        = true;
        this._compileSilent       = false;
        this._compiling           = false;
        this._simulatorModules    = new SimulatorModules({settings: this._settings, ide: this});
        this._simulator           = new Simulator({
            ui:        opts.ui,
            ev3:       ev3,
            poweredUp: poweredUp,
            settings:  settings,
            onStop:    this.stop.bind(this)
        });
        // EV3 events...
        ev3
            .addEventListener('EV3.Connected',    this, this.onDeviceConnected)
            .addEventListener('EV3.Disconnected', this, this.onDeviceDisconnected);
        // EV3 events...
        poweredUp
            .addEventListener('PoweredUp.Connected',    this, this.onDeviceConnected)
            .addEventListener('PoweredUp.Disconnected', this, this.onDeviceDisconnected);
        dispatcher
            .on('VM.Breakpoint',           this, this.onBreakpoint)
            .on('VM.Error.Range',          this, this.onRangeCheckError)
            .on('VM.Error.DivisionByZero', this, this.onDivisionByZero)
            .on('VM.Error.HeapOverflow',   this, this.onHeapOverflow)
            .on('Button.Device.EV3',       this, this.onSelectDeviceEV3)
            .on('Button.Device.PoweredUp', this, this.onSelectDevicePoweredUp);
    }

    onDeviceConnected() {
        if (this._localModules && this._vm) {
            let modules = this.getModules(this._vm);
            this._vm.setModules(modules);
            this._simulatorModules.setupModules({
                vm:        this._vm,
                simulator: this._simulator,
                modules:   modules
            });
        }
    }

    onDeviceDisconnected() {
        if (!this._localModules && this._vm) {
            let modules = this.getModules(this._vm);
            this._vm.setModules(modules);
            this._simulatorModules.setupModules({
                vm:        this._vm,
                simulator: this._simulator,
                modules:   modules
            });
        }
    }

    // To be implemented in subclass...
    onCreatedPreProcessor(preprocessor) {}
    onBreakpoint(vm, breakpoint) {}
    onCompilerError(opts) {}
    onBeforeCompile() {}
    onBeforeRun(program) {}
    onStop() {}
    onCompileSuccess(program, lineCount) {}
    onGetSource(callback) {}

    onRangeCheckError(lastCommand, range0, range1) {
        this.showError(lastCommand, '#1 Range check error: ' + range1 + ' ≠ [0..' + range0 + ']');
    }

    onDivisionByZero(lastCommand) {
        this.showError(lastCommand, '#2 Division by zero.');
    }

    onHeapOverflow(lastCommand) {
        this.showError(lastCommand, '#3 Heap overflow.');
    }

    onSetImage(image) {
        this._simulatorModules.setImage(image);
    }

    onSelectDeviceEV3() {
        dispatcher.dispatch('Settings.Set.ActiveDevice',      0);
        dispatcher.dispatch('Button.Device.EV3.Change',       {className: 'green active'});
        dispatcher.dispatch('Button.Device.PoweredUp.Change', {className: 'green in-active'});
    }

    onSelectDevicePoweredUp() {
        dispatcher.dispatch('Settings.Set.ActiveDevice',      1);
        dispatcher.dispatch('Button.Device.EV3.Change',       {className: 'green in-active'});
        dispatcher.dispatch('Button.Device.PoweredUp.Change', {className: 'green active'});
    }

    getVM() {
        return this._vm;
    }

    getLinter() {
        return null;
    }

    getFileData(filename, token, callback) {
        callback('');
    }

    getEditorFileData(filename, callback) {
        callback(null);
    }

    setSource(source) {
        this._source = source;
    }

    getProjectFilename() {
        return this._projectFilename;
    }

    getProgram() {
        return this._program;
    }

    getModules(vm) {
        let modules    = [];
        let fileSystem = new FileSystem({vm: vm});
        let device     = () => {
                return (this._settings.getActiveDevice() === 0) ? this._ev3 : this._poweredUp;
            };
        this._localModules = !device().getConnected();
        if (this._localModules) {
            modules[  0] = new LocalStandardModule              ({vm: vm, device: device});
            modules[  1] = new LocalMathModule                  ({vm: vm, device: device});
            modules[  2] = new LocalScreenModule                ({vm: vm, device: device});
            modules[  3] = new LocalLightModule                 ({vm: vm, device: device});
            modules[  4] = new LocalButtonModule                ({vm: vm, device: device});
            modules[  5] = new LocalSoundModule                 ({vm: vm, device: device});
            modules[  6] = new LocalMotorModule                 ({vm: vm, device: device});
            modules[  7] = new LocalSensorModule                ({vm: vm, device: device});
            modules[  8] = new LocalFileModule                  ({vm: vm, device: device, fileSystem: fileSystem});
            modules[  9] = new LocalSystemModule                ({vm: vm, device: device});
            modules[ 10] = new LocalStringModule                ({vm: vm, device: device});
            modules[ 11] = new LocalBitModule                   ({vm: vm, device: device});
            modules[ 12] = new LocalDeviceModule                ({vm: vm, device: device});
            modules[ 13] = new LocalPoweredUpModule             ({vm: vm, device: device});
            // Mindsensors...
            modules[ 32] = new LocalPspModule                   ({vm: vm, device: device});
            modules[ 33] = new LocalMultiplexerModule           ({vm: vm, device: device});
            // Components....
            modules[ 64] = new LocalComponentFormModule         ({vm: vm, device: device});
            modules[ 65] = new LocalComponentButtonModule       ({vm: vm, device: device});
            modules[ 66] = new LocalComponentSelectButtonModule ({vm: vm, device: device});
            modules[ 67] = new LocalComponentLabelModule        ({vm: vm, device: device});
            modules[ 68] = new LocalComponentCheckboxModule     ({vm: vm, device: device});
            modules[ 69] = new LocalComponentTextInputModule    ({vm: vm, device: device});
            modules[ 70] = new LocalComponentSliderModule       ({vm: vm, device: device});
            modules[ 71] = new LocalComponentStatusLightModule  ({vm: vm, device: device});
            modules[ 72] = new LocalComponentPanelModule        ({vm: vm, device: device});
            modules[ 73] = new LocalComponentTabsModule         ({vm: vm, device: device});
            modules[ 74] = new LocalComponentRectangleModule    ({vm: vm, device: device});
            modules[ 75] = new LocalComponentCircleModule       ({vm: vm, device: device});
            modules[ 76] = new LocalComponentImageModule        ({vm: vm, device: device});
            // Simulator components...
            modules[128] = new LocalComponentPUDeviceModule     ({vm: vm, device: device});
            modules[129] = new LocalComponentEV3MotorModule     ({vm: vm, device: device});
            modules[130] = new LocalComponentEV3SensorModule    ({vm: vm, device: device});
        } else {
            modules[  0] = new RemoteStandardModule             ({vm: vm, device: device});
            modules[  1] = new RemoteMathModule                 ({vm: vm, device: device});
            modules[  2] = new RemoteScreenModule               ({vm: vm, device: device});
            modules[  3] = new RemoteLightModule                ({vm: vm, device: device});
            modules[  4] = new RemoteButtonModule               ({vm: vm, device: device});
            modules[  5] = new RemoteSoundModule                ({vm: vm, device: device});
            modules[  6] = new RemoteMotorModule                ({vm: vm, device: device});
            modules[  7] = new RemoteSensorModule               ({vm: vm, device: device});
            modules[  8] = new RemoteFileModule                 ({vm: vm, device: device, fileSystem: fileSystem});
            modules[  9] = new RemoteSystemModule               ({vm: vm, device: device});
            modules[ 10] = new RemoteStringModule               ({vm: vm, device: device});
            modules[ 11] = new RemoteBitModule                  ({vm: vm, device: device});
            modules[ 12] = new RemoteDeviceModule               ({vm: vm, device: device});
            modules[ 13] = new RemotePoweredUpModule            ({vm: vm, device: device});
            // Mindsensors...
            modules[ 32] = new RemotePspModule                  ({vm: vm, device: device});
            modules[ 33] = new RemoteMultiplexerModule          ({vm: vm, device: device});
            // Components....
            modules[ 64] = new RemoteComponentFormModule        ({vm: vm, device: device});
            modules[ 65] = new RemoteComponentButtonModule      ({vm: vm, device: device});
            modules[ 66] = new RemoteComponentSelectButtonModule({vm: vm, device: device});
            modules[ 67] = new RemoteComponentLabelModule       ({vm: vm, device: device});
            modules[ 68] = new RemoteComponentCheckboxModule    ({vm: vm, device: device});
            modules[ 69] = new RemoteComponentTextInputModule   ({vm: vm, device: device});
            modules[ 70] = new RemoteComponentSliderModule      ({vm: vm, device: device});
            modules[ 71] = new RemoteComponentStatusLightModule ({vm: vm, device: device});
            modules[ 72] = new RemoteComponentPanelModule       ({vm: vm, device: device});
            modules[ 73] = new RemoteComponentTabsModule        ({vm: vm, device: device});
            modules[ 74] = new RemoteComponentRectangleModule   ({vm: vm, device: device});
            modules[ 75] = new RemoteComponentCircleModule      ({vm: vm, device: device});
            modules[ 76] = new RemoteComponentImageModule       ({vm: vm, device: device});
            // Simulator components...
            modules[128] = new RemoteComponentPUDeviceModule    ({vm: vm, device: device});
            modules[129] = new RemoteComponentEV3MotorModule    ({vm: vm, device: device});
            modules[130] = new RemoteComponentEV3SensorModule   ({vm: vm, device: device});
        }
        return modules;
    }

    createVM() {
        let program = this._program;
        let vm      = new VM({
                entryPoint:  program.getEntryPoint(),
                globalSize:  program.getGlobalSize(),
                constants:   program.getConstants(),
                stringList:  program.getStringList(),
                sortedFiles: this._sortedFiles
            });
        let modules = this.getModules(vm);
        vm
            .setModules(modules)
            .setCommands(program.getCommands())
            .setOutputPath(this._outputPath)
            .getVMData().setHeap(program.getHeap());
        this._simulatorModules.setupModules({
            vm:        vm,
            simulator: this._simulator,
            modules:   modules
        });
        this._simulator.setVM(vm);
        if (!this._compileSilent) {
            dispatcher.dispatch('VM', vm);
        }
        return vm;
    }

    simulatorLoaded() {
        this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_EV3_UUID).getDisplay().drawLoaded(this._title);
    }

    filesProcessed(title) {
        let compiler = new Compiler({linter: this.getLinter()});
        let tokens   = this._preProcessor.getDefinedConcatTokens();
        this._tokens      = tokens;
        this._sortedFiles = this._preProcessor.getSortedFiles();
        try {
            compiler
                .setFormResources(this._preProcessor.getFormResources())
                .buildTokens(tokens);
            this._program = compiler.getProgram();
            this._program.setLayerCount(this._settings.getDaisyChainMode());
            this.onCompileSuccess(this._program, this._preProcessor.getLineCount());
            this._vm = this.createVM();
            if ((title === 'Simulator') && (this._program.getTitle() !== '')) {
                title = this._program.getTitle();
            }
            this._title     = title;
            this._compiling = false;
            this.simulatorLoaded();
            if (!this._compileSilent) {
                dispatcher.dispatch('Compile.Compiled', this._vm);
            }
        } catch (error) {
            this._compiling = false;
            if (this._compileSilent) {
                // Compile failed but try to use what we've got for the code completion...
                dispatcher.dispatch('Compiler.Database', compiler.getScope());
            } else {
                error.tokens = this._tokens;
                this.onCompilerError(error);
            }
        }
        this._compileSilent = false;
    }

    compile(documentPath, title) {
        if (this._compiling) {
            return;
        }
        this._compiling = true;
        if (documentPath === undefined) {
            documentPath = '';
        }
        this._changedWhileRunning = false;
        title || (title = 'Simulator');
        this.stop();
        this.onGetSource(() => {
            this.onBeforeCompile();
            this._simulatorModules.reset();
            try {
                let linter = this.getLinter();
                if (linter) {
                    linter.reset();
                }
                this._preProcessor = new PreProcessor({
                    documentPath:      documentPath,
                    projectFilename:   this._projectFilename,
                    linter:            linter,
                    getFileData:       this.getFileData.bind(this),
                    getEditorFileData: this.getEditorFileData.bind(this),
                    setImage:          this.onSetImage.bind(this)
                });
                this.onCreatedPreProcessor(this._preProcessor);
                this._preProcessor.processFile({filename: this._projectFilename, token: null}, 0, 0, this.filesProcessed.bind(this, title));
            } catch (error) {
                this._compiling = false;
                if (!this._compileSilent) {
                    error.tokens = this._tokens;
                    this.onCompilerError(error);
                }
            }
        });
    }

    run() {
        if (this._vm && this._vm.running()) {
            this.stop();
        } else {
            this._vm = this.createVM(this._program);
            this.onBeforeRun(this._program);
            this.setRunProgramTitle('Stop');
            this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_EV3_UUID).getDisplay()
                .clearScreen()
                .reset();
            this._vm.startRunInterval(this.stop.bind(this));
        }
    }

    stop() {
        dispatcher
            .dispatch('Button.Continue.Change', {disabled: true, hidden: true})
            .dispatch('Button.Run.Change',      {value: 'Run'});
        if (!this._vm || !this._vm.running()) {
            return;
        }
        this.setRunProgramTitle('Run');
        this._vm.stop();
        this._motors && this._motors.reset();
        let ev3Plugin = this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_EV3_UUID);
        ev3Plugin.getLight().off();
        ev3Plugin.getDisplay().drawLoaded(this._title);
        this.onStop();
    }

    showError(lastCommand, message) {
        let sortedFiles = this._vm.getSortedFiles();
        let info        = lastCommand ? lastCommand.info : null;
        if (info && info.token && sortedFiles[info.token.fileIndex]) {
            dispatcher.dispatch(
                'Console.Error',
                {
                    type:    'Runtime error',
                    message: message,
                    token:   info.token,
                    tokens:  sortedFiles[info.token.fileIndex].tokens
                }
            );
            dispatcher.dispatch(
                'Console.RuntimeError',
                info
            );
        } else {
            dispatcher.dispatch(
                'Console.Error',
                {
                    type:    'Runtime error',
                    message: message
                }
            );
        }
    }
};
