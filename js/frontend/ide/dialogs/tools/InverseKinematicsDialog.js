/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path       = require('../../../../shared/lib/path');
const DOMNode    = require('../../../lib/dom').DOMNode;
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;
const Dropdown   = require('../../../lib/components/input/Dropdown').Dropdown;

class Point {
    constructor(opts) {
        this._x = opts.x;
        this._y = opts.y;
    }

    rotate(angle) {
        let x = this._x * Math.cos(angle) - this._y * Math.sin(angle);
        let y = this._x * Math.sin(angle) + this._y * Math.cos(angle);
        this._x = x;
        this._y = y;
        return this;
    }

    translate(x, y) {
        this._x += x;
        this._y += y;
        return this;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }
}

const gridSizeX = 63;
const gridSizeY = 31;
const sizeX     = 20 * 0.75;
const sizeY     = 25 * 0.75;
const sizeX2    = sizeX / 2;
const sizeY2    = sizeY / 2;

const SHOW_SIGNAL = 'Dialog.InverseKinematics.Show';

exports.InverseKinematicsDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._liftArm1     = 11;
        this._liftArm2     = 11;
        this._targetX      = 7;
        this._targetY      = 0;
        this._mouseTargetX = null;
        this._mouseTargetY = null;
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      gridSizeX * sizeX + 66  + 16,
            height:     gridSizeY * sizeY + 138 + 8 + 16,
            className:  'inverse-kinematics-dialog',
            title:      'Inverse Kinematics calculator'
        });
        this._gridCanvas   = this._refs.grid;
        this._gridCtx      = this._gridCanvas.getContext('2d');
        this._resultCanvas = this._refs.result;
        this._resultCtx    = this._resultCanvas.getContext('2d');
    }

    initWindowContent(opts) {
        let liftArmItems = [];
        for (let i = 2; i < 22; i++) {
            liftArmItems.push({value: i, title: i});
        }
        return [
            {
                className: 'abs dialog-l dialog-t dialog-r',
                children: [
                    {
                        type:      'canvas',
                        className: 'abs grid',
                        ref:       this.setRef('grid')
                    },
                    {
                        type:      'canvas',
                        className: 'abs',
                        ref:       this.setRef('result'),
                        id:        this.setResultElement.bind(this)
                    }
                ]
            },
            this.initButtons([
                {
                    value:    'Close',
                    onClick:  this.hide.bind(this),
                    tabIndex: 513
                },
                {
                    type:      Dropdown,
                    ref:       this.setRef('liftArm2'),
                    ui:        this._ui,
                    uiId:      this._uiId,
                    up:        true,
                    tabIndex:  1,
                    onChange:  this.onChangeLiftArm2.bind(this),
                    items:     liftArmItems,
                    value:     this._liftArm2
                },
                {
                    type:      'div',
                    className: 'frt label',
                    innerHTML: 'Liftarm 2'
                },
                {
                    type:      Dropdown,
                    ref:       this.setRef('liftArm1'),
                    ui:        this._ui,
                    uiId:      this._uiId,
                    up:        true,
                    tabIndex:  1,
                    onChange:  this.onChangeLiftArm1.bind(this),
                    items:     liftArmItems,
                    value:     this._liftArm1
                },
                {
                    type:      'div',
                    className: 'frt label',
                    innerHTML: 'Liftarm 1'
                },
                {
                    type:      'div',
                    className: 'frt label',
                    innerHTML: 'Target (' + this._targetX + ',' + this._targetY + ')',
                    ref:       this.setRef('target')
                },
                {
                    type:      'div',
                    className: 'frt label',
                    innerHTML: 'Angle2 = 0',
                    ref:       this.setRef('angle2')
                },
                {
                    type:      'div',
                    className: 'frt label',
                    innerHTML: 'Angle1 = 0',
                    ref:       this.setRef('angle1')
                }
            ])
        ];
    }

    inverseKinematic(deltaX, deltaY, lenA, lenB) {
        let dist2  = deltaX * deltaX + deltaY * deltaY;
        let lenA2  = lenA * lenA;
        let lenB2  = lenB * lenB;
        let angle1 = Math.min(Math.max((dist2 + lenA2 - lenB2) / (2 * lenA * Math.sqrt(dist2)), -1), 1);
        let angle2 = Math.min(Math.max((dist2 - lenA2 - lenB2) / (2 * lenA * lenB), -1), 1);
        return {
            angle1: Math.atan2(deltaY, deltaX) - Math.acos(angle1),
            angle2: Math.acos(angle2)
        };
    }

    setResultElement(resultElement) {
        resultElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        resultElement.addEventListener('mouseout',  this.onMouseOut.bind(this));
        resultElement.addEventListener('click',     this.onClick.bind(this));
    }

    drawGrid() {
        let gridCanvas = this._gridCanvas;
        let ctx        = this._gridCtx;
        gridCanvas.width  = gridSizeX * sizeX + 8;
        gridCanvas.height = gridSizeY * sizeY + 8;
        ctx.lineWidth     = 1;
        ctx.strokeStyle   = this._settings.getDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.25)';
        for (let y = 0; y < gridSizeY; y++) {
            for (let x = 0; x < gridSizeX; x++) {
                ctx.beginPath();
                ctx.arc(4 + x * sizeX + sizeX2, 4 + y * sizeY + sizeY2, sizeX * 0.42, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
        ctx.lineWidth   = 1.5;
        ctx.strokeStyle = this._settings.getDarkMode() ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.moveTo(gridCanvas.width * 0.5 - 0.75, 0);
        ctx.lineTo(gridCanvas.width * 0.5 - 0.75, gridCanvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,                gridCanvas.height * 0.5 - 0.75);
        ctx.lineTo(gridCanvas.width, gridCanvas.height * 0.5 - 0.75);
        ctx.stroke();
    }

    drawLiftArm(x, y, len, angle, extended) {
        x += gridSizeX * sizeX2 + 4;
        y += gridSizeY * sizeY2 + 4;
        let darkMode     = this._settings.getDarkMode();
        let resultCanvas = this._resultCanvas;
        let ctx          = this._resultCtx;
        let points       = [
                new Point({x: 0,               y: -sizeY2}),
                new Point({x: len * sizeX,     y: -sizeY2}),
                new Point({x: len * sizeX,     y: sizeY2}),
                new Point({x: 0,               y: sizeY2}),
                new Point({x: 0,               y: 0}),
                new Point({x: len * sizeX,     y: 0}),
                new Point({x: len * sizeX * 2, y: 0})
            ];
        points.forEach((point) => {
            point.rotate(angle).translate(x, y);
        });
        ctx.lineWidth   = 1.5;
        ctx.strokeStyle = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
        if (extended) {
            ctx.beginPath();
            ctx.moveTo(points[5].getX(), points[5].getY());
            ctx.lineTo(points[6].getX(), points[6].getY());
            ctx.stroke();
        }
        ctx.fillStyle   = darkMode ? '#F1C40F' : '#3498DB';
        ctx.strokeStyle = darkMode ? '#F39C12' : '#2980B9';
        // Draw fill color...
        ctx.beginPath();
        ctx.moveTo(points[0].getX(), points[0].getY());
        ctx.arc(points[4].getX(), points[4].getY(), sizeY * 0.5, angle + Math.PI * 0.5, angle + Math.PI * 1.5);
        ctx.lineTo(points[3].getX(), points[3].getY());
        ctx.arc(points[5].getX(), points[5].getY(), sizeY * 0.5, angle + Math.PI * 0.5, angle + Math.PI * 1.5, true);
        ctx.closePath();
        ctx.fill();
        // Draw outline....
        for (let i = 0; i <= 2; i += 2) {
            ctx.beginPath();
            ctx.moveTo(points[i].getX(), points[i].getY());
            ctx.lineTo(points[i + 1].getX(), points[i + 1].getY());
            ctx.stroke();
        }
        for (let i = 0; i <= len; i++) {
            let point = new Point({x: sizeX * i, y: 0}).rotate(angle).translate(x, y);
            if (i === 0) {
                ctx.beginPath();
                ctx.arc(point.getX(), point.getY(), sizeY * 0.5, angle + Math.PI * 0.5, angle + Math.PI * 1.5);
                ctx.stroke();
            } else if (i === len) {
                ctx.beginPath();
                ctx.arc(point.getX(), point.getY(), sizeY * 0.5, angle + Math.PI * 1.5, angle + Math.PI * 2.5);
                ctx.stroke();
            }
            // Clear circle...
            ctx.save();
            ctx.beginPath();
            ctx.arc(point.getX(), point.getY(), sizeX * 0.42, 0, 2 * Math.PI);
            ctx.clip();
            ctx.clearRect(point.getX() - sizeX, point.getY() - sizeY, point.getX() + sizeX, point.getY() + sizeY);
            ctx.restore();
            // Draw circle line...
            ctx.beginPath();
            ctx.arc(point.getX(), point.getY(), sizeX * 0.42, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    drawAngle(opts) {
        let x        = opts.x + gridSizeX * sizeX2 + 4;
        let y        = opts.y + gridSizeY * sizeY2 + 4;
        let ctx      = this._resultCtx;
        let darkMode = this._settings.getDarkMode();
        ctx.strokeStyle = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth   = opts.len * sizeX2;
        ctx.beginPath();
        if (opts.angle2 - opts.angle3 > 0) {
            ctx.arc(x, y, opts.len * sizeX2, opts.angle3, opts.angle2);
        } else {
            ctx.arc(x, y, opts.len * sizeX2, opts.angle2, opts.angle3);
        }
        ctx.stroke();
        // Draw angle...
        x += Math.cos(opts.angle1) * opts.len * sizeX2;
        y += Math.sin(opts.angle1) * opts.len * sizeX2;
        ctx.fillStyle   = '#4CD137';
        ctx.strokeStyle = '#44BD32';
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle    = '#FFFFFF';
        ctx.font         = '14px open_sansregular, Helvetica, Arial, sans-serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(opts.angle0 * (180 / Math.PI)), x, y + 1);
    }

    drawResult(opts) {
        if (opts.clear) {
            this._resultCanvas.width  = gridSizeX * sizeX + 8;
            this._resultCanvas.height = gridSizeY * sizeY + 8;
        }
        this._resultCtx.globalAlpha = opts.alpha;
        let angles = this.inverseKinematic(opts.targetX * sizeX, opts.targetY * sizeY, this._liftArm1 * sizeX, this._liftArm2 * sizeX);
        let x2     = this._liftArm1 * sizeX * Math.cos(angles.angle1);
        let y2     = this._liftArm1 * sizeX * Math.sin(angles.angle1);
        this.drawLiftArm(0,  0,  this._liftArm1, angles.angle1, (opts.alpha === 1));
        this.drawLiftArm(x2, y2, this._liftArm2, angles.angle1 + angles.angle2);
        if (opts.drawAngle) {
            this.drawAngle({
                x:      0,
                y:      0,
                len:    this._liftArm1,
                angle0: angles.angle1,
                angle1: angles.angle1 * 0.5,
                angle2: angles.angle1,
                angle3: 0
            });
            this.drawAngle({
                x:      x2,
                y:      y2,
                len:    this._liftArm1,
                angle0: angles.angle2,
                angle1: angles.angle1 + angles.angle2 * 0.5,
                angle2: angles.angle1,
                angle3: angles.angle1 + angles.angle2
            });
            let refs = this._refs;
            refs.angle1.innerHTML = 'Angle1 = ' + Math.round(angles.angle1 * (180 / Math.PI)) + '°';
            refs.angle2.innerHTML = 'Angle2 = ' + Math.round(angles.angle2 * (180 / Math.PI)) + '°';
        }
    }

    onChangeLiftArm1(value) {
        this._liftArm1 = value;
        this.drawResult({
            targetX:   this._targetX,
            targetY:   this._targetY,
            alpha:     1,
            clear:     true,
            drawAngle: true
        });
    }

    onChangeLiftArm2(value) {
        this._liftArm2 = value;
        this.drawResult({
            targetX:   this._targetX,
            targetY:   this._targetY,
            alpha:     1,
            clear:     true,
            drawAngle: true
        });
    }

    onMouseMove(event) {
        let resultCanvas = this._resultCanvas;
        let x            = event.offsetX;
        let y            = event.offsetY;
        let width        = resultCanvas.width;
        let height       = resultCanvas.height;
        if ((x > 4) && (y > 4) && (x < width - 4) && (y < height - 4)) {
            let targetX = Math.round((x - width  * 0.5 - 4) / sizeX);
            let targetY = Math.round((y - height * 0.5 - 4) / sizeY);
            if ((this._mouseTargetX !== targetX) || (this._mouseTargetY !== targetY)) {
                this._mouseTargetX = targetX;
                this._mouseTargetY = targetY;
                this.drawResult({
                    targetX:   targetX,
                    targetY:   targetY,
                    alpha:     0.25,
                    clear:     true
                });
                this.drawResult({
                    targetX:   this._targetX,
                    targetY:   this._targetY,
                    alpha:     1,
                    clear:     false,
                    drawAngle: true
                });
            }
        }
    }

    onMouseOut(event) {
        this._mouseTargetX = null;
        this._mouseTargetY = null;
        this.drawResult({
            targetX:   this._targetX,
            targetY:   this._targetY,
            alpha:     1,
            clear:     true,
            drawAngle: true
        });
    }

    onClick(event) {
        let resultCanvas = this._resultCanvas;
        let x            = event.offsetX;
        let y            = event.offsetY;
        let width        = resultCanvas.width;
        let height       = resultCanvas.height;
        if ((x > 4) && (y > 4) && (x < width - 4) && (y < height - 4)) {
            this._targetX = Math.round((x - width  * 0.5) / sizeX);
            this._targetY = Math.round((y - height * 0.5) / sizeY);
            this.drawResult({
                targetX:   this._targetX,
                targetY:   this._targetY,
                alpha:     1,
                clear:     true,
                drawAngle: true
            });
            this._refs.target.innerHTML = 'Target (' + this._targetX + ',' + this._targetY + ')';
        }
    }

    onShow(opts) {
        this.drawGrid();
        this.show();
        this.drawResult({
            targetX:   this._targetX,
            targetY:   this._targetY,
            alpha:     1,
            clear:     true,
            drawAngle: true
        });
    }
};

exports.InverseKinematicsDialog.SHOW_SIGNAL = SHOW_SIGNAL;
