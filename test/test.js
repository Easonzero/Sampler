/**
 * Created by eason on 17-2-16.
 */
let canvas = document.getElementById('canvas');

let renderer = new $S.Renderer(canvas);
let sampler = new $S.Sampler('power',4);
let print = false;

function tick(){
    requestAnimationFrame(tick);
    renderer.render(sampler.sampleDatas);
    if(sampler.sampleNum>1000){
        if(!print) {
            sampler.print();
            print = !print;
        }
        return;
    }
    sampler.sampling();
}

tick();