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
    const { nameref } = req.params;

    try {
        const products = await ProductModel.findOne({ nameref })
        if (!products) {
            const error = new Error("Product not found...");
            error.status = 404;
            error.name = "NotFoundError";
            return next(error);
        }
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
    const {name, type, variants} = req.body;

    if (!name  || !type || !variants ) {
        const error = new Error("productname, size and price are required`");
        error.name = "ValidationError";
        error.status = 400;
        return next(error);
    }

    try {
        const doc = await ProductModel.create({name, type, variants})
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
    const { nameref } = req.params; // Changed to take nameref from params
    const body = req.body;

    try {
        // Find by nameref and update. Ensure nameref is not changed by the body if it's in there.
        // Also, return the new updated document.
        const updated = await ProductModel.findOneAndUpdate({ nameref }, body, { new: true, runValidators: true }); // Changed to findOneAndUpdate({ nameref }, body, { new: true }) and added runValidators: true

        if(!updated) {
            const error = new Error("Product not found...");
            error.status = 404;
            error.name = "NotFoundError";
            return next (error);
        }

        const safe = updated.toObject();
        // Assuming there is no 'password' field in product model, but keeping the line if it's a general copy-paste.
        // If ProductModel can have password, it should be handled in a user context.
        // For products, this line is likely not needed.
        // delete safe.password;

        return res.status(200).json({
            success : true,
            data : safe,
        });
    } catch (error) {
        if (error.code === 11000){ // Duplicate key error, potentially if 'name' was changed resulting in a duplicate nameref
            error.status = 409;
            error.name = "DuplicateKeyError";
            error.message = "Product name change resulted in a duplicate nameref";
            return next(error);
        }
        error.status = 500;
        error.name = error.name || "DatabaseError";
        error.message = error.message || "Failed to update product";
        return next(error);
    }
};

// ✅ route handler : delete a product in the database
export const deleteProduct = async (req, res , next) => {
    const { nameref } = req.params; // Changed from 'id' to 'nameref'
    try {
        const deleted = await ProductModel.findOneAndDelete({ nameref }); // Changed from 'findByIdAndDelete(id)' to 'findOneAndDelete({ nameref })'
        
        if(!deleted){
            const error = new Error("Product not found"); // Changed to "Product not found"
            error.status = 404;
            error.name = "NotFoundError";
            return next(error);
        }
        return res.status(200).json({
            success: true,
            data : null,
        });
    } catch (error) {
        error.status = 500;
        error.name = error.name || "DatabaseError";
        error.message = error.message || "Failed to delete product";
        return next(error);
    }
}