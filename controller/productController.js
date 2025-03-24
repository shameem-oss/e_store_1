
import ProductsModel from "../models/productsSchema.js"
export const getAllProducts=async(req,res,next)=>{
    try {
        const product=await ProductsModel.find()
        res.send({success:true, data:product})
    } catch (err) {
        res.send({success:false, message:err.message})
    }
}


export const createProducts=async(req,res,next)=>{
    try {
        const product=await ProductsModel.create(req.body)
        res.send({success:true, data:product})
    } catch (err) {
        res.send({success:false, message:err.message})
    }
}
