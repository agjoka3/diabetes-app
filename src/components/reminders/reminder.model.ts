
export interface Reminder {
    date: number;
    userId: string;
    address: string;
    info: string;
    note: string;
}

export type ReminderRow = Reminder & {
    id: string
}