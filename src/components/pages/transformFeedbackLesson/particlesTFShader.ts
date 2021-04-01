// по сути вершинный шейдер в трансформ фидбек буферах ответственен за логику по изменению позиции частицы во времени.
// он не занимается отрисовкой или чем-то подобным -- исключение расчет состояния и передача его дальше.
// уже после всего другой шейдерик берет эти данные и отрисовывает
const initialVertex = `#version 300 es
    in vec2 oldPosition;
    in vec2 velocity;
    
    uniform float u_step;
    uniform vec2 u_canvasDimensions;
    
    out vec2 newPosition;
    
    vec2 euclideanModulo(vec2 n, vec2 m) {
      return mod(mod(n, m) + m, m);
    }
    
    void main() {
      newPosition = euclideanModulo(
          oldPosition + velocity * u_step / 100.0,
          u_canvasDimensions);
    }
  `

// в трансформ фидбек шейдериках, если основная логика задействована в вершинном, в фрагментном ничо не делаем
const initialFragment = `#version 300 es
  precision highp float;
  void main() {
  }
  `

export const particlesTFShader = [initialVertex, initialFragment]
