const initialVertex = `
    attribute vec2 a_Position; // аттрибуты разные для каждой вершины
    attribute vec3 a_Color;
    uniform float u_Shift;
    uniform vec2 u_Pos1;
    uniform vec2 u_Pos2;
     
    void main() {
      float a_PointSize = 3.0;
      gl_PointSize = a_PointSize;
      
      gl_Position = vec4(a_Position.x + u_Shift, a_Position.y, 0, 1.0); // произошел перенос -- перемножаем матрицы переноса на вектор пространства
    }
  `

const initialFragment = `
    // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
    // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
    precision mediump float;
     
    void main() {
      // gl_FragColor - специальная переменная фрагментного шейдера.
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); 
    }
  `

export const lesson2 = [initialVertex, initialFragment]
