import { StatusCode, StatusMessage } from "../enum/StatusEnum";

export default class ResponseModel{
    constructor(
        public readonly message : string,
        public readonly status : StatusCode,
        public readonly messages : string[] = []
    ) {}
}