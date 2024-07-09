export default interface IProduct{
    id : string,
    name : string,
    description : string,
    price : number,
    discount? : number,
    selectedImages : string[],
    categoryId : string,
}