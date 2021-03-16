import { createVectorFieldMultiple } from './vectorFieldMultiple'
import { createVectorField } from './vectorField'
import { textureLesson1 } from './textureLesson1'

export enum Pages {
  VectorField = 'vectorField',
  VectorFieldMultiple = 'VectorFieldMultiple',
  TextureLesson1 = 'textureLesson1'
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
  }
] as PagePayload[]

export default pages
