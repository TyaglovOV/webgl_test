import vectorField from './vectorField/vectorField'

export enum Pages {
  VectorField = 'vectorField'
}

const pages = [
  {
    id: Pages.VectorField,
    name: Pages.VectorField,
    body: vectorField
  }
]

export default pages
