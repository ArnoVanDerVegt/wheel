/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../lib/dom').DOMNode;
const Hint       = require('../lib/components/Hint').Hint;
const FileTree   = require('../lib/components/filetree/FileTree').FileTree;
const getImage   = require('./data/images').getImage;
const tabIndex   = require('./tabIndex');
const Editor     = require('./editor/Editor').Editor;
const Console    = require('./console/Console').Console;
const MainMenu   = require('./menu/MainMenu').MainMenu;
const Simulator  = require('./simulator/Simulator').Simulator;
const Properties = require('./properties/Properties').Properties;
const IDEDialogs = require('./IDEDialogs').IDEDialogs;

exports.IDEDOM = class extends IDEDialogs {
    initDOM() {
        new DOMNode({}).create(
            document.body,
            {
                className: 'root',
                children: [
                    {
                        type:          MainMenu,
                        tabIndex:      tabIndex.MAIN_MENU,
                        getImage:      getImage,
                        ui:            this._ui,
                        settings:      this._settings,
                        platform:      this._settings.getOS().platform,
                        devices:       this._devices
                    },
                    {
                        type:          FileTree,
                        uiId:          1,
                        ui:            this._ui,
                        settings:      this._settings,
                        tabIndex:      tabIndex.FILE_TREE,
                        tabIndexClose: tabIndex.CLOSE_FILE_TREE,
                        getImage:      getImage
                    },
                    {
                        id:            (editor) => { this._editor = editor; },
                        type:          Editor,
                        ui:            this._ui,
                        settings:      this._settings,
                        devices:       this._devices,
                        editorsState:  this._editorsState
                    },
                    {
                        id:            (simulator) => { this._simulator = simulator; },
                        type:          Simulator,
                        ui:            this._ui,
                        devices:       this._devices,
                        settings:      this._settings,
                        onStop:        this.stop.bind(this)
                    },
                    {
                        type:          Properties,
                        ui:            this._ui,
                        settings:      this._settings
                    },
                    {
                        type:          Hint,
                        ui:            this._ui,
                        settings:      this._settings,
                        getImage:      getImage
                    },
                    {
                        type:          Console,
                        ui:            this._ui,
                        settings:      this._settings
                    }
                ]
            }
        );
        return this;
    }
};
