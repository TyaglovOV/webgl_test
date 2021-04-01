import {
  createDoubleFrameBuffer,
  drawToDoubleFramebuffer,
  getContext,
  setCanvasToFullScreen
} from '../../../utils/utils'
import { particlesShader } from './particlesShader'
import { particlesTFShader } from './particlesTFShader'
import { VertexShader } from '../../../shaders/vertexShader'
import { FragmentShader } from '../../../shaders/fragmentShader'
import { Program } from '../../../programs/program'
import { figures } from '../../../utils/figures'
import { mat4 } from 'gl-matrix';

export function transformFeedbackLesson(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)
  const pointsCount = 10000
  const edgeDetectKernel = [
    1, 2, 1,
    2, 4, 2,
    1, 2, 1
  ]

  const gl = getContext(canvas)

  const particlesPositionTFProgram = new Program(gl, new VertexShader(gl, particlesTFShader[0]), new FragmentShader(gl, particlesTFShader[1]), {
    transfromFeedbackAttributes: gl.SEPARATE_ATTRIBS,
    transfromFeedbackVaryings: ['newPosition']
  })
  const particlesProgram = new Program(gl, new VertexShader(gl, particlesShader[0]), new FragmentShader(gl, particlesShader[1]))

  gl.clearColor(0,0,0,1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const oldPosition = gl.getAttribLocation(particlesPositionTFProgram.program, 'oldPosition')
  const velocity = gl.getAttribLocation(particlesPositionTFProgram.program, 'velocity')
  const u_step = gl.getUniformLocation(particlesPositionTFProgram.program, 'u_step')
  const u_canvasDimensions = gl.getUniformLocation(particlesPositionTFProgram.program, 'u_canvasDimensions')

  const particlesProgramLocs = {
    position: gl.getAttribLocation(particlesProgram.program, 'position'),
    matrix: gl.getUniformLocation(particlesProgram.program, 'u_matrix'),
  }

  const rand = (min: number, max: number) => {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.random() * (max - min) + min;
  }

  const numParticles = 200;
  const createPoints = (num: number, ranges: number[][]) =>
    //@ts-ignore
    new Array(num).fill(0).map(_ => ranges.map(range => rand(...range))).flat();
  const positions = new Float32Array(createPoints(numParticles, [[canvas.width], [canvas.height]]));
  const velocities = new Float32Array(createPoints(numParticles, [[-300, 300], [-300, 300]]));

  //@ts-ignore
  function makeBuffer(gl: WebGL2RenderingContext, sizeOrData, usage) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
    return buf;
  }

  const position1Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
  const position2Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
  const velocityBuffer = makeBuffer(gl, velocities, gl.STATIC_DRAW);

  //@ts-ignore
  function makeVertexArray(gl: WebGL2RenderingContext, bufLocPairs) {
    const va = gl.createVertexArray();
    gl.bindVertexArray(va);
    for (const [buffer, loc] of bufLocPairs) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(
        loc,      // attribute location
        2,        // number of elements
        gl.FLOAT, // type of data
        false,    // normalize
        0,        // stride (0 = auto)
        0,        // offset
      );
    }
    return va;
  }

  const updatePositionVA1 = makeVertexArray(gl, [
    [position1Buffer, oldPosition],
    [velocityBuffer, velocity],
  ]);
  const updatePositionVA2 = makeVertexArray(gl, [
    [position2Buffer, oldPosition],
    [velocityBuffer, velocity],
  ]);

  const drawVA1 = makeVertexArray(
    gl, [[position1Buffer, particlesProgramLocs.position]]);
  const drawVA2 = makeVertexArray(
    gl, [[position2Buffer, particlesProgramLocs.position]]);

  function makeTransformFeedback(gl: WebGL2RenderingContext, buffer: WebGLBuffer | null) {
    const tf = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);
    return tf;
  }

  const tf1 = makeTransformFeedback(gl, position1Buffer);
  const tf2 = makeTransformFeedback(gl, position2Buffer);

  // unbind left over stuff
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  let current = {
    updateVA: updatePositionVA1,  // read from position1
    tf: tf2,                      // write to position2
    drawVA: drawVA2,              // draw with position2
  };
  let next = {
    updateVA: updatePositionVA2,  // read from position2
    tf: tf1,                      // write to position1
    drawVA: drawVA1,              // draw with position1
  };

  let done = false
  let count = 0

  //@ts-ignore
  function orthographic(left, right, bottom, top, near, far, dst) {
    dst = dst || new Float32Array(16);

    dst[ 0] = 2 / (right - left);
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 2 / (top - bottom);
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  }

  function animate (time: number) {
    if (done) {
      return
    }

    setCanvasToFullScreen(canvas)
    gl.clear(gl.COLOR_BUFFER_BIT)

    particlesPositionTFProgram.use()
    gl.bindVertexArray(current.updateVA)
    gl.uniform1f(u_step, count)
    gl.uniform2f(u_canvasDimensions, gl.canvas.width, gl.canvas.height)

    gl.enable(gl.RASTERIZER_DISCARD);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tf);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // turn on using fragment shaders again
    gl.disable(gl.RASTERIZER_DISCARD);

    // now draw the particles.
    particlesProgram.use()
    gl.bindVertexArray(current.drawVA)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.uniformMatrix4fv(
      particlesProgramLocs.matrix,
      false,
      //@ts-ignore
      orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1));
    gl.drawArrays(gl.POINTS, 0, numParticles);

    count++
    requestAnimationFrame(animate)
  }

  function computeKernelWeight(kernel: number[]) {
    const weight = kernel.reduce(function(prev, curr) {
      return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
  }

  function init() {
    animate(0)
  }

  function createControls() {}

  function clear() {
    done = true
  }

  return {
    init,
    createControls,
    clear
  }
}
