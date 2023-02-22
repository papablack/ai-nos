class Singleton {
    [x: string]: any;
    private static instance: Singleton;
    protected constructor() { }
    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}

export default Singleton;