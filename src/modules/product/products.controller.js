import { ProductModel } from "./products.model.js";

// ✅ route call all product to view
export const getProducts = async (req, res, next) => {
    try {
        const products = await ProductModel.find();
        return res.status(200).json({
            success: true,
            data: products,
        })
    } catch (error) {
            return next(error);
        }
}

// ✅ route call one product to view (in edit product)
export const getProduct = async (req, res, next) =>{
    const { id } = req.params;

    try {
        const products = await ProductModel.findById(id)
        return res.status(200).json({
            success: true,
            data: products,
        })
    } catch (error) {
        error.status = 500;
        error.name = error.name || "DatabaseError";
        error.message = error.message || "Failed to get a product";
        return next(error);
    }
};

// ✅ route handler : craete a new product in the database 
export const createProduct = async (req, res, next) => {
    const {name, size, price} = req.body;

    if (!name  || !size || !price ) {
        const error = new Error("productname, size and price are required`");
        error.name = "ValidationError";
        error.status = 400;
        return next(error);
    }

    try {
        const doc = await Product.createProduct({name, size, price})
        const safe = doc.toObject();

        return res.status(201).json({
            success:true,
            data:safe,
        });
    } catch (error) {
        if(error.code === 11000){
            error.status = 409;
            error.name = "DuplicateKeyError";
            error.message = "product already in use";
        }
            error.status = 500;
            error.name = error.product || "DatabaseError";
            error.message = error.message || "Failed to create a product";
            return next(error);
    }
};


// ✅ route handler : update a product in the database
export const updateProduct = async (req, res, next) => {
    const { id } = req.body;
    const body = req.body;

    try {
        const updated = await product.findByIdAndUpdate(id, body);

        if(!updated) {
            const error = new Error("Product not found...");

            return next (error);
        }

        const safe = updated.toObject();
        delete safe.password;

        return res.status(200).json({
            success : true,
            data : safe,
        });
    } catch (error) {
        if (error.code === 11000){
            return next(error);
        }
        return next(error);
    }
};

// ✅ route handler : delete a product in the database
export const deleteProduct = async (req, res , next) => {
    const { id } = req.params;
    try {
        const deleted = await Product.findByIdAndDelete(id);
        
        if(!deleted){
            const error = new Error("product not found");
            return next(error);
        }
        return res.status(200).json({
            success: true,
            data : null,
        });
    } catch (error) {
        return next(error);
    }
}