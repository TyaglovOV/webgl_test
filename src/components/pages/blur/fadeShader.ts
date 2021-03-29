const initialVertex = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    
    varying vec2 v_texCoord;
    
    void main() {
      v_texCoord = a_texCoord;
      
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `

const initialFragment = `
    precision mediump float;
    
    uniform sampler2D u_sampler;
    uniform vec2 u_textureSize;
    
    uniform float u_kernel[9];
    uniform float u_kernelWeight;
     
    // texCoords, переданные из вершинного шейдера
    varying vec2 v_texCoord;
     
    void main() {
       vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
       vec4 colorSum =
         texture2D(u_sampler, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
         texture2D(u_sampler, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
     
       // делим сумму на весовой коэффициент, но берём из результата только rgb
       // прозрачность установим в значение 1.0
       
       gl_FragColor = vec4((colorSum / u_kernelWeight).rgb * 0.98, 1.0);
    }
  `

export const fadeShader = [initialVertex, initialFragment]
