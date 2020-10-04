/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher   = require('../../js/frontend/lib/dispatcher').dispatcher;
const PluginsState = require('../../js/frontend/ide/settings/PluginsState').PluginsState;
const pluginUuid   = require('../../js/frontend/ide/plugins/pluginUuid');
const assert       = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test plugins state',
    () => {
        it(
            'Should create PluginsState',
            () => {
                let pluginsState = new PluginsState({});
                assert.equal(pluginsState.getDefaultPlugins().length, 6);
            }
        );
        it(
            'Should get sorted plugins',
            () => {
                let pluginsState = new PluginsState({});
                let names        = [];
                pluginsState.getSortedPlugins().forEach(function(plugin) {
                    names.push(plugin.name);
                });
                assert.deepEqual(names, ['EV3 Motors', 'EV3', 'EV3 Sensors', 'EV3 Sensor output graph', 'PSP', 'Hub']);
            }
        );
        it(
            'Should get plugin by uuid',
            () => {
                let pluginsState = new PluginsState({});
                assert.notEqual(pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_EV3_UUID),          null);
                assert.notEqual(pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_EV3_SENSORS_UUID),  null);
                assert.notEqual(pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_EV3_MOTORS_UUID),   null);
                assert.notEqual(pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_SENSOR_GRAPH_UUID), null);
                assert.notEqual(pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_PSP_UUID),          null);
                assert.notEqual(pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_POWERED_UP_UUID),   null);
            }
        );
        it(
            'Should load and add new plugin',
            () => {
                let pluginsState = new PluginsState({});
                pluginsState.load([{
                    uuid:    '94f5d48e-6de0-11ea-bc55-0242ac130003',
                    group:   'Test',
                    name:    'Test plugin',
                    path:    'test',
                    visible: true,
                    order:   20
                }]);
                assert.equal(pluginsState.getSortedPlugins().length, 7);
            }
        );
        it(
            'Should load and add existing plugin',
            () => {
                let pluginsState = new PluginsState({});
                pluginsState.load([{
                    uuid:    pluginUuid.SIMULATOR_EV3_UUID,
                    group:   'Test',
                    name:    'Test plugin',
                    path:    'test',
                    visible: true,
                    order:   20
                }]);
                assert.equal(pluginsState.getSortedPlugins().length, 6);
            }
        );
        it(
            'Should toggle plugin visible',
            () => {
                let pluginsState = new PluginsState({settings: {save: () => {}, emit: () => {}}});
                let startVisible = pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_EV3_UUID).visible;
                dispatcher.dispatch('Settings.Toggle.PluginByUuid', pluginUuid.SIMULATOR_EV3_UUID);
                assert.notEqual(pluginsState.getPluginByUuid(pluginUuid.SIMULATOR_EV3_UUID).visible, startVisible);
            }
        );
        it(
            'Should set visible',
            () => {
                let pluginsState = new PluginsState({settings: {save: () => {}, emit: () => {}}});
                let testUuid     = '94f5d48e-6de0-11ea-bc55-0242ac130003';
                pluginsState.load([{
                    uuid:    testUuid,
                    group:   'Test',
                    name:    'Test plugin',
                    path:    'test',
                    visible: false,
                    order:   20
                }]);
                assert.equal(pluginsState.getPluginByUuid(testUuid).visible, false);
                dispatcher.dispatch('Settings.Show.PluginByUuid', testUuid);
                assert.equal(pluginsState.getPluginByUuid(testUuid).visible, true);
            }
        );
    }
);
