/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.ProgressBar = class extends Component {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode);
        dispatcher.on(opts.event, this, this.onEvent);
    }

    onEvent(progress) {
        this._progressElement.style.width = progress + '%';
    }

    setProgressElement(element) {
        this._progressElement = element;
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'progress-bar',
                children: [
                    {
                        className: 'bar',
                        children: [
                            {
                                id:        this.setProgressElement.bind(this),
                                className: 'progress'
                            }
                        ]
                    }
                ]
            }
        );
    }
};
