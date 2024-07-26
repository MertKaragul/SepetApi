import { ObjectId } from "mongoose"

export default interface IDeliveryAddress{
    id : ObjectId,
    name : string,
    address : string,
    postCode : string,
    apartment : string
}