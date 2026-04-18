export const MACHINE_OPERATION_STATUS = {
    CONSOLIDATED: "CONSOLIDATED",
    CANCELLED: "CANCELLED",
    PENDING: "PENDING"
} as const;

export type MachineOperationStatusType = typeof MACHINE_OPERATION_STATUS[keyof typeof MACHINE_OPERATION_STATUS];

export interface MachineOperationModelType {
    _id: string;
    asset: string;
    operator: string;
    serviceDescription: string;
    operationDate: Date;
    hourMeterDeparture: number;
    hourMeterArrival: number;
    totalHours: number;
    hourMeterServiceStart: number;
    hourMeterServiceEnd: number;
    workedHours: number;
    fuelDepartureLiters?: number;
    fuelConsumptionLiters?: number;
    hourlyRate: number;
    totalValue: number;
    status: MachineOperationStatusType;
    createdAt: Date;
    updatedAt: Date;
}