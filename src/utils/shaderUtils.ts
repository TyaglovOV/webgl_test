export function getPixelByCoords({ dx = 'dx', dy = 'dy', v_texCoord = 'v_texCoord', u_sampler = 'u_sampler', u_textureSize = 'u_textureSize' }:
                                   { dx?: string, dy?: string, v_texCoord?: string, u_sampler?: string, u_textureSize?: string }) {
  // int getPixelByCoords(int dx, int dy) {
  //   return int(texture2D(u_sampler, v_texCoord + (vec2(1.0, 1.0) / u_textureSize) * vec2(dx, dy)).r);
  // }

  return `
    int getPixelByCoords(int ${dx}, int ${dy}) {
      return int(texture2D(${u_sampler}, ${v_texCoord} + (vec2(1.0, 1.0) / ${u_textureSize}) * vec2(${dx}, ${dy})).r);
    }
  `
}

export function goldNoise({ xy = 'xy', seed = 'seed' }: { xy?: string, seed?: string }) {
  // float PHI = 1.61803398874989484820459;
  //
  // float goldNoise(vec2 xy, float seed) {
  //   return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);
  // }

  return `
    float PHI = 1.61803398874989484820459;
    
    float goldNoise(vec2 ${xy}, float ${seed}) {
      return fract(tan(distance(${xy} * PHI, ${xy}) * ${seed}) * ${xy}.x);
    }
  `
}