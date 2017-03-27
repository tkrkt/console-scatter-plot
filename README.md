# console-scatter-plot

Simple scatter plot generator writing into browser/node console

```
npm install --save console-scatter-plot
```

```js
import ScatterPlot from 'console-scatter-plot';

var option = {
  xAxis: {
    label: 'xLabel',
    color: '#0a5'
  },
  yAxis: {
    label: 'yLabel',
    color: 'rgb(150,150,200)'
  },
  points: [
    {x: 100, y: 30, color: 'red'},
    {x: 20, y: 60, marker: '@'}
  ]
};

var scatterPlot = new ScatterPlot(option);

var graph = scatterPlot.string(); // get graph as string (without color)
scatterPlot.print(); // print to console
```

<img src="./snapshot.png" width="640px">

[demo](https://tkrkt.github.com/console-scatter-plot)

## option

|param|-|default|
|---|---|---|
|xAxis|label|'x'|
| |min|(auto)|
| |max|(auto)|
| |length|60|
| |color|(default)|
| |flip|false|
|yAxis|label|'y'|
| |min|(auto)|
| |max|(auto)|
| |length|20|
| |color|(default)|
| |flip|false|
|points[]|x|(required)|
| |y|(required)|
| |marker|'\*'|
| |color|(default)|


## color option

* Browser
    * CSS color style (#f00, rgb(255, 0, 0), red, ...)
* Node.js
    * black
    * red
    * green
    * yellow
    * blue
    * magenta
    * cyan
    * white
    * gray
    * grey
