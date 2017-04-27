/**
 * Created by eason on 17-4-26.
 */
import * as matrix from './math/math.matrix';
import {Renderer} from './render/renderer';
import * as sampler from './sampler/index';

window.Sampler = {
    Renderer:Renderer,
    cosineWeightedDirection:sampler.cosineWeightedDirection,
    uniformlyRandomDirection:sampler.uniformlyRandomDirection,
    sa:sampler.sa
};