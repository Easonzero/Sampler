/**
 * Created by eason on 17-2-16.
 */
let canvas = document.getElementById('canvas');

let renderer = new $S.Renderer(canvas);
let sampler = new $S.Sampler('cosineWeightedDirection',$V([0,1,0]));
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