export type CanvasContext = WebGL2RenderingContext | WebGLRenderingContext
export enum ShaderType {
  Vertex = WebGLRenderingContext.VERTEX_SHADER,
  Fragment = WebGLRenderingContext.FRAGMENT_SHADER
}
export type GLSLShader = string
export type DrawAction = () => void

export function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
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

  return <WebGL2RenderingContext>context
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

export function createTextureForFrameBuffer({ gl, level = 0, width, height, format, data }: {
  gl: CanvasContext, level?: number, width: number, height: number, format?: number, data?: any
}) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.texImage2D(gl.TEXTURE_2D, level, format || gl.RGBA, width, height, 0, format || gl.RGBA, gl.UNSIGNED_BYTE, data || null)

  return texture
}

type Framebuffer = {
  texture: WebGLTexture | null,
  fb: WebGLFramebuffer | null,
  width: number,
  height: number,
  texelSizeX: number,
  texelSizeY: number,
  makeActive: (level?: number) => number
}

export function createFrameBuffer({ gl, level = 0, width, height, format }: {
  gl: CanvasContext, level?: number, width: number, height: number, format?: number
}): Framebuffer {
  const texture = createTextureForFrameBuffer({ gl, level, width, height, format })
  const fb = gl.createFramebuffer()

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.viewport(0, 0, width, height)
  gl.clear(gl.COLOR_BUFFER_BIT)

  return {
    texture,
    fb,
    width,
    height,
    texelSizeX: 1.0 / width,
    texelSizeY: 1.0 / height,
    makeActive: (level: number = 0) => {
      gl.activeTexture(gl.TEXTURE0 + level)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      return level
    }
  }
}

type DoubleFramebuffer = {
  read: Framebuffer,
  write: Framebuffer,
  swap: () => void
}

export function createDoubleFrameBuffer({ gl, level = 0, width, height, format }: {
  gl: CanvasContext, level?: number, width: number, height: number, format?: number
}): DoubleFramebuffer {
  let fb1 = createFrameBuffer({ gl, level, width, height, format })
  let fb2 = createFrameBuffer({ gl, level, width, height, format })

  return {
    get read() {
      return fb1
    },
    get write() {
      return fb2
    },
    swap() {
      let temp = fb1
      fb1 = fb2
      fb2 = temp
    }
  }
}

export function drawToFramebuffer({ gl, fb, width, height, draw }: {
  gl: CanvasContext, fb: Framebuffer, width: number, height: number, draw?: DrawAction
}) {
  gl.viewport(0, 0, width, height)
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb?.fb)
  draw && draw()
  gl.bindTexture(gl.TEXTURE_2D, fb.texture)
}

export function drawToDoubleFramebuffer({ gl, dfbo, width, height, draw }: {
  gl:  CanvasContext, dfbo: DoubleFramebuffer, width: number, height: number, draw?: DrawAction
}) {
  drawToFramebuffer({ gl, fb: dfbo.read, width, height, draw })
  dfbo.swap()
}
