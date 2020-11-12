const getSpan       = require('../spans').getSpan;
const getArrayIndex = require('../spans').getArrayIndex;
const getArrayRange = require('../spans').getArrayRange;
const getSpace      = require('../spans').getSpace;

exports.ArrayTreeBuilder = class {
    constructor(data, stringList) {
        this._data       = data;
        this._stringList = stringList;
        this._offset     = 0;
    }

    getValue(offset) {
        let value = this._data[offset];
        return (typeof value === 'number') ? value : '-';
    }

    buildArray(vr, arraySize, children) {
        let isNumber  = (vr.getType().type === 'number');
        let itemCount = isNumber ? 10 : 4;
        let i         = 0;
        while (i < arraySize) {
            let j     = 0;
            let title = getArrayRange(i, Math.min(i + itemCount, arraySize - 1));
            let data  = [];
            while ((i < arraySize) && (j < itemCount)) {
                let value = this.getValue(this._offset);
                if (isNumber) {
                    data.push(getSpan(value, 'number'));
                } else {
                    data.push(getSpan('"' + this._stringList[value] + '"', 'string'));
                }
                i++;
                j++;
                this._offset++;
            }
            children.push({
                title: title,
                children: [
                    {
                        title: data.join(getSpan(',&nbsp;'))
                    }
                ]
            });
        }
    }

    build(vr, baseOffset) {
        let arraySize = vr.getArraySize();
        if (typeof arraySize === 'number') {
            arraySize = [arraySize];
        }
        let tree = {
                title:    '[' + arraySize.join('][') + ']',
                children: []
            };
        const buildArray = (index, children) => {
                if (index === arraySize.length - 1) {
                    this.buildArray(vr, arraySize[index], children);
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
            };
        this._offset = baseOffset + (vr.getPointer() ? this._data[vr.getOffset()] : vr.getOffset());
        buildArray(0, tree.children);
        return tree;
    }
};
