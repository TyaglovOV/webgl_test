/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/lessons/vectorField3Multiple.ts":
/*!*************************************************!*\
  !*** ./src/app/lessons/vectorField3Multiple.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.startApp = void 0;\nvar utils_1 = __webpack_require__(/*! ../utils */ \"./src/app/utils.ts\");\nvar vectorField3Multiple_1 = __webpack_require__(/*! ../shadersData/vectorField3Multiple */ \"./src/app/shadersData/vectorField3Multiple.ts\");\nvar program_1 = __webpack_require__(/*! ../programs/program */ \"./src/app/programs/program.ts\");\nvar vertexShader_1 = __webpack_require__(/*! ../shaders/vertexShader */ \"./src/app/shaders/vertexShader.ts\");\nvar fragmentShader_1 = __webpack_require__(/*! ../shaders/fragmentShader */ \"./src/app/shaders/fragmentShader.ts\");\nfunction startApp(canvas) {\n    var rows = 20;\n    var cols = 20;\n    var recalced = true;\n    utils_1.setCanvasToFullScreen(canvas);\n    var gl = utils_1.getContext(canvas);\n    // to initialize START\n    var shaders = [\n        new vertexShader_1.VertexShader(gl, vectorField3Multiple_1.lesson2[0]),\n        new fragmentShader_1.FragmentShader(gl, vectorField3Multiple_1.lesson2[1])\n    ];\n    var program = new program_1.Program(gl, shaders[0], shaders[1]);\n    program.use();\n    gl.clearColor(1, 1, 1, 1);\n    gl.clear(gl.COLOR_BUFFER_BIT);\n    var dotsVertex = createDots(rows, cols, canvas.width, canvas.height);\n    // создаем буфер\n    var dotsBuffer = gl.createBuffer();\n    // биндим буфер в видеокарте, теперь запись идет туда\n    gl.bindBuffer(gl.ARRAY_BUFFER, dotsBuffer);\n    // закладываем данные в наш буфер\n    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsVertex), gl.STATIC_DRAW);\n    var a_Position = gl.getAttribLocation(program.program, 'a_Position');\n    var u_Pos1 = gl.getUniformLocation(program.program, 'u_Pos1');\n    var u_Pos2 = gl.getUniformLocation(program.program, 'u_Pos2');\n    var u_Pos3 = gl.getUniformLocation(program.program, 'u_Pos3');\n    var u_Pow = gl.getUniformLocation(program.program, 'u_Pow');\n    var u_Multiplier = gl.getUniformLocation(program.program, 'u_Multiplier');\n    var u_Inverse = gl.getUniformLocation(program.program, 'u_Inverse');\n    // позволяем этим атрибутам брать данные из буфера, изначально они этого не умели\n    gl.enableVertexAttribArray(a_Position);\n    gl.uniform2f(u_Pos1, Math.random(), Math.random());\n    gl.uniform2f(u_Pos2, Math.random(), Math.random());\n    gl.uniform2f(u_Pos3, Math.random(), Math.random());\n    gl.uniform1f(u_Pow, 2.0);\n    gl.uniform1f(u_Multiplier, 0.03);\n    gl.uniform1f(u_Inverse, 1.0);\n    function animate(time) {\n        gl.clear(gl.COLOR_BUFFER_BIT);\n        if (!recalced) {\n            dotsVertex = createDots(rows, cols, canvas.width, canvas.height);\n            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsVertex), gl.STATIC_DRAW);\n            recalced = true;\n        }\n        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 3, 0);\n        gl.drawArrays(gl.LINES, 0, dotsVertex.length / 3);\n        requestAnimationFrame(animate);\n    }\n    initGui();\n    animate(0);\n    function changeMultiplier(value) {\n        gl.uniform1f(u_Multiplier, value);\n    }\n    function changePow(value) {\n        gl.uniform1f(u_Pow, value);\n    }\n    function changeInverse(value) {\n        gl.uniform1f(u_Inverse, value);\n    }\n    function initGui() {\n        var guiWrapper = document.getElementById('guiWrapper');\n        var colsInput = document.getElementById('cols');\n        var rowsInput = document.getElementById('rows');\n        var powRange = document.getElementById('pow');\n        var multiplierRange = document.getElementById('multiplier');\n        var inverseCheckbox = document.getElementById('inverse');\n        //@ts-ignore\n        colsInput.value = cols;\n        //@ts-ignore\n        rowsInput.value = rows;\n        document.addEventListener('keypress', function (event) {\n            if (event.key === 'p') {\n                guiWrapper.classList.toggle('hidden');\n            }\n        });\n        canvas.addEventListener('mousemove', function (event) {\n            gl.uniform2f(u_Pos1, event.x / canvas.width, (canvas.height - event.y) / canvas.height);\n        });\n        var period = 2;\n        canvas.addEventListener('click', function (event) {\n            gl.uniform2f(period === 2 ? u_Pos2 : u_Pos3, event.x / canvas.width, (canvas.height - event.y) / canvas.height);\n            period = period === 2 ? 3 : 2;\n        });\n        colsInput.addEventListener('input', function (event) {\n            //@ts-ignore\n            cols = event.target.value;\n            recalced = false;\n        });\n        rowsInput.addEventListener('input', function (event) {\n            //@ts-ignore\n            rows = event.target.value;\n            recalced = false;\n        });\n        powRange.addEventListener('input', function (event) {\n            //@ts-ignore\n            changePow(Number(event.target.value));\n        });\n        multiplierRange.addEventListener('input', function (event) {\n            //@ts-ignore\n            changeMultiplier(Number(event.target.value));\n        });\n        inverseCheckbox.addEventListener('input', function (event) {\n            var inverseValue = 1.0;\n            //@ts-ignore\n            console.log(event.target.checked);\n            //@ts-ignore\n            if (event.target.checked) {\n                inverseValue = -1.0;\n            }\n            changeInverse(inverseValue);\n        });\n    }\n}\nexports.startApp = startApp;\nfunction createDots(rows, cols, width, height) {\n    var dots = [];\n    var pointer = 0;\n    for (var i = 0; i < rows; i++) {\n        for (var k = 0; k < cols; k++) {\n            addData(i + 0.5, k + 0.5);\n        }\n    }\n    function addData(row, col) {\n        dots[pointer] = (col / cols);\n        dots[pointer + 1] = (row / rows);\n        dots[pointer + 2] = 0.0;\n        dots[pointer + 3] = (col / cols);\n        dots[pointer + 4] = (row / rows);\n        dots[pointer + 5] = 1.0;\n        pointer += 6;\n    }\n    return dots;\n}\n\n\n//# sourceURL=webpack://vortex/./src/app/lessons/vectorField3Multiple.ts?");

/***/ }),

/***/ "./src/app/programs/program.ts":
/*!*************************************!*\
  !*** ./src/app/programs/program.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Program = void 0;\n// привязка шейдериков к программе\nvar Program = /** @class */ (function () {\n    function Program(canvasContext, vertexShader, fragmentShader) {\n        this.program = undefined;\n        this.canvasContext = undefined;\n        var program = canvasContext.createProgram();\n        canvasContext.attachShader(program, vertexShader.shader);\n        canvasContext.attachShader(program, fragmentShader.shader);\n        canvasContext.linkProgram(program);\n        var linkStatus = canvasContext.getProgramParameter(program, canvasContext.LINK_STATUS);\n        if (linkStatus) {\n            this.program = program;\n            this.canvasContext = canvasContext;\n            return;\n        }\n        console.log(canvasContext.getProgramInfoLog(program));\n        canvasContext.deleteProgram(program);\n        throw new Error('program problem, bruh');\n    }\n    Program.prototype.use = function () {\n        this.canvasContext.useProgram(this.program);\n    };\n    return Program;\n}());\nexports.Program = Program;\n\n\n//# sourceURL=webpack://vortex/./src/app/programs/program.ts?");

/***/ }),

/***/ "./src/app/shaders/fragmentShader.ts":
/*!*******************************************!*\
  !*** ./src/app/shaders/fragmentShader.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FragmentShader = void 0;\nvar utils_1 = __webpack_require__(/*! ../utils */ \"./src/app/utils.ts\");\nvar shader_1 = __webpack_require__(/*! ./shader */ \"./src/app/shaders/shader.ts\");\nvar shaderBase_1 = __webpack_require__(/*! ./shaderBase */ \"./src/app/shaders/shaderBase.ts\");\nvar FragmentShader = /** @class */ (function (_super) {\n    __extends(FragmentShader, _super);\n    function FragmentShader(canvasContext, source) {\n        return _super.call(this, canvasContext, new shaderBase_1.ShaderBase(utils_1.ShaderType.Fragment, source)) || this;\n    }\n    return FragmentShader;\n}(shader_1.Shader));\nexports.FragmentShader = FragmentShader;\n\n\n//# sourceURL=webpack://vortex/./src/app/shaders/fragmentShader.ts?");

/***/ }),

/***/ "./src/app/shaders/shader.ts":
/*!***********************************!*\
  !*** ./src/app/shaders/shader.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Shader = void 0;\nvar utils_1 = __webpack_require__(/*! ../utils */ \"./src/app/utils.ts\");\nvar Shader = /** @class */ (function () {\n    function Shader(canvasContext, shaderBase) {\n        this.shader = undefined;\n        var shader = canvasContext.createShader(utils_1.getShaderType(canvasContext, shaderBase.type)); // создание шейдера\n        canvasContext.shaderSource(shader, shaderBase.source); // устанавливаем шейдеру его программный код\n        canvasContext.compileShader(shader); // канпелируем шейдер\n        var successfulCompile = canvasContext.getShaderParameter(shader, canvasContext.COMPILE_STATUS);\n        if (successfulCompile) {\n            this.shader = shader;\n            return;\n        }\n        console.log(canvasContext.getShaderInfoLog(shader));\n        canvasContext.deleteShader(shader);\n        throw new Error('shader problem, bruh');\n    }\n    return Shader;\n}());\nexports.Shader = Shader;\n\n\n//# sourceURL=webpack://vortex/./src/app/shaders/shader.ts?");

/***/ }),

/***/ "./src/app/shaders/shaderBase.ts":
/*!***************************************!*\
  !*** ./src/app/shaders/shaderBase.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ShaderBase = void 0;\nvar ShaderBase = /** @class */ (function () {\n    function ShaderBase(type, source) {\n        this.type = type;\n        this.source = source;\n    }\n    return ShaderBase;\n}());\nexports.ShaderBase = ShaderBase;\n\n\n//# sourceURL=webpack://vortex/./src/app/shaders/shaderBase.ts?");

/***/ }),

/***/ "./src/app/shaders/vertexShader.ts":
/*!*****************************************!*\
  !*** ./src/app/shaders/vertexShader.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.VertexShader = void 0;\nvar utils_1 = __webpack_require__(/*! ../utils */ \"./src/app/utils.ts\");\nvar shader_1 = __webpack_require__(/*! ./shader */ \"./src/app/shaders/shader.ts\");\nvar shaderBase_1 = __webpack_require__(/*! ./shaderBase */ \"./src/app/shaders/shaderBase.ts\");\nvar VertexShader = /** @class */ (function (_super) {\n    __extends(VertexShader, _super);\n    function VertexShader(canvasContext, source) {\n        return _super.call(this, canvasContext, new shaderBase_1.ShaderBase(utils_1.ShaderType.Vertex, source)) || this;\n    }\n    return VertexShader;\n}(shader_1.Shader));\nexports.VertexShader = VertexShader;\n\n\n//# sourceURL=webpack://vortex/./src/app/shaders/vertexShader.ts?");

/***/ }),

/***/ "./src/app/shadersData/vectorField3Multiple.ts":
/*!*****************************************************!*\
  !*** ./src/app/shadersData/vectorField3Multiple.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.lesson2 = void 0;\nvar initialVertex = \"\\n    attribute vec3 a_Position; // \\u0430\\u0442\\u0442\\u0440\\u0438\\u0431\\u0443\\u0442\\u044B \\u0440\\u0430\\u0437\\u043D\\u044B\\u0435 \\u0434\\u043B\\u044F \\u043A\\u0430\\u0436\\u0434\\u043E\\u0439 \\u0432\\u0435\\u0440\\u0448\\u0438\\u043D\\u044B\\n    \\n    uniform vec2 u_Pos1;\\n    uniform vec2 u_Pos2;\\n    uniform vec2 u_Pos3;\\n    \\n    uniform float u_Pow;\\n    uniform float u_Multiplier;\\n    uniform float u_Inverse;\\n     \\n    void main() {\\n      float isEndOfLine = a_Position.z; // \\u0435\\u0441\\u043B\\u0438 1.0 -> \\u044D\\u0442\\u043E \\u043A\\u043E\\u043D\\u0435\\u0446 \\u043B\\u0438\\u043D\\u0438\\u0438, \\u0432 \\u043A\\u043E\\u043D\\u0446\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u043E \\u0443\\u043C\\u043D\\u043E\\u0436\\u0430\\u0435\\u043C \\u043F\\u0440\\u0438\\u0431\\u0430\\u0432\\u043A\\u0443 \\u043A \\u043A\\u043E\\u043E\\u0440\\u0434\\u0438\\u043D\\u0430\\u0442\\u0430\\u043C\\n      \\n      float dotX = a_Position.x;\\n      float dotY = a_Position.y;\\n      \\n      if (isEndOfLine == 1.0) {\\n        float inverseDistance1 = u_Multiplier / sqrt(pow((a_Position.x - u_Pos1.x), 2.0) + \\n          pow((a_Position.y - u_Pos1.y), 2.0)); // \\u043E\\u0431\\u0440\\u0430\\u0442\\u043D\\u043E\\u0435 \\u0440\\u0430\\u0441\\u0441\\u0442\\u043E\\u044F\\u043D\\u0438\\u0435 \\u0434\\u043E \\u0442\\u043E\\u0447\\u043A\\u0438, \\u0447\\u0435\\u043C \\u0431\\u043B\\u0438\\u0436\\u0435, \\u0442\\u0435\\u043C \\u0431\\u043E\\u043B\\u044C\\u0448\\u0435 \\u0434\\u043B\\u0438\\u043D\\u0430\\n          \\n        float inverseDistance2 = u_Multiplier / sqrt(pow((a_Position.x - u_Pos2.x), 2.0) + \\n          pow((a_Position.y - u_Pos2.y), 2.0));\\n          \\n        float inverseDistance3 = u_Multiplier / sqrt(pow((a_Position.x - u_Pos3.x), 2.0) + \\n          pow((a_Position.y - u_Pos3.y), 2.0));\\n        \\n        float dotX1 = a_Position.x + (u_Pos1.x - a_Position.x) * pow(inverseDistance1, u_Pow);\\n        float dotY1 = a_Position.y + (u_Pos1.y - a_Position.y) * pow(inverseDistance1, u_Pow);\\n        \\n        float dotX2 = a_Position.x + (u_Pos2.x - a_Position.x) * pow(inverseDistance2, u_Pow);\\n        float dotY2 = a_Position.y + (u_Pos2.y - a_Position.y) * pow(inverseDistance2, u_Pow);\\n        \\n        float dotX3 = a_Position.x + (u_Pos3.x - a_Position.x) * pow(inverseDistance3, u_Pow);\\n        float dotY3 = a_Position.y + (u_Pos3.y - a_Position.y) * pow(inverseDistance3, u_Pow);\\n        \\n        // if (u_Inverse == 1.0) {\\n        \\n        // }\\n        \\n        if (abs(a_Position.x - u_Pos1.x) < a_Position.z * abs(a_Position.x - dotX1)) {\\n          dotX1 = u_Pos1.x;\\n          dotY1 = u_Pos1.y;\\n        }\\n        \\n        if (abs(a_Position.x - u_Pos2.x) < a_Position.z * abs(a_Position.x - dotX2)) {\\n          dotX2 = u_Pos2.x;\\n          dotY2 = u_Pos2.y;\\n        }\\n        \\n        if (abs(a_Position.x - u_Pos3.x) < a_Position.z * abs(a_Position.x - dotX3)) {\\n          dotX3 = u_Pos3.x;\\n          dotY3 = u_Pos3.y;\\n        }\\n\\n        dotX = dotX1 + dotX2 + dotX3 - a_Position.x * 2.0;\\n        dotY = dotY1 + dotY2 + dotY3 - a_Position.y * 2.0;\\n      }\\n       \\n      dotX = dotX * 2.0 - 1.0;\\n      dotY = dotY * 2.0 - 1.0;\\n      \\n      gl_Position = vec4(dotX, dotY, 0, 1.0); // \\u043F\\u0440\\u043E\\u0438\\u0437\\u043E\\u0448\\u0435\\u043B \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441 -- \\u043F\\u0435\\u0440\\u0435\\u043C\\u043D\\u043E\\u0436\\u0430\\u0435\\u043C \\u043C\\u0430\\u0442\\u0440\\u0438\\u0446\\u044B \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0430 \\u043D\\u0430 \\u0432\\u0435\\u043A\\u0442\\u043E\\u0440 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430\\n    }\\n  \";\nvar initialFragment = \"\\n    // \\u0444\\u0440\\u0430\\u0433\\u043C\\u0435\\u043D\\u0442\\u043D\\u044B\\u0435 \\u0448\\u0435\\u0439\\u0434\\u0435\\u0440\\u044B \\u043D\\u0435 \\u0438\\u043C\\u0435\\u044E\\u0442 \\u0442\\u043E\\u0447\\u043D\\u043E\\u0441\\u0442\\u0438 \\u043F\\u043E \\u0443\\u043C\\u043E\\u043B\\u0447\\u0430\\u043D\\u0438\\u044E, \\u043F\\u043E\\u044D\\u0442\\u043E\\u043C\\u0443 \\u043D\\u0430\\u043C \\u043D\\u0435\\u043E\\u0431\\u0445\\u043E\\u0434\\u0438\\u043C\\u043E \\u0435\\u0451\\n    // \\u0443\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C. mediump \\u043F\\u043E\\u0434\\u043E\\u0439\\u0434\\u0451\\u0442 \\u0434\\u043B\\u044F \\u0431\\u043E\\u043B\\u044C\\u0448\\u0438\\u043D\\u0441\\u0442\\u0432\\u0430 \\u0441\\u043B\\u0443\\u0447\\u0430\\u0435\\u0432. \\u041E\\u043D \\u043E\\u0437\\u043D\\u0430\\u0447\\u0430\\u0435\\u0442 \\\"\\u0441\\u0440\\u0435\\u0434\\u043D\\u044F\\u044F \\u0442\\u043E\\u0447\\u043D\\u043E\\u0441\\u0442\\u044C\\\"\\n    precision mediump float;\\n     \\n    void main() {\\n      // gl_FragColor - \\u0441\\u043F\\u0435\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u0430\\u044F \\u043F\\u0435\\u0440\\u0435\\u043C\\u0435\\u043D\\u043D\\u0430\\u044F \\u0444\\u0440\\u0430\\u0433\\u043C\\u0435\\u043D\\u0442\\u043D\\u043E\\u0433\\u043E \\u0448\\u0435\\u0439\\u0434\\u0435\\u0440\\u0430.\\n      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); \\n    }\\n  \";\nexports.lesson2 = [initialVertex, initialFragment];\n\n\n//# sourceURL=webpack://vortex/./src/app/shadersData/vectorField3Multiple.ts?");

/***/ }),

/***/ "./src/app/utils.ts":
/*!**************************!*\
  !*** ./src/app/utils.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getShaderType = exports.setCanvasToFullScreen = exports.getContext = exports.ShaderType = void 0;\nvar ShaderType;\n(function (ShaderType) {\n    ShaderType[ShaderType[\"Vertex\"] = WebGLRenderingContext.VERTEX_SHADER] = \"Vertex\";\n    ShaderType[ShaderType[\"Fragment\"] = WebGLRenderingContext.FRAGMENT_SHADER] = \"Fragment\";\n})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));\nfunction getContext(canvas) {\n    var params = { alpha: false, antialias: true };\n    var context = canvas.getContext('webgl2', params);\n    if (!Boolean(context)) {\n        context = canvas.getContext('webgl', params);\n    }\n    if (!Boolean(context)) {\n        alert('please use modern browser');\n        throw new Error('oops');\n    }\n    context.viewport(0, 0, context.canvas.width, context.canvas.height);\n    return context;\n}\nexports.getContext = getContext;\nfunction setCanvasToFullScreen(canvas) {\n    var width = scaleByPixelRatio(canvas.clientWidth);\n    var height = scaleByPixelRatio(canvas.clientHeight);\n    if (width !== canvas.width || height !== canvas.height) {\n        canvas.height = height;\n        canvas.width = width;\n    }\n}\nexports.setCanvasToFullScreen = setCanvasToFullScreen;\nfunction scaleByPixelRatio(input) {\n    // todo разобраться, почему делает слишком высокое разрешение\n    // const pixelRatio = window.devicePixelRatio || 1\n    var pixelRatio = 1;\n    return Math.floor(input / pixelRatio);\n}\nfunction getShaderType(canvas, type) {\n    return type === ShaderType.Vertex ? canvas.VERTEX_SHADER : canvas.FRAGMENT_SHADER;\n}\nexports.getShaderType = getShaderType;\nvar lastUpdateTime = Date.now();\nfunction calcDeltaTime() {\n    var now = Date.now();\n    var dt = (now - lastUpdateTime);\n    dt = Math.min(dt, 16.666);\n    lastUpdateTime = now;\n    return dt;\n}\n\n\n//# sourceURL=webpack://vortex/./src/app/utils.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar vectorField3Multiple_1 = __webpack_require__(/*! ./app/lessons/vectorField3Multiple */ \"./src/app/lessons/vectorField3Multiple.ts\");\nvar canvas = document.getElementById('canvas');\nvectorField3Multiple_1.startApp(canvas);\n\n\n//# sourceURL=webpack://vortex/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;