import { useEffect, useRef } from 'react'

export default function ParadiseBackground() {
const canvasRef = useRef(null)

useEffect(() => {
const canvas = canvasRef.current
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
const gl = canvas?.getContext('webgl')

if (!canvas || !gl) {
  console.error('WebGL não está disponível neste navegador.')
  return
}

const vertexShaderSource = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 resolution;
  uniform float time;

  float wave(vec2 uv, float offset, float speed) {
    float y = sin(uv.x * 3.0 + time * speed + offset) * 0.16;
    y += sin(uv.x * 6.0 - time * speed * 0.6) * 0.05;
    return abs(uv.y - y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.x *= resolution.x / resolution.y;

    vec3 turquoise = vec3(0.0, 0.96, 0.83);
    vec3 blue = vec3(0.0, 0.35, 1.0);
    vec3 purple = vec3(0.48, 0.12, 1.0);
    vec3 pink = vec3(1.0, 0.08, 0.48);

    vec3 color = vec3(0.035, 0.015, 0.09);

    float glow1 = exp(-length(uv - vec2(0.25, 0.65)) * 2.2);
    float glow2 = exp(-length(uv - vec2(0.85, 0.35)) * 2.0);
    float glow3 = exp(-length(uv - vec2(0.60, 0.85)) * 2.5);

    color += turquoise * glow1 * 0.55;
    color += purple * glow2 * 0.65;
    color += pink * glow3 * 0.35;

    float blend = 0.5 + 0.5 * sin(uv.x * 2.0 + time * 0.25);
    color += mix(blue, purple, blend) * 0.12;

    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float distanceToWave = wave(uv, fi * 0.55, 0.55 + fi * 0.08);

      float line = exp(-distanceToWave * 48.0);
      float halo = exp(-distanceToWave * 8.0);

      vec3 lineColor = mix(turquoise, pink, fi / 6.0);

      color += lineColor * line * 0.45;
      color += lineColor * halo * 0.07;
    }

    color = color / (1.0 + color * 0.25);

    gl_FragColor = vec4(color, 1.0);
  }
`

function createShader(type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

if (!vertexShader || !fragmentShader) {
  if (vertexShader) gl.deleteShader(vertexShader)
  if (fragmentShader) gl.deleteShader(fragmentShader)
  return
}

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  return
}

gl.useProgram(program)

const vertices = new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
])

const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

const positionLocation = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

const resolutionLocation = gl.getUniformLocation(program, 'resolution')
const timeLocation = gl.getUniformLocation(program, 'time')
const startTime = performance.now()

function resize() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  const width = Math.floor(canvas.clientWidth * pixelRatio)
  const height = Math.floor(canvas.clientHeight * pixelRatio)

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  gl.viewport(0, 0, canvas.width, canvas.height)
}

let animationFrame

function render(now) {
  resize()

  gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
  gl.uniform1f(timeLocation, (now - startTime) / 1000)
  gl.drawArrays(gl.TRIANGLES, 0, 6)

  animationFrame = requestAnimationFrame(render)
}

resize()
animationFrame = requestAnimationFrame(render)
window.addEventListener('resize', resize)

return () => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', resize)
  gl.deleteBuffer(buffer)
  gl.deleteProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
}

}, [])

return <canvas ref={canvasRef} id="paradise-canvas" aria-hidden="true" />
}
