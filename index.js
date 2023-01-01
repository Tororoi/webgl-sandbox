const vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "",
  "void main()",
  "{",
  " fragColor = vertColor;",
  " gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n")

const fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  " gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n")
//
// start here
//
function initSurface() {
  const canvas = document.querySelector("#glcanvas")
  // Initialize the GL context
  const gl = canvas.getContext("webgl")

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    )
    return
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.75, 0.85, 0.8, 1.0)
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  //Create shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(vertexShader, vertexShaderText)
  gl.shaderSource(fragmentShader, fragmentShaderText)

  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader",
      gl.getShaderInfoLog(vertexShader)
    )
    return
  }
  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling fragment shader",
      gl.getShaderInfoLog(fragmentShader)
    )
    return
  }

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program", gl.getProgramInfoLog(program))
    return
  }
  //comment out validation for prod
  gl.validateProgram(program)
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program", gl.getProgramInfoLog(program))
    return
  }
  //create buffer, expected as 32 bit floats, need conversion in javascript
  const triangleVertices = [
    //X,Y, R,G,B
    [0.0, 0.5, 1.0, 1.0, 0.0],
    [-0.5, -0.5, 0.7, 0.0, 1.0],
    [0.5, -0.5, 0.1, 1.0, 0.6],
  ]

  const triangleVertexBufferObject = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices.flat()),
    gl.STATIC_DRAW
  )

  const positionAttribLocation = gl.getAttribLocation(program, "vertPosition")
  const colorAttribLocation = gl.getAttribLocation(program, "vertColor")
  gl.vertexAttribPointer(
    positionAttribLocation,
    2, //Number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    triangleVertices[0].length * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
    0 //Offset from the beginning of a single vertex to this attribute
  )
  gl.vertexAttribPointer(
    colorAttribLocation,
    3, //Number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    triangleVertices[0].length * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT //Offset from the beginning of a single vertex to this attribute
  )
  gl.enableVertexAttribArray(positionAttribLocation)
  gl.enableVertexAttribArray(colorAttribLocation)

  //Main render loop
  gl.useProgram(program)
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length)
}

function vertexShader(vertPosition, vertColor) {
  return {
    fragColor: vertColor,
    gl_Position: [vertPosition.x, vertPosition.y, 0.0, 1.0],
  }
}

initSurface()
