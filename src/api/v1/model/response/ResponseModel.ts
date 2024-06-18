export default class ResponseModel{
    constructor(
        public readonly name : string,
        public readonly status : number,
        public readonly message : string[] = []
    ) {}
}