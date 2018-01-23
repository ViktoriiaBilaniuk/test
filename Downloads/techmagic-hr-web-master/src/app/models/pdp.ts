import { USER } from './user';


interface ActiveYears {
    [key: string]: MonthObject;
}

interface MonthObject {
    name: string;
    users: USER[];
}

export interface PDP {
    outdated?: USER[];
    active?: ActiveYears[];
}
