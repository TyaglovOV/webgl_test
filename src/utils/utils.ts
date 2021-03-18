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

type webglText = {
  image: HTMLImageElement,
  webglTexture: null | WebGLTexture
}

export function getTexture(gl: CanvasContext, url: string): webglText {
  const image = new Image()
  const texture : webglText = {
    image,
    webglTexture: null
  }

  image.onload = () => {
    const tex = gl.createTexture()

    // просто пиздец
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)

    texture.webglTexture = tex
  }

  image.src = url

  return texture
}

export function createTextureRenderBuffer(gl: CanvasContext, renderBuffer: WebGLRenderbuffer | null, level: number = 0) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, level)
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer)

  // отвязываем
  gl.bindTexture(gl.TEXTURE_2D,null)

  return texture
}
