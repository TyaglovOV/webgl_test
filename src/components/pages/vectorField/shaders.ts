const initialVertex = `
    attribute vec3 a_Position; // аттрибуты разные для каждой вершины
    // attribute vec a_EndOfLine;
    // attribute vec3 a_Color;
    // uniform float u_Shift;
    uniform vec2 u_Pos1;
    uniform vec2 u_Pos2;
    uniform float u_Pow;
    uniform float u_Multiplier;
    uniform float u_Inverse;
     
    void main() {
      float isEndOfLine = a_Position.z; // если 1.0 -> это конец линии, в конце просто умножаем прибавку к координатам
       
      float inverseDistance = u_Multiplier / sqrt(pow((a_Position.x - u_Pos1.x), 2.0) + 
        pow((a_Position.y - u_Pos1.y), 2.0)); // обратное расстояние до точки, чем ближе, тем больше длина
      
      float dotX = a_Position.x + isEndOfLine * u_Inverse * (u_Pos1.x - a_Position.x) * pow(inverseDistance, u_Pow);
      float dotY = a_Position.y + isEndOfLine * u_Inverse * (u_Pos1.y - a_Position.y) * pow(inverseDistance, u_Pow);
      
      if (u_Inverse == 1.0) {
        if (abs(a_Position.x - u_Pos1.x) < a_Position.z * abs(a_Position.x - dotX)) {
          dotX = u_Pos1.x;
        }
        
        if (abs(a_Position.y - u_Pos1.y) < a_Position.z * abs(a_Position.y - dotY)) {
          dotY = u_Pos1.y;
        }
      }
      
      dotX = dotX * 2.0 - 1.0;
      dotY = dotY * 2.0 - 1.0;
      
      gl_Position = vec4(dotX, dotY, 0, 1.0); // произошел перенос -- перемножаем матрицы переноса на вектор пространства
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

export const vectorFieldShaders = [initialVertex, initialFragment]
