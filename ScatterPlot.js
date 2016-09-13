const Align = {
  left: 0,
  center: 1,
  right: 2
};

const NodeColor = {
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

class Plotter {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.data = [[]];
  }

  setChar({x, y, char, color}) {
    this.data[y] = this.data[y] || [];
    this.data[y][x] = {char, color};
  }

  horizonalText({x, y, text, align, color}) {
    text = ('' + text);

    if (align === Align.right) {
      x -= text.length;
    } else if (align === Align.center) {
      x -= Math.floor(text.length / 2);
    }
    x = Math.max(0, x);

    text.split('').forEach((char, index) => {
      this.setChar({x: x + index, y, char, color});
    });
  }

  verticalText({x, y, text, align, color}) {
    text = ('' + text);

    if (align === Align.right) {
      y -= text.length;
    } else if (align === Align.center) {
      y -= Math.floor(text.length / 2);
    }
    y = Math.max(0, y);

    text.split('').forEach((char, index) => {
      this.setChar({x, y: y + index, char, color});
    });
  }

  print() {
    const isNode = typeof window === 'undefined';
    const args = [];

    const str = Array.from(this.data).map(row => {
      if (!row) return '';

      return Array.from(row).map(item => {
        if (!item) return ' ';

        const {char, color} = item;
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
    console.log(str, ...args);
  }

  string() {
    return Array.from(this.data).map(row => {
      if (!row) return '';

      return Array.from(row).map(item => {
        if (item) {
          return item.char;
        } else {
          return ' ';
        }
      }).join('');
    }).join('\n');
  }
}

export default class ScatterPlot {
  constructor({xAxis = {}, yAxis = {}, points = []} = {}) {
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

  createPlotter() {
    const plotter = new Plotter();

    // calc min/max value
    const range = this.points.reduce((range, {x, y}) => {
      if (range) {
        return [
          Math.min(range[0], x),
          Math.max(range[1], x),
          Math.min(range[2], y),
          Math.max(range[3], y)
        ];
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

    const topMargin = 1;
    const leftMargin = Math.max(('' + this.yAxis.min).length, ('' + this.yAxis.max).length) + 1;

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
    plotter.setChar({x: leftMargin, y: topMargin, char: '+'});
    plotter.setChar({x: leftMargin + this.xAxis.length, y: topMargin, char: '+'});
    plotter.setChar({x: leftMargin + this.xAxis.length, y: topMargin + this.yAxis.length, char: '+'});
    plotter.setChar({x: leftMargin, y: topMargin + this.yAxis.length, char: '+'});

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
    let [minXPos, maxXPos] = [leftMargin, leftMargin + this.xAxis.length];
    if (this.xAxis.flip) {
      [minXPos, maxXPos] = [maxXPos, minXPos];
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

    // pring minY/maxY
    let [minYPos, maxYPos] = [topMargin + this.yAxis.length, topMargin];
    if (this.yAxis.flip) {
      [minYPos, maxYPos] = [maxYPos, minYPos];
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
    this.points.forEach(({x, y, marker, color}) => {
      const xStep = Math.floor((x - this.xAxis.min) * this.xAxis.length / (this.xAxis.max - this.xAxis.min));
      const yStep = Math.floor((y - this.yAxis.min) * this.yAxis.length / (this.yAxis.max - this.yAxis.min));
      const xFlip = this.xAxis.flip ? this.xAxis.length - xStep : xStep;
      const yFlip = this.yAxis.flip ? yStep : this.yAxis.length - yStep;
      plotter.setChar({
        x: leftMargin + xFlip,
        y: topMargin + yFlip,
        char: marker || '*',
        color
      });
    });

    return plotter;
  }

  print() {
    this.createPlotter().print();
  }

  string() {
    this.createPlotter().string();
  }
}
