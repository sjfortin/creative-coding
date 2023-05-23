const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#7FB1FF';
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.arc(width / 2, height / 2, 100, 0, Math.PI * 2, false);
    context.fillStyle = '#A1E9FF';
    context.fill();

    context.lineWidth = 30;
    context.strokeStyle = '#BFC0FF';
    context.stroke();
  };
};

canvasSketch(sketch, settings);
