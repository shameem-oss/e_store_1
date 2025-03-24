import {Schema,model} from "mongoose"

const productSchema= new Schema({
   name:{type:String, required:true},
   category:{type:String},
   price:{type:Number},
   rating:{type:Number},
   stock:{type:Number},
   image:[{type:String}]




})
const ProductsModel= model("products",productSchema)
export default ProductsModel

