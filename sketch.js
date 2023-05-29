const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
};

const colors = [
  "#7FB1FF",
  "#A1E9FF",
  "#BFC0FF",
  "#7869F1",
  "#FFB6E4",
  "#FEC896",
  "#FFE87F",
  "#83FFC1",
];

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = random.rangeFloor(40, 80);

    const colorCount = random.rangeFloor(2, 8);
    const colorsToPickFrom = random.shuffle(colors);
    const palette = colorsToPickFrom.slice(0, colorCount);

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.075;

        points.push({
          color: random.pick(palette),
          radius: radius,
          position: [u, v],
          rotation: random.noise2D(u, v) * .5,
        });
      }
    }

    return points;
  };

  // random.setSeed(512);
  const points = createGrid().filter(() => random.value() > .5);
  const margin = 300;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    points.forEach((data) => {
      const {
        position: [u, v],
        radius,
        color,
        rotation
      } = data;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.lineWidth = 1;
      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('⧉', 0, 0);
      // context.fillText('⧋', 0, 0);
      // context.fillText('⩕', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
