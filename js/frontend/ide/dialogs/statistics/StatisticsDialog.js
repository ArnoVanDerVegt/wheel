/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Component  = require('../../../lib/components/Component').Component;
const getImage   = require('../../data/images').getImage;
const $          = require('../../../program/commands');

const Chart = class extends Component {
        constructor(opts) {
            super(opts);
            this._baseClassName = 'chart';
            this._program       = opts.program;
            this.initDOM(opts.parentNode);
        }

        initDOM(parentNode) {
            let commands       = this._program.getCommands();
            let occurenceData  = this.getOccurenceData(this._program);
            let children       = [];
            let locationText   = ['#', '[#]', '[stack + #]', '[pointer + #]'];
            let max            = null;
            let optimizedCount = 0;

            occurenceData.forEach(function(o, index) {
                if (max === null) {
                    max = o.count;
                }
                let perc      = Math.round(o.count * 100 / commands.length);
                let optimized = [88, 84, 0, 64, 16, 101, 90, 106, 122].indexOf(o.cmdPacked) !== -1;
                let title     = perc + '% ' + $.CMD_TO_STR[o.cmd] + ' ' + locationText[o.param1] + ', ' + locationText[o.param2];
                if (optimized) {
                    optimizedCount += o.count;
                }
                children.push({
                    className: 'chart-row',
                    children: [
                        {
                            className: 'chart-bar',
                            children: [
                                {
                                    className: 'chart-bar-perc ' + (optimized ? 'green' : 'red'),
                                    style: {
                                        width: (o.count / max * 100) + '%'
                                    }
                                }
                            ]
                        },
                        {
                            innerHTML: title,
                            className: 'chart-title'
                        }
                    ]
                });
            });

            this.create(parentNode, {className: 'text-line', innerHTML: commands.length + ' commands.'});
            this.create(parentNode, {className: 'text-line', innerHTML: optimizedCount + ' optimized commands.'});
            this.create(parentNode, {className: 'chart',     children:  children});
        }

        getOccurenceData(program) {
            let commands       = program.getCommands();
            let occurenceByCmd = [];
            commands.forEach(
                function(command) {
                    let param1    = command.getParam1();
                    let param2    = command.getParam2();
                    let cmd       = command.getCmd();
                    let cmdPacked = (cmd << 4) + (param1.getType() << 2) + param2.getType();
                    if (occurenceByCmd[cmdPacked]) {
                        occurenceByCmd[cmdPacked].count++;
                    } else {
                        occurenceByCmd[cmdPacked] = {
                            count:     1,
                            cmd:       cmd,
                            cmdPacked: cmdPacked,
                            param1:    param1.getType(),
                            param2:    param2.getType(),
                            toString:  function() {
                                return ('00000000' + this.count).substr(-8);
                            }
                        };
                    }
                },
                this
            );
            occurenceByCmd.sort();
            occurenceByCmd.reverse();
            return occurenceByCmd;
        }

    };

exports.StatisticsDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.createWindow(
            'statistics-dialog',
            'Statistics',
            [
                {
                    ref:       this.setRef('text'),
                    className: 'statistics-text'
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            value:   'Ok',
                            onClick: this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Statistics.Show', this, this.onShow);
    }

    onShow(opts) {
        let refs          = this._refs;
        let dialogElement = this._dialogElement;
        refs.title.innerHTML = 'Output command statistics';

        let text = refs.text;
        while (text.childNodes.length) {
            text.removeChild(text.childNodes[0]);
        }
        if (opts.program) {
            new Chart({ui: this._ui, parentNode: text, program: opts.program});
        } else {
            this.create(text, {className: 'text-line', innerHTML: 'No data available.'});
        }
        this.show();
    }
};
