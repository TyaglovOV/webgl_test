import { createVectorFieldMultiple } from './vectorFieldMultiple'
import { createVectorField } from './vectorField'
import { textureLesson1 } from './textureLesson1'
import { textureLesson2 } from './textureLesson2'
import { mandelbrotSet } from './mandelbrotSet'
import { tryToSwapTextures } from './tryToSwapTextures'

export enum Pages {
  VectorField = 'vectorField',
  VectorFieldMultiple = 'VectorFieldMultiple',
  TextureLesson1 = 'textureLesson1',
  TextureLesson2 = 'textureLesson2',
  MandelbrotSet = 'mandelbrotSet',
  TryToSwapTextures = 'tryToSwapTextures'
}

export type PagePayload = {
  id: Pages.VectorField,
  name: string,
  createScene: (canvas: HTMLCanvasElement, controlsParentNode: HTMLDivElement) => {
    init: () => void,
    createControls: () => void,
    clear: () => void,
  }
}

const pages = [
  {
    id: Pages.VectorField,
    name: Pages.VectorField,
    createScene: createVectorField
  },
  {
    id: Pages.VectorFieldMultiple,
    name: Pages.VectorFieldMultiple,
    createScene: createVectorFieldMultiple
  },
  {
    id: Pages.TextureLesson1,
    name: Pages.TextureLesson1,
    createScene: textureLesson1
  },
  {
    id: Pages.TextureLesson2,
    name: Pages.TextureLesson2,
    createScene: textureLesson2
  },
  {
    id: Pages.MandelbrotSet,
    name: Pages.MandelbrotSet,
    createScene: mandelbrotSet
  },
  {
    id: Pages.TryToSwapTextures,
    name: Pages.TryToSwapTextures,
    createScene: tryToSwapTextures
  }
] as PagePayload[]

export default pages
