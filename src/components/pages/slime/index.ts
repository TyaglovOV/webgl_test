import {
  createDoubleFrameBuffer,
  drawToDoubleFramebuffer,
  getContext,
  setCanvasToFullScreen
} from '../../../utils/utils'
import { pathFindingTFShader } from './pathFindingTFShader'
import { particlesShader } from './particlesShader'
import { fadeShader } from './fadeShader'
import { blurShader } from './blurShader'
import { VertexShader } from '../../../shaders/vertexShader'
import { FragmentShader } from '../../../shaders/fragmentShader'
import { Program } from '../../../programs/program'
import { figures } from '../../../utils/figures'
import { mat4 } from 'gl-matrix'
import { blurKernel, computeKernelWeight } from '../../../utils/imageProcessing';

export function slime(canvas: HTMLCanvasElement, controlParent: HTMLDivElement) {
  setCanvasToFullScreen(canvas)

  const gl = getContext(canvas)

  const programs = {
    pathFinding: new Program(gl,pathFindingTFShader,
      {
        transfromFeedbackAttributes: gl.SEPARATE_ATTRIBS,
        transfromFeedbackVaryings: ['newPosition']
      }),
    particles: new Program(gl, particlesShader),
    fade: new Program(gl, fadeShader),
    blur: new Program(gl, blurShader)
  }

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const pathFindingLocs = {
    oldPosition: gl.getAttribLocation(programs.pathFinding.program, 'oldPosition'),
    velocity: gl.getAttribLocation(programs.pathFinding.program, 'velocity'),
    u_step: gl.getUniformLocation(programs.pathFinding.program, 'u_step'),
    u_canvasDimensions: gl.getUniformLocation(programs.pathFinding.program, 'u_canvasDimensions')
  }

  const particlesLocs = {
    position: gl.getAttribLocation(programs.particles.program, 'position'),
    matrix: gl.getUniformLocation(programs.particles.program, 'u_matrix'),
  }
  
  const blurLocs = {
    a_texCoord: gl.getAttribLocation(programs.blur.program, 'a_texCoord'),
    a_position: gl.getAttribLocation(programs.blur.program, 'a_position'),
    u_textureSize: gl.getUniformLocation(programs.blur.program, 'u_textureSize'),
    kernelLocation: gl.getUniformLocation(programs.blur.program, "u_kernel[0]"),
    kernelWeightLocation: gl.getUniformLocation(programs.blur.program, "u_kernelWeight"),
  }

  const dfbo = createDoubleFrameBuffer({ gl, width: canvas.clientWidth, height: canvas.clientHeight })

  const rand = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  const numParticles = 200;
  const createPoints = (num: number, ranges: number[][]) => {
    return new Array(num)
      .fill(0)
      .map((_) => {
        return ranges.map((range) => {
          return rand(range[0], range[1])
        })
      }).flat();
  }
  const positions = new Float32Array(createPoints(numParticles, [[0, canvas.width], [0, canvas.height]]));
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
    [position1Buffer, pathFindingLocs.oldPosition],
    [velocityBuffer, pathFindingLocs.velocity],
  ]);
  const updatePositionVA2 = makeVertexArray(gl, [
    [position2Buffer, pathFindingLocs.oldPosition],
    [velocityBuffer, pathFindingLocs.velocity],
  ]);

  const drawVA1 = makeVertexArray(
    gl, [[position1Buffer, particlesLocs.position]]);
  const drawVA2 = makeVertexArray(
    gl, [[position2Buffer, particlesLocs.position]]);

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

    dst[0] = 2 / (right - left);
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 0;
    dst[5] = 2 / (top - bottom);
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  }

  function animate(time: number) {
    if (done) {
      return
    }

    setCanvasToFullScreen(canvas)
    gl.clear(gl.COLOR_BUFFER_BIT)

    programs.pathFinding.use()
    gl.bindVertexArray(current.updateVA)
    gl.uniform1f(pathFindingLocs.u_step, count)
    gl.uniform2f(pathFindingLocs.u_canvasDimensions, gl.canvas.width, gl.canvas.height)

    gl.enable(gl.RASTERIZER_DISCARD)

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tf);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // turn on using fragment shaders again
    gl.disable(gl.RASTERIZER_DISCARD)

    // now draw the particles.
    programs.particles.use()
    gl.bindVertexArray(current.drawVA)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.uniformMatrix4fv(
      particlesLocs.matrix,
      false,
      //@ts-ignore
      orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1));
    gl.drawArrays(gl.POINTS, 0, numParticles);

    count++
    requestAnimationFrame(animate)
  }

  function init() {
    animate(0)
  }

  function createControls() {
  }

  function clear() {
    done = true
  }

  return {
    init,
    createControls,
    clear
  }
}
