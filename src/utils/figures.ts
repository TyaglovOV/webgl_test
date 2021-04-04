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

function createRandomPoints(count: number) {
  const points = new Array(count * 2)

  for (let i = 0; i < count * 2; i++) {
    points[i] = ((Math.random() * 2) - 1)
  }

  return points
}

const rand = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

function createRangeRandomPoints (num: number, ranges: number[][]) {
  return new Array(num)
    .fill(0)
    .map((_) => {
      return ranges.map((range) => {
        return rand(range[0], range[1])
      })
    }).flat();
}

export const figures = {
  flatPlane: {
    vertices: createFlatPlane,
    texCoords: createFlatPlaneTexCoords
  },
  points: {
    verticesRandom: createRandomPoints,
    rangeRandom: createRangeRandomPoints
  }
}
