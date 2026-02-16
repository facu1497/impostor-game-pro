import type { Category } from '../types';

const objects: Category = {
    id: 'objects',
    name: 'Objetos',
    words: [
        'Silla', 'Mesa', 'Computadora', 'Teléfono', 'Lámpara', 'Mochila', 'Reloj',
        'Zapatilla', 'Anteojos', 'Llaves', 'Billetera', 'Cámara', 'Guitarra',
        'Microondas', 'Heladera',
        'Televisor', 'Ventilador', 'Auriculares', 'Mouse', 'Teclado',
        'Cuaderno', 'Lapicera', 'Botella', 'Cargador', 'Parlante',
        'Plancha', 'Aspiradora', 'Control Remoto'
    ]
};

const places: Category = {
    id: 'places',
    name: 'Lugares',
    words: [
        'Playa', 'Montaña', 'Escuela', 'Hospital', 'Supermercado', 'Aeropuerto',
        'Cine', 'Restaurante', 'Biblioteca', 'Gimnasio', 'Hotel', 'Parque',
        'Estadio', 'Museo',
        'Iglesia', 'Plaza', 'Farmacia', 'Banco', 'Oficina',
        'Teatro', 'Terminal', 'Puerto', 'Universidad', 'Barrio',
        'Shopping', 'Fábrica'
    ]
};

const professions: Category = {
    id: 'professions',
    name: 'Profesiones',
    words: [
        'Bombero', 'Policía', 'Médico', 'Maestro', 'Ingeniero', 'Abogado',
        'Electricista', 'Cocinero', 'Mecánico', 'Astronauta', 'Actor',
        'Pintor', 'Músico', 'Carpintero',
        'Arquitecto', 'Veterinario', 'Enfermero', 'Psicólogo', 'Contador',
        'Periodista', 'Diseñador', 'Programador', 'Plomero',
        'Chofer', 'Panadero'
    ]
};

const food: Category = {
    id: 'food',
    name: 'Comidas',
    words: [
        'Pizza', 'Hamburguesa', 'Sushi', 'Asado', 'Tacos', 'Empanadas',
        'Helado', 'Chocolate', 'Papas Fritas', 'Fideos', 'Arroz',
        'Ensalada', 'Milanesa', 'Sándwich',
        'Pollo', 'Pescado', 'Ravioles', 'Ñoquis',
        'Torta', 'Galletitas', 'Flan', 'Yogur',
        'Cereal', 'Pan', 'Queso'
    ]
};

const animals: Category = {
    id: 'animals',
    name: 'Animales',
    words: [
        'Perro', 'Gato', 'León', 'Elefante', 'Jirafa', 'Mono',
        'Tigre', 'Oso', 'Delfín', 'Tiburón', 'Águila', 'Pingüino',
        'Serpiente', 'Cocodrilo',
        'Caballo', 'Vaca', 'Cerdo', 'Oveja', 'Gallina',
        'Conejo', 'Ratón', 'Zorro', 'Lobo',
        'Ballena', 'Pulpo'
    ]
};

const sports: Category = {
    id: 'sports',
    name: 'Deportes',
    words: [
        'Fútbol', 'Básquet', 'Tenis', 'Vóley', 'Rugby',
        'Hockey', 'Natación', 'Ciclismo', 'Atletismo',
        'Boxeo', 'Golf', 'Pádel', 'Handball',
        'Surf', 'Skate', 'Snowboard', 'Artes Marciales',
        'Automovilismo', 'Motociclismo', 'Triatlón'
    ]
};

const football_teams: Category = {
    id: 'football_teams',
    name: 'Equipos de Fútbol',
    words: [
        'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Sevilla', 'Valencia',
        'Real Sociedad', 'Villarreal', 'Manchester City', 'Manchester United',
        'Liverpool', 'Arsenal', 'Chelsea', 'Tottenham', 'Newcastle United',
        'Aston Villa', 'Juventus', 'Inter', 'AC Milan', 'Napoli', 'Roma',
        'Lazio', 'Atalanta', 'Fiorentina', 'Bayern Munich', 'Borussia Dortmund',
        'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt', 'Schalke 04',
        'Paris Saint-Germain', 'Marseille', 'Lyon', 'Monaco', 'Lille',
        'Benfica', 'Porto', 'Sporting CP', 'Ajax', 'PSV', 'Feyenoord',
        'Boca Juniors', 'River Plate', 'Racing Club', 'Independiente',
        'San Lorenzo', 'Huracán', 'Estudiantes de La Plata', 'Vélez Sarsfield',
        "Newell's Old Boys", 'Rosario Central', 'Talleres de Córdoba', 'Belgrano de Córdoba'
    ]
};

export const baseCategories = [objects, places, professions, food, animals, sports, football_teams];

export const CATEGORIES: Category[] = [
    ...baseCategories,
    {
        id: 'all',
        name: 'Todas',
        words: baseCategories.flatMap(c => c.words)
    },
    {
        id: 'custom',
        name: 'Personalizado',
        words: [] // Placeholder for custom logic
    }
];

export const getRandomWord = (categoryId: string): string => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category || category.words.length === 0) return 'Error';
    const randomIndex = Math.floor(Math.random() * category.words.length);
    return category.words[randomIndex];
};
