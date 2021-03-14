export const verVars = {
  posAttr: 'a_position',
  resUni: 'u_resolution'
}

export const fragVars = {
  colorUni: 'u_color'
}

const initialVertex = `
    attribute vec2 ${verVars.posAttr};
    uniform vec2 ${verVars.resUni};
     
    // все шейдеры имеют функцию main
    void main() {
      // преобразуем положение в пикселях к диапазону от 0.0 до 1.0
      vec2 zeroToOne = ${verVars.posAttr}.xy / ${verVars.resUni};
      
      // преобразуем из 0->1 в 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;
      
      // преобразуем из 0->2 в -1->+1 (пространство отсечения)
      vec2 clipSpace = zeroToTwo - 1.0;
     
      // gl_Position - специальная переменная вершинного шейдера,
      // которая отвечает за установку положения
      gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);
    }
  `

const initialFragment = `
    // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
    // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
    precision mediump float;
    uniform vec4 ${fragVars.colorUni};
     
    void main() {
      // gl_FragColor - специальная переменная фрагментного шейдера.
      // Она отвечает за установку цвета.
      gl_FragColor = ${fragVars.colorUni}; 
    }
  `

export const initialShaders = [initialVertex, initialFragment]
