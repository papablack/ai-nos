import * as fs from 'fs';
import * as tf from '@tensorflow/tfjs-node';
import DataType from '../interfaces/DataType';
import { Dataset } from '@tensorflow/tfjs-data';
import config from '../config/paths';
import { ImageData } from 'node-canvas';
import {PNG} from 'pngjs';

const readData = async (width: number, height: number, channels: number): Promise<tf.Tensor<tf.Rank>> => {
    const examplesDir = config.rootDir + '/examples';
    const imageTensors = [];
    

    // Read all .png files in the examples folder and normalize the image tensors
    const files = fs.readdirSync(examplesDir);

    console.log('Reading data...');
    for (const file of files) {
        if (file.endsWith('.png')) {
            const imagePath = examplesDir + '/' + file;                    
            imageTensors.push((await readImage(imagePath)).div(255));
        }
    }

    /// Normalize the image tensor
    return tf.stack(imageTensors);    
};

const readImage = async (path: string): Promise<tf.Tensor3D | tf.Tensor4D> => {
    // Read the PNG file and convert it to a tensor
    const buffer = fs.readFileSync(path);        

    const convertPromise = (): Promise<any> => new Promise((resolve, reject) => {
        new PNG({
            colorType: 2,
            bgColor: {
              red: 0,
              green: 255,
              blue: 0,
            },
          }).parse(buffer, function(error, data){
            if(error){
                reject(error)
            }else{
                resolve(data)            
            }            
        });
    });        

    const newStream = await convertPromise();

    // console.log(await stream2buffer(newStream));

    console.log(newStream);

    return tf.node.decodeImage(buffer);              
};

function stream2buffer(stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {    
        const _buf = [];

        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));
    });
} 

async function printImageBuffer(buffer) {
    try {
        var png = PNG.sync.read(buffer);
        let buff = this.printer.printImageBuffer(png.width, png.height, png.data);
        this.append(buff);
        return buff;
    } catch(error) {
        throw error;
    }
}

const train = async (    
    width: number,
    height: number,
    channels: number,
    batchSize: number
  ): Promise<tf.Sequential> => {

    const inputData = await readData(1920, 920, 3);

    console.log(inputData);
    // Define and train your model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 100, inputShape: [height, width, channels], activation: 'relu' }),
        tf.layers.dense({ units: 100, activation: 'relu' }),
        tf.layers.dense({ units: width * height * channels, activation: 'sigmoid' }),
        tf.layers.reshape({ targetShape: [height, width, channels] }),
      ],
    });
  
    model.compile({
      optimizer: tf.train.adam(),
      loss: 'binaryCrossentropy',
    });
  
    console.log('Training model...');
  
    await model.fit(inputData, inputData, {
        batchSize: batchSize,
        epochs: 100,
    });
  
    console.log('Model ready...');
  
    return model;
  };


export default {
    readData,
    train,
    readImage
}