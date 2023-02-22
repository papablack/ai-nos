import io from '../services/io.service';
import TeacherController from '../modules/teacher/TeacherController';

export default async () => {
    //declare "cliData" variable and fill it with user console input
    const cliData = await io.getLine('Input test...');

    await TeacherController.startTrainingImages();
    
    return true;
}