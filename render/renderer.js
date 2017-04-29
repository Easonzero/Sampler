/**
 * Created by eason on 17-4-26.
 */
import {ShaderProgram,WebglHelper} from './webgl';
import {Camera} from './camera';
import {Control} from './control';
import {vs_render,fs_render} from './shader/shader.program';

class Renderer{
    constructor(canvas,psize=5){
        WebglHelper.initWebgl(canvas);
        this.shader = new ShaderProgram(vs_render,fs_render);
        this.camera = new Camera([0,0,7],[0,0,0]);

        this.control = new Control(canvas,this.camera);
        this.control.onmousemove(()=>{ this.update() });
        this.control.onmousewheel(()=>{ this.update() });

        this.shader.uniforms.matrix = this.camera.projection.x(this.camera.modelview);
        this.shader.uniforms.pSize = ['float',psize];
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

export {Renderer}