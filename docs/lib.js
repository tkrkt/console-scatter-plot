(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.ScatterPlot = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Align = {
    left: 0,
    center: 1,
    right: 2
  };

  var NodeColor = {
    black: '\u001b[30m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m',
    gray: '\u001b[90m',
    grey: '\u001b[90m',
    reset: '\u001b[0m'
  };

  var Plotter = function () {
    function Plotter() {
      _classCallCheck(this, Plotter);

      this.x = 0;
      this.y = 0;
      this.data = [[]];
    }

    _createClass(Plotter, [{
      key: 'setChar',
      value: function setChar(_ref) {
        var x = _ref.x;
        var y = _ref.y;
        var char = _ref.char;
        var color = _ref.color;

        this.data[y] = this.data[y] || [];
        this.data[y][x] = { char: char, color: color };
      }
    }, {
      key: 'horizonalText',
      value: function horizonalText(_ref2) {
        var _this = this;

        var x = _ref2.x;
        var y = _ref2.y;
        var text = _ref2.text;
        var align = _ref2.align;
        var color = _ref2.color;

        text = '' + text;

        if (align === Align.right) {
          x -= text.length;
        } else if (align === Align.center) {
          x -= Math.floor(text.length / 2);
        }
        x = Math.max(0, x);

        text.split('').forEach(function (char, index) {
          _this.setChar({ x: x + index, y: y, char: char, color: color });
        });
      }
    }, {
      key: 'verticalText',
      value: function verticalText(_ref3) {
        var _this2 = this;

        var x = _ref3.x;
        var y = _ref3.y;
        var text = _ref3.text;
        var align = _ref3.align;
        var color = _ref3.color;

        text = '' + text;

        if (align === Align.right) {
          y -= text.length;
        } else if (align === Align.center) {
          y -= Math.floor(text.length / 2);
        }
        y = Math.max(0, y);

        text.split('').forEach(function (char, index) {
          _this2.setChar({ x: x, y: y + index, char: char, color: color });
        });
      }
    }, {
      key: 'print',
      value: function print() {
        var _console;

        var isNode = typeof window === 'undefined';
        var args = [];

        var str = Array.from(this.data).map(function (row) {
          if (!row) return '';

          return Array.from(row).map(function (item) {
            if (!item) return ' ';

            var char = item.char;
            var color = item.color;

            if (color && isNode && NodeColor[color]) {
              return NodeColor[color] + char + NodeColor.reset;
            } else if (color && !isNode) {
              args.push('color:' + color, '');
              return '%c' + char + '%c';
            } else {
              return char;
            }
          }).join('');
        }).join('\n');
        (_console = console).log.apply(_console, [str].concat(args));
      }
    }, {
      key: 'string',
      value: function string() {
        return Array.from(this.data).map(function (row) {
          if (!row) return '';

          return Array.from(row).map(function (item) {
            if (item) {
              return item.char;
            } else {
              return ' ';
            }
          }).join('');
        }).join('\n');
      }
    }]);

    return Plotter;
  }();

  var ScatterPlot = function () {
    function ScatterPlot() {
      var _ref4 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref4$xAxis = _ref4.xAxis;
      var xAxis = _ref4$xAxis === undefined ? {} : _ref4$xAxis;
      var _ref4$yAxis = _ref4.yAxis;
      var yAxis = _ref4$yAxis === undefined ? {} : _ref4$yAxis;
      var _ref4$points = _ref4.points;
      var points = _ref4$points === undefined ? [] : _ref4$points;

      _classCallCheck(this, ScatterPlot);

      this.xAxis = Object.assign({}, {
        label: 'x',
        length: 60
      }, xAxis);

      this.yAxis = Object.assign({}, {
        label: 'y',
        length: 20
      }, yAxis);

      this.points = points;
    }

    _createClass(ScatterPlot, [{
      key: 'createPlotter',
      value: function createPlotter() {
        var _this3 = this;

        var plotter = new Plotter();

        // calc min/max value
        var range = this.points.reduce(function (range, _ref5) {
          var x = _ref5.x;
          var y = _ref5.y;

          if (range) {
            return [Math.min(range[0], x), Math.max(range[1], x), Math.min(range[2], y), Math.max(range[3], y)];
          } else {
            return [x, x, y, y];
          }
        }, null) || [0, 0, 0, 0];

        // set min/max
        if (typeof this.xAxis.min === 'undefined') {
          this.xAxis.min = range[0];
        }
        if (typeof this.xAxis.max === 'undefined') {
          this.xAxis.max = range[1];
        }
        if (typeof this.yAxis.min === 'undefined') {
          this.yAxis.min = range[2];
        }
        if (typeof this.yAxis.max === 'undefined') {
          this.yAxis.max = range[3];
        }

        // differentiate min/max
        if (this.xAxis.min === this.xAxis.max) {
          this.xAxis.max += 1;
        }
        if (this.yAxis.min === this.yAxis.max) {
          this.yAxis.max += 1;
        }

        var topMargin = 1;
        var leftMargin = Math.max(('' + this.yAxis.min).length, ('' + this.yAxis.max).length) + 1;

        // print border
        plotter.horizonalText({
          x: leftMargin,
          y: topMargin,
          text: '-'.repeat(this.xAxis.length),
          color: this.xAxis.color
        });
        plotter.horizonalText({
          x: leftMargin,
          y: topMargin + this.yAxis.length,
          text: '-'.repeat(this.xAxis.length),
          color: this.xAxis.color
        });
        plotter.verticalText({
          x: leftMargin,
          y: topMargin,
          text: '|'.repeat(this.yAxis.length),
          color: this.yAxis.color
        });
        plotter.verticalText({
          x: leftMargin + this.xAxis.length,
          y: topMargin,
          text: '|'.repeat(this.yAxis.length),
          color: this.yAxis.color
        });

        // print corner
        plotter.setChar({ x: leftMargin, y: topMargin, char: '+' });
        plotter.setChar({ x: leftMargin + this.xAxis.length, y: topMargin, char: '+' });
        plotter.setChar({ x: leftMargin + this.xAxis.length, y: topMargin + this.yAxis.length, char: '+' });
        plotter.setChar({ x: leftMargin, y: topMargin + this.yAxis.length, char: '+' });

        // print axis label
        plotter.horizonalText({
          x: leftMargin,
          y: 0,
          text: this.yAxis.label,
          align: Align.center,
          color: this.yAxis.color
        });
        plotter.horizonalText({
          x: leftMargin + this.xAxis.length + 2,
          y: topMargin + this.yAxis.length,
          text: this.xAxis.label,
          color: this.xAxis.color
        });

        // print minX/maxX
        var minXPos = leftMargin;
        var maxXPos = leftMargin + this.xAxis.length;

        if (this.xAxis.flip) {
          var _ref6 = [maxXPos, minXPos];
          minXPos = _ref6[0];
          maxXPos = _ref6[1];
        }
        plotter.horizonalText({
          x: minXPos,
          y: topMargin + this.yAxis.length + 1,
          text: this.xAxis.min,
          align: Align.center,
          color: this.xAxis.color
        });
        plotter.horizonalText({
          x: maxXPos,
          y: topMargin + this.yAxis.length + 1,
          text: this.xAxis.max,
          align: Align.center,
          color: this.xAxis.color
        });

        // print minY/maxY
        var minYPos = topMargin + this.yAxis.length;
        var maxYPos = topMargin;

        if (this.yAxis.flip) {
          var _ref7 = [maxYPos, minYPos];
          minYPos = _ref7[0];
          maxYPos = _ref7[1];
        }
        plotter.horizonalText({
          x: leftMargin - 1,
          y: maxYPos,
          text: this.yAxis.max,
          align: Align.right,
          color: this.yAxis.color
        });
        plotter.horizonalText({
          x: leftMargin - 1,
          y: minYPos,
          text: this.yAxis.min,
          align: Align.right,
          color: this.yAxis.color
        });

        // print points
        this.points.forEach(function (_ref8) {
          var x = _ref8.x;
          var y = _ref8.y;
          var marker = _ref8.marker;
          var color = _ref8.color;

          var xStep = Math.floor((x - _this3.xAxis.min) * _this3.xAxis.length / (_this3.xAxis.max - _this3.xAxis.min));
          var yStep = Math.floor((y - _this3.yAxis.min) * _this3.yAxis.length / (_this3.yAxis.max - _this3.yAxis.min));
          var xFlip = _this3.xAxis.flip ? _this3.xAxis.length - xStep : xStep;
          var yFlip = _this3.yAxis.flip ? yStep : _this3.yAxis.length - yStep;
          plotter.setChar({
            x: leftMargin + xFlip,
            y: topMargin + yFlip,
            char: marker || '*',
            color: color
          });
        });

        return plotter;
      }
    }, {
      key: 'print',
      value: function print() {
        this.createPlotter().print();
      }
    }, {
      key: 'string',
      value: function string() {
        return this.createPlotter().string();
      }
    }]);

    return ScatterPlot;
  }();

  exports.default = ScatterPlot;
  module.exports = exports['default'];
});
