/**
 * Created by eason on 17-4-26.
 */
import * as map from './sampler.f';

class Sampler{
    constructor(name,...attr){
        let temp = map.find[name](...attr);
        this.__sampling = temp.f;
        this.type = temp.type;

        this.sampleNum = 0;
        this.divide = 10;
        this.start = [];this.delt=[];this.sampleDatas = [];this.events = [];

        for(let i=0;i<this.type;i++){
            this.start[i] = temp.range[i][0];
            this.delt[i] = (temp.range[i][1]-temp.range[i][0])/this.divide;
        }

        for(let i=0;i<this.type;i++){
            this.events[i] = [];
            for(let j=0;j<this.divide;j++){
                this.events[i][j] = 0;
            }
        }
    }

    sampling(){
        this.sampleNum++;
        let result = this.__sampling();
        this.sampleDatas.push(...result.data.flatten());

        for(let i=0;i<this.type;i++){
            let index = (result.x[i]-this.start[i])/this.delt[i];
            this.events[i][Math.floor(index)]++;
        }
    }

    print(){
        console.log(this.sampleNum);
        for(let i=0;i<this.type;i++){
            console.log(`attr${i+1}=>`);
            for(let j=0;j<this.divide;j++){
                let start=this.start[i]+j*this.delt[i],
                    end=this.start[i]+(j+1)*this.delt[i];
                console.log(`${start}-${end}    ${this.events[i][j]}`);
            }
        }
    }
}

export {Sampler};