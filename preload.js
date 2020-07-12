/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
require('./js/shared/vm/modules/buttonModuleConstants');
require('./js/shared/vm/modules/fileModuleConstants');
require('./js/shared/vm/modules/lightModuleConstants');
require('./js/shared/vm/modules/mathModuleConstants');
require('./js/shared/vm/modules/motorModuleConstants');
require('./js/shared/vm/modules/screenModuleConstants');
require('./js/shared/vm/modules/sensorModuleConstants');
require('./js/shared/vm/modules/soundModuleConstants');
require('./js/shared/vm/modules/standardModuleConstants');
require('./js/shared/vm/modules/systemModuleConstants');
require('./js/shared/vm/modules/stringModuleConstants');
require('./js/shared/vm/modules/bitModuleConstants');
require('./js/shared/vm/modules/deviceModuleConstants');
require('./js/shared/vm/modules/multiplexerModuleConstants');
require('./js/shared/vm/modules/pspModuleConstants');
require('./js/shared/vm/modules/poweredUpModuleConstants');
require('./js/shared/vm/modules/components/componentFormModuleConstants');
require('./js/shared/vm/modules/components/componentButtonModuleConstants');
require('./js/shared/vm/modules/components/componentCheckboxModuleConstants');
require('./js/shared/vm/modules/components/componentLabelModuleConstants');
require('./js/shared/vm/modules/components/componentSelectButtonModuleConstants');
require('./js/shared/vm/modules/components/componentStatusLightModuleConstants');
require('./js/shared/vm/modules/components/componentPanelModuleConstants');
require('./js/shared/vm/modules/components/componentTabsModuleConstants');
require('./js/shared/vm/modules/components/componentRectangleModuleConstants');
require('./js/shared/vm/modules/components/componentCircleModuleConstants');
require('./js/shared/vm/modules/components/componentImageModuleConstants');
require('./js/shared/vm/modules/components/componentPUDeviceModuleConstants');
require('./js/shared/vm/modules/components/componentEV3MotorModuleConstants');
require('./js/shared/vm/modules/components/componentEV3SensorModuleConstants');
require('./js/shared/lib/RgfImage');
require('./js/shared/lib/Sound');
require('./js/shared/device/BasicDevice');
require('./js/shared/device/modules/DeviceModule');
require('./js/shared/device/modules/PoweredUpModule');
require('./js/shared/device/modules/ButtonModule');
require('./js/shared/device/modules/FileModule');
require('./js/shared/device/modules/LightModule');
require('./js/shared/device/modules/MathModule');
require('./js/shared/device/modules/MotorModule');
require('./js/shared/device/modules/ScreenModule');
require('./js/shared/device/modules/SensorModule');
require('./js/shared/device/modules/SoundModule');
require('./js/shared/device/modules/StandardModule');
require('./js/shared/device/modules/SystemModule');
require('./js/shared/device/modules/StringModule');
require('./js/shared/device/modules/BitModule');
require('./js/shared/device/modules/DeviceModule');
require('./js/shared/device/modules/PoweredUpModule');
require('./js/shared/device/ev3/messageEncoder');
require('./js/shared/device/ev3/CommandQueue');
require('./js/shared/device/ev3/EV3');
require('./js/shared/device/ev3/constants');
require('./js/shared/device/poweredup/PoweredUp');
require('./js/backend/routes/settings');
require('./js/backend/routes/ev3');
require('./js/backend/routes/ide');
require('./js/frontend/ev3/Downloader');
const dispatcher = require('./js/frontend/lib/dispatcher').dispatcher;
require('./js/frontend/lib/platform');
require('./js/frontend/lib/Emitter');
require('./js/frontend/lib/path');
require('./js/frontend/lib/dom');
require('./js/frontend/lib/Http');
require('./js/frontend/program/commands');
require('./js/frontend/program/Program');
require('./js/frontend/program/output/Rtf');
require('./js/frontend/program/output/Text');
require('./js/frontend/compiler/errors');
require('./js/frontend/compiler/tokenizer/tokenizer');
require('./js/frontend/compiler/tokenizer/tokenUtils');
require('./js/frontend/compiler/tokenizer/TokenIterator');
require('./js/frontend/compiler/syntax/utils');
require('./js/frontend/compiler/syntax/syntaxRoot');
require('./js/frontend/compiler/syntax/syntaxProc');
require('./js/frontend/compiler/syntax/syntaxProcName');
require('./js/frontend/compiler/syntax/syntaxProcParams');
require('./js/frontend/compiler/syntax/syntaxRecord');
require('./js/frontend/compiler/syntax/syntaxAddr');
require('./js/frontend/compiler/syntax/syntaxModule');
require('./js/frontend/compiler/syntax/syntaxBreak');
require('./js/frontend/compiler/syntax/syntaxSelect');
require('./js/frontend/compiler/syntax/syntaxSelectValue');
require('./js/frontend/compiler/syntax/syntaxSelectCaseValue');
require('./js/frontend/compiler/syntax/syntaxSelectDefault');
require('./js/frontend/compiler/syntax/syntaxForTo');
require('./js/frontend/compiler/syntax/syntaxForToAssignment');
require('./js/frontend/compiler/syntax/syntaxNumericAssignment');
require('./js/frontend/compiler/syntax/syntaxBoolean');
require('./js/frontend/compiler/syntax/syntaxAssignment');
require('./js/frontend/compiler/syntax/syntaxBlock');
require('./js/frontend/compiler/syntax/SyntaxValidator');
require('./js/frontend/compiler/types/Var');
require('./js/frontend/compiler/types/Scope');
require('./js/frontend/compiler/types/Record');
require('./js/frontend/compiler/types/Proc');
require('./js/frontend/compiler/types/Namespace');
require('./js/frontend/compiler/compiler/CompileData');
require('./js/frontend/compiler/expression/MathExpression');
require('./js/frontend/compiler/expression/VarExpression');
require('./js/frontend/compiler/expression/AssignmentExpression');
require('./js/frontend/compiler/expression/BooleanExpression');
require('./js/frontend/compiler/compiler/CompileScope');
require('./js/frontend/compiler/compiler/CompileCall');
require('./js/frontend/compiler/compiler/CompileVars');
require('./js/frontend/compiler/compiler/CompileBlock');
require('./js/frontend/compiler/compiler/CompileLoop');
require('./js/frontend/compiler/linter/Linter');
require('./js/frontend/compiler/resources/ProjectResource');
require('./js/frontend/compiler/resources/ImageResource');
require('./js/frontend/compiler/resources/TextResource');
require('./js/frontend/compiler/resources/FormResource');
require('./js/frontend/compiler/resources/ProjectResources');
require('./js/frontend/compiler/preprocessor/Defines');
require('./js/frontend/compiler/preprocessor/MetaCompiler');
require('./js/frontend/compiler/preprocessor/PreProcessor');
require('./js/frontend/compiler/keyword/CompileNamespace');
require('./js/frontend/compiler/keyword/CompileAddr');
require('./js/frontend/compiler/keyword/CompileBreak');
require('./js/frontend/compiler/keyword/CompileFor');
require('./js/frontend/compiler/keyword/CompileIf');
require('./js/frontend/compiler/keyword/CompileModule');
require('./js/frontend/compiler/keyword/CompileProc');
require('./js/frontend/compiler/keyword/CompileRecord');
require('./js/frontend/compiler/keyword/CompileRepeat');
require('./js/frontend/compiler/keyword/CompileRet');
require('./js/frontend/compiler/keyword/CompileSelect');
require('./js/frontend/compiler/keyword/CompileWhile');
require('./js/frontend/compiler/CompilerUseInfo');
require('./js/frontend/compiler/Compiler');
require('./js/frontend/vm/modules/VMModule');
require('./js/frontend/vm/modules/local/FileSystem');
require('./js/frontend/vm/modules/local/ButtonModule');
require('./js/frontend/vm/modules/local/FileModule');
require('./js/frontend/vm/modules/local/LightModule');
require('./js/frontend/vm/modules/local/MathModule');
require('./js/frontend/vm/modules/local/MotorModule');
require('./js/frontend/vm/modules/local/ScreenModule');
require('./js/frontend/vm/modules/local/SensorModule');
require('./js/frontend/vm/modules/local/SoundModule');
require('./js/frontend/vm/modules/local/StandardModule');
require('./js/frontend/vm/modules/local/SystemModule');
require('./js/frontend/vm/modules/local/StringModule');
require('./js/frontend/vm/modules/local/BitModule');
require('./js/frontend/vm/modules/local/DeviceModule');
require('./js/frontend/vm/modules/local/PoweredUpModule');
require('./js/frontend/vm/modules/local/MultiplexerModule');
require('./js/frontend/vm/modules/local/PspModule');
require('./js/frontend/vm/modules/local/components/ComponentFormModule');
require('./js/frontend/vm/modules/local/components/ComponentButtonModule');
require('./js/frontend/vm/modules/local/components/ComponentCheckboxModule');
require('./js/frontend/vm/modules/local/components/ComponentLabelModule');
require('./js/frontend/vm/modules/local/components/ComponentSelectButtonModule');
require('./js/frontend/vm/modules/local/components/ComponentStatusLightModule');
require('./js/frontend/vm/modules/local/components/ComponentPanelModule');
require('./js/frontend/vm/modules/local/components/ComponentTabsModule');
require('./js/frontend/vm/modules/local/components/ComponentRectangleModule');
require('./js/frontend/vm/modules/local/components/ComponentCircleModule');
require('./js/frontend/vm/modules/local/components/ComponentImageModule');
require('./js/frontend/vm/modules/local/components/ComponentPUDeviceModule');
require('./js/frontend/vm/modules/local/components/ComponentEV3MotorModule');
require('./js/frontend/vm/modules/local/components/ComponentEV3SensorModule');
require('./js/frontend/vm/BasicLayerState');
require('./js/frontend/vm/ev3/LayerState');
require('./js/frontend/vm/poweredup/LayerState');
require('./js/frontend/vm/modules/remote/ButtonModule');
require('./js/frontend/vm/modules/remote/FileModule');
require('./js/frontend/vm/modules/remote/LightModule');
require('./js/frontend/vm/modules/remote/MathModule');
require('./js/frontend/vm/modules/remote/MotorModule');
require('./js/frontend/vm/modules/remote/ScreenModule');
require('./js/frontend/vm/modules/remote/SensorModule');
require('./js/frontend/vm/modules/remote/SoundModule');
require('./js/frontend/vm/modules/remote/StandardModule');
require('./js/frontend/vm/modules/remote/SystemModule');
require('./js/frontend/vm/modules/remote/StringModule');
require('./js/frontend/vm/modules/remote/BitModule');
require('./js/frontend/vm/modules/remote/DeviceModule');
require('./js/frontend/vm/modules/remote/PoweredUpModule');
require('./js/frontend/vm/modules/remote/MultiplexerModule');
require('./js/frontend/vm/modules/remote/PspModule');
require('./js/frontend/vm/VMData');
require('./js/frontend/vm/VM');
require('./js/frontend/lib/dataprovider/HttpDataProvider');
require('./js/frontend/lib/dataprovider/ElectronDataProvider');
require('./js/frontend/lib/dataprovider/dataProvider');
require('./js/frontend/lib/components/Component');
require('./js/frontend/lib/components/ComponentContainer');
require('./js/frontend/lib/components/ContextMenu');
require('./js/frontend/lib/components/Tabs');
require('./js/frontend/lib/components/TabPanel');
require('./js/frontend/lib/components/Panel');
require('./js/frontend/lib/components/Dialog');
require('./js/frontend/lib/components/MainMenuItem');
require('./js/frontend/lib/components/MainMenu');
require('./js/frontend/lib/components/Menu');
require('./js/frontend/lib/components/Label');
require('./js/frontend/lib/components/Button');
require('./js/frontend/lib/components/StatusLight');
require('./js/frontend/lib/components/Resizer');
require('./js/frontend/lib/components/Dropdown');
require('./js/frontend/lib/components/CloseButton');
require('./js/frontend/lib/components/IconSelect');
require('./js/frontend/lib/components/TextInput');
require('./js/frontend/lib/components/Checkbox');
require('./js/frontend/lib/components/CheckboxAndLabel');
require('./js/frontend/lib/components/Radio');
require('./js/frontend/lib/components/Slider');
require('./js/frontend/lib/components/Toolbar');
require('./js/frontend/lib/components/ToolOptions');
require('./js/frontend/lib/components/Hint');
require('./js/frontend/lib/components/Rectangle');
require('./js/frontend/lib/components/Circle');
require('./js/frontend/lib/components/Image');
require('./js/frontend/lib/components/io/BasicIODevice');
require('./js/frontend/lib/components/io/PoweredUpDevice');
require('./js/frontend/lib/components/io/EV3Motor');
require('./js/frontend/lib/components/io/EV3Sensor');
require('./js/frontend/lib/components/files/File');
require('./js/frontend/lib/components/files/FileDetail');
require('./js/frontend/lib/components/files/Files');
require('./js/frontend/lib/components/filetree/Item');
require('./js/frontend/lib/components/filetree/File');
require('./js/frontend/lib/components/filetree/Directory');
require('./js/frontend/lib/components/filetree/FileTree');
require('./js/frontend/lib/components/tree/TreeNode');
require('./js/frontend/lib/components/tree/Tree');
require('./js/frontend/lib/components/list/ListItem');
require('./js/frontend/lib/components/list/List');
require('./js/frontend/lib/components/basic/A');
require('./js/frontend/lib/components/basic/Span');
require('./js/frontend/lib/components/basic/H');
require('./js/frontend/lib/components/basic/P');
require('./js/frontend/lib/components/basic/Hr');
require('./js/frontend/lib/components/basic/Pre');
require('./js/frontend/lib/components/basic/Table');
require('./js/frontend/lib/components/basic/Ul');
require('./js/frontend/lib/components/basic/Img');
require('./js/frontend/lib/directoryWatcher');
require('./js/frontend/lib/fileDropHandler');
require('./js/frontend/ide/data/images');
// Don't load, only loaded in setup when needed: require('./js/frontend/ide/data/templates');
require('./js/frontend/ide/data/texts');
require('./js/frontend/ide/tabIndex');
require('./js/frontend/ide/plugins/pluginUuid');
require('./js/frontend/ide/help/components/IndexList');
require('./js/frontend/ide/help/components/IndexListText');
require('./js/frontend/ide/help/woc/FileProcessor');
require('./js/frontend/ide/help/woc/SubjectFileProcessor');
require('./js/frontend/ide/help/woc/WhlFileProcessor');
require('./js/frontend/ide/help/woc/WocFileProcessor');
require('./js/frontend/ide/help/woc/Woc');
require('./js/frontend/ide/help/woc/WheelSyntax');
require('./js/frontend/ide/help/helpData');
require('./js/frontend/ide/help/HelpBuilder');
require('./js/frontend/ide/help/HelpBuilderText');
require('./js/frontend/ide/dialogs/AlertDialog');
require('./js/frontend/ide/dialogs/settings/components/Updater');
require('./js/frontend/ide/dialogs/settings/SettingsDialog');
require('./js/frontend/ide/dialogs/hint/HintDialog');
require('./js/frontend/ide/dialogs/hint/WelcomeHintDialog');
require('./js/frontend/ide/dialogs/ConfirmDialog');
require('./js/frontend/ide/dialogs/ExploreDialog');
require('./js/frontend/ide/dialogs/list/components/ListItem');
require('./js/frontend/ide/dialogs/list/ListDialog');
require('./js/frontend/ide/dialogs/list/EV3ConnectListDialog');
require('./js/frontend/ide/dialogs/list/PoweredUpConnectListDialog');
require('./js/frontend/ide/dialogs/statistics/StatisticsDialog');
require('./js/frontend/ide/dialogs/YesNoCancelDialog');
require('./js/frontend/ide/dialogs/file/components/IncludeFiles');
require('./js/frontend/ide/dialogs/file/FileDialog');
require('./js/frontend/ide/dialogs/file/FileNewDialog');
require('./js/frontend/ide/dialogs/file/FileRenameDialog');
require('./js/frontend/ide/dialogs/image/components/ImagePreview');
require('./js/frontend/ide/dialogs/image/components/Step');
require('./js/frontend/ide/dialogs/image/components/StepSelect');
require('./js/frontend/ide/dialogs/image/components/StepScale');
require('./js/frontend/ide/dialogs/image/components/StepContrast');
require('./js/frontend/ide/dialogs/image/components/StepFilename');
require('./js/frontend/ide/dialogs/image/ImageDialog');
require('./js/frontend/ide/dialogs/image/ImageNewDialog');
require('./js/frontend/ide/dialogs/image/ImageResizeDialog');
require('./js/frontend/ide/dialogs/image/ImageLoadDialog');
require('./js/frontend/ide/dialogs/form/ComponentFormContainer.js');
require('./js/frontend/ide/dialogs/form/FormSizeDialog');
require('./js/frontend/ide/dialogs/form/FormNewDialog');
require('./js/frontend/ide/dialogs/form/FormDialog');
require('./js/frontend/ide/dialogs/form/FormGridSizeDialog');
require('./js/frontend/ide/dialogs/VolumeDialog');
require('./js/frontend/ide/dialogs/help/components/WocFileLoader');
require('./js/frontend/ide/dialogs/help/HelpDialog');
require('./js/frontend/ide/dialogs/directcontrol/components/Motor');
require('./js/frontend/ide/dialogs/directcontrol/components/MotorAlias');
require('./js/frontend/ide/dialogs/directcontrol/components/Motors');
require('./js/frontend/ide/dialogs/directcontrol/components/PianoKey');
require('./js/frontend/ide/dialogs/directcontrol/components/Piano');
require('./js/frontend/ide/dialogs/directcontrol/DirectControlDialog');
require('./js/frontend/ide/dialogs/directcontrol/EV3ControlDialog');
require('./js/frontend/ide/dialogs/directcontrol/PoweredUpControlDialog');
require('./js/frontend/ide/dialogs/DaisyChainDialog');
require('./js/frontend/ide/dialogs/LicenseDialog');
require('./js/frontend/ide/dialogs/directory/DirectoryNewDialog');
require('./js/frontend/ide/dialogs/ReplaceDialog');
require('./js/frontend/ide/dialogs/download/components/ResourceLine');
require('./js/frontend/ide/dialogs/download/DownloadDialog');
require('./js/frontend/ide/dialogs/GraphDialog');
require('./js/frontend/ide/dialogs/device/DeviceAliasDialog');
require('./js/frontend/ide/dialogs/device/DevicePortAliasDialog');
require('./js/frontend/ide/dialogs/device/DeviceCountDialog');
require('./js/frontend/ide/menu/HelpOption');
require('./js/frontend/ide/menu/MainMenu');
require('./js/frontend/ide/editor/editors/Clipboard');
require('./js/frontend/ide/editor/editors/Editor');
require('./js/frontend/ide/editor/editors/home/HomeScreenTile');
require('./js/frontend/ide/editor/editors/home/HomeScreenConnectEV3Tile');
require('./js/frontend/ide/editor/editors/home/HomeScreenConnectPoweredUpTile');
require('./js/frontend/ide/editor/editors/home/HomeScreenRecentProjectTile');
require('./js/frontend/ide/editor/editors/home/HomeScreenThemeTile');
require('./js/frontend/ide/editor/editors/home/HomeScreen');
require('./js/frontend/ide/editor/editors/text/toolbar/BluetoothState');
require('./js/frontend/ide/editor/editors/text/toolbar/ToolbarBottom');
require('./js/frontend/ide/editor/editors/text/toolbar/ToolbarBottomViewer');
require('./js/frontend/ide/editor/editors/text/VMViewer');
require('./js/frontend/ide/editor/editors/text/WheelEditorState');
require('./js/frontend/ide/editor/editors/text/WheelEditor');
require('./js/frontend/ide/editor/editors/text/TextEditor');
require('./js/frontend/ide/editor/editors/image/text/Text');
require('./js/frontend/ide/editor/editors/image/text/TextLarge');
require('./js/frontend/ide/editor/editors/image/text/TextMedium');
require('./js/frontend/ide/editor/editors/image/text/TextSmall');
require('./js/frontend/ide/editor/editors/image/toolbar/ToolbarTop');
require('./js/frontend/ide/editor/editors/image/toolbar/ToolbarBottom');
require('./js/frontend/ide/editor/editors/image/Image');
require('./js/frontend/ide/editor/editors/image/Grid');
require('./js/frontend/ide/editor/editors/image/selection/Selection');
require('./js/frontend/ide/editor/editors/image/selection/SelectionCopy');
require('./js/frontend/ide/editor/editors/image/selection/SelectionText');
require('./js/frontend/ide/editor/editors/image/ImageLoader');
require('./js/frontend/ide/editor/editors/image/ImageEditorState');
require('./js/frontend/ide/editor/editors/image/ImageEditor');
require('./js/frontend/ide/editor/editors/sound/toolbar/ToolbarTop');
require('./js/frontend/ide/editor/editors/sound/toolbar/ToolbarBottom');
require('./js/frontend/ide/editor/editors/sound/SoundLoader');
require('./js/frontend/ide/editor/editors/sound/SoundEditorState');
require('./js/frontend/ide/editor/editors/sound/SoundEditor');
require('./js/frontend/ide/editor/editors/form/toolbar/ToolbarTop');
require('./js/frontend/ide/editor/editors/form/toolbar/ToolbarBottom');
require('./js/frontend/ide/editor/editors/form/SourceBuilder');
require('./js/frontend/ide/editor/editors/form/ComponentBuilder');
require('./js/frontend/ide/editor/editors/form/formEditorConstants');
require('./js/frontend/ide/editor/editors/form/FormComponentContainer');
require('./js/frontend/ide/editor/editors/form/FormComponent');
require('./js/frontend/ide/editor/editors/form/state/ComponentList');
require('./js/frontend/ide/editor/editors/form/state/EventList');
require('./js/frontend/ide/editor/editors/form/state/PropertyList');
require('./js/frontend/ide/editor/editors/form/state/UndoStack');
require('./js/frontend/ide/editor/editors/form/state/FormEditorState');
require('./js/frontend/ide/editor/editors/form/FormEditor');
require('./js/frontend/ide/editor/Editors');
require('./js/frontend/ide/editor/EditorsState');
require('./js/frontend/ide/editor/Editor');
require('./js/frontend/ide/console/spans');
require('./js/frontend/ide/console/components/VarView');
require('./js/frontend/ide/console/components/VarViewNumber');
require('./js/frontend/ide/console/components/VarViewString');
require('./js/frontend/ide/console/components/VarViewRecord');
require('./js/frontend/ide/console/tree/ArrayTreeBuilder');
require('./js/frontend/ide/console/tree/RecordTreeBuilder');
require('./js/frontend/ide/console/Vars');
require('./js/frontend/ide/console/Registers');
require('./js/frontend/ide/console/Log');
require('./js/frontend/ide/console/Terminal');
require('./js/frontend/ide/console/NewVersion');
require('./js/frontend/ide/console/Console');
require('./js/frontend/ide/properties/PropertiesToolbar');
require('./js/frontend/ide/properties/Property');
require('./js/frontend/ide/properties/Event');
require('./js/frontend/ide/properties/types/BooleanProperty');
require('./js/frontend/ide/properties/types/DropdownProperty');
require('./js/frontend/ide/properties/types/HAlignProperty');
require('./js/frontend/ide/properties/types/ColorProperty');
require('./js/frontend/ide/properties/types/TextProperty');
require('./js/frontend/ide/properties/types/TextListProperty');
require('./js/frontend/ide/properties/types/RgbProperty');
require('./js/frontend/ide/properties/Properties');
require('./js/frontend/ide/simulator/SimulatorToolbar');
require('./js/frontend/ide/simulator/SimulatorModules');
require('./js/frontend/ide/plugins/simulator/lib/SimulatorPlugin');
require('./js/frontend/ide/plugins/simulator/lib/motor/io/BasicIOState');
require('./js/frontend/ide/plugins/simulator/lib/motor/io/BasicIODevice');
require('./js/frontend/ide/plugins/simulator/lib/motor/io/Motor');
require('./js/frontend/ide/plugins/simulator/lib/motor/Plugin');
require('./js/frontend/ide/plugins/simulator/ev3/io/text/Text');
require('./js/frontend/ide/plugins/simulator/ev3/io/text/TextLarge');
require('./js/frontend/ide/plugins/simulator/ev3/io/text/TextMedium');
require('./js/frontend/ide/plugins/simulator/ev3/io/text/TextSmall');
require('./js/frontend/ide/plugins/simulator/ev3/io/Light');
require('./js/frontend/ide/plugins/simulator/ev3/io/Sound');
require('./js/frontend/ide/plugins/simulator/ev3/io/Button');
require('./js/frontend/ide/plugins/simulator/ev3/io/Buttons');
require('./js/frontend/ide/plugins/simulator/ev3/io/Display');
require('./js/frontend/ide/plugins/simulator/ev3/Plugin');
require('./js/frontend/ide/plugins/simulator/ev3motors/io/MotorState');
require('./js/frontend/ide/plugins/simulator/ev3motors/io/Motor');
require('./js/frontend/ide/plugins/simulator/ev3motors/Plugin');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/Sensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/UnknownSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/ColorSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/GyroSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/InfraredSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/SoundSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/TouchSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/UltrasonicSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/io/MultiplexerSensor');
require('./js/frontend/ide/plugins/simulator/ev3sensors/SensorContainer');
require('./js/frontend/ide/plugins/simulator/ev3sensors/Plugin');
require('./js/frontend/ide/plugins/simulator/psp/Plugin'),
require('./js/frontend/ide/plugins/simulator/poweredup/io/MotorOrSensorState');
require('./js/frontend/ide/plugins/simulator/poweredup/io/MotorOrSensor');
require('./js/frontend/ide/plugins/simulator/poweredup/io/SimulatedLayerDevice');
require('./js/frontend/ide/plugins/simulator/poweredup/io/SimulatedDevices');
require('./js/frontend/ide/plugins/simulator/poweredup/components/BasicHub');
require('./js/frontend/ide/plugins/simulator/poweredup/components/TechnicHub');
require('./js/frontend/ide/plugins/simulator/poweredup/components/Hub');
require('./js/frontend/ide/plugins/simulator/poweredup/components/MoveHub');
require('./js/frontend/ide/plugins/simulator/poweredup/components/Remote');
require('./js/frontend/ide/plugins/simulator/poweredup/Plugin');
require('./js/frontend/ide/plugins/simulator/graph/io/CircularBuffer'),
require('./js/frontend/ide/plugins/simulator/graph/io/BarChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/io/BinaryChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/io/ColorBarChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/io/FillChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/io/LineChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/io/PointChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/io/SplineChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/io/ChartDrawer'),
require('./js/frontend/ide/plugins/simulator/graph/Plugin'),
require('./js/frontend/ide/simulator/Simulator');
require('./js/frontend/ide/CompileAndRun');
require('./js/frontend/ide/CompileAndRunOutput');
require('./js/frontend/ide/CompileAndRunInstall');
require('./js/frontend/ide/settings/PluginsState');
require('./js/frontend/vm/BasicDeviceState');
const Setup          = require('./js/frontend/ide/Setup').Setup;
const IDE            = require('./js/frontend/ide/IDE').IDE;
const SettingsState  = require('./js/frontend/ide/settings/SettingsState').SettingsState;
const UIState        = require('./js/frontend/lib/UIState').UIState;
const EV3State       = require('./js/frontend/vm/ev3/EV3State').EV3State;
const PoweredUpState = require('./js/frontend/vm/poweredup/PoweredUpState').PoweredUpState;

(function() {
    let settings;
    let ui;
    let ide   = null;
    let setup = null;

    const onFinishedSetup = function() {
            if (ide) {
                return;
            }
            ide = new IDE({
                ui:        ui,
                settings:  settings,
                ev3:       new EV3State({layerCount: settings.getDaisyChainMode()}),
                poweredUp: new PoweredUpState({layerCount: settings.getDaisyChainMode()})
            });
        };

    const onLoadedSettings = function() {
            if (setup) {
                return;
            }
            require('./js/frontend/lib/path').setSep(settings.getOS().pathSep);
            setup = new Setup({
                ui:         ui,
                settings:   settings,
                onFinished: onFinishedSetup
            });
        };

    const loadDocumentPath = function() {
            const ipcRenderer = require('electron').ipcRenderer;
            ipcRenderer.on(
                'postMessage',
                function(event, arg) {
                    let data;
                    try {
                        data = JSON.parse(arg);
                    } catch (error) {
                        data = {};
                    }
                    if (data.message === 'documentPath') {
                        const getDataProvider = require('./js/frontend/lib/dataprovider/dataProvider').getDataProvider;
                        ui       = new UIState();
                        settings = new SettingsState({
                            getDataProvider:  getDataProvider,
                            userDocumentPath: data.data,
                            isPackaged:       data.isPackaged
                        });
                        settings.load(onLoadedSettings);
                    }
                }
            );
            ipcRenderer.send('postMessage', {command: 'documentPath'});
        };

    const onDOMContentLoaded = function() {
            loadDocumentPath();
        };

    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
})();
