/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getDataProvider = require('../lib/dataprovider/dataProvider').getDataProvider;
const dispatcher      = require('../lib/dispatcher').dispatcher;
const path            = require('../lib/path');
const Log             = require('./console/Log');
const Console         = require('./console/Console');

exports.CompileAndRunOutput = class {
    constructor(opts) {
        this._settings = opts.settings;
    }

    setProjectFilename(projectFilename) {
        this._projectFilename = projectFilename;
        return this;
    }

    setPreProcessor(preProcessor) {
        this._preProcessor = preProcessor;
        return this;
    }

    setSimulatorModules(simulatorModules) {
        this._simulatorModules = simulatorModules;
        return this;
    }

    onResourceData(resource, outputPath, filename, pathAndFilename, data) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            data = {success: false};
        }
        let resourceMessageId = this._resourceMessageId;
        if (!data.success) {
            dispatcher.dispatch(
                'Console.Log',
                {
                    type:            Console.MESSAGE_TYPE_ERROR,
                    parentMessageId: resourceMessageId,
                    message:         'Failed to load resource <i>' + filename + '</i>'
                }
            );
            return;
        }
        let saveData = null;
        switch (path.getExtension(filename)) {
            case '.rgf':
                saveData = data.data;
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:            Console.MESSAGE_TYPE_INFO,
                        parentMessageId: resourceMessageId,
                        message:         'Loaded resource <i>' + filename + '</i>'
                    }
                );
                resource.setData(data.data.image);
                break;
            case '.rsf':
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:            Console.MESSAGE_TYPE_INFO,
                        parentMessageId: resourceMessageId,
                        message:         'Loaded resource <i>' + filename + '</i>'
                    }
                );
                resource.setData(data.data);
                break;
        }
        if (saveData === null) {
            return;
        }
        let documentPath = this._settings.getDocumentPath();
        getDataProvider().getData(
            'post',
            'ide/file-save',
            {
                filename: path.join(outputPath, pathAndFilename.filename),
                data:     saveData
            },
            function() {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:            Console.MESSAGE_TYPE_HINT,
                        parentMessageId: resourceMessageId,
                        message:         'Saved resource ' +
                            '<i>' + path.removePath(documentPath, path.join(outputPath, pathAndFilename.filename)) + '</i>'
                    }
                );
            }
        );
    }

    saveResource(outputPath, resource) {
        let documentPath    = this._settings.getDocumentPath();
        let filename        = resource.getFilename();
        let pathAndFilename = path.getPathAndFilename(filename);
        getDataProvider().getData(
            'get',
            'ide/file',
            {filename: path.join(documentPath, filename)},
            this.onResourceData.bind(this, resource, outputPath, filename, pathAndFilename)
        );
    }

    saveResources(outputPath, resources) {
        this._resourceMessageId = Log.getMessageId();
        let resourcesList = resources.getResources();
        if (resourcesList.length > 0) {
            dispatcher.dispatch(
                'Console.Log',
                {
                    type:      Console.MESSAGE_TYPE_INFO,
                    message:   'Processing ' + resourcesList.length + ' resource' + ((resourcesList.length > 1) ? 's' : ''),
                    messageId: this._resourceMessageId
                }
            );
        }
        let documentPath = this._settings.getDocumentPath();
        resourcesList.forEach(
            function(resource) {
                if (resource.canSave()) {
                    resource.getData((data) => {
                        if (data === null) {
                            this.saveResource(outputPath, resource);
                        }
                    });
                } else {
                    let pathAndFilename = path.getPathAndFilename(resource.getFilename());
                    dispatcher.dispatch(
                        'Console.Log',
                        {
                            type:            Console.MESSAGE_TYPE_INFO,
                            message:         'Processed resource ' +
                                                '<i>' + path.removePath(documentPath, path.join(outputPath, pathAndFilename.filename)) + '</i>',
                            parentMessageId: this._resourceMessageId
                        }
                    );
                }
            },
            this
        );
    }

    saveOutput(data) {
        let dataProvider    = getDataProvider();
        let pathAndFilename = path.getPathAndFilename(this._projectFilename);
        let filename        = path.replaceExtension(pathAndFilename.filename, '.rtf');
        let outputPath      = path.join(pathAndFilename.path, 'output');
        let outputFilename  = path.join(outputPath, filename);
        let resources       = this._preProcessor.getResources();
        this._outputPath = outputPath;
        dataProvider.getData(
            'post',
            'ide/path-create',
            {path: outputPath},
            function() {
                dataProvider.getData(
                    'post',
                    'ide/file-save',
                    {filename: outputFilename, data: data},
                    function() {
                        resources.save(outputPath);
                        dispatcher.dispatch('Compile.SaveOutput', outputFilename);
                    }
                );
            }
        );
        this.saveResources(outputPath, resources);
        this._simulatorModules.setResources(resources);
    }
};
