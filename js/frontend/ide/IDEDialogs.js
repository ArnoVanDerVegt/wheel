/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform                       = require('../../shared/lib/platform');
const getImage                       = require('./data/images').getImage;
const FileOpenDialog                 = require('./dialogs/file/FileOpenDialog').FileOpenDialog;
const FileNewDialog                  = require('./dialogs/file/FileNewDialog').FileNewDialog;
const FileRenameDialog               = require('./dialogs/file/FileRenameDialog').FileRenameDialog;
const FilePoweredUpProjectDialog     = require('./dialogs/file/FilePoweredUpProjectDialog').FilePoweredUpProjectDialog;
const ExploreDialog                  = require('./dialogs/ExploreDialog').ExploreDialog;
const NXTControlDialog               = require('./dialogs/directcontrol/NXTControlDialog').NXTControlDialog;
const EV3ControlDialog               = require('./dialogs/directcontrol/EV3ControlDialog').EV3ControlDialog;
const PoweredUpControlDialog         = require('./dialogs/directcontrol/PoweredUpControlDialog').PoweredUpControlDialog;
const SpikeControlDialog             = require('./dialogs/directcontrol/SpikeControlDialog').SpikeControlDialog;
const ConfirmDialog                  = require('./dialogs/ConfirmDialog').ConfirmDialog;
const AlertDialog                    = require('./dialogs/AlertDialog').AlertDialog;
const SettingsDialog                 = require('./dialogs/settings/SettingsDialog').SettingsDialog;
const YesNoCancelDialog              = require('./dialogs/YesNoCancelDialog').YesNoCancelDialog;
const ImageNewDialog                 = require('./dialogs/image/ImageNewDialog').ImageNewDialog;
const ImageResizeDialog              = require('./dialogs/image/ImageResizeDialog').ImageResizeDialog;
const ImageLoadDialog                = require('./dialogs/image/ImageLoadDialog').ImageLoadDialog;
const IconDialog                     = require('./dialogs/image/IconDialog').IconDialog;
const FormNewDialog                  = require('./dialogs/form/FormNewDialog').FormNewDialog;
const FormSizeDialog                 = require('./dialogs/form/FormSizeDialog').FormSizeDialog;
const ListDialog                     = require('./dialogs/list/ListDialog').ListDialog;
const NXTConnectListDialog           = require('./dialogs/connection/NXTConnectListDialog').NXTConnectListDialog;
const EV3ConnectListDialog           = require('./dialogs/connection/EV3ConnectListDialog').EV3ConnectListDialog;
const PoweredUpConnectListDialog     = require('./dialogs/connection/PoweredUpConnectListDialog').PoweredUpConnectListDialog;
const PoweredUpAutoConnectListDialog = require('./dialogs/connection/PoweredUpAutoConnectListDialog').PoweredUpAutoConnectListDialog;
const SpikeConnectListDialog         = require('./dialogs/connection/SpikeConnectListDialog').SpikeConnectListDialog;
const StatisticsDialog               = require('./dialogs/statistics/StatisticsDialog').StatisticsDialog;
const VolumeDialog                   = require('./dialogs/VolumeDialog').VolumeDialog;
const HelpDialog                     = require('./dialogs/help/HelpDialog').HelpDialog;
const DaisyChainDialog               = require('./dialogs/DaisyChainDialog').DaisyChainDialog;
const LicenseDialog                  = require('./dialogs/LicenseDialog').LicenseDialog;
const DirectoryNewDialog             = require('./dialogs/directory/DirectoryNewDialog').DirectoryNewDialog;
const ReplaceDialog                  = require('./dialogs/find/ReplaceDialog').ReplaceDialog;
const FindInFilesDialog              = require('./dialogs/find/FindInFilesDialog').FindInFilesDialog;
const DownloadDialog                 = require('./dialogs/download/DownloadDialog').DownloadDialog;
const GraphDialog                    = require('./dialogs/GraphDialog').GraphDialog;
const SensorTypeDialog               = require('./dialogs/SensorTypeDialog').SensorTypeDialog;
const DeviceAliasDialog              = require('./dialogs/device/DeviceAliasDialog').DeviceAliasDialog;
const DevicePortAliasDialog          = require('./dialogs/device/DevicePortAliasDialog').DevicePortAliasDialog;
const DeviceCountDialog              = require('./dialogs/device/DeviceCountDialog').DeviceCountDialog;
const FormGridSizeDialog             = require('./dialogs/form/FormGridSizeDialog').FormGridSizeDialog;
const OpenFormDialog                 = require('./dialogs/hint/OpenFormDialog').OpenFormDialog;
const ConnectedDialog                = require('./dialogs/hint/ConnectedDialog').ConnectedDialog;
const GearRatioCalculatorDialog      = require('./dialogs/tools/GearRatioCalculatorDialog').GearRatioCalculatorDialog;
const InverseKinematicsDialog        = require('./dialogs/tools/InverseKinematicsDialog').InverseKinematicsDialog;
const WheelToSVGDialog               = require('./dialogs/tools/WheelToSVGDialog').WheelToSVGDialog;
const ExampleDialog                  = require('./dialogs/example/ExampleDialog').ExampleDialog;
const DefineListDialog               = require('./dialogs/define/DefineListDialog').DefineListDialog;
const DefineValueDialog              = require('./dialogs/define/DefineValueDialog').DefineValueDialog;
const IDEEvents                      = require('./IDEEvents').IDEEvents;

exports.IDEDialogs = class extends IDEEvents {
    initDialogs() {
        if (!platform.isElectron()) {
            new FileOpenDialog({getImage: require('../data/images').getImage, ui: this._ui, settings: this._settings});
        }
        // Alert/confirm...
        new ConfirmDialog                 ({getImage: getImage, ui: this._ui});
        new AlertDialog                   ({getImage: getImage, ui: this._ui});
        // File...
        new FileNewDialog                 ({getImage: getImage, ui: this._ui, settings: this._settings});
        new FileRenameDialog              ({getImage: getImage, ui: this._ui});
        new FilePoweredUpProjectDialog    ({getImage: getImage, ui: this._ui, settings: this._settings, device: this._devices.poweredUp});
        // Connect...
        new NXTConnectListDialog          ({getImage: getImage, ui: this._ui});
        new EV3ConnectListDialog          ({getImage: getImage, ui: this._ui});
        new SpikeConnectListDialog        ({getImage: getImage, ui: this._ui, settings: this._settings});
        new PoweredUpConnectListDialog    ({getImage: getImage, ui: this._ui, settings: this._settings});
        new PoweredUpAutoConnectListDialog({getImage: getImage, ui: this._ui, settings: this._settings});
        // Control...
        new PoweredUpControlDialog        ({getImage: getImage, ui: this._ui, settings: this._settings, device: this._devices.poweredUp});
        new NXTControlDialog              ({getImage: getImage, ui: this._ui, settings: this._settings, device: this._devices.nxt});
        new EV3ControlDialog              ({getImage: getImage, ui: this._ui, settings: this._settings, device: this._devices.ev3});
        new SpikeControlDialog            ({getImage: getImage, ui: this._ui, settings: this._settings, device: this._devices.spike});
        new SettingsDialog                ({getImage: getImage, ui: this._ui, settings: this._settings});
        new YesNoCancelDialog             ({getImage: getImage, ui: this._ui});
        // Image...
        new ImageNewDialog                ({getImage: getImage, ui: this._ui});
        new ImageResizeDialog             ({getImage: getImage, ui: this._ui});
        new ImageLoadDialog               ({getImage: getImage, ui: this._ui});
        new IconDialog                    ({getImage: getImage, ui: this._ui});
        // Form...
        new FormNewDialog                 ({getImage: getImage, ui: this._ui});
        new FormSizeDialog                ({getImage: getImage, ui: this._ui});
        // Misc...
        new ListDialog                    ({getImage: getImage, ui: this._ui, showSignal: 'Dialog.List.Show'});
        new StatisticsDialog              ({getImage: getImage, ui: this._ui});
        new VolumeDialog                  ({getImage: getImage, ui: this._ui});
        new LicenseDialog                 ({getImage: getImage, ui: this._ui});
        new DirectoryNewDialog            ({getImage: getImage, ui: this._ui});
        new ReplaceDialog                 ({getImage: getImage, ui: this._ui});
        new FindInFilesDialog             ({getImage: getImage, ui: this._ui});
        new GraphDialog                   ({getImage: getImage, ui: this._ui});
        new FormGridSizeDialog            ({getImage: getImage, ui: this._ui});
        new ExampleDialog                 ({getImage: getImage, ui: this._ui});
        // Device...
        new DeviceAliasDialog             ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DevicePortAliasDialog         ({getImage: getImage, ui: this._ui, settings: this._settings});
        // Device count...
        new DeviceCountDialog             ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DaisyChainDialog              ({getImage: getImage, ui: this._ui});
        // Misc...
        new HelpDialog                    ({getImage: getImage, ui: this._ui, settings: this._settings});
        new OpenFormDialog                ({getImage: getImage, ui: this._ui, settings: this._settings});
        // NXT...
        new SensorTypeDialog              ({getImage: getImage, ui: this._ui, settings: this._settings, nxt: this._devices.nxt});
        // EV3...
        new ConnectedDialog               ({getImage: getImage, ui: this._ui, settings: this._settings});
        new ExploreDialog                 ({getImage: getImage, ui: this._ui, settings: this._settings, ev3: this._devices.ev3});
        new DownloadDialog                ({getImage: getImage, ui: this._ui, settings: this._settings, ev3: this._devices.ev3});
        // Tools...
        new GearRatioCalculatorDialog     ({getImage: getImage, ui: this._ui, settings: this._settings});
        new InverseKinematicsDialog       ({getImage: getImage, ui: this._ui, settings: this._settings});
        new WheelToSVGDialog              ({getImage: getImage, ui: this._ui, settings: this._settings, ide: this});
        // Defines...
        new DefineListDialog              ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DefineValueDialog             ({getImage: getImage, ui: this._ui, settings: this._settings});
        return this;
    }
};
