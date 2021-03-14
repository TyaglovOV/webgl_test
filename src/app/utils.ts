export type CanvasContext = WebGL2RenderingContext | WebGLRenderingContext
export enum ShaderType {
  Vertex = WebGLRenderingContext.VERTEX_SHADER,
  Fragment = WebGLRenderingContext.FRAGMENT_SHADER
}
export type GLSLShader = string

export function getContext(canvas: HTMLCanvasElement): CanvasContext {
  const params = { alpha: false, antialias: true }
  let context: WebGL2RenderingContext | WebGLRenderingContext = <WebGL2RenderingContext>canvas.getContext('webgl2', params)

  if (!Boolean(context)) {
    context = <WebGLRenderingContext>canvas.getContext('webgl', params)
  }

  if (!Boolean(context)) {
    alert('please use modern browser')
    throw new Error('oops')
  }


  context.viewport(0, 0, context.canvas.width, context.canvas.height);

  return context
}

export function setCanvasToFullScreen(canvas: HTMLCanvasElement) {
  const width = scaleByPixelRatio(canvas.clientWidth)
  const height = scaleByPixelRatio(canvas.clientHeight)

  if (width !== canvas.width || height !== canvas.height) {
    canvas.height = height
    canvas.width = width
  }
}

function scaleByPixelRatio (input: number) {
  // todo разобраться, почему делает слишком высокое разрешение
  // const pixelRatio = window.devicePixelRatio || 1
  const pixelRatio = 1
  return Math.floor(input / pixelRatio)
}

export function getShaderType (canvas: CanvasContext, type: ShaderType) {
  return type === ShaderType.Vertex ? canvas.VERTEX_SHADER : canvas.FRAGMENT_SHADER
}

let lastUpdateTime = Date.now();

function calcDeltaTime () {
  let now = Date.now()
  let dt = (now - lastUpdateTime)
  dt = Math.min(dt, 16.666)
  lastUpdateTime = now

  return dt
}
