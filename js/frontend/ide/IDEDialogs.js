/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform                       = require('../../shared/lib/platform');
const dispatcher                     = require('../lib/dispatcher').dispatcher;
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
        this
            .initDialog({Constructor: ConfirmDialog})
            .initDialog({Constructor: AlertDialog})
        // File...
            .initDialog({Constructor: FileNewDialog})
            .initDialog({Constructor: FileRenameDialog})
            .initDialog({Constructor: FilePoweredUpProjectDialog, device: this._devices.poweredUp})
        // Connect...
            .initDialog({Constructor: NXTConnectListDialog})
            .initDialog({Constructor: EV3ConnectListDialog})
            .initDialog({Constructor: SpikeConnectListDialog})
            .initDialog({Constructor: PoweredUpConnectListDialog})
            .initDialog({Constructor: PoweredUpAutoConnectListDialog})
        // Control...
            .initDialog({Constructor: PoweredUpControlDialog, device: this._devices.poweredUp})
            .initDialog({Constructor: NXTControlDialog,       device: this._devices.nxt})
            .initDialog({Constructor: EV3ControlDialog,       device: this._devices.ev3})
            .initDialog({Constructor: SpikeControlDialog,     device: this._devices.spike})
            .initDialog({Constructor: SettingsDialog})
            .initDialog({Constructor: YesNoCancelDialog})
        // Image...
            .initDialog({Constructor: ImageNewDialog})
            .initDialog({Constructor: ImageResizeDialog})
            .initDialog({Constructor: ImageLoadDialog})
            .initDialog({Constructor: IconDialog})
        // Form...
            .initDialog({Constructor: FormNewDialog})
            .initDialog({Constructor: FormSizeDialog})
        // Misc...
            .initDialog({Constructor: ListDialog})
            .initDialog({Constructor: StatisticsDialog})
            .initDialog({Constructor: VolumeDialog})
            .initDialog({Constructor: LicenseDialog})
            .initDialog({Constructor: DirectoryNewDialog})
            .initDialog({Constructor: ReplaceDialog})
            .initDialog({Constructor: FindInFilesDialog})
            .initDialog({Constructor: GraphDialog})
            .initDialog({Constructor: FormGridSizeDialog})
            .initDialog({Constructor: ExampleDialog})
        // Device...
            .initDialog({Constructor: DeviceAliasDialog})
            .initDialog({Constructor: DevicePortAliasDialog})
        // Device count...
            .initDialog({Constructor: DeviceCountDialog})
            .initDialog({Constructor: DaisyChainDialog})
        // Misc...
            .initDialog({Constructor: HelpDialog, immidiate: true})
            .initDialog({Constructor: OpenFormDialog})
        // NXT...
            .initDialog({Constructor: SensorTypeDialog, nxt: this._devices.nxt})
        // EV3...
            .initDialog({Constructor: ConnectedDialog})
            .initDialog({Constructor: ExploreDialog,  ev3: this._devices.ev3})
            .initDialog({Constructor: DownloadDialog, ev3: this._devices.ev3})
        // Tools...
            .initDialog({Constructor: GearRatioCalculatorDialog})
            .initDialog({Constructor: InverseKinematicsDialog})
            .initDialog({Constructor: WheelToSVGDialog, ide: this})
        // Defines...
            .initDialog({Constructor: DefineListDialog})
            .initDialog({Constructor: DefineValueDialog});
        return this;
    }

    initDialog(constructorOpts) {
        constructorOpts.getImage = getImage;
        constructorOpts.ui       = this._ui;
        constructorOpts.settings = this._settings;
        let showSignal = constructorOpts.Constructor.SHOW_SIGNAL;
        if (!showSignal) {
            throw new Error('Missing show signal');
        }
        if (constructorOpts.immidiate) {
            new constructorOpts.Constructor(constructorOpts);
            return this;
        }
        // Capture the signal...
        let d = dispatcher.on(
            showSignal,
            this,
            function(opts) {
                d(); // Remove the listener...
                // Construct the dialog which contains the new listener...
                new constructorOpts.Constructor(constructorOpts);
                // And dispatch the same signal again...
                dispatcher.dispatch(showSignal, opts);
            }
        );
        return this;
    }
};
