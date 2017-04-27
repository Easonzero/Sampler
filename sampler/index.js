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



export {cosineWeightedDirection,uniformlyRandomDirection,sa};