import io from '../services/io.service';
import TeacherController from '../modules/teacher/TeacherController';

export default async () => {
    await TeacherController.startTrainingImages();
    
    return true;
}