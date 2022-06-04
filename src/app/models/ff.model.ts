export class FF {
    value?: any;
    flag?: string;

    public constructor(flag?: string, value?: any) {
        if (flag !== undefined) {
            this.flag = flag;
        }
        if (value !== undefined) {
            this.value = value;
        }
    }

    

    

}
