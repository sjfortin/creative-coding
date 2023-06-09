const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const radius = 100;
  var dashes = [12, 6];
  var lineOne;
  var lineTwo;
  const colorOptions = [
    "#7FB1FF",
    "#A1E9FF",
    "#BFC0FF",
    "#7869F1",
    "#FFB6E4",
    "#FEC896",
    "#FFE87F",
    "#83FFC1",
  ];

  function getRandomColors(array, count) {
    // Create a copy of the array to avoid mutating the original
    const tempArray = [...array];

    // The result array for the random colors
    let result = [];

    for (let i = 0; i < count; i++) {
      // Generate a random index based on the current length of tempArray
      const randomIndex = Math.floor(Math.random() * tempArray.length);

      // Remove the selected color from tempArray and add it to the result array
      result.push(...tempArray.splice(randomIndex, 1));
    }

    return result;
  }

  // Get 3 random colors from colorOptions
  const colors = getRandomColors(colorOptions, 2);

  var lineTypes = [
    // arcs from corners
    function (c, x, y, radius) {
      drawQuarter(c, x, y, radius, 3, 0);
    },
    function (c, x, y, radius) {
      drawQuarter(c, x, y, radius, 0, 1);
    },
    function (c, x, y, radius) {
      drawQuarter(c, x, y, radius, 1, 2);
    },
    function (c, x, y, radius) {
      drawQuarter(c, x, y, radius, 2, 3);
    },

    // arcs from sides
    function (c, x, y, radius) {
      drawArc(c, x, y, radius, 0, -1, 0);
    },
    function (c, x, y, radius) {
      drawArc(c, x, y, radius, 1, 0, -1);
    },
    function (c, x, y, radius) {
      drawArc(c, x, y, radius, 2, 1, 0);
    },
    function (c, x, y, radius) {
      drawArc(c, x, y, radius, 3, 0, 1);
    },

    // straight
    function (c, x, y, radius) {
      drawVert(c, x, y, radius, false, false);
    },
    function (c, x, y, radius) {
      drawHoriz(c, x, y, radius, false, false);
    },
    function (c, x, y, radius) {
      drawDiagonalRight(c, x, y, radius, false, false);
    },
    function (c, x, y, radius) {
      drawDiagonalLeft(c, x, y, radius, false, false);
    },

    // not straight
    function (c, x, y, radius) {
      drawVert(c, x, y, radius, false, true);
    },
    function (c, x, y, radius) {
      drawHoriz(c, x, y, radius, false, true);
    },
    function (c, x, y, radius) {
      drawDiagonalRight(c, x, y, radius, false, true);
    },
    function (c, x, y, radius) {
      drawDiagonalLeft(c, x, y, radius, false, true);
    },

    // broken
    function (c, x, y, radius) {
      drawVert(c, x, y, radius, true, false);
    },
    function (c, x, y, radius) {
      drawHoriz(c, x, y, radius, true, false);
    },
    function (c, x, y, radius) {
      drawDiagonalRight(c, x, y, radius, true, false);
    },
    function (c, x, y, radius) {
      drawDiagonalLeft(c, x, y, radius, true, false);
    },
  ];

  // arcs from corners
  function drawQuarter(c, x, y, radius, start, end) {
    var clockWise = false;

    var startAngle = 0.5 * Math.PI * start;
    var endAngle = 0.5 * Math.PI * end;
    var newx = start === 0 || start === 3 ? x : x + radius;
    var newy = end === 0 || end === 3 ? y + radius : y;

    c.beginPath();
    c.arc(newx, newy, radius, startAngle, endAngle, clockWise);
    c.stroke();
  }

  // arcs from sides
  function drawArc(c, x, y, radius, start, cx, cy) {
    var startAngle = (-(1 / 6) + (1 / 2) * start) * Math.PI;
    var endAngle = (-(1 / 6) + (1 / 2) * start + 1 / 3) * Math.PI;
    var clockWise = false;
    var refx = x + 0.5 * radius;
    var refy = y + 0.5 * radius;

    var halfRadius = radius * 0.5;
    var offset = radius * 0.36863;

    var offsetx = refx + cx * (halfRadius + offset);
    var offsety = refy + cy * (halfRadius + offset);

    c.beginPath();
    c.arc(offsetx, offsety, radius, startAngle, endAngle, clockWise);
    c.stroke();
  }

  // narrow limit from 0.2 to 0.8 or from -0.3 to 0.3
  function narrowLimit(signed) {
    var limit = Math.random() * 0.6;
    return !!signed ? limit - 0.3 : limit + 0.2;
  }

  function randomDiagonal(radius) {
    return narrowLimit() * (radius * Math.sqrt(2) * 0.09);
  }

  // straight, not straight and broken
  function drawVert(c, x, y, radius, dashed, random) {
    var offset = 0.5 * radius;
    var threshold = 0.1 * radius;
    if (dashed) {
      c.setLineDash(dashes);
    }
    c.beginPath();
    c.moveTo(x + offset, y);

    if (random) {
      var randx;
      var randy;
      var dx = x + offset;
      var dy = y;
      while (dy < y + radius - threshold) {
        randx = narrowLimit(true) * (radius * 0.09);
        randy = narrowLimit() * radius * 0.18;
        c.lineTo(dx + randx, (dy += randy));
      }
    }

    c.lineTo(x + offset, y + radius);
    c.stroke();
    if (dashed) {
      c.setLineDash([]);
    }
  }

  function drawHoriz(c, x, y, radius, dashed, random) {
    var offset = 0.5 * radius;
    var threshold = 0.1 * radius;
    if (dashed) {
      c.setLineDash(dashes);
    }
    c.beginPath();
    c.moveTo(x, y + offset);

    if (random) {
      var randx;
      var randy;
      var dx = x;
      var dy = y + offset;
      while (dx < x + radius - threshold) {
        randx = narrowLimit() * radius * 0.18;
        randy = narrowLimit(true) * (radius * 0.09);

        c.lineTo((dx += randx), dy + randy);
      }
    }

    c.lineTo(x + radius, y + offset);
    c.stroke();
    if (dashed) {
      c.setLineDash([]);
    }
  }

  function drawDiagonalRight(c, x, y, radius, dashed, random) {
    var threshold = 0.1 * radius;
    if (dashed) {
      c.setLineDash(dashes);
    }
    c.beginPath();
    c.moveTo(x + radius, y);

    if (random) {
      var randx;
      var randy;
      var dx = x + radius;
      var dy = y;
      while (dx > x + threshold && dy < y + radius - threshold) {
        randx = randomDiagonal(radius);
        randy = randomDiagonal(radius);
        c.lineTo((dx -= randx), (dy += randy));
      }
    }

    c.lineTo(x, y + radius);
    c.stroke();
    if (dashed) {
      c.setLineDash([]);
    }
  }

  function drawDiagonalLeft(c, x, y, radius, dashed, random) {
    var threshold = 0.1 * radius;
    if (dashed) {
      c.setLineDash(dashes);
    }
    c.beginPath();
    c.moveTo(x, y);

    if (random) {
      var randx;
      var randy;
      var dx = x;
      var dy = y;
      while (dx < x + radius - threshold && dy < y + radius - threshold) {
        randx = randomDiagonal(radius);
        randy = randomDiagonal(radius);
        c.lineTo((dx += randx), (dy += randy));
      }
    }

    c.lineTo(x + radius, y + radius);
    c.stroke();
    if (dashed) {
      c.setLineDash([]);
    }
  }

  // which lines do cross, which do not
  const crossMatrix = [
    // ◝ ◞ ◟ ◜  ) ⌣ ( ⌢  | - / \  | - / \  ⋮ ⋯ ⋰ ⋱
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],

    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],

    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],

    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],

    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  ];

  function getUnique(oldVal, total) {
    var newVal;
    do {
      do {
        newVal = Math.floor(Math.random() * total);
      } while (newVal === oldVal);
    } while (crossMatrix[oldVal][newVal] === 0);

    return newVal;
  }

  // Insert your utility functions here

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    var blocksx = Math.floor(width / radius);
    var blocksy = Math.floor(height / radius);

    var marginLeft = (width - blocksx * radius) * 0.5; // margin left
    var marginTop = (height - blocksy * radius) * 0.5; // margin top

    var x;
    var y;
    var row;
    var col;

    for (row = 0; row < blocksx; row++) {
      for (col = 0; col < blocksy; col++) {
        lineOne = Math.floor(Math.random() * lineTypes.length);
        lineTwo = getUnique(lineOne, lineTypes.length);
        context.save();
        context.lineWidth = 10;
        context.strokeStyle = colors[Math.floor(Math.random() * colors.length)];

        x = row * radius + marginLeft;
        y = col * radius + marginTop;

        lineTypes[lineOne].call(null, context, x, y, radius);
        lineTypes[lineTwo].call(null, context, x, y, radius);
        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
