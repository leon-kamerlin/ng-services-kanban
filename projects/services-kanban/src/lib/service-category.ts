import { Service } from './service';

export class ServiceCategory {
    id: string | number;
    title: string;
    priority: number;
    services: Service[];
}
