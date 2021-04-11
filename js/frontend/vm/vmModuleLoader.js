/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
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
const spikeModuleConstants                  = require('../../shared/vm/modules/spikeModuleConstants');
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
const componentIconModuleConstants          = require('../../shared/vm/modules/components/componentIconModuleConstants');
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
const FileSystem                            = require('./modules/local/FileSystem'                             ).FileSystem;
const LocalStandardModule                   = require('./modules/local/StandardModule'                         ).StandardModule;
const LocalScreenModule                     = require('./modules/local/ScreenModule'                           ).ScreenModule;
const LocalMotorModule                      = require('./modules/local/MotorModule'                            ).MotorModule;
const LocalSensorModule                     = require('./modules/local/SensorModule'                           ).SensorModule;
const LocalMathModule                       = require('./modules/local/MathModule'                             ).MathModule;
const LocalLightModule                      = require('./modules/local/LightModule'                            ).LightModule;
const LocalButtonModule                     = require('./modules/local/ButtonModule'                           ).ButtonModule;
const LocalSoundModule                      = require('./modules/local/SoundModule'                            ).SoundModule;
const LocalFileModule                       = require('./modules/local/FileModule'                             ).FileModule;
const LocalSystemModule                     = require('./modules/local/SystemModule'                           ).SystemModule;
const LocalStringModule                     = require('./modules/local/StringModule'                           ).StringModule;
const LocalBitModule                        = require('./modules/local/BitModule'                              ).BitModule;
const LocalDeviceModule                     = require('./modules/local/DeviceModule'                           ).DeviceModule;
const LocalPoweredUpModule                  = require('./modules/local/PoweredUpModule'                        ).PoweredUpModule;
const LocalSpikeModule                      = require('./modules/local/SpikeModule'                            ).SpikeModule;
// Form component...
const LocalComponentFormModule              = require('./modules/local/components/ComponentFormModule'         ).ComponentFormModule;
// Input components...
const LocalComponentButtonModule            = require('./modules/local/components/ComponentButtonModule'       ).ComponentButtonModule;
const LocalComponentSelectButtonModule      = require('./modules/local/components/ComponentSelectButtonModule' ).ComponentSelectButtonModule;
const LocalComponentCheckboxModule          = require('./modules/local/components/ComponentCheckboxModule'     ).ComponentCheckboxModule;
const LocalComponentRadioModule             = require('./modules/local/components/ComponentRadioModule'        ).ComponentRadioModule;
const LocalComponentDropdownModule          = require('./modules/local/components/ComponentDropdownModule'     ).ComponentDropdownModule;
const LocalComponentTextInputModule         = require('./modules/local/components/ComponentTextInputModule'    ).ComponentTextInputModule;
const LocalComponentSliderModule            = require('./modules/local/components/ComponentSliderModule'       ).ComponentSliderModule;
// Text components...
const LocalComponentLabelModule             = require('./modules/local/components/ComponentLabelModule'        ).ComponentLabelModule;
const LocalComponentTitleModule             = require('./modules/local/components/ComponentTitleModule'        ).ComponentTitleModule;
const LocalComponentTextModule              = require('./modules/local/components/ComponentTextModule'         ).ComponentTextModule;
const LocalComponentListItemsModule         = require('./modules/local/components/ComponentListItemsModule'    ).ComponentListItemsModule;
// Panel components...
const LocalComponentPanelModule             = require('./modules/local/components/ComponentPanelModule'        ).ComponentPanelModule;
const LocalComponentTabsModule              = require('./modules/local/components/ComponentTabsModule'         ).ComponentTabsModule;
// Graphics components...
const LocalComponentRectangleModule         = require('./modules/local/components/ComponentRectangleModule'    ).ComponentRectangleModule;
const LocalComponentCircleModule            = require('./modules/local/components/ComponentCircleModule'       ).ComponentCircleModule;
const LocalComponentImageModule             = require('./modules/local/components/ComponentImageModule'        ).ComponentImageModule;
const LocalComponentIconModule              = require('./modules/local/components/ComponentIconModule'         ).ComponentIconModule;
// Status components...
const LocalComponentStatusLightModule       = require('./modules/local/components/ComponentStatusLightModule'  ).ComponentStatusLightModule;
const LocalComponentProgressBarModule       = require('./modules/local/components/ComponentProgressBarModule'  ).ComponentProgressBarModule;
const LocalComponentLoadingDotsModule       = require('./modules/local/components/ComponentLoadingDotsModule'  ).ComponentLoadingDotsModule;
// IO Display components...
const LocalComponentPUDeviceModule          = require('./modules/local/components/ComponentPUDeviceModule'     ).ComponentPUDeviceModule;
const LocalComponentEV3MotorModule          = require('./modules/local/components/ComponentEV3MotorModule'     ).ComponentEV3MotorModule;
const LocalComponentEV3SensorModule         = require('./modules/local/components/ComponentEV3SensorModule'    ).ComponentEV3SensorModule;
// Dialog components...
const LocalComponentAlertDialogModule       = require('./modules/local/components/ComponentAlertDialogModule'  ).ComponentAlertDialogModule;
const LocalComponentConfirmDialogModule     = require('./modules/local/components/ComponentConfirmDialogModule').ComponentConfirmDialogModule;
// Non visual components...
const LocalComponentIntervalModule          = require('./modules/local/components/ComponentIntervalModule'     ).ComponentIntervalModule;
const LocalComponentTimeoutModule           = require('./modules/local/components/ComponentTimeoutModule'      ).ComponentTimeoutModule;
// Remote components...
const RemoteStandardModule                  = require('./modules/remote/StandardModule'                        ).StandardModule;
const RemoteScreenModule                    = require('./modules/remote/ScreenModule'                          ).ScreenModule;
const RemoteMotorModule                     = require('./modules/remote/MotorModule'                           ).MotorModule;
const RemoteSensorModule                    = require('./modules/remote/SensorModule'                          ).SensorModule;
const RemoteMathModule                      = require('./modules/remote/MathModule'                            ).MathModule;
const RemoteLightModule                     = require('./modules/remote/LightModule'                           ).LightModule;
const RemoteButtonModule                    = require('./modules/remote/ButtonModule'                          ).ButtonModule;
const RemoteSoundModule                     = require('./modules/remote/SoundModule'                           ).SoundModule;
const RemoteFileModule                      = require('./modules/remote/FileModule'                            ).FileModule;
const RemoteSystemModule                    = require('./modules/remote/SystemModule'                          ).SystemModule;
const RemoteStringModule                    = require('./modules/remote/StringModule'                          ).StringModule;
const RemoteBitModule                       = require('./modules/remote/BitModule'                             ).BitModule;
const RemoteDeviceModule                    = require('./modules/remote/DeviceModule'                          ).DeviceModule;
const RemotePoweredUpModule                 = require('./modules/remote/PoweredUpModule'                       ).PoweredUpModule;
const RemoteSpikeModule                     = require('./modules/remote/SpikeModule'                           ).SpikeModule;
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
const RemoteComponentIconModule             = LocalComponentIconModule;
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

exports.load = (vm, localModules, device, ide) => {
    let modules    = [];
    let fileSystem = new FileSystem({vm: vm});
    if (localModules) {
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
        modules[spikeModuleConstants                 .MODULE_SPIKE           ] = new LocalSpikeModule                  ({vm: vm, device: device});
        // Components....
        modules[componentFormModuleConstants         .MODULE_FORM            ] = new LocalComponentFormModule          ({vm: vm, device: device, ide: ide});
        // Input components...
        modules[componentButtonModuleConstants       .MODULE_BUTTON          ] = new LocalComponentButtonModule        ({vm: vm, device: device, ide: ide});
        modules[componentSelectButtonModuleConstants .MODULE_SELECT_BUTTON   ] = new LocalComponentSelectButtonModule  ({vm: vm, device: device, ide: ide});
        modules[componentCheckboxModuleConstants     .MODULE_CHECKBOX        ] = new LocalComponentCheckboxModule      ({vm: vm, device: device, ide: ide});
        modules[componentRadioModuleConstants        .MODULE_RADIO           ] = new LocalComponentRadioModule         ({vm: vm, device: device, ide: ide});
        modules[componentDropdownModuleConstants     .MODULE_DROPDOWN        ] = new LocalComponentDropdownModule      ({vm: vm, device: device, ide: ide});
        modules[componentTextInputModuleConstants    .MODULE_TEXT_INPUT      ] = new LocalComponentTextInputModule     ({vm: vm, device: device, ide: ide});
        modules[componentSliderModuleConstants       .MODULE_SLIDER          ] = new LocalComponentSliderModule        ({vm: vm, device: device, ide: ide});
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
        modules[componentIconModuleConstants         .MODULE_ICON            ] = new LocalComponentIconModule          ({vm: vm, device: device});
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
        modules[spikeModuleConstants                 .MODULE_SPIKE           ] = new RemoteSpikeModule                 ({vm: vm, device: device});
        // Components....
        modules[componentFormModuleConstants         .MODULE_FORM            ] = new RemoteComponentFormModule         ({vm: vm, device: device, ide: ide});
        // Input components...
        modules[componentButtonModuleConstants       .MODULE_BUTTON          ] = new RemoteComponentButtonModule       ({vm: vm, device: device, ide: ide});
        modules[componentSelectButtonModuleConstants .MODULE_SELECT_BUTTON   ] = new RemoteComponentSelectButtonModule ({vm: vm, device: device, ide: ide});
        modules[componentCheckboxModuleConstants     .MODULE_CHECKBOX        ] = new RemoteComponentCheckboxModule     ({vm: vm, device: device, ide: ide});
        modules[componentRadioModuleConstants        .MODULE_RADIO           ] = new RemoteComponentRadioModule        ({vm: vm, device: device, ide: ide});
        modules[componentDropdownModuleConstants     .MODULE_DROPDOWN        ] = new RemoteComponentDropdownModule     ({vm: vm, device: device, ide: ide});
        modules[componentTextInputModuleConstants    .MODULE_TEXT_INPUT      ] = new RemoteComponentTextInputModule    ({vm: vm, device: device, ide: ide});
        modules[componentSliderModuleConstants       .MODULE_SLIDER          ] = new RemoteComponentSliderModule       ({vm: vm, device: device, ide: ide});
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
        modules[componentIconModuleConstants         .MODULE_ICON            ] = new RemoteComponentIconModule         ({vm: vm, device: device});
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
};
