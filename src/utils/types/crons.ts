export interface CronTask {
    name: string;
    schedule: string;
    enabled: boolean;
    task: () => Promise<void>;
}