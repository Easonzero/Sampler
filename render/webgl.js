/**
 * Created by eason on 17-3-15.
 */
class ShaderProgram {
    constructor(vshader,fshader) {
        this.uniforms = {};
        this.program = WebglHelper.createProgram(vshader, fshader);

        this.vertexBuffer = gl.createBuffer();
        this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
        gl.enableVertexAttribArray(this.vertexAttribute);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.blendFunc(gl.ONE, gl.ONE)
    }

    render(flag,vertexs){
        gl.useProgram(this.program);

        WebglHelper.clearScreen();

        this._updateUniforms();
        if(vertexs) this._updateVBO(vertexs);

        gl.drawArrays(flag, 0, vertexs.length/3);
    }

    _updateUniforms(){
        for(let entry of Object.entries(this.uniforms)) {
            let location = gl.getUniformLocation(this.program, entry[0]);
            if(location == null||!entry[1]) continue;
            if(entry[1] instanceof Vector) {
                gl.uniform3fv(location, new Float32Array([entry[1].elements[0], entry[1].elements[1], entry[1].elements[2]]));
            } else if(entry[1] instanceof Matrix) {
                gl.uniformMatrix4fv(location, false, new Float32Array(entry[1].flatten()));
            } else if(entry[1][0]=='int'){
                gl.uniform1i(location, entry[1][1]);
            } else if(entry[1][0]=='float'){
                gl.uniform1f(location, entry[1][1]);
            } else {
                gl.uniform1f(location, entry[1]);
            }
        }
    }

    _updateVBO(vertexs){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexs), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.vertexAttribute, 3, gl.FLOAT, false, 0, 0);
    }
}
class WebglHelper {
    static clearScreen(){
        gl.clearColor(0.5,0.5,0.5,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    static createProgram(vshader, fshader){
        let vertexShader = WebglHelper.loadShader(gl.VERTEX_SHADER, vshader);
        let fragmentShader = WebglHelper.loadShader(gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        let program = gl.createProgram();
        if (!program) {
            return null;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        return program;
    }

    static loadShader(type, source) {
        let shader = gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }
        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(shader);
            console.log('Failed to compile shader: ' + error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static initWebgl(canvas){
        window.gl = null;

        try {
            gl = canvas.getContext("webgl2");
        }
        catch(e) {}
        if (!gl) {
            alert("WebGL2初始化失败，可能是因为您的浏览器不支持。");
            gl = null;
        }
        return gl;
    }
}

export {ShaderProgram,WebglHelper}
