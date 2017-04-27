#version 300 es

in vec3 vertex;
uniform mat4 matrix;

void main() {
    gl_Position = matrix*vec4(vertex,1);
    gl_PointSize = 2.0;
}