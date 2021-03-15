import { createVectorFieldMultiple } from './vectorFieldMultiple'
import { createVectorField } from './vectorField'

export enum Pages {
  VectorField = 'vectorField',
  VectorFieldMultiple = 'VectorFieldMultiple'
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
  }
] as PagePayload[]

export default pages
