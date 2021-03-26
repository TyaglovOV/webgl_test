export function getPixelByCoords({ dx, dy, v_texCoord = 'v_texCoord', u_sampler = 'u_sampler', u_textureSize = 'u_textureSize' }:
                                   { dx: string, dy: string, v_texCoord?: string, u_sampler?: string, u_textureSize?: string }) {

  console.log(`
    int getPixelByCoords(int ${dx}, int ${dy}) {
      return int(texture2D(${u_sampler}, ${v_texCoord} + (vec2(1.0, 1.0) / ${u_textureSize}) * vec2(${dx}, ${dy})).r);
    }
  `)

  return `
    int getPixelByCoords(int ${dx}, int ${dy}) {
      return int(texture2D(${u_sampler}, ${v_texCoord} + (vec2(1.0, 1.0) / ${u_textureSize}) * vec2(${dx}, ${dy})).r);
    }
  `
  //int getPixelByCoords(int dx, int dy) {
  //  return int(texture(source, uv + pixelSize * vec2(dx, dy)).r);
  //}
}