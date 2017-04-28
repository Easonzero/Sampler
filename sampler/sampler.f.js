/**
 * Created by eason on 17-4-27.
 */
export let find = {
    cosineWeightedDirection: (normal)=>{
        return {
            f: () => {
                let u = Math.random();
                let v = Math.random();
                let angle = 2 * Math.PI * v;
                let sdir, tdir;
                if (Math.abs(normal.e(1)) < .5) {
                    sdir = normal.cross($V([1, 0, 0]));
                } else {
                    sdir = normal.cross($V([0, 1, 0]));
                }
                tdir = normal.cross(sdir);
                return {
                    data: sdir.x(u * Math.cos(angle)).add(tdir.x(u * Math.sin(angle))).add(normal.x(Math.cos(Math.asin(u)))),
                    x: [Math.asin(u), 2 * Math.PI * v]
                }
            },
            type: 2,
            range: [[0, Math.PI / 2], [0, 2 * Math.PI]]
        }
    },

    power:(n)=>{
        return {
            f: () => {
                let sample = [];
                for(let i=0;i<n+1;i++){
                    sample.push(Math.random())
                }
                let max = Math.max(...sample);
                return {
                    data: $V([max, 0, 0]),
                    x: [max]
                };
            },
            type: 1,
            range: [[0, 1]]
        }
    }
};