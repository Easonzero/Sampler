/**
 * Created by eason on 17-2-16.
 */
let canvas = document.getElementById('canvas');

let renderer = new Sampler.Renderer(canvas);

let data = [];

function tick(){
    requestAnimationFrame(tick);
    renderer.render(data);
    if(data.length>10000) return;
    for(let i=0;i<10;i++){
        data.push(...Sampler.sa().flatten());
    }
}

tick();