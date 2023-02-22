import { TensorContainerObject } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs-node';

export default interface DataType extends TensorContainerObject {
    xs: tf.Tensor;
    ys: tf.Tensor;
}