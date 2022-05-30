interface SeedData {
    entries: SeedEntry[];
}

interface SeedEntry {
    description: string;
    status: string;
    createdAt: number;
}

export const seedData:SeedData = {
    entries:  [
        {
            description: 'Pendiente: Hacer el footer',
            status: 'pending',
            createdAt: Date.now(),
        },
        {
            description: 'En progreso: Hacer el footer 2',
            status: 'in-progress',
            createdAt: Date.now(),
        },
        {
            description: 'Finalizado: Hacer el footer 3',
            status: 'finished',
            createdAt: Date.now(),
        },
    ]
}