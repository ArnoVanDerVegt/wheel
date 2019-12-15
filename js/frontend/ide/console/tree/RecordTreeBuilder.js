const Record           = require('../../../compiler/types/Record').Record;
const getSpan          = require('../spans').getSpan;
const getArrayIndex    = require('../spans').getArrayIndex;
const getRecord        = require('../spans').getRecord;
const getVariable      = require('../spans').getVariable;
const getSpace         = require('../spans').getSpace;
const getAssign        = require('../spans').getAssign;
const ArrayTreeBuilder = require('./ArrayTreeBuilder').ArrayTreeBuilder;

exports.RecordTreeBuilder = class {
    constructor(data, stringList) {
        this._data       = data;
        this._stringList = stringList;
        this._baseOffset = 0;
    }

    getValue(offset) {
        let value = this._data[offset];
        return (typeof value === 'number') ? value : '-';
    }

    initRecord(type, treeNode, offset) {
        treeNode.children = [];
        let fields           = type.getVars();
        let arrayTreeBuilder = null;
        for (let i = 0; i < fields.length; i++) {
            let field     = fields[i];
            let fieldType = field.getType();
            let arraySize = field.getArraySize();
            let o         = offset + field.getOffset();
            let treeNodeChild;
            if (fieldType === 'number') {
                if (arraySize === false) {
                    treeNodeChild = {title: getVariable(field.getName()) + getAssign() + getSpan(this.getValue(o), 'number')};
                } else {
                    if (!arrayTreeBuilder) {
                        arrayTreeBuilder = new ArrayTreeBuilder(this._data);
                    }
                    treeNodeChild = arrayTreeBuilder.build(field, this._baseOffset);
                }
            } else if (fieldType instanceof Record) {
                treeNodeChild = {
                    title: getRecord(fieldType.getName()) + getSpace() + getVariable(field.getName())
                };
                if (arraySize === false) {
                    this.initRecord(fieldType, treeNodeChild, o);
                } else {
                    treeNodeChild.title += getArrayIndex(arraySize);
                    this.initRecordArray(fieldType, treeNodeChild, o, arraySize);
                }
            }
            if (treeNodeChild) {
                treeNode.children.push(treeNodeChild);
            }
        }
    }

    initRecordArray(type, treeNode, offset, arraySize) {
        if (typeof arraySize === 'number') {
            arraySize = [arraySize];
        }
        const buildArray = (function(index, children) {
                if (index === arraySize.length - 1) {
                    for (let i = 0; i < arraySize[index]; i++) {
                        let treeNodeChild = {title: getArrayIndex(i)};
                        this.initRecord(type, treeNodeChild, offset);
                        children.push(treeNodeChild);
                        offset += type.getSize();
                    }
                } else {
                    for (let i = 0; i < arraySize[index]; i++) {
                        let child = {
                                title:    getArrayIndex(i),
                                children: []
                            };
                        buildArray(index + 1, child.children);
                        children.push(child);
                    }
                }
            }).bind(this);
        buildArray(0, treeNode.children);
    }

    build(vr, baseOffset) {
        this._baseOffset = baseOffset;
        let offset   = baseOffset + vr.getOffset();
        let treeNode = {
                children: [],
                title:    getRecord(vr.getType().getName()) + getSpace() + getVariable(vr.getName())
            };
        if (vr.getArraySize() === false) {
            this.initRecord(vr.getType(), treeNode, offset);
        } else {
            treeNode.title += getArrayIndex(vr.getArraySize());
            this.initRecordArray(vr.getType(), treeNode, offset, vr.getArraySize());
        }
        return treeNode;
    }
};
