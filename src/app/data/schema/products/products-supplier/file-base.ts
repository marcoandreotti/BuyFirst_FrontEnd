export class FileBase {
    type: number; 
    name: string; 
    key: string;
    uri: string | null;

    //aux
    uploadFile?: File | any;
}