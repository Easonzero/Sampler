(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	/**
	 * Created by eason on 17-4-13.
	 */
	Matrix.Translation = function (v)
	{
	    if (v.elements.length == 2) {
	        let r = Matrix.I(3);
	        r.elements[2][0] = v.elements[0];
	        r.elements[2][1] = v.elements[1];
	        return r;
	    }

	    if (v.elements.length == 3) {
	        let r = Matrix.I(4);
	        r.elements[0][3] = v.elements[0];
	        r.elements[1][3] = v.elements[1];
	        r.elements[2][3] = v.elements[2];
	        return r;
	    }

	    throw "Invalid length for Translation";
	};

	Matrix.prototype.flatten = function ()
	{
	    let result = [];
	    if (this.elements.length == 0)
	        return [];


	    for (let j = 0; j < this.elements[0].length; j++)
	        for (let i = 0; i < this.elements.length; i++)
	            result.push(this.elements[i][j]);
	    return result;
	};

	Matrix.prototype.ensure4x4 = function()
	{
	    if (this.elements.length == 4 &&
	        this.elements[0].length == 4)
	        return this;

	    if (this.elements.length > 4 ||
	        this.elements[0].length > 4)
	        return null;

	    for (let i = 0; i < this.elements.length; i++) {
	        for (let j = this.elements[i].length; j < 4; j++) {
	            if (i == j)
	                this.elements[i].push(1);
	            else
	                this.elements[i].push(0);
	        }
	    }

	    for (let i = this.elements.length; i < 4; i++) {
	        if (i == 0)
	            this.elements.push([1, 0, 0, 0]);
	        else if (i == 1)
	            this.elements.push([0, 1, 0, 0]);
	        else if (i == 2)
	            this.elements.push([0, 0, 1, 0]);
	        else if (i == 3)
	            this.elements.push([0, 0, 0, 1]);
	    }

	    return this;
	};

	Matrix.prototype.make3x3 = function()
	{
	    if (this.elements.length != 4 ||
	        this.elements[0].length != 4)
	        return null;

	    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
	        [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
	        [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
	};

	Vector.prototype.flatten = function ()
	{
	    return this.elements;
	};

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
	    }

	    render(flag,vertexs){
	        gl.useProgram(this.program);

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
	        gl.clearColor(0.0,0.0,1.0,1.0);
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

	/**
	 * Created by eason on 17-4-26.
	 */
	class Camera {
	    constructor(eye, center, up=[0,1,0]){
	        this.eye = $V(eye);
	        this.center = $V(center);
	        this.up = $V(up);

	        this.makePerspective();
	        this.makeLookAt();
	    }

	    makePerspective(fovy=55, aspect=1, znear=1, zfar=100){
	        let top = znear * Math.tan(fovy * Math.PI / 360.0);
	        let bottom = -top;
	        let left = bottom * aspect;
	        let right = top * aspect;

	        let X = 2*znear/(right-left);
	        let Y = 2*znear/(top-bottom);
	        let A = (right+left)/(right-left);
	        let B = (top+bottom)/(top-bottom);
	        let C = -(zfar+znear)/(zfar-znear);
	        let D = -2*zfar*znear/(zfar-znear);

	        this.projection = $M([
	            [X, 0, A, 0],
	            [0, Y, B, 0],
	            [0, 0, C, D],
	            [0, 0, -1, 0]
	        ]);
	    }

	    makeLookAt(){
	        let z = this.eye.subtract(this.center).toUnitVector();
	        let x = this.up.cross(z).toUnitVector();
	        let y = z.cross(x).toUnitVector();

	        let m = $M([
	            [x.e(1), x.e(2), x.e(3), 0],
	            [y.e(1), y.e(2), y.e(3), 0],
	            [z.e(1), z.e(2), z.e(3), 0],
	            [0, 0, 0, 1]
	        ]);

	        let t = $M([
	            [1, 0, 0, -this.eye.e(1)],
	            [0, 1, 0, -this.eye.e(2)],
	            [0, 0, 1, -this.eye.e(3)],
	            [0, 0, 0, 1]
	        ]);

	        this.modelview = m.x(t);
	    }

	    update(){
	        this.makeLookAt();
	    }
	}

	/**
	 * Created by eason on 17-4-26.
	 */
	function addEvent(obj,xEvent,fn) {
	    if(obj.attachEvent){
	        obj.attachEvent('on'+xEvent,fn);
	    }else{
	        obj.addEventListener(xEvent,fn,false);
	    }
	}

	function elementPos(element) {
	    let x = 0, y = 0;
	    while(element.offsetParent) {
	        x += element.offsetLeft;
	        y += element.offsetTop;
	        element = element.offsetParent;
	    }
	    return { x: x, y: y };
	}

	function eventPos(event) {
	    return {
	        x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
	        y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop
	    };
	}

	function canvasMousePos(event,canvas) {
	    let mousePos = eventPos(event);
	    let canvasPos = elementPos(canvas);
	    return {
	        x: mousePos.x - canvasPos.x,
	        y: mousePos.y - canvasPos.y
	    };
	}

	class Control{
	    constructor(canvas,camera){
	        this.camera = camera;
	        this.canvas = canvas;

	        this.mouseDown = false;
	        this.angleX = 0;
	        this.angleY = 0;
	        this.R = this.camera.eye.distanceFrom(this.camera.center);

	        this.onmousedown();
	        this.onmousemove();
	        this.onmouseup();
	        this.onmousewheel();
	    }

	    __onmousedown(fn){
	        return (event)=>{
	            let mouse = canvasMousePos(event,this.canvas);
	            this.oldX = mouse.x;
	            this.oldY = mouse.y;
	            if(mouse.x >= 0 && mouse.x < 512 && mouse.y >= 0 && mouse.y < 512) {
	                this.mouseDown = true;
	                this.angleX = Math.asin((this.camera.eye.e(2)-this.camera.center.e(2))/this.R);
	                this.angleY = Math.acos((this.camera.eye.e(3)-this.camera.center.e(3))/(this.R*Math.cos(this.angleX)));
	                if(this.camera.eye.e(1)-this.camera.center.e(1)<0) this.angleY = -this.angleY;
	                fn();
	            }

	            return true;
	        };
	    }

	    __onmousemove(fn){
	        return (event)=>{
	            let mouse = canvasMousePos(event,this.canvas);
	            if(this.mouseDown) {
	                this.angleY += (this.oldX-mouse.x) * 0.01;
	                this.angleX += -(this.oldY-mouse.y) * 0.01;

	                this.angleX = Math.max(this.angleX, -Math.PI / 2 + 0.01);
	                this.angleX = Math.min(this.angleX, Math.PI / 2 - 0.01);

	                this.camera.eye = $V([
	                    this.R * Math.sin(this.angleY) * Math.cos(this.angleX),
	                    this.R * Math.sin(this.angleX),
	                    this.R * Math.cos(this.angleY) * Math.cos(this.angleX)
	                ]).add(this.camera.center);

	                this.oldX = mouse.x;
	                this.oldY = mouse.y;

	                fn();
	            }
	        };
	    }

	    __onmouseup(fn){
	        return (event)=>{
	            this.mouseDown = false;
	            fn();
	        }
	    }

	    __onmousewheel(fn){
	        return (event)=>{
	            let ev = event || window.event;
	            let down = true;
	            down = ev.wheelDelta?ev.wheelDelta<0:ev.detail>0;
	            if(!down){
	                this.R*=0.9;
	                this.camera.eye = $V([
	                    this.R * Math.sin(this.angleY) * Math.cos(this.angleX),
	                    this.R * Math.sin(this.angleX),
	                    this.R * Math.cos(this.angleY) * Math.cos(this.angleX)
	                ]).add(this.camera.center);
	            }else{
	                this.R*=1.1;
	                this.camera.eye = $V([
	                    this.R * Math.sin(this.angleY) * Math.cos(this.angleX),
	                    this.R * Math.sin(this.angleX),
	                    this.R * Math.cos(this.angleY) * Math.cos(this.angleX)
	                ]).add(this.camera.center);
	            }
	            fn();
	            if(ev.preventDefault){
	                ev.preventDefault();
	            }
	            return false;
	        }
	    }

	    onmousedown(fn=()=>{}){
	        addEvent(document,'mousedown',this.__onmousedown(fn));
	    }

	    onmousemove(fn=()=>{}){
	        addEvent(document,'mousemove',this.__onmousemove(fn));
	    }

	    onmouseup(fn=()=>{}){
	        addEvent(document,'mouseup',this.__onmouseup(fn));
	    }

	    onmousewheel(fn=()=>{}){
	        addEvent(this.canvas,'mousewheel',this.__onmousewheel(fn));
	        addEvent(this.canvas,'DOMMouseScroll',this.__onmousewheel(fn));
	    }
	}

	var vs_render = "#version 300 es\nin vec3 vertex;\nuniform mat4 matrix;\nvoid main() {\n    gl_Position = matrix*vec4(vertex,1);\n    gl_PointSize = 2.0;\n}";

	var fs_render = "#version 300 es\nprecision highp float;\nout vec4 color;\nvoid main() {\n    color = vec4(1.0,0.1,1.0,0.3);\n}";

	/**
	 * Created by eason on 17-4-26.
	 */

	/**
	 * Created by eason on 17-4-26.
	 */
	class Renderer{
	    constructor(canvas){
	        WebglHelper.initWebgl(canvas);
	        this.shader = new ShaderProgram(vs_render,fs_render);
	        this.camera = new Camera([0,0,7],[0,0,0]);

	        this.control = new Control(canvas,this.camera);
	        this.control.onmousemove(()=>{ this.update(); });
	        this.control.onmousewheel(()=>{ this.update(); });

	        this.shader.uniforms.matrix = this.camera.projection.x(this.camera.modelview);
	    }

	    update(){
	        this.camera.update();
	        this.shader.uniforms.matrix = this.camera.projection.x(this.camera.modelview);
	    }

	    render(samplerResult){
	        if(samplerResult.length==0) return;
	        this.shader.render(gl.POINTS,samplerResult);
	    }
	}

	/**
	 * Created by eason on 17-4-26.
	 */

	function cosineWeightedDirection(normal) {
	    let u = Math.random();
	    let v = Math.random();
	    let r = Math.sqrt(u);
	    let angle = 2*Math.PI*v;
	    let sdir, tdir;
	    if (Math.abs(normal.e(1)) < .5) {
	        sdir = normal.cross($V([1, 0, 0]));
	    } else {
	        sdir = normal.cross($V([0, 1, 0]));
	    }
	    tdir = normal.cross(sdir);
	    return sdir.x(r * Math.cos(angle)).add(tdir.x(r * Math.sin(angle))).add(normal.x(Math.sqrt(1-u)));
	}

	function uniformlyRandomDirection(){
	    let u = Math.random();
	    let v = Math.random();
	    let z = 1.0 - 2.0 * u;   let r = Math.sqrt( 1.0 - z * z );
	    let angle = 2*Math.PI*v;
	    return $V([r * Math.cos(angle),r * Math.sin(angle),z]);
	}

	function sa(){
	    let x = Math.random()*20-10;
	    return $V([x,Math.sin(x)/x,0]);
	}

	/**
	 * Created by eason on 17-4-26.
	 */
	window.Sampler = {
	    Renderer:Renderer,
	    cosineWeightedDirection:cosineWeightedDirection,
	    uniformlyRandomDirection:uniformlyRandomDirection,
	    sa:sa
	};

})));
