const initialVertex = `
    attribute vec3 a_Position; // аттрибуты разные для каждой вершины
    
    uniform vec2 u_Pos1;
    uniform vec2 u_Pos2;
    uniform vec2 u_Pos3;
    
    uniform float u_Pow;
    uniform float u_Multiplier;
    uniform float u_Inverse;
     
    void main() {
      float isEndOfLine = a_Position.z; // если 1.0 -> это конец линии, в конце просто умножаем прибавку к координатам
      
      float dotX = a_Position.x;
      float dotY = a_Position.y;
      
      if (isEndOfLine == 1.0) {
        float inverseDistance1 = u_Multiplier / sqrt(pow((a_Position.x - u_Pos1.x), 2.0) + 
          pow((a_Position.y - u_Pos1.y), 2.0)); // обратное расстояние до точки, чем ближе, тем больше длина
          
        float inverseDistance2 = u_Multiplier / sqrt(pow((a_Position.x - u_Pos2.x), 2.0) + 
          pow((a_Position.y - u_Pos2.y), 2.0));
          
        float inverseDistance3 = u_Multiplier / sqrt(pow((a_Position.x - u_Pos3.x), 2.0) + 
          pow((a_Position.y - u_Pos3.y), 2.0));
        
        float dotX1 = a_Position.x + (u_Pos1.x - a_Position.x) * pow(inverseDistance1, u_Pow);
        float dotY1 = a_Position.y + (u_Pos1.y - a_Position.y) * pow(inverseDistance1, u_Pow);
        
        float dotX2 = a_Position.x + (u_Pos2.x - a_Position.x) * pow(inverseDistance2, u_Pow);
        float dotY2 = a_Position.y + (u_Pos2.y - a_Position.y) * pow(inverseDistance2, u_Pow);
        
        float dotX3 = a_Position.x + (u_Pos3.x - a_Position.x) * pow(inverseDistance3, u_Pow);
        float dotY3 = a_Position.y + (u_Pos3.y - a_Position.y) * pow(inverseDistance3, u_Pow);
        
        // if (u_Inverse == 1.0) {
        
        // }
        
        if (abs(a_Position.x - u_Pos1.x) < a_Position.z * abs(a_Position.x - dotX1)) {
          dotX1 = u_Pos1.x;
          dotY1 = u_Pos1.y;
        }
        
        if (abs(a_Position.x - u_Pos2.x) < a_Position.z * abs(a_Position.x - dotX2)) {
          dotX2 = u_Pos2.x;
          dotY2 = u_Pos2.y;
        }
        
        if (abs(a_Position.x - u_Pos3.x) < a_Position.z * abs(a_Position.x - dotX3)) {
          dotX3 = u_Pos3.x;
          dotY3 = u_Pos3.y;
        }

        dotX = dotX1 + dotX2 + dotX3 - a_Position.x * 2.0;
        dotY = dotY1 + dotY2 + dotY3 - a_Position.y * 2.0;
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

export const lesson2 = [initialVertex, initialFragment]
