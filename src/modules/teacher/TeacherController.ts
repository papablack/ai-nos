import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { createCanvas, CanvasRenderingContext2D } from 'node-canvas';
import config from '../../config/paths';

import learningService from '../../services/learning.service';

const startTrainingImages = async () => {
    const width = 1920;
    const height = 960;
    const channels = 3;
    const batchSize = 32;
    
   // const reshapedData = learningService.readData(width, height, channels);

    const model = await learningService.train(width, height, channels, batchSize);

    // Generate images using your trained model
    const numImages = 3;

    for (let i = 0; i < numImages; i++) {
        const input = tf.randomUniform([1, height, width, channels]);
        const transposedInput = tf.transpose(input, [0, 2, 1, 3]);
        const batchedInput = tf.stack(Array.from({ length: batchSize }, () => transposedInput), 0);
        const output = ((model.predict(batchedInput) as tf.Tensor).mul(255).reshape([height, width, channels]).arraySync()) as number[][][];        

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Clear the canvas before drawing the new image
        ctx.clearRect(0, 0, width, height);

        const imageData = ctx.createImageData(width, height);

        const data = new Uint8ClampedArray(output.flatMap(arr => arr.flat()));

        imageData.data.set(data);
        imageData.data.fill(0, 3, imageData.data.length);
    
        // Swap the dimensions
        
        // imageData.data.set(learningService.transposeData(imageData, width, height, channels));
    
        fs.writeFileSync(config.generatedDir + `/output${i}.png`, canvas.toBuffer('image/png'));
        console.log(`Image ${i} created.`);
    }

    return true;
}

export default {
    startTrainingImages
}