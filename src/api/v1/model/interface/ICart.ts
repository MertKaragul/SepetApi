import { ObjectId } from "mongoose";

export default interface ICart {
    productId : string,
    count : number,
    address : string
}