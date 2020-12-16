/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../lib/dispatcher').dispatcher;
const DOMUtils         = require('../lib/dom').DOMUtils;
const Compiler         = require('../compiler/Compiler').Compiler;
const PreProcessor     = require('../compiler/preprocessor/PreProcessor').PreProcessor;
const VM               = require('../vm/VM').VM;
const vmModuleLoader   = require('../vm/vmModuleLoader');
const Json             = require('../program/output/Json').Json;
const SimulatorModules = require('./simulator/SimulatorModules').SimulatorModules;
const pluginUuid       = require('./plugins/pluginUuid');

exports.CompileAndRun = class extends DOMUtils {
    constructor(opts) {
        super();
        let settings  = opts.settings;
        let ev3       = opts.ev3;
        let poweredUp = opts.poweredUp;
        let spike     = opts.spike;
        this._ev3                     = ev3;
        this._poweredUp               = poweredUp;
        this._spike                   = spike;
        this._settings                = opts.settings;
        this._outputPath              = '';
        this._projectFilename         = '';
        this._source                  = '';
        this._simulator               = null;
        this._sortedFiles             = null;
        this._tokens                  = null;
        this._preProcessor            = null;
        this._program                 = null;
        this._vm                      = null;
        this._changedWhileRunning     = false;
        this._localModules            = true;
        this._compileAndRun           = false;
        this._compileSilent           = false;
        this._compiling               = false;
        this._compileFinishedCallback = false;
        this._simulatorModules        = new SimulatorModules({settings: this._settings, ide: this});
        // EV3 events...
        ev3
            .addEventListener('EV3.Connected',    this, this.onDeviceConnected)
            .addEventListener('EV3.Disconnected', this, this.onDeviceDisconnected);
        // EV3 events...
        poweredUp
            .addEventListener('PoweredUp.Connected',    this, this.onDeviceConnected)
            .addEventListener('PoweredUp.Disconnected', this, this.onDeviceDisconnected);
        // Spike events...
        spike
            .addEventListener('Spike.Connected',    this, this.onDeviceConnected)
            .addEventListener('Spike.Disconnected', this, this.onDeviceDisconnected);
        dispatcher
            .on('VM.Breakpoint',           this, this.onBreakpoint)
            .on('VM.Error.Range',          this, this.onRangeCheckError)
            .on('VM.Error.DivisionByZero', this, this.onDivisionByZero)
            .on('VM.Error.HeapOverflow',   this, this.onHeapOverflow)
            .on('Button.Device.EV3',       this, this.onSelectDeviceEV3)
            .on('Button.Device.PoweredUp', this, this.onSelectDevicePoweredUp)
            .on('Button.Device.Spike',     this, this.onSelectDeviceSpike);
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
        dispatcher.dispatch('Device.Connected');
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
        dispatcher.dispatch('Button.Device.Spike.Change',     {className: 'green in-active'});
    }

    onSelectDevicePoweredUp() {
        dispatcher.dispatch('Settings.Set.ActiveDevice',      1);
        dispatcher.dispatch('Button.Device.EV3.Change',       {className: 'green in-active'});
        dispatcher.dispatch('Button.Device.PoweredUp.Change', {className: 'green active'});
        dispatcher.dispatch('Button.Device.Spike.Change',     {className: 'green in-active'});
    }

    onSelectDeviceSpike() {
        dispatcher.dispatch('Settings.Set.ActiveDevice',      2);
        dispatcher.dispatch('Button.Device.EV3.Change',       {className: 'green in-active'});
        dispatcher.dispatch('Button.Device.PoweredUp.Change', {className: 'green in-active'});
        dispatcher.dispatch('Button.Device.Spike.Change',     {className: 'green active'});
    }

    getVM() {
        return this._vm;
    }

    getLinter() {
        return null;
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
        let device = () => {
                switch (this._settings.getActiveDevice()) {
                    case 0: return this._ev3;
                    case 1: return this._poweredUp;
                    case 2: return this._spike;
                }
                return this._ev3;
            };
        this._localModules = !device().getConnected();
        return vmModuleLoader.load(vm, this._localModules, device, this);
    }

    createVM() {
        let program = this._program;
        let vm      = new VM({
                entryPoint:  program.getEntryPoint(),
                globalSize:  program.getGlobalSize(),
                constants:   program.getConstants(),
                stringList:  program.getStringList(),
                sortedFiles: this._sortedFiles,
                heap:        program.getHeap(),
                dataType:    program.getDataType()
            });
        let modules = this.getModules(vm);
        vm
            .setModules(modules)
            .setCommands(program.getCommands())
            .setOutputPath(this._outputPath);
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

    finishCompiling(success) {
        this._compiling     = false;
        this._compileSilent = false;
        if (typeof this._compileFinishedCallback === 'function') {
            this._compileFinishedCallback(success);
            this._compileFinishedCallback = false;
        }
    }

    onGetFileData(filename, token, callback) {
        callback('');
    }

    onGetFileDataError() {
        this.finishCompiling(false);
    }

    onGetEditorFileData(filename, callback) {
        callback(null);
    }

    onFilesProcessed(title, filesDone, preProcessorError) {
        if (preProcessorError) {
            this.finishCompiling(false);
            return;
        }
        let compiler = new Compiler({linter: this.getLinter()});
        let tokens   = this._preProcessor.getDefinedConcatTokens();
        let success  = false;
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
            this._title = title;
            if (!this._compileSilent) {
                this.simulatorLoaded();
                dispatcher.dispatch('Compile.Compiled', this._vm);
            }
            success = true;
        } catch (error) {
            if (this._compileSilent) {
                // Compile failed but try to use what we've got for the code completion...
                dispatcher.dispatch('Compiler.Database', compiler.getScope());
            } else {
                error.tokens = this._tokens;
                this.onCompilerError(error);
            }
        }
        this.finishCompiling(success);
    }

    compile(opts) {
        if (this._compiling) {
            return;
        }
        this._compileAndRun           = !!opts.compileAndRun;
        this._compileSilent           = !!opts.compileSilent;
        this._compileFinishedCallback = (typeof opts.finishedCallback === 'function') ? opts.finishedCallback : false;
        this._compiling               = true;
        this._changedWhileRunning     = false;
        this.stop();
        this.onGetSource((success) => {
            if (!success) {
                this.finishCompiling(false);
                return;
            }
            this.onBeforeCompile();
            this._simulatorModules.reset();
            try {
                let linter = this.getLinter();
                if (linter) {
                    linter.reset();
                }
                this._preProcessor = new PreProcessor({
                    linter:              linter,
                    documentPath:        this._settings.getDocumentPath() || '',
                    projectFilename:     this._projectFilename,
                    onGetFileData:       this.onGetFileData.bind(this),
                    onGetFileDataError:  this.onGetFileDataError.bind(this),
                    onGetEditorFileData: this.onGetEditorFileData.bind(this),
                    onError:             this.onCompilerError.bind(this),
                    onFinished:          this.onFilesProcessed.bind(this, opts.title || 'Simulator'),
                    setImage:            this.onSetImage.bind(this)
                });
                this.onCreatedPreProcessor(this._preProcessor);
                this._preProcessor.processFile({filename: this._projectFilename, token: null});
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
            dispatcher.dispatch('VM.Run', this._vm);
            this.onBeforeRun(this._program);
            this.setRunProgramTitle('Stop');
            this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_EV3_UUID).getDisplay()
                .clearScreen()
                .reset();
            this._vm.startRunInterval(this.stop.bind(this));
        }
    }

    runVM() {
        this._poweredUp.disconnect();
        this.stop();
        let ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send(
            'postMessage',
            {
                command:         'vm',
                settings:        this._settings.getSettings(),
                projectFilename: this._projectFilename,
                program:         new Json(this._program).getOutput()
            }
        );
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
        this._ev3.stopAllMotors(this._settings.getDaisyChainMode());
        this._poweredUp.stopAllMotors(this._settings.getPoweredUpDeviceCount());
        this._spike.stopAllMotors(this._settings.getSpikeDeviceCount());
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
