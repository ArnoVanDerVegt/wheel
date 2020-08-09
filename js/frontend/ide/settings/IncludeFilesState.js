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
            {file: 'lib/bit.whl',      description: 'Binary operations like `and` and `or`'},
            {file: 'lib/button.whl',   description: 'Read EV3 buttons'},
            {file: 'lib/file.whl',     description: 'Read and write files'},
            {file: 'lib/light.whl',    description: 'Control the EV3 light'},
            {file: 'lib/math.whl',     description: 'Math functions: `round`, `sin`, etc...'},
            {file: 'lib/motor.whl',    description: 'Control motors'},
            {file: 'lib/screen.whl',   description: 'Drawing functions'},
            {file: 'lib/sensor.whl',   description: 'Read sensors'},
            {file: 'lib/sound.whl',    description: 'Play tones and samples'},
            {file: 'lib/standard.whl', description: 'Standard functions'},
            {file: 'lib/string.whl',   description: 'String functions'},
            {file: 'lib/system.whl',   description: 'Access to EV3 system functions'}
        ];
    }

    getIncludeFiles() {
        return JSON.parse(JSON.stringify(this._includeFiles));
    }

    load(data) {
        if (!data || !data.length) {
            this.loadDefaults();
            return;
        }
        let includeFiles = this._includeFiles;
        includeFiles.length = 0;
        data.forEach(function(includeFile) {
            if (('file' in includeFile) && ('description' in includeFile)) {
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
