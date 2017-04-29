#version 300 es

in vec3 vertex;
uniform mat4 matrix;
uniform float pSize;

void main() {
    gl_Position = matrix*vec4(vertex,1);
    gl_PointSize = pSize;
}