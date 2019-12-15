/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const fileModuleConstants = require('../../../../shared/vm/modules/fileModuleConstants');
const VMModule            = require('./../VMModule').VMModule;
const FileSystem          = require('./FileSystem');

exports.FileModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._fileSystem = opts.fileSystem;
    }

    run(commandId) {
        let vmData     = this._vmData;
        let vm         = this._vm;
        let file;
        let fileOpen;
        let filename;
        let fileSystem = this._fileSystem;
        let h;
        switch (commandId) {
            case fileModuleConstants.FILE_EXISTS:
                fileOpen = vmData.getRecordFromAtOffset(['filename']);
                fileSystem.exists(
                    vmData.getStringList()[fileOpen.filename],
                    function(exists) {
                        vmData.setNumberAtRet(exists);
                    }
                );
                break;
            case fileModuleConstants.FILE_OPEN_READ:
                fileOpen = vmData.getRecordFromAtOffset(['filename']);
                h        = fileSystem.open(vmData.getStringList()[fileOpen.filename], FileSystem.MODE_READ);
                vmData.setNumberAtRet(h);
                break;
            case fileModuleConstants.FILE_OPEN_WRITE:
                fileOpen = vmData.getRecordFromAtOffset(['filename']);
                h        = fileSystem.open(vmData.getStringList()[fileOpen.filename], FileSystem.MODE_WRITE);
                vmData.setNumberAtRet(h);
                break;
            case fileModuleConstants.FILE_READ_NUMBER:
                vmData.setNumberAtRet(this._fileSystem.readNumber(vmData.getRecordFromAtOffset(['handle']).handle));
                break;
            case fileModuleConstants.FILE_READ_STRING:
                let fileReadString = vmData.getRecordFromAtOffset(['handle', 's']);
                vmData.getStringList()[fileReadString.s] = this._fileSystem.readString(fileReadString.handle);
                break;
            case fileModuleConstants.FILE_WRITE_NUMBER:
                let fileWriteNumber = vmData.getRecordFromAtOffset(['handle', 'n']);
                fileSystem.writeNumber(fileWriteNumber.handle, fileWriteNumber.n);
                break;
            case fileModuleConstants.FILE_WRITE_STRING:
                let fileWriteString = vmData.getRecordFromAtOffset(['handle', 's']);
                fileSystem.writeNumber(fileWriteString.handle, vmData.getStringList()[fileWriteString.s]);
                break;
            case fileModuleConstants.FILE_CLOSE:
                fileSystem.close(vmData.getRecordFromAtOffset(['handle']).handle);
                break;
            case fileModuleConstants.FILE_DELETE:
                let fileDelete = vmData.getRecordFromAtOffset(['s']);
                fileSystem.remove(vmData.getStringList()[fileDelete.s]);
                break;
            case fileModuleConstants.FILE_SIZE:
                let fileSize = vmData.getRecordFromAtOffset(['filename']);
                fileSystem.fileSize(
                    vmData.getStringList()[fileSize.filename],
                    function(size) {
                        vmData.setNumberAtRet(size, 1);
                    }
                );
                break;
        }
    }
};
