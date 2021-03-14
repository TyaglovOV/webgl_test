const initialVertex = `
    attribute vec2 a_Position; // аттрибуты разные для каждой вершины
    attribute vec3 a_Color;
    uniform mat4 u_Pmatrix;
    uniform mat4 u_Mmatrix;
    uniform mat4 u_Vmatrix;
    varying vec3 v_Color;
     
    void main() {
      v_Color = a_Color;
      gl_Position = u_Pmatrix * u_Mmatrix * u_Vmatrix * vec4(a_Position, 1.0, 1.0); // произошел перенос -- перемножаем матрицы переноса на вектор пространства
    }
  `

const initialFragment = `
    // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
    // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
    precision mediump float;
    varying vec3 v_Color;
     
    void main() {
      // gl_FragColor - специальная переменная фрагментного шейдера.
      gl_FragColor = vec4(v_Color, 1.0); 
    }
  `

export const lesson2 = [initialVertex, initialFragment]
