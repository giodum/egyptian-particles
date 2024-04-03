// attribute vec3 position;
attribute vec3 aRandom;

varying vec3 vPosition;

uniform float uTime;

void main() {
  vPosition = position;

  float time = uTime * 4.0;

  vec3 pos = position;
  pos.x += sin(time * aRandom.x) * 0.01;
  pos.y += cos(time * aRandom.y) * 0.01;
  pos.z += cos(time * aRandom.z) * 0.01;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0 / -mvPosition.z;
}