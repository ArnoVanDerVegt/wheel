/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ChartDrawer = require('./ChartDrawer').ChartDrawer;

exports.SplineChartDrawer = class extends ChartDrawer {
    // Catmull-rom spline: http://www.mvps.org/directx/articles/catmull/
    spline(p0, p1, p2, p3, t) {
        return 0.5 * ((2 * p1) +
            t * ((-p0 + p2) +
            t * ((2 * p0 - 5 * p1 + 4 * p2 - p3) +
            t * (-p0 + 3 * p1 - 3 * p2 + p3))));
    }
};
