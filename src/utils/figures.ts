function createFlatPlane() {
  return [
    -1, -1,
    1, -1,
    1, 1,

    -1, -1,
    1, 1,
    -1, 1,
  ]
}

function createFlatPlaneTexCoords() {
  return [
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

    0.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ]
}

export const figures = {
  flatPlane: {
    vertices: createFlatPlane(),
    texCoords: createFlatPlaneTexCoords()
  }
}
