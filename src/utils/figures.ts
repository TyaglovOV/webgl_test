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

function createRandomPoints(count: number, normalized: boolean = true) {
  const points = new Array(count * 2)

  for (let i = 0; i < count * 2; i++) {
    points[i] = ((Math.random() * 2) - 1)
  }

  return points
}

export const figures = {
  flatPlane: {
    vertices: createFlatPlane,
    texCoords: createFlatPlaneTexCoords
  },
  points: {
    verticesRandom: createRandomPoints
  }
}
