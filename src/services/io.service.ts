import process from "process";
import readline from "readline";
import Singleton from "./singleton.class";

//IOServiceInterface
interface IOServiceInterface {
    createInterface(): void;
    getLine(question: string): Promise<string>;
}

class IOService implements IOServiceInterface {    
    private _interface: readline.Interface;    
    

    createInterface(): void
    {
        if(this._interface){
            return;
        }
        
        this._interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });    
    }

    getLine(question: string): Promise<string>
    {
        this.createInterface();

        return new Promise((resolve, reject) => {
            try{
                this._interface.question(question, (line) => {
                    resolve(line);        
                }); 
            }catch(e){
                reject(e);
            }
        });
    }
}

export default new IOService();

export {
    IOServiceInterface
}