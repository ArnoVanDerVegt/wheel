/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                            = require('../lib/dispatcher').dispatcher;
const DOMUtils                              = require('../lib/dom').DOMUtils;
const Compiler                              = require('../compiler/Compiler').Compiler;
const PreProcessor                          = require('../compiler/preprocessor/PreProcessor').PreProcessor;
const VM                                    = require('../vm/VM').VM;
// Modules...
const standardModuleConstants               = require('../../shared/vm/modules/standardModuleConstants');
const mathModuleConstants                   = require('../../shared/vm/modules/mathModuleConstants');
const screenModuleConstants                 = require('../../shared/vm/modules/screenModuleConstants');
const lightModuleConstants                  = require('../../shared/vm/modules/lightModuleConstants');
const buttonModuleConstants                 = require('../../shared/vm/modules/buttonModuleConstants');
const soundModuleConstants                  = require('../../shared/vm/modules/soundModuleConstants');
const motorModuleConstants                  = require('../../shared/vm/modules/motorModuleConstants');
const sensorModuleConstants                 = require('../../shared/vm/modules/sensorModuleConstants');
const fileModuleConstants                   = require('../../shared/vm/modules/fileModuleConstants');
const systemModuleConstants                 = require('../../shared/vm/modules/systemModuleConstants');
const stringModuleConstants                 = require('../../shared/vm/modules/stringModuleConstants');
const bitModuleConstants                    = require('../../shared/vm/modules/bitModuleConstants');
const deviceModuleConstants                 = require('../../shared/vm/modules/deviceModuleConstants');
const poweredUpModuleConstants              = require('../../shared/vm/modules/poweredUpModuleConstants');
// Mindsensors...
const pspModuleConstants                    = require('../../shared/vm/modules/pspModuleConstants');
const multiplexerModuleConstants            = require('../../shared/vm/modules/multiplexerModuleConstants');
// Form component...
const componentFormModuleConstants          = require('../../shared/vm/modules/components/componentFormModuleConstants');
// Input components...
const componentButtonModuleConstants        = require('../../shared/vm/modules/components/componentButtonModuleConstants');
const componentSelectButtonModuleConstants  = require('../../shared/vm/modules/components/componentSelectButtonModuleConstants');
const componentCheckboxModuleConstants      = require('../../shared/vm/modules/components/componentCheckboxModuleConstants');
const componentRadioModuleConstants         = require('../../shared/vm/modules/components/componentRadioModuleConstants');
const componentDropdownModuleConstants      = require('../../shared/vm/modules/components/componentDropdownModuleConstants');
const componentTextInputModuleConstants     = require('../../shared/vm/modules/components/componentTextInputModuleConstants');
const componentSliderModuleConstants        = require('../../shared/vm/modules/components/componentSliderModuleConstants');
// Text components...
const componentLabelModuleConstants         = require('../../shared/vm/modules/components/componentLabelModuleConstants');
const componentTitleModuleConstants         = require('../../shared/vm/modules/components/componentTitleModuleConstants');
const componentTextModuleConstants          = require('../../shared/vm/modules/components/componentTextModuleConstants');
const componentListItemsModuleConstants     = require('../../shared/vm/modules/components/componentListItemsModuleConstants');
// Panel components...
const componentPanelModuleConstants         = require('../../shared/vm/modules/components/componentPanelModuleConstants');
const componentTabsModuleConstants          = require('../../shared/vm/modules/components/componentTabsModuleConstants');
// Graphics components...
const componentRectangleModuleConstants     = require('../../shared/vm/modules/components/componentRectangleModuleConstants');
const componentCircleModuleConstants        = require('../../shared/vm/modules/components/componentCircleModuleConstants');
const componentImageModuleConstants         = require('../../shared/vm/modules/components/componentImageModuleConstants');
// Status components...
const componentStatusLightModuleConstants   = require('../../shared/vm/modules/components/componentStatusLightModuleConstants');
const componentProgressBarModuleConstants   = require('../../shared/vm/modules/components/componentProgressBarModuleConstants');
const componentLoadingDotsModuleConstants   = require('../../shared/vm/modules/components/componentLoadingDotsModuleConstants');
// IO Display components...
const componentPUDeviceModuleConstants      = require('../../shared/vm/modules/components/componentPUDeviceModuleConstants');
const componentEV3MotorModuleConstants      = require('../../shared/vm/modules/components/componentEV3MotorModuleConstants');
const componentEV3SensorModuleConstants     = require('../../shared/vm/modules/components/componentEV3SensorModuleConstants');
// Dialog components...
const componentAlertDialogModuleConstants   = require('../../shared/vm/modules/components/componentAlertDialogModuleConstants');
const componentConfirmDialogModuleConstants = require('../../shared/vm/modules/components/componentConfirmDialogModuleConstants');
// Non visual components...
const componentIntervalModuleConstants      = require('../../shared/vm/modules/components/componentIntervalModuleConstants');
const componentTimeoutModuleConstants       = require('../../shared/vm/modules/components/componentTimeoutModuleConstants');

// Modules...
const FileSystem                            = require('../vm/modules/local/FileSystem'                             ).FileSystem;
const LocalStandardModule                   = require('../vm/modules/local/StandardModule'                         ).StandardModule;
const LocalScreenModule                     = require('../vm/modules/local/ScreenModule'                           ).ScreenModule;
const LocalMotorModule                      = require('../vm/modules/local/MotorModule'                            ).MotorModule;
const LocalSensorModule                     = require('../vm/modules/local/SensorModule'                           ).SensorModule;
const LocalMathModule                       = require('../vm/modules/local/MathModule'                             ).MathModule;
const LocalLightModule                      = require('../vm/modules/local/LightModule'                            ).LightModule;
const LocalButtonModule                     = require('../vm/modules/local/ButtonModule'                           ).ButtonModule;
const LocalSoundModule                      = require('../vm/modules/local/SoundModule'                            ).SoundModule;
const LocalFileModule                       = require('../vm/modules/local/FileModule'                             ).FileModule;
const LocalSystemModule                     = require('../vm/modules/local/SystemModule'                           ).SystemModule;
const LocalStringModule                     = require('../vm/modules/local/StringModule'                           ).StringModule;
const LocalBitModule                        = require('../vm/modules/local/BitModule'                              ).BitModule;
const LocalPspModule                        = require('../vm/modules/local/PspModule'                              ).PspModule;
const LocalMultiplexerModule                = require('../vm/modules/local/MultiplexerModule'                      ).MultiplexerModule;
const LocalDeviceModule                     = require('../vm/modules/local/DeviceModule'                           ).DeviceModule;
const LocalPoweredUpModule                  = require('../vm/modules/local/PoweredUpModule'                        ).PoweredUpModule;
// Form component...
const LocalComponentFormModule              = require('../vm/modules/local/components/ComponentFormModule'         ).ComponentFormModule;
// Input components...
const LocalComponentButtonModule            = require('../vm/modules/local/components/ComponentButtonModule'       ).ComponentButtonModule;
const LocalComponentSelectButtonModule      = require('../vm/modules/local/components/ComponentSelectButtonModule' ).ComponentSelectButtonModule;
const LocalComponentCheckboxModule          = require('../vm/modules/local/components/ComponentCheckboxModule'     ).ComponentCheckboxModule;
const LocalComponentRadioModule             = require('../vm/modules/local/components/ComponentRadioModule'        ).ComponentRadioModule;
const LocalComponentDropdownModule          = require('../vm/modules/local/components/ComponentDropdownModule'     ).ComponentDropdownModule;
const LocalComponentTextInputModule         = require('../vm/modules/local/components/ComponentTextInputModule'    ).ComponentTextInputModule;
const LocalComponentSliderModule            = require('../vm/modules/local/components/ComponentSliderModule'       ).ComponentSliderModule;
// Text components...
const LocalComponentLabelModule             = require('../vm/modules/local/components/ComponentLabelModule'        ).ComponentLabelModule;
const LocalComponentTitleModule             = require('../vm/modules/local/components/ComponentTitleModule'        ).ComponentTitleModule;
const LocalComponentTextModule              = require('../vm/modules/local/components/ComponentTextModule'         ).ComponentTextModule;
const LocalComponentListItemsModule         = require('../vm/modules/local/components/ComponentListItemsModule'    ).ComponentListItemsModule;
// Panel components...
const LocalComponentPanelModule             = require('../vm/modules/local/components/ComponentPanelModule'        ).ComponentPanelModule;
const LocalComponentTabsModule              = require('../vm/modules/local/components/ComponentTabsModule'         ).ComponentTabsModule;
// Graphics components...
const LocalComponentRectangleModule         = require('../vm/modules/local/components/ComponentRectangleModule'    ).ComponentRectangleModule;
const LocalComponentCircleModule            = require('../vm/modules/local/components/ComponentCircleModule'       ).ComponentCircleModule;
const LocalComponentImageModule             = require('../vm/modules/local/components/ComponentImageModule'        ).ComponentImageModule;
// Status components...
const LocalComponentStatusLightModule       = require('../vm/modules/local/components/ComponentStatusLightModule'  ).ComponentStatusLightModule;
const LocalComponentProgressBarModule       = require('../vm/modules/local/components/ComponentProgressBarModule'  ).ComponentProgressBarModule;
const LocalComponentLoadingDotsModule       = require('../vm/modules/local/components/ComponentLoadingDotsModule'  ).ComponentLoadingDotsModule;
// IO Display components...
const LocalComponentPUDeviceModule          = require('../vm/modules/local/components/ComponentPUDeviceModule'     ).ComponentPUDeviceModule;
const LocalComponentEV3MotorModule          = require('../vm/modules/local/components/ComponentEV3MotorModule'     ).ComponentEV3MotorModule;
const LocalComponentEV3SensorModule         = require('../vm/modules/local/components/ComponentEV3SensorModule'    ).ComponentEV3SensorModule;
// Dialog components...
const LocalComponentAlertDialogModule       = require('../vm/modules/local/components/ComponentAlertDialogModule'  ).ComponentAlertDialogModule;
const LocalComponentConfirmDialogModule     = require('../vm/modules/local/components/ComponentConfirmDialogModule').ComponentConfirmDialogModule;
// Non visual components...
const LocalComponentIntervalModule          = require('../vm/modules/local/components/ComponentIntervalModule'     ).ComponentIntervalModule;
const LocalComponentTimeoutModule           = require('../vm/modules/local/components/ComponentTimeoutModule'      ).ComponentTimeoutModule;
// Remote components...
const RemoteStandardModule                  = require('../vm/modules/remote/StandardModule'                        ).StandardModule;
const RemoteScreenModule                    = require('../vm/modules/remote/ScreenModule'                          ).ScreenModule;
const RemoteMotorModule                     = require('../vm/modules/remote/MotorModule'                           ).MotorModule;
const RemoteSensorModule                    = require('../vm/modules/remote/SensorModule'                          ).SensorModule;
const RemoteMathModule                      = require('../vm/modules/remote/MathModule'                            ).MathModule;
const RemoteLightModule                     = require('../vm/modules/remote/LightModule'                           ).LightModule;
const RemoteButtonModule                    = require('../vm/modules/remote/ButtonModule'                          ).ButtonModule;
const RemoteSoundModule                     = require('../vm/modules/remote/SoundModule'                           ).SoundModule;
const RemoteFileModule                      = require('../vm/modules/remote/FileModule'                            ).FileModule;
const RemoteSystemModule                    = require('../vm/modules/remote/SystemModule'                          ).SystemModule;
const RemoteStringModule                    = require('../vm/modules/remote/StringModule'                          ).StringModule;
const RemoteBitModule                       = require('../vm/modules/remote/BitModule'                             ).BitModule;
const RemotePspModule                       = require('../vm/modules/remote/PspModule'                             ).PspModule;
const RemoteMultiplexerModule               = require('../vm/modules/remote/MultiplexerModule'                     ).MultiplexerModule;
const RemoteDeviceModule                    = require('../vm/modules/remote/DeviceModule'                          ).DeviceModule;
const RemotePoweredUpModule                 = require('../vm/modules/remote/PoweredUpModule'                       ).PoweredUpModule;
// Form component...
const RemoteComponentFormModule             = LocalComponentFormModule;
// Input components...
const RemoteComponentButtonModule           = LocalComponentButtonModule;
const RemoteComponentSelectButtonModule     = LocalComponentSelectButtonModule;
const RemoteComponentCheckboxModule         = LocalComponentCheckboxModule;
const RemoteComponentRadioModule            = LocalComponentRadioModule;
const RemoteComponentDropdownModule         = LocalComponentDropdownModule;
const RemoteComponentTextInputModule        = LocalComponentTextInputModule;
const RemoteComponentSliderModule           = LocalComponentSliderModule;
// Text components...
const RemoteComponentLabelModule            = LocalComponentLabelModule;
const RemoteComponentTitleModule            = LocalComponentTitleModule;
const RemoteComponentTextModule             = LocalComponentTextModule;
const RemoteComponentListItemsModule        = LocalComponentListItemsModule;
// Panel components...
const RemoteComponentPanelModule            = LocalComponentPanelModule;
const RemoteComponentTabsModule             = LocalComponentTabsModule;
// Graphics components...
const RemoteComponentRectangleModule        = LocalComponentRectangleModule;
const RemoteComponentCircleModule           = LocalComponentCircleModule;
const RemoteComponentImageModule            = LocalComponentImageModule;
// Status components...
const RemoteComponentStatusLightModule      = LocalComponentStatusLightModule;
const RemoteComponentProgressBarModule      = LocalComponentProgressBarModule;
const RemoteComponentLoadingDotsModule      = LocalComponentLoadingDotsModule;
// IO Display components...
const RemoteComponentPUDeviceModule         = LocalComponentPUDeviceModule;
const RemoteComponentEV3MotorModule         = LocalComponentEV3MotorModule;
const RemoteComponentEV3SensorModule        = LocalComponentEV3SensorModule;
// Dialog components...
const RemoteComponentAlertDialogModule      = LocalComponentAlertDialogModule;
const RemoteComponentConfirmDialogModule    = LocalComponentConfirmDialogModule;
// Non visual components...
const RemoteComponentIntervalModule         = LocalComponentIntervalModule;
const RemoteComponentTimeoutModule          = LocalComponentTimeoutModule;
// Simulator events...
const SimulatorModules                      = require('./simulator/SimulatorModules').SimulatorModules;
const pluginUuid                            = require('./plugins/pluginUuid');

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
        this._simulator           = null;
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
            modules[standardModuleConstants              .MODULE_STANDARD        ] = new LocalStandardModule               ({vm: vm, device: device});
            modules[mathModuleConstants                  .MODULE_MATH            ] = new LocalMathModule                   ({vm: vm, device: device});
            modules[screenModuleConstants                .MODULE_SCREEN          ] = new LocalScreenModule                 ({vm: vm, device: device});
            modules[lightModuleConstants                 .MODULE_LIGHT           ] = new LocalLightModule                  ({vm: vm, device: device});
            modules[buttonModuleConstants                .MODULE_BUTTON          ] = new LocalButtonModule                 ({vm: vm, device: device});
            modules[soundModuleConstants                 .MODULE_SOUND           ] = new LocalSoundModule                  ({vm: vm, device: device});
            modules[motorModuleConstants                 .MODULE_MOTOR           ] = new LocalMotorModule                  ({vm: vm, device: device});
            modules[sensorModuleConstants                .MODULE_SENSOR          ] = new LocalSensorModule                 ({vm: vm, device: device});
            modules[fileModuleConstants                  .MODULE_FILE            ] = new LocalFileModule                   ({vm: vm, device: device, fileSystem: fileSystem});
            modules[systemModuleConstants                .MODULE_SYSTEM          ] = new LocalSystemModule                 ({vm: vm, device: device});
            modules[stringModuleConstants                .MODULE_STRING          ] = new LocalStringModule                 ({vm: vm, device: device});
            modules[bitModuleConstants                   .MODULE_BIT             ] = new LocalBitModule                    ({vm: vm, device: device});
            modules[deviceModuleConstants                .MODULE_DEVICE          ] = new LocalDeviceModule                 ({vm: vm, device: device});
            modules[poweredUpModuleConstants             .MODULE_POWERED_UP      ] = new LocalPoweredUpModule              ({vm: vm, device: device});
            // Mindsensors...
            modules[pspModuleConstants                   .MODULE_PSP             ] = new LocalPspModule                    ({vm: vm, device: device});
            modules[multiplexerModuleConstants           .MODULE_MULTIPLEXER     ] = new LocalMultiplexerModule            ({vm: vm, device: device});
            // Components....
            modules[componentFormModuleConstants         .MODULE_FORM            ] = new LocalComponentFormModule          ({vm: vm, device: device});
            // Input components...
            modules[componentButtonModuleConstants       .MODULE_BUTTON          ] = new LocalComponentButtonModule        ({vm: vm, device: device, ide: this});
            modules[componentSelectButtonModuleConstants .MODULE_SELECT_BUTTON   ] = new LocalComponentSelectButtonModule  ({vm: vm, device: device, ide: this});
            modules[componentCheckboxModuleConstants     .MODULE_CHECKBOX        ] = new LocalComponentCheckboxModule      ({vm: vm, device: device, ide: this});
            modules[componentRadioModuleConstants        .MODULE_RADIO           ] = new LocalComponentRadioModule         ({vm: vm, device: device, ide: this});
            modules[componentDropdownModuleConstants     .MODULE_DROPDOWN        ] = new LocalComponentDropdownModule      ({vm: vm, device: device, ide: this});
            modules[componentTextInputModuleConstants    .MODULE_TEXT_INPUT      ] = new LocalComponentTextInputModule     ({vm: vm, device: device, ide: this});
            modules[componentSliderModuleConstants       .MODULE_SLIDER          ] = new LocalComponentSliderModule        ({vm: vm, device: device, ide: this});
            // Text components...
            modules[componentLabelModuleConstants        .MODULE_LABEL           ] = new LocalComponentLabelModule         ({vm: vm, device: device});
            modules[componentTitleModuleConstants        .MODULE_TITLE           ] = new LocalComponentTitleModule         ({vm: vm, device: device});
            modules[componentTextModuleConstants         .MODULE_TEXT            ] = new LocalComponentTextModule          ({vm: vm, device: device});
            modules[componentListItemsModuleConstants    .MODULE_LIST_ITEMS      ] = new LocalComponentListItemsModule     ({vm: vm, device: device});
            // Panel components...
            modules[componentPanelModuleConstants        .MODULE_PANEL           ] = new LocalComponentPanelModule         ({vm: vm, device: device});
            modules[componentTabsModuleConstants         .MODULE_TABS            ] = new LocalComponentTabsModule          ({vm: vm, device: device});
            // Graphics components...
            modules[componentRectangleModuleConstants    .MODULE_RECTANGLE       ] = new LocalComponentRectangleModule     ({vm: vm, device: device});
            modules[componentCircleModuleConstants       .MODULE_CIRCLE          ] = new LocalComponentCircleModule        ({vm: vm, device: device});
            modules[componentImageModuleConstants        .MODULE_IMAGE           ] = new LocalComponentImageModule         ({vm: vm, device: device});
            // Status components...
            modules[componentStatusLightModuleConstants  .MODULE_STATUS_LIGHT    ] = new LocalComponentStatusLightModule   ({vm: vm, device: device});
            modules[componentProgressBarModuleConstants  .MODULE_PROGRESS_BAR    ] = new LocalComponentProgressBarModule   ({vm: vm, device: device});
            modules[componentLoadingDotsModuleConstants  .MODULE_LOADING_DOTS    ] = new LocalComponentLoadingDotsModule   ({vm: vm, device: device});
            // Simulator components...
            modules[componentPUDeviceModuleConstants     .MODULE_PU_DEVICE       ] = new LocalComponentPUDeviceModule      ({vm: vm, device: device});
            modules[componentEV3MotorModuleConstants     .MODULE_EV3_MOTOR       ] = new LocalComponentEV3MotorModule      ({vm: vm, device: device});
            modules[componentEV3SensorModuleConstants    .MODULE_EV3_SENSOR      ] = new LocalComponentEV3SensorModule     ({vm: vm, device: device});
            // Dialog components...
            modules[componentAlertDialogModuleConstants  .MODULE_ALERT_DIALOG    ] = new LocalComponentAlertDialogModule   ({vm: vm, device: device});
            modules[componentConfirmDialogModuleConstants.MODULE_CONFIRM_DIALOG  ] = new LocalComponentConfirmDialogModule ({vm: vm, device: device});
            // Non visual components...
            modules[componentIntervalModuleConstants     .MODULE_INTERVAL        ] = new LocalComponentIntervalModule      ({vm: vm, device: device});
            modules[componentTimeoutModuleConstants      .MODULE_TIMEOUT         ] = new LocalComponentTimeoutModule       ({vm: vm, device: device});
        } else {
            modules[standardModuleConstants              .MODULE_STANDARD        ] = new RemoteStandardModule              ({vm: vm, device: device});
            modules[mathModuleConstants                  .MODULE_MATH            ] = new RemoteMathModule                  ({vm: vm, device: device});
            modules[screenModuleConstants                .MODULE_SCREEN          ] = new RemoteScreenModule                ({vm: vm, device: device});
            modules[lightModuleConstants                 .MODULE_LIGHT           ] = new RemoteLightModule                 ({vm: vm, device: device});
            modules[buttonModuleConstants                .MODULE_BUTTON          ] = new RemoteButtonModule                ({vm: vm, device: device});
            modules[soundModuleConstants                 .MODULE_SOUND           ] = new RemoteSoundModule                 ({vm: vm, device: device});
            modules[motorModuleConstants                 .MODULE_MOTOR           ] = new RemoteMotorModule                 ({vm: vm, device: device});
            modules[sensorModuleConstants                .MODULE_SENSOR          ] = new RemoteSensorModule                ({vm: vm, device: device});
            modules[fileModuleConstants                  .MODULE_FILE            ] = new RemoteFileModule                  ({vm: vm, device: device, fileSystem: fileSystem});
            modules[systemModuleConstants                .MODULE_SYSTEM          ] = new RemoteSystemModule                ({vm: vm, device: device});
            modules[stringModuleConstants                .MODULE_STRING          ] = new RemoteStringModule                ({vm: vm, device: device});
            modules[bitModuleConstants                   .MODULE_BIT             ] = new RemoteBitModule                   ({vm: vm, device: device});
            modules[deviceModuleConstants                .MODULE_DEVICE          ] = new RemoteDeviceModule                ({vm: vm, device: device});
            modules[poweredUpModuleConstants             .MODULE_POWERED_UP      ] = new RemotePoweredUpModule             ({vm: vm, device: device});
            // Components....
            modules[componentFormModuleConstants         .MODULE_FORM            ] = new RemoteComponentFormModule         ({vm: vm, device: device});
            // Input components...
            modules[componentButtonModuleConstants       .MODULE_BUTTON          ] = new RemoteComponentButtonModule       ({vm: vm, device: device, ide: this});
            modules[componentSelectButtonModuleConstants .MODULE_SELECT_BUTTON   ] = new RemoteComponentSelectButtonModule ({vm: vm, device: device, ide: this});
            modules[componentCheckboxModuleConstants     .MODULE_CHECKBOX        ] = new RemoteComponentCheckboxModule     ({vm: vm, device: device, ide: this});
            modules[componentRadioModuleConstants        .MODULE_RADIO           ] = new RemoteComponentRadioModule        ({vm: vm, device: device, ide: this});
            modules[componentDropdownModuleConstants     .MODULE_DROPDOWN        ] = new RemoteComponentDropdownModule     ({vm: vm, device: device, ide: this});
            modules[componentTextInputModuleConstants    .MODULE_TEXT_INPUT      ] = new RemoteComponentTextInputModule    ({vm: vm, device: device, ide: this});
            modules[componentSliderModuleConstants       .MODULE_SLIDER          ] = new RemoteComponentSliderModule       ({vm: vm, device: device, ide: this});
            // Text components...
            modules[componentLabelModuleConstants        .MODULE_LABEL           ] = new RemoteComponentLabelModule        ({vm: vm, device: device});
            modules[componentTitleModuleConstants        .MODULE_TITLE           ] = new RemoteComponentTitleModule        ({vm: vm, device: device});
            modules[componentTextModuleConstants         .MODULE_TEXT            ] = new RemoteComponentTextModule         ({vm: vm, device: device});
            modules[componentListItemsModuleConstants    .MODULE_LIST_ITEMS      ] = new RemoteComponentListItemsModule    ({vm: vm, device: device});
            // Panel components...
            modules[componentPanelModuleConstants        .MODULE_PANEL           ] = new RemoteComponentPanelModule        ({vm: vm, device: device});
            modules[componentTabsModuleConstants         .MODULE_TABS            ] = new RemoteComponentTabsModule         ({vm: vm, device: device});
            // Graphics components...
            modules[componentRectangleModuleConstants    .MODULE_RECTANGLE       ] = new RemoteComponentRectangleModule    ({vm: vm, device: device});
            modules[componentCircleModuleConstants       .MODULE_CIRCLE          ] = new RemoteComponentCircleModule       ({vm: vm, device: device});
            modules[componentImageModuleConstants        .MODULE_IMAGE           ] = new RemoteComponentImageModule        ({vm: vm, device: device});
            // Status components...
            modules[componentStatusLightModuleConstants  .MODULE_STATUS_LIGHT    ] = new RemoteComponentStatusLightModule  ({vm: vm, device: device});
            modules[componentProgressBarModuleConstants  .MODULE_PROGRESS_BAR    ] = new RemoteComponentProgressBarModule  ({vm: vm, device: device});
            modules[componentLoadingDotsModuleConstants  .MODULE_LOADING_DOTS    ] = new RemoteComponentLoadingDotsModule  ({vm: vm, device: device});
            // Simulator components...
            modules[componentPUDeviceModuleConstants     .MODULE_PU_DEVICE       ] = new RemoteComponentPUDeviceModule     ({vm: vm, device: device});
            modules[componentEV3MotorModuleConstants     .MODULE_EV3_MOTOR       ] = new RemoteComponentEV3MotorModule     ({vm: vm, device: device});
            modules[componentEV3SensorModuleConstants    .MODULE_EV3_SENSOR      ] = new RemoteComponentEV3SensorModule    ({vm: vm, device: device});
            // Dialog components...
            modules[componentAlertDialogModuleConstants  .MODULE_ALERT_DIALOG    ] = new RemoteComponentAlertDialogModule  ({vm: vm, device: device});
            modules[componentConfirmDialogModuleConstants.MODULE_CONFIRM_DIALOG  ] = new RemoteComponentConfirmDialogModule({vm: vm, device: device});
            // Non visual components...
            modules[componentIntervalModuleConstants     .MODULE_INTERVAL        ] = new RemoteComponentIntervalModule     ({vm: vm, device: device});
            modules[componentTimeoutModuleConstants      .MODULE_TIMEOUT         ] = new RemoteComponentTimeoutModule      ({vm: vm, device: device});
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
