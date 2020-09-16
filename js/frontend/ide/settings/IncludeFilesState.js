/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform   = require('../../lib/platform');
const dispatcher = require('../../lib/dispatcher').dispatcher;
const Emitter    = require('../../lib/Emitter').Emitter;

exports.IncludeFilesState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._settings     = opts.settings;
        this._includeFiles = this.getDefaultIncludeFiles();
        dispatcher
            .on('Settings.Set.IncludeFileDefaults',     this, this._setIncludeFileDefaults)
            .on('Settings.Set.IncludeFileByIndex',      this, this._setIncludeFileByIndex)
            .on('Settings.Set.IncludeFileUp',           this, this._setIncludeFileUp)
            .on('Settings.Set.IncludeFileDown',         this, this._setIncludeFileDown)
            .on('Settings.Set.IncludeFile.File',        this, this._setIncludeFileFile)
            .on('Settings.Set.IncludeFile.Description', this, this._setIncludeFileDescription)
            .on('Settings.Add.IncludeFile',             this, this._addIncludeFile);
    }

    getDefaultIncludeFiles() {
        return [
            {file: 'lib/bit.whl',      type: 'General', description: 'Binary operations like `and` and `or`'},
            {file: 'lib/button.whl',   type: 'EV3',     description: 'Read EV3 buttons'},
            {file: 'lib/file.whl',     type: 'EV3',     description: 'Read and write files'},
            {file: 'lib/light.whl',    type: 'EV3',     description: 'Control the EV3 light'},
            {file: 'lib/math.whl',     type: 'General', description: 'Math functions: `round`, `sin`, etc...'},
            {file: 'lib/motor.whl',    type: 'General', description: 'Control motors'},
            {file: 'lib/screen.whl',   type: 'EV3',     description: 'Drawing functions'},
            {file: 'lib/sensor.whl',   type: 'General', description: 'Read sensors'},
            {file: 'lib/sound.whl',    type: 'EV3',     description: 'Play tones and samples'},
            {file: 'lib/standard.whl', type: 'General', description: 'Standard functions'},
            {file: 'lib/string.whl',   type: 'General', description: 'String functions'},
            {file: 'lib/system.whl',   type: 'EV3',     description: 'Access to EV3 system functions'}
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
        let includeFiles = this._includeFiles;
        includeFiles.length = 0;
        data.forEach(function(includeFile) {
            if (('file' in includeFile) && ('description' in includeFile)) {
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

    _setIncludeFileDefaults() {
        this._includeFiles = this.getDefaultIncludeFiles();
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _setIncludeFileByIndex(includeFile, index) {
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

    _setIncludeFileUp(index) {
        let includeFiles = this._includeFiles;
        let includeFile  = includeFiles[index];
        includeFiles[index    ] = includeFiles[index - 1];
        includeFiles[index - 1] = includeFile;
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _setIncludeFileDown(index) {
        let includeFiles = this._includeFiles;
        let includeFile  = includeFiles[index];
        includeFiles[index    ] = includeFiles[index + 1];
        includeFiles[index + 1] = includeFile;
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    _setIncludeFileFile(opts) {
        this._includeFiles[opts.index].file = opts.file;
        this._settings.save();
    }

    _setIncludeFileDescription(opts) {
        this._includeFiles[opts.index].description = opts.description;
        this._settings.save();
    }

    _addIncludeFile() {
        let includeFiles = this._includeFiles;
        includeFiles.push({
            file:        'include' + includeFiles.length + '.whl',
            description: 'Description (' + includeFiles.length + ')'
        });
        this._settings
            .save()
            .emit('Settings.IncludeFiles');
    }

    toJSON() {
        return Object.assign([], this._includeFiles);
    }
};
