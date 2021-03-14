const initialVertex = `
    attribute vec4 a_Position; // аттрибуты разные для каждой вершины
    attribute float a_PointSize;
     
    void main() {
      gl_PointSize = a_PointSize;
      gl_Position = a_Position;
    }
  `

const initialFragment = `
    // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
    // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
    precision mediump float;
    uniform vec4 u_FragColor;
     
    void main() {
      // gl_FragColor - специальная переменная фрагментного шейдера.
      // Она отвечает за установку цвета.
      gl_FragColor = u_FragColor; 
    }
  `

export const lesson2 = [initialVertex, initialFragment]
