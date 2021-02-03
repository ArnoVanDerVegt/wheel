/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform   = require('../../../shared/lib/platform');
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Emitter    = require('../../lib/Emitter').Emitter;

const INCLUDE_FILE_TYPE_GENERAL = 'General';
const INCLUDE_FILE_TYPE_EV3     = 'EV3';

exports.INCLUDE_FILE_TYPE_GENERAL = INCLUDE_FILE_TYPE_GENERAL;
exports.INCLUDE_FILE_TYPE_EV3     = INCLUDE_FILE_TYPE_EV3;

exports.IncludeFilesState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._settings     = opts.settings;
        this._includeFiles = this.getDefaultIncludeFiles();
        dispatcher
            .on('Settings.IncludeFile.SetDefaults',    this, this._setDefaults)
            .on('Settings.IncludeFile.SetByIndex',     this, this._setByIndex)
            .on('Settings.IncludeFile.SetUp',          this, this._setUp)
            .on('Settings.IncludeFile.SetDown',        this, this._setDown)
            .on('Settings.IncludeFile.SetFile',        this, this._setFile)
            .on('Settings.IncludeFile.SetDescription', this, this._setDescription)
            .on('Settings.IncludeFile.Add',            this, this._add)
            .on('Settings.IncludeFile.Delete',         this, this._delete);
    }

    getDefaultIncludeFiles() {
        return [
            {file: 'lib/modules/bit.whl',      type: INCLUDE_FILE_TYPE_GENERAL, description: 'Binary operations like `and` and `or`'},
            {file: 'lib/modules/button.whl',   type: INCLUDE_FILE_TYPE_EV3,     description: 'Read EV3 buttons'},
            {file: 'lib/modules/file.whl',     type: INCLUDE_FILE_TYPE_EV3,     description: 'Read and write files'},
            {file: 'lib/modules/light.whl',    type: INCLUDE_FILE_TYPE_EV3,     description: 'Control the EV3 light'},
            {file: 'lib/modules/math.whl',     type: INCLUDE_FILE_TYPE_GENERAL, description: 'Math functions: `round`, `sin`, etc...'},
            {file: 'lib/modules/motor.whl',    type: INCLUDE_FILE_TYPE_GENERAL, description: 'Control motors'},
            {file: 'lib/modules/screen.whl',   type: INCLUDE_FILE_TYPE_EV3,     description: 'Drawing functions'},
            {file: 'lib/modules/sensor.whl',   type: INCLUDE_FILE_TYPE_GENERAL, description: 'Read sensors'},
            {file: 'lib/modules/sound.whl',    type: INCLUDE_FILE_TYPE_EV3,     description: 'Play tones and samples'},
            {file: 'lib/modules/standard.whl', type: INCLUDE_FILE_TYPE_GENERAL, description: 'Standard functions'},
            {file: 'lib/modules/string.whl',   type: INCLUDE_FILE_TYPE_GENERAL, description: 'String functions'},
            {file: 'lib/modules/system.whl',   type: INCLUDE_FILE_TYPE_EV3,     description: 'Access to EV3 system functions'}
        ];
    }

    getIncludeFiles(types) {
        if (!types) {
            return JSON.parse(JSON.stringify(this._includeFiles));
        }
        let result = [];
        this._includeFiles.forEach((includeFile) => {
            if (includeFile.type === undefined) {
                result.push(JSON.parse(JSON.stringify(includeFile)));
            } else {
                for (let i = 0; i < types.length; i++) {
                    if (includeFile.type.indexOf(types[i]) !== -1) {
                        result.push(JSON.parse(JSON.stringify(includeFile)));
                        break;
                    }
                }
            }
        });
        return result;
    }

    load(data) {
        if (!data || !data.length) {
            this.loadDefaults();
            return;
        }
        let includeFileByFile = {};
        this.getDefaultIncludeFiles().forEach((includeFile) => {
            includeFileByFile[includeFile.file] = includeFile;
        });
        this.loadDefaults();
        let includeFiles             = this._includeFiles;
        let defaultIncludeFileByFile = {};
        this.getDefaultIncludeFiles().forEach((includeFile) => {
            defaultIncludeFileByFile[includeFile.file] = includeFile;
        });
        data.forEach(function(includeFile) {
            if (('file' in includeFile) && ('description' in includeFile)) {
                if (includeFile.file in defaultIncludeFileByFile) {
                    return;
                }
                if (includeFileByFile[includeFile.file]) {
                    includeFile.type = includeFileByFile[includeFile.file].type;
                }
                includeFiles.push(Object.assign({}, includeFile));
            }
        });
    }

    loadDefaults() {
        this._includeFiles = this.getDefaultIncludeFiles();
    }

    _setDefaults() {
        this._includeFiles = this.getDefaultIncludeFiles();
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _setByIndex(includeFile, index) {
        let includeFiles = this._includeFiles;
        if ((index >= 0) && (index < includeFiles.length)) {
            includeFiles[index].file        = includeFile.file;
            includeFiles[index].type        = includeFile.type;
            includeFiles[index].description = includeFile.description;
        }
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _setUp(index) {
        let includeFiles = this._includeFiles;
        let includeFile  = includeFiles[index];
        includeFiles[index    ] = includeFiles[index - 1];
        includeFiles[index - 1] = includeFile;
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _setDown(index) {
        let includeFiles = this._includeFiles;
        let includeFile  = includeFiles[index];
        includeFiles[index    ] = includeFiles[index + 1];
        includeFiles[index + 1] = includeFile;
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _setFile(opts) {
        this._includeFiles[opts.index].file = opts.file;
        this._settings.save();
    }

    _setDescription(opts) {
        this._includeFiles[opts.index].description = opts.description;
        this._settings.save();
    }

    _add() {
        let includeFiles = this._includeFiles;
        includeFiles.push({
            file:        'include' + includeFiles.length + '.whl',
            description: 'Description (' + includeFiles.length + ')'
        });
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _delete(index) {
        let includeFiles = this._includeFiles;
        for (let i = index; i < includeFiles.length - 1; i++) {
            includeFiles[i] = includeFiles[i + 1];
        }
        includeFiles.pop();
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    toJSON() {
        return Object.assign([], this._includeFiles);
    }
};
