/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const VMData = require('../../../js/frontend/vm/VMData').VMData;
const $      = require('../../../js/frontend/program/commands');
const assert = require('assert');

describe(
    'Test VMData',
    () => {
        it(
            'Should create VMData',
            () => {
                let vmData = new VMData({globalSize: 1024, constants: []});
                assert.notEqual(vmData, null);
            }
        );
        it(
            'Should set and get number at offset',
            () => {
                let vmData = new VMData({globalSize: 1024, constants: []});
                vmData.setNumberAtOffset(55, 100);
                assert.equal(vmData.getNumberAtOffset(100), 55);
            }
        );
        it(
            'Should set number and read registers',
            () => {
                let vmData = new VMData({globalSize: 1024, constants: []});
                vmData.setNumberAtOffset(55, $.REG_STACK);
                vmData.setNumberAtOffset(56, $.REG_SRC);
                vmData.setNumberAtOffset(57, $.REG_DEST);
                vmData.setNumberAtOffset(58, $.REG_PTR);
                vmData.setNumberAtOffset(59, $.REG_CODE);
                vmData.setNumberAtOffset(60, $.REG_RET);
                vmData.setNumberAtOffset(61, $.REG_FLAGS);
                vmData.setNumberAtOffset(62, $.REG_RANGE0);
                vmData.setNumberAtOffset(63, $.REG_RANGE1);
                assert.deepEqual(vmData.getRegisters(), [55, 56, 57, 58, 59, 60, 61, 62, 63]);
            }
        );
        it(
            'Should set number at reg offset',
            () => {
                let vmData = new VMData({globalSize: 1024, constants: []});
                vmData.setNumberAtOffset(13, $.REG_SRC);
                vmData.setNumberAtRegOffset(1234);
                assert.equal(vmData.getNumberAtOffset(13), 1234);
            }
        );
        it(
            'Should set number at reg offset + offset',
            () => {
                let vmData = new VMData({globalSize: 1024, constants: []});
                vmData.setNumberAtOffset(13, $.REG_SRC);
                vmData.setNumberAtRegOffset(5678, 5);
                assert.equal(vmData.getNumberAtOffset(18), 5678);
            }
        );
        it(
            'Should set and get registers',
            () => {
                let vmData = new VMData({globalSize: 1024, constants: []});
                vmData.setRegisters([55, 56, 57, 58, 59, 60, 61, 62, 63]);
                assert.deepEqual(vmData.getRegisters(), [55, 56, 57, 58, 59, 60, 61, 62, 63]);
            }
        );
        it(
            'Should get regSrc',
            () => {
                let vmData = new VMData({globalSize: 1024, constants: []});
                vmData.setNumberAtOffset(13, $.REG_SRC);
                assert.equal(vmData.getRegSrc(), 13);
            }
        );
    }
);
