/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform                       = require('../lib/platform');
const getImage                       = require('./data/images').getImage;
const FileDialog                     = require('./dialogs/file/FileDialog').FileDialog;
const FileNewDialog                  = require('./dialogs/file/FileNewDialog').FileNewDialog;
const FileRenameDialog               = require('./dialogs/file/FileRenameDialog').FileRenameDialog;
const ExploreDialog                  = require('./dialogs/ExploreDialog').ExploreDialog;
const EV3ControlDialog               = require('./dialogs/directcontrol/EV3ControlDialog').EV3ControlDialog;
const PoweredUpControlDialog         = require('./dialogs/directcontrol/PoweredUpControlDialog').PoweredUpControlDialog;
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
const EV3ConnectListDialog           = require('./dialogs/list/EV3ConnectListDialog').EV3ConnectListDialog;
const PoweredUpConnectListDialog     = require('./dialogs/list/PoweredUpConnectListDialog').PoweredUpConnectListDialog;
const PoweredUpAutoConnectListDialog = require('./dialogs/list/PoweredUpAutoConnectListDialog').PoweredUpAutoConnectListDialog;
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
const DeviceAliasDialog              = require('./dialogs/device/DeviceAliasDialog').DeviceAliasDialog;
const DevicePortAliasDialog          = require('./dialogs/device/DevicePortAliasDialog').DevicePortAliasDialog;
const DeviceCountDialog              = require('./dialogs/device/DeviceCountDialog').DeviceCountDialog;
const FormGridSizeDialog             = require('./dialogs/form/FormGridSizeDialog').FormGridSizeDialog;
const OpenFormDialog                 = require('./dialogs/hint/OpenFormDialog').OpenFormDialog;
const ConnectedDialog                = require('./dialogs/hint/ConnectedDialog').ConnectedDialog;
const IDEEvents                      = require('./IDEEvents').IDEEvents;

exports.IDEDialogs = class extends IDEEvents {
    initDialogs() {
        if (!platform.isElectron()) {
            new FileDialog({getImage: require('../data/images').getImage, ui: this._ui, settings: this._settings});
        }
        new FileNewDialog                 ({getImage: getImage, ui: this._ui, settings: this._settings});
        new FileRenameDialog              ({getImage: getImage, ui: this._ui});
        new ConfirmDialog                 ({getImage: getImage, ui: this._ui});
        new AlertDialog                   ({getImage: getImage, ui: this._ui});
        new EV3ConnectListDialog          ({getImage: getImage, ui: this._ui});
        new EV3ControlDialog              ({getImage: getImage, ui: this._ui, device: this._ev3});
        new PoweredUpConnectListDialog    ({getImage: getImage, ui: this._ui, settings: this._settings});
        new PoweredUpAutoConnectListDialog({getImage: getImage, ui: this._ui, settings: this._settings});
        new PoweredUpControlDialog        ({getImage: getImage, ui: this._ui, settings: this._settings, device: this._poweredUp});
        new SettingsDialog                ({getImage: getImage, ui: this._ui, settings: this._settings});
        new YesNoCancelDialog             ({getImage: getImage, ui: this._ui});
        new ImageNewDialog                ({getImage: getImage, ui: this._ui});
        new ImageResizeDialog             ({getImage: getImage, ui: this._ui});
        new ImageLoadDialog               ({getImage: getImage, ui: this._ui});
        new IconDialog                    ({getImage: getImage, ui: this._ui});
        new FormNewDialog                 ({getImage: getImage, ui: this._ui});
        new FormSizeDialog                ({getImage: getImage, ui: this._ui});
        new ListDialog                    ({getImage: getImage, ui: this._ui, signal: 'Dialog.List.Show'});
        new StatisticsDialog              ({getImage: getImage, ui: this._ui});
        new VolumeDialog                  ({getImage: getImage, ui: this._ui});
        new DaisyChainDialog              ({getImage: getImage, ui: this._ui});
        new LicenseDialog                 ({getImage: getImage, ui: this._ui});
        new DirectoryNewDialog            ({getImage: getImage, ui: this._ui});
        new ReplaceDialog                 ({getImage: getImage, ui: this._ui});
        new FindInFilesDialog             ({getImage: getImage, ui: this._ui});
        new GraphDialog                   ({getImage: getImage, ui: this._ui});
        new FormGridSizeDialog            ({getImage: getImage, ui: this._ui});
        new DeviceAliasDialog             ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DevicePortAliasDialog         ({getImage: getImage, ui: this._ui, settings: this._settings});
        new DeviceCountDialog             ({getImage: getImage, ui: this._ui, settings: this._settings});
        new HelpDialog                    ({getImage: getImage, ui: this._ui, settings: this._settings});
        new OpenFormDialog                ({getImage: getImage, ui: this._ui, settings: this._settings});
        new ConnectedDialog               ({getImage: getImage, ui: this._ui, settings: this._settings});
        new ExploreDialog                 ({getImage: getImage, ui: this._ui, ev3: this._ev3, settings: this._settings});
        new DownloadDialog                ({getImage: getImage, ui: this._ui, ev3: this._ev3, settings: this._settings});
        return this;
    }
};
