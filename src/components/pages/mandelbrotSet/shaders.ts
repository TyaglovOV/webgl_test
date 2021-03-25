const initialVertex = `
    attribute vec3 a_Position;
    
    void main() {
      gl_Position = vec4(a_Position, 1.0);
    }
  `

const initialFragment = `
    // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
    // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
    precision mediump float;
    uniform vec2 u_canvasSize;
    uniform float u_zoom;
    uniform vec2 u_offset;
    uniform int u_shades;
    
    void main() {
      const int maxIterations = 100;
      
      vec2 newCoords = vec2(
        (gl_FragCoord.x - (u_canvasSize.x + u_offset.x * u_zoom) / 2.0) / (u_canvasSize.x * u_zoom),
        (gl_FragCoord.y - (u_canvasSize.y + u_offset.y * u_zoom) / 2.0) / (u_canvasSize.y * u_zoom)
      ); // координаты канваса изменил в координаты, из которых можно вычислить мандельброт
      
      float originalX = newCoords.x;
      float originalY = newCoords.y;
     
      int iterationCount = 0;
      
      for (int i = 0; i < maxIterations; i++) {
        iterationCount++;
        
        float realComponent = pow(newCoords.x, 2.0) - pow(newCoords.y, 2.0);
        float complexComponent = 2.0 * newCoords.x * newCoords.y;

        newCoords.x = realComponent + originalX;
        newCoords.y = complexComponent + originalY;

        if (pow(newCoords.x, 2.0) + pow(newCoords.y, 2.0) > 16.0) {
          break;
        }
      }
      
      float color = 1.0;

      if (iterationCount == maxIterations) {
        color = 0.0;
      }
      
      if (u_shades == 0) {
        color = float(maxIterations - iterationCount) / float(maxIterations);
      }
      
      gl_FragColor = vec4(color, color, color, 1.0);
    }
  `

export const textureLesson1Shaders = [initialVertex, initialFragment]
