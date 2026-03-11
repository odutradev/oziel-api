import vaultTransactionModel from "@database/model/vaultTransaction";
import { VAULT_TRANSACTION_TYPES } from "@utils/constants/vault";
import vaultModel from "@database/model/vault";
import dateService from "@utils/services/date.service";

import type { VaultTransactionModelType } from "@utils/types/models/vaultTransaction";
import type { ManageRequestBody } from "@middlewares/manageRequest";
import type { VaultModelType } from "@utils/types/models/vault";

const createVault = async ({ data, createLog, ids, manageError }: ManageRequestBody) => {
    const payload = data as Partial<VaultModelType>;
    if (!payload.name) return manageError({ code: "invalid_params" as never });

    const vault = await vaultModel.create({ ...payload, balance: 0 });
    await createLog({ action: "system_action", entity: "system", entityID: vault._id.toString(), userID: ids.userID, data: { description: "Vault created", vault } });

    return vault;
};

const updateVault = async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
    const vaultID = params?.id as string;
    if (!vaultID) return manageError({ code: "invalid_params" as never });

    const payload = data as Partial<VaultModelType>;
    const updatedVault = await vaultModel.findByIdAndUpdate(vaultID, { ...payload, updatedAt: dateService.now() }, { new: true });
    if (!updatedVault) return manageError({ code: "data_not_found" as never });

    await createLog({ action: "system_action", entity: "system", entityID: vaultID, userID: ids.userID, data: { description: "Vault updated", data } });

    return updatedVault;
};

const getVaults = async ({ querys, manageError }: ManageRequestBody) => {
    const pageNum = Number(querys?.page) || 1;
    const limitNum = Number(querys?.limit) || 10;
    if (pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

    const skip = (pageNum - 1) * limitNum;
    const [data, total] = await Promise.all([
        vaultModel.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
        vaultModel.countDocuments()
    ]);

    return { data, meta: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum } };
};

const getVaultById = async ({ params, querys, manageError }: ManageRequestBody) => {
    const vaultID = params?.id as string;
    const pageNum = Number(querys?.page) || 1;
    const limitNum = Number(querys?.limit) || 10;

    if (!vaultID || pageNum < 1 || limitNum < 1) return manageError({ code: "invalid_params" as never });

    const vault = await vaultModel.findById(vaultID).lean();
    if (!vault) return manageError({ code: "data_not_found" as never });

    const skip = (pageNum - 1) * limitNum;
    const [transactions, totalTransactions] = await Promise.all([
        vaultTransactionModel.find({ vaultID }).sort({ date: -1 }).skip(skip).limit(limitNum).lean(),
        vaultTransactionModel.countDocuments({ vaultID })
    ]);

    return { vault, transactions, meta: { total: totalTransactions, page: pageNum, pages: Math.ceil(totalTransactions / limitNum), limit: limitNum } };
};

const processTransaction = async ({ params, data, createLog, ids, manageError }: ManageRequestBody) => {
    const vaultID = params?.id as string;
    if (!vaultID) return manageError({ code: "invalid_params" as never });

    const payload = data as Partial<VaultTransactionModelType>;
    if (!payload.amount || payload.amount <= 0 || !payload.type) return manageError({ code: "invalid_params" as never });

    const vault = await vaultModel.findById(vaultID);
    if (!vault) return manageError({ code: "data_not_found" as never });

    if (payload.type === VAULT_TRANSACTION_TYPES.WITHDRAWAL && vault.balance < payload.amount) {
        return manageError({ code: "invalid_data" as never });
    }

    const transaction = await vaultTransactionModel.create({
        vaultID,
        amount: payload.amount,
        type: payload.type,
        description: payload.description,
        date: dateService.now()
    });

    const balanceChange = payload.type === VAULT_TRANSACTION_TYPES.DEPOSIT ? payload.amount : -payload.amount;
    await vaultModel.findByIdAndUpdate(vaultID, { $inc: { balance: balanceChange }, updatedAt: dateService.now() });

    await createLog({ action: "system_action", entity: "system", entityID: vaultID, userID: ids.userID, data: { description: "Vault transaction processed", transaction } });

    return transaction;
};

const vaultResource = {
    createVault,
    updateVault,
    getVaults,
    getVaultById,
    processTransaction
};

export default vaultResource;