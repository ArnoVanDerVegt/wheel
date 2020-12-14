/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../lib/dispatcher').dispatcher;
const path                = require('../../lib/path');
const formEditorConstants = require('../editor/editors/form/formEditorConstants');
const sourceBuilderUtils  = require('./sourceBuilderUtils');

exports.SourceBuilder = class {
    constructor(opts) {
        this._settings             = opts.settings;
        this._lines                = [];
        this._compilerDatabase     = null;
        this._preProcessorDatabase = null;
        this._events   = [
            dispatcher.on('Compiler.Database',     this, this.onCompilerDatabase),
            dispatcher.on('PreProcessor.Database', this, this.onPreProcessorDatabase)
        ];
    }

    remove() {
        while (this._events.length) {
            this._events.pop()();
        }
    }

    setSource(source) {
        this._lines = source.split('\n');
        return this;
    }

    getSource() {
        return sourceBuilderUtils.removeDuplicateEmptyLines(this._lines).join('\n');
    }

    generateSourceFromFormData(data) {
        this._lines = sourceBuilderUtils.generateSourceFromComponents({
            components:          data.components,
            project:             data.project,
            createEventComments: this._settings.getCreateEventComments()
        });
        return this;
    }

    generateEventProc(componentName, componentType, eventType, procName) {
        return sourceBuilderUtils.generateEventProc({
            database:      this._compilerDatabase,
            componentName: componentName,
            componentType: componentType,
            eventType:     eventType,
            procName:      procName
        });
    }

    generateEventsFromComponents(components) {
        let lines      = this._lines;
        let procedures = sourceBuilderUtils.findProcedures(lines);
        const insertProc = (proc, procLines) => {
                if (!procLines.length) {
                    return;
                }
                sourceBuilderUtils.insertProc(lines, procedures, proc, procLines);
                procedures = sourceBuilderUtils.findProcedures(lines);
            };
        components.forEach((component) => {
            for (let i in component) {
                let value = component[i];
                if ((i.substr(0, 2) === 'on') && value && !sourceBuilderUtils.findProcedure(procedures, value)) {
                    insertProc(value, this.generateEventProc(component.name, component.type, i, value));
                }
            }
        });
    }

    generateUpdatedSource(opts) {
        let lines = this._lines;
        sourceBuilderUtils.updateLinesWithIncludes(lines, opts);
        this.generateEventsFromComponents(opts.components);
        let formName       = sourceBuilderUtils.getFormNameFromComponents(opts.components);
        let defines        = sourceBuilderUtils.generateDefinesFromComponents(formName, opts.components, this._preProcessorDatabase);
        let insertPosition = sourceBuilderUtils.removeExistingDefines({lines: lines, defines: defines});
        if (insertPosition === -1) {
            defines.list.forEach((define) => {
                lines.push(define.line);
            });
        } else {
            if (insertPosition > lines.length) {
                lines.push('');
            }
            defines.list.reverse();
            defines.list.forEach((define) => {
                lines.splice(insertPosition, 0, define.line);
            });
        }
        let i = insertPosition + defines.list.length;
        if ((i < lines.length) && (lines[i].trim() !== '')) {
            lines.splice(i, 0, '');
        }
        return this;
    }

    deleteComponent(opts) {
        opts.lines = this._lines;
        sourceBuilderUtils.deleteComponent(opts);
        return this;
    }

    updateEventNames(opts) {
        if (!opts.renameEvents.length) {
            return this;
        }
        opts.lines = this._lines;
        sourceBuilderUtils.updateEventNames(opts);
        return this;
    }

    updateFormNameAndRemoveDefines(opts) {
        opts.lines = this._lines;
        sourceBuilderUtils.updateFormNameAndRemoveDefines(opts);
        return this;
    }

    updateComponentName(opts) {
        opts.lines = this._lines;
        sourceBuilderUtils.updateComponentName(opts);
        return this;
    }

    /**
     * Add a new component uid to the defines in the source...
    **/
    updateComponents(opts) {
        return this.generateUpdatedSource(opts);
    }

    onCompilerDatabase(compilerDatabase) {
        this._compilerDatabase = compilerDatabase;
    }

    onPreProcessorDatabase(preProcessorDatabase) {
        this._preProcessorDatabase = preProcessorDatabase;
    }
};
