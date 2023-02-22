import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { createCanvas, CanvasRenderingContext2D } from 'node-canvas';
import DataType from '../../interfaces/DataType';
import { Dataset } from '@tensorflow/tfjs-data';
import config from '../../config/paths';

const startTrainingImages = async () => {
    const width = 100;
    const height = 100;
    const channels = 3;

    // Collect and preprocess your data
    const data: number[][] = [
        [1, 0, 0], // red
        [0, 1, 0], // green
        [0, 0, 1], // blue
    ];
    const normalizedData = tf.tensor2d(data).div(255);

    // Define and train your model
    const model = tf.sequential({
        layers: [
            tf.layers.dense({ units: 100, inputShape: [3], activation: 'relu' }),
            tf.layers.dense({ units: 100, activation: 'relu' }),
            tf.layers.dense({ units: width * height * channels, activation: 'sigmoid' }),
            tf.layers.reshape({ targetShape: [width, height, channels] }),
        ],
    });

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'binaryCrossentropy',
    });

    const batchSize = 32;
    const epochs = 100;

    async function train() {
        for (let i = 0; i < epochs; i++) {
            const indices = tf.util.createShuffledIndices(data.length);
            const batches = tf.data.array(data)
        .shuffle(data.length)
        .batch(batchSize)
        .map((batch) => ({ xs: batch, ys: batch })) as any as typeof Dataset<DataType>;

                console.log(`Epoch ${i + 1} completed.`);
        }
    }

    await train();

    // Generate images using your trained model
    const numImages = 3;

    for (let i = 0; i < numImages; i++) {
        const input = tf.randomUniform([1, 3]);
        const output = ((model.predict(input) as tf.Tensor).mul(255).reshape([width, height, channels]).arraySync()) as number[][][];

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);

        const data = new Uint8ClampedArray(output.flatMap(arr => arr.flat()));
        imageData.data.set(data);

        ctx.putImageData(imageData, 0, 0);    

        const out = fs.createWriteStream(config.generatedDir + `/output${i}.png`);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log(`Image ${i} created.`));
    }

    return true;  
}

export default {
    startTrainingImages
}