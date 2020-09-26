/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../shared/vm/modules/poweredUpModuleConstants');
const path                     = require('../../lib/path');
const formEditorConstants      = require('../editor/editors/form/formEditorConstants');

let deviceTypeConst = {};
deviceTypeConst[poweredUpModuleConstants.POWERED_UP_DEVICE_HUB        ] = 'POWERED_UP_HUB';
deviceTypeConst[poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB   ] = 'POWERED_UP_MOVE_HUB';
deviceTypeConst[poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB] = 'POWERED_UP_TECHNIC_HUB';
deviceTypeConst[poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE     ] = 'POWERED_UP_REMOTE_CONTROL';

let deviceTypeTitle = {};
deviceTypeTitle[poweredUpModuleConstants.POWERED_UP_DEVICE_HUB        ] = 'Hub';
deviceTypeTitle[poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB   ] = 'Move hub';
deviceTypeTitle[poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB] = 'Technic hub';
deviceTypeTitle[poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE     ] = 'Remote control';

let devicePortType = {};
devicePortType[poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR              ] = 'POWERED_UP_DEVICE_BASIC_MOTOR';
devicePortType[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR        ] = 'POWERED_UP_DEVICE_BOOST_TACHO_MOTOR';
devicePortType[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR ] = 'POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR';
devicePortType[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR] = 'POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR';
devicePortType[poweredUpModuleConstants.POWERED_UP_DEVICE_TRAIN_MOTOR              ] = 'POWERED_UP_DEVICE_TRAIN_MOTOR';
devicePortType[poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS               ] = 'POWERED_UP_DEVICE_LED_LIGHTS';
devicePortType[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE           ] = 'POWERED_UP_DEVICE_BOOST_DISTANCE';

exports.getProcNameFromFilename = (filename) => {
    let result = '';
    filename = path.replaceExtension(filename, '');
    for (let i = 0; i < filename.length; i++) {
        let c = filename[i];
        if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(c) !== -1) {
            result += c;
        }
    }
    if (result.length === 1) {
        return result.toUpperCase() + 'Form';
    }
    return result.substr(0, 1).toUpperCase() + result.substr(1 - result.length) + 'Form';
};

exports.getShowProcNameFromFormName = (formName) => {
    if (formName.length === 1) {
        formName = formName.toUpperCase();
    } else {
        formName = formName.substr(0, 1).toUpperCase() + formName.substr(1 - formName.length);
    }
    return 'show' + formName + 'Form';
};

exports.getFormCode = (filename) => {
    let pathAndFilename = path.getPathAndFilename(filename);
    let wfrmFilename    = path.replaceExtension(pathAndFilename.filename, '.wfrm');
    return [
        '',
        '#resource "' + wfrmFilename + '"',
        '',
        '; @proc                   Show the form.',
        '; @ret                    The handle to the form.',
        'proc show' + exports.getProcNameFromFilename(wfrmFilename) + '()',
        '    ret components.form.show("' + wfrmFilename + '")',
        'end',
        ''
    ];
};

exports.getConstantFromName = (name) => {
    if (name.toUpperCase() === name) {
        return name;
    }
    let result = name.substr(0, 1).toUpperCase();
    let j      = name.length - 1;
    for (let i = 1; i <= j; i++) {
        let c = name.substr(i, 1).toUpperCase();
        if (i < j) {
            if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(name.substr(i + 1, 1)) === -1) {
                result += c;
            } else {
                result += c + '_';
            }
        } else {
            result += c;
        }
    }
    return result;
};

exports.getFormNameFromComponents = (components) => {
    let formName = '';
    for (let i = 0; i < components.length; i++) {
        let component = components[i];
        if (component.type.toLowerCase() === formEditorConstants.COMPONENT_TYPE_FORM) {
            formName = component.name;
            let j = formName.indexOf('.');
            if (j !== -1) {
                formName = formName.substr(0, j);
            }
            break;
        }
    }
    return formName;
};

exports.getDefineInfo = (line) => {
    let i = line.indexOf('#define');
    if (i !== -1) {
        let s = line.substr(7, line.length - 7).trim();
        i = s.indexOf(' ');
        if (i !== -1) {
            return {key: s.substr(0, i).trim(), value: s.substr(i, s.length - i).trim()};
        }
    }
    return null;
};

exports.generateIncludesFromComponents = (components) => {
    let includes         = [];
    let propertiesByType = formEditorConstants.PROPERTIES_BY_TYPE;
    components.forEach((component) => {
        if (component.type.toUpperCase() in propertiesByType) {
            let include = propertiesByType[component.type.toUpperCase()].include;
            if (includes.indexOf(include) === -1) {
                includes.push(include);
            }
        }
    });
    includes.sort();
    return includes;
};

exports.updateLinesWithIncludes = (lines, opts) => {
    let currentIncludes = [];
    let lastIndex       = 0;
    let found           = false;
    lines.forEach((line, index) => {
        line = line.trim();
        if (line.indexOf('#include ') === 0) {
            let i = line.indexOf('"');
            let j = line.indexOf('"', i + 1);
            if ((i !== -1) && (j !== -1)) {
                currentIncludes.push(line.substr(i + 1, j - i - 1));
            }
            lastIndex = index;
            found     = true;
        }
    });
    if (!found && lines.length) {
        lastIndex++;
        lines.splice(lastIndex, 0, '');
    }
    let includes = exports.generateIncludesFromComponents(opts.components);
    includes.forEach((include) => {
        if (currentIncludes.indexOf(include) === -1) {
            lines.splice(lastIndex + 1, 0, '#include "' + include + '"');
        }
    });
};

const addIncludes = (lines, includeFiles) => {
        includeFiles.sort();
        for (let i = 0; i < includeFiles.length; i++) {
            lines.push('#include "' + includeFiles[i] + '"');
        }
    };

exports.removeDuplicateEmptyLines = (lines) => {
    let result = [];
    let empty  = false;
    let i      = 0;
    while (i < lines.length) {
        let line = lines[i++];
        if (line.trim() === '') {
            if (!empty) {
                result.push('');
            }
            empty = true;
        } else {
            result.push(line);
            empty = false;
        }
    }
    return result;
};

exports.createPoweredUpSetup = (lines, poweredUp) => {
    const ports = ['A', 'B', 'C', 'D'];
    lines.push(
        '',
        '; Please connect before running',
        '; ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        '; If you connect you device while your program is already running then the program will',
        '; not automatically start using the connected device. The connection has to be setup',
        '; before you start running your program else the IDE will use modules which',
        '; simulate device behaviour.'
    );
    poweredUp.forEach((device, index) => {
        let layerIndex = index + 1;
        lines.push(
            '',
            '; Initialize the `' + deviceTypeTitle[device.type] + '` device.',
            'proc initDevice' + layerIndex + '()',
            '    ; Set the device type:',
            '    poweredUpSetDevice(LAYER_' + layerIndex + ', ' + deviceTypeConst[device.type] + ')',
            '    lightLayer(LAYER_' + layerIndex + ', LIGHT_PU_GREEN)'
        );
        let first     = true;
        let portCount = 0;
        device.ports.forEach((portInfo, portIndex) => {
            if (portInfo.enabled && portInfo.available && (portInfo.type in devicePortType)) {
                portCount++;
            }
        });
        device.ports.forEach((portInfo, portIndex) => {
            if (portInfo.enabled && portInfo.available && (portInfo.type in devicePortType)) {
                if (first) {
                    lines.push(
                        '    ; Configure the port' + ((portCount > 1) ? 's' : '') + '...',
                        ''
                    );
                    first = false;
                }
                lines.push('');
                let layer = 'LAYER_' + layerIndex;
                let port  = ports[portIndex];
                if (portInfo.type === poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE) {
                    lines.push(
                        '    ; Select the color/distance sensor:',
                        '    sensorLayerSetType(' + layer + ', OUTPUT_' + port + ', ' + devicePortType[portInfo.type] + ')',
                        '    ; Set the mode to `POWERED_UP_SENSOR_MODE_DISTANCE` or `POWERED_UP_SENSOR_MODE_COLOR`...',
                        '    sensorLayerSetMode(' + layer + ', OUTPUT_' + port + ', POWERED_UP_SENSOR_MODE_DISTANCE)'
                    );
                } else {
                    lines.push(
                        '    ; Set the motor type:',
                        '    motorLayerSetType(' + layer + ', OUTPUT_' + port + ', ' + devicePortType[portInfo.type] + ')',
                        '    ; Set brake style to `MOTOR_COAST` or `MOTOR_BRAKE`...',
                        '    motorLayerSetBrake(' + layer + ', OUTPUT_' + port + ', MOTOR_BRAKE)',
                        '    motorLayerSetSpeed(' + layer + ', OUTPUT_' + port + ', 50)'
                    );
                }
            }
        });
        lines.push(
            'end',
            ''
        );
    });
};

exports.createProjectFile = (opts) => {
    let lines           = ['#project "' + opts.description + '"', ''];
    let pathAndFilename = path.getPathAndFilename(opts.filename);
    let includeFiles    = opts.includeFiles;
    let formFilename;
    let formName;
    const addToIncludeFiles = (filename) => {
            if (includeFiles.indexOf(filename) === -1) {
                includeFiles.push(filename);
            }
        };
    if (opts.createForm) {
        formFilename = path.replaceExtension(path.getPathAndFilename(opts.filename).filename, '.wfrm');
        formName     = path.replaceExtension(formFilename, '');
        addToIncludeFiles('lib/standard.whl');
        addToIncludeFiles('lib/components/component.whl');
        addToIncludeFiles('lib/components/form.whl');
    }
    if (opts.poweredUp) {
        addToIncludeFiles('lib/device.whl');
        addToIncludeFiles('lib/poweredUp.whl');
        addToIncludeFiles('lib/motor.whl');
        addToIncludeFiles('lib/sensor.whl');
        addToIncludeFiles('lib/light.whl');
    }
    addIncludes(lines, includeFiles);
    if (opts.createForm) {
        lines.push.apply(lines, exports.getFormCode(formFilename));
    }
    if (opts.poweredUp) {
        exports.createPoweredUpSetup(lines, opts.poweredUp);
    }
    if (!opts.createForm && !opts.poweredUp) {
        lines.push('');
    }
    lines.push('proc main()');
    if (opts.poweredUp) {
        lines.push(
            '    ; Select the Powered Up mode in the simulator:',
            '    selectDevice(DEVICE_POWERED_UP)',
            '',
            '    ; Initialize the Powered Up device' + ((opts.poweredUp.length > 1) ? 's' : '') + '.'
        );
        opts.poweredUp.forEach((device, index) => {
            lines.push('    initDevice' + (index + 1) + '()');
        });
    }
    if (opts.createForm) {
        if (opts.poweredUp) {
            lines.push('');
        }
        lines.push(
            '    ' + exports.getShowProcNameFromFormName(formName) + '()',
            '    halt()'
        );
    }
    lines.push('end');
    return exports.removeDuplicateEmptyLines(lines);
};

exports.generateDefinesFromComponents = (formName, components) => {
    let maxLength = 0;
    let toString  = function() {
            /* eslint-disable no-invalid-this */
            maxLength = Math.max(maxLength, this.name.length);
            /* eslint-disable no-invalid-this */
            return this.name;
        };
    let defines       = [];
    let definesByName = {};
    let addDefine     = function(name, uid) {
            definesByName[name] = uid;
            defines.push({
                line:     '',
                name:     name,
                uid:      uid,
                toString: toString
            });
        };
    formName = exports.getConstantFromName(formName);
    components.forEach((component) => {
        if (component.type !== formEditorConstants.COMPONENT_TYPE_FORM) {
            addDefine(formName + '_' + exports.getConstantFromName(component.name), component.uid);
        }
    });
    defines.sort();
    let space = '                                                                      ';
    defines.forEach((define) => {
        define.line = '#define ' + (define.name + space).substr(0, Math.max(maxLength, define.name.length)) + ' ' + define.uid;
    });
    return {
        definesByName: definesByName,
        list:          defines
    };
};

exports.generateSourceFromComponents = (opts) => {
    let lines      = [];
    let components = opts.components;
    let includes   = exports.generateIncludesFromComponents(components);
    let formName   = exports.getFormNameFromComponents(components);
    if (opts.project) {
        lines.push(
            '#project "' + formName + '"',
            '',
            '#include "lib/standard.whl"',
            '#include "lib/components/component.whl"'
        );
    }
    includes.forEach((include) => {
        lines.push('#include "' + include + '"');
    });
    let defines = exports.generateDefinesFromComponents(formName, components);
    lines.push('');
    defines.list.forEach((define) => {
        lines.push(define.line);
    });
    lines.push(
        '',
        '#resource "' + formName + '.wfrm"'
    );
    if (formName) {
        lines.push('');
        if (opts.createEventComments) {
            lines.push(
                '; @proc                   Show the form.',
                '; @ret                    The handle to the form.'
            );
        }
        lines.push(
            'proc show' + exports.getProcNameFromFilename(formName) + '()',
            '    ret components.form.show("' + formName + '.wfrm")',
            'end'
        );
    }
    if (opts.project) {
        lines.push(
            '',
            'proc main()',
            '    show' + exports.getProcNameFromFilename(formName) + '()',
            '    halt()',
            'end'
        );
    }
    return exports.removeDuplicateEmptyLines(lines);
};

exports.generateEventProc = (opts) => {
    let lines  = [];
    let events = formEditorConstants.PROPERTIES_BY_TYPE[opts.componentType.toUpperCase()].events || [];
    let event  = null;
    for (let i = 0; i < events.length; i++) {
        if (events[i].name === opts.eventType) {
            event = events[i];
            break;
        }
    }
    if (!opts.procName || !event || (opts.database && opts.database.findProc(opts.procName))) {
        return [];
    }
    let addComments = opts.createEventComments;
    let proc        = 'proc ' + opts.procName + '(';
    if (addComments) {
        lines.push('; @proc                   ' +
            opts.componentType.substr(0, 1).toUpperCase() + opts.componentType.substr(1, opts.componentType.length - 1) +
            ' ' + opts.eventType + ' event.');
    }
    event.params.forEach((param) => {
        proc += param.type + ' ' + param.name + ', ';
        if (addComments) {
            lines.push('; @param ' + (param.name + '                ').substr(0, 16) + ' ' + (param.comment || ''));
        }
    });
    proc = proc.substr(0, proc.length - 2) + ')';
    lines.push(proc);
    if (event.code) {
        event.code.forEach((code) => {
            lines.push(code.replace('{name}', opts.componentName));
        });
    }
    lines.push('end', '');
    return lines;
};

exports.findProcedures = (lines) => {
    let procedures = [];
    lines.forEach((line, index) => {
        let s = line.trim();
        if (s.indexOf('proc') === 0) {
            s = s.substr(4, s.length - 4).trim();
            let i = s.indexOf('(');
            if (i !== -1) {
                procedures.push({
                    name:  s.substr(0, i).trim(),
                    index: index
                });
            }
        }
    });
    return procedures;
};

exports.findProcedure = (procedures, proc) => {
    for (let i = 0; i < procedures.length; i++) {
        if (procedures[i].name === proc) {
            return proc;
        }
    }
    return null;
};

exports.insertProc = (lines, procedures, proc, procLines) => {
    let found = false;
    for (let i = 0; i < procedures.length; i++) {
        // Try to insert in alpha order...
        if (proc < procedures[i].name) {
            let index = procedures[i].index;
            // Insert before the comments of the proc...
            while ((index > 0) && (lines[index - 1].trim().substr(0, 1) === ';')) {
                index--;
            }
            if (procLines[procLines.length - 1].trim() !== '') {
                procLines.push('');
            }
            procLines.reverse();
            procLines.forEach((procLine) => {
                lines.splice(index, 0, procLine);
            });
            found = true;
            break;
        }
    }
    if (!found) {
        if (procLines[procLines.length - 1].trim() === '') {
            procLines.pop();
        }
        procLines.unshift('');
        lines.push.apply(lines, procLines);
    }
};

exports.updateEventNames = (opts) => {
    if (!opts.renameEvents.length) {
        return;
    }
    let lines           = opts.lines;
    let eventsByOldName = {};
    opts.renameEvents.forEach((renameEvent) => {
        eventsByOldName[renameEvent.oldName] = renameEvent;
    });
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim().indexOf('proc') === 0) {
            line = line.trim();
            let j = line.indexOf('(');
            if (j !== -1) {
                let procName = line.substr(5, j - 5).trim();
                if (procName in eventsByOldName) {
                    lines[i] = 'proc ' + eventsByOldName[procName].newName + line.substr(j - line.length).trim();
                    delete eventsByOldName[procName];
                }
            }
        }
    }
};

exports.updateComponentName = (opts) => {
    let oldName = exports.getConstantFromName(opts.formName) + '_' + exports.getConstantFromName(opts.oldName);
    let newName = exports.getConstantFromName(opts.formName) + '_' + exports.getConstantFromName(opts.newName);
    if (oldName === newName) {
        return;
    }
    let lines   = opts.lines;
    let found   = false;
    let defines = {};
    let i       = 0;
    // First check if there's anything to update...
    while (!found && (i < lines.length)) {
        let defineInfo = exports.getDefineInfo(lines[i].trim());
        if (defineInfo && (defineInfo.key === oldName)) {
            found = true;
        } else {
            i++;
        }
    }
    if (!found) {
        return; // Nothing to update found!
    }
    // Scan all lines for existing defines and get the maximum key length...
    let maxLength = newName.length;
    for (let i = 0; i < lines.length; i++) {
        let line       = lines[i].trim();
        let defineInfo = exports.getDefineInfo(line);
        if (defineInfo) {
            maxLength = Math.max(maxLength, defineInfo.key.length);
        }
    }
    let space = '';
    while (space.length < maxLength) {
        space += ' ';
    }
    // Update all defines with the new alignment and rename the define key...
    i = 0;
    while (i < lines.length) {
        let line       = lines[i].trim();
        let defineInfo = exports.getDefineInfo(line);
        if (defineInfo) {
            if (defineInfo.key in defines) {
                lines.splice(i, 1); // Remove duplicate define...
            } else {
                if (defineInfo.key === oldName) {
                    defineInfo.key = newName;
                }
                lines[i] = '#define ' + (defineInfo.key + space).substr(0, maxLength) + ' ' + defineInfo.value;
                defines[defineInfo.key] = true;
                i++;
            }
        } else {
            i++;
        }
    }
};

exports.updateFormNameAndRemoveDefines = (opts) => {
    let lines   = opts.lines;
    let oldName = exports.getShowProcNameFromFormName(opts.oldName);
    let newName = exports.getShowProcNameFromFormName(opts.newName);
    if (newName === '') {
        return;
    }
    let defines = exports.generateDefinesFromComponents(opts.oldName, opts.components);
    let i       = 0;
    while (i < lines.length) {
        let line       = lines[i].trim();
        let defineInfo = exports.getDefineInfo(line);
        if (defineInfo && (defineInfo.key in defines.definesByName)) {
           lines.splice(i, 1);
        } else {
            if ((line.indexOf('proc') === 0) && (line.indexOf(' ' + oldName) !== -1)) {
                let j = line.indexOf(oldName);
                lines[i] = line.substr(0, j) + newName + line.substr(j + oldName.length, line.length - j - oldName.length);
                break;
            }
            i++;
        }
    }
};

exports.deleteComponent = (opts) => {
    let lines = opts.lines;
    const deleteComponent = (name) => {
            let define = exports.getConstantFromName(opts.formName) + '_' + exports.getConstantFromName(name);
            let i      = 0;
            while (i < lines.length) {
                let defineInfo = exports.getDefineInfo(lines[i]);
                if (defineInfo && (defineInfo.key === define)) {
                    lines.splice(i, 1);
                    break;
                } else {
                    i++;
                }
            }
        };
    opts.components.forEach((item) => {
        deleteComponent(item.name);
    });
};

exports.removeExistingDefines = (opts) => {
    let lines          = opts.lines;
    let defines        = opts.defines;
    let insertPosition = -1;
    let i              = 0;
    while (i < lines.length) {
        let defineInfo = exports.getDefineInfo(lines[i]);
        if (defineInfo && (defineInfo.key in defines.definesByName)) {
            lines.splice(i, 1);
            insertPosition = i;
        } else {
            i++;
        }
    }
    if (insertPosition === -1) {
        i = 0;
        while (i < lines.length) {
            if (lines[i].trim().indexOf('#include') === 0) {
                insertPosition = i;
            }
            i++;
        }
        if (insertPosition !== -1) {
            insertPosition += 2;
        }
    }
    return insertPosition;
};
