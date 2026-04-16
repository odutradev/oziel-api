import productModel from "@database/model/product";
import dateService from "@utils/services/date.service";

import type { ManageRequestBody } from "@middlewares/manageRequest";
import type { ProductModelType } from "@utils/types/models/product";

const productResource = {
    createProduct: async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
        const payload = data as Partial<ProductModelType>;
        if (!payload.name) return manageError({ code: "invalid_params" as never });

        const product = await productModel.create({ ...payload, active: payload.active ?? true, unit: "kg" });
        await createLog({ action: "system_action", entity: "system", entityID: product._id.toString(), userID: ids.userID, data: { description: "Product created", product } });

        return product;
    },
    updateProduct: async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
        const productID = params?.id as string;
        if (!productID) return manageError({ code: "invalid_params" as never });

        const payload = data as Partial<ProductModelType>;
        const updatedProduct = await productModel.findByIdAndUpdate(productID, { ...payload, unit: "kg", updatedAt: dateService.now() }, { new: true });
        if (!updatedProduct) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: productID, userID: ids.userID, data: { description: "Product updated", data } });

        return updatedProduct;
    },
    deleteProduct: async ({ params, createLog, ids, manageError }: ManageRequestBody) => {
        const productID = params?.id as string;
        if (!productID) return manageError({ code: "invalid_params" as never });

        const deletedProduct = await productModel.findByIdAndDelete(productID);
        if (!deletedProduct) return manageError({ code: "data_not_found" as never });

        await createLog({ action: "system_action", entity: "system", entityID: productID, userID: ids.userID, data: { description: "Product deleted" } });

        return { success: true };
    },
    getAllProducts: async ({ querys, manageError }: ManageRequestBody) => {
        const pageNum = Number(querys?.page) || 1;
        const limitNum = Number(querys?.limit) || 10;
        if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
            productModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            productModel.countDocuments()
        ]);

        return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
    },
    getProductById: async ({ params, manageError }: ManageRequestBody) => {
        const productID = params?.id as string;
        if (!productID) return manageError({ code: "invalid_params" as never });

        const product = await productModel.findById(productID).lean();
        if (!product) return manageError({ code: "data_not_found" as never });

        return product;
    }
};

export default productResource;