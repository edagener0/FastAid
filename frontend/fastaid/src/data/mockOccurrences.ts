export interface Occurrence {
  id: number;
  type: string;
  description: string;
  distance: number;
  time: string;
  priority: 'high' | 'medium' | 'low';
  location: string;
  coordinates: [number, number];
}

export const mockOccurrences: Occurrence[] = [
  {
    id: 1,
    type: 'Acidente de transito',
    description: 'Colisao entre dois veiculos na Av. da Liberdade.',
    distance: 0.8,
    time: 'ha 10 min',
    priority: 'high',
    location: 'Av. da Liberdade, Lisboa',
    coordinates: [38.7223, -9.1393],
  },
  {
    id: 2,
    type: 'Pessoa ferida',
    description: 'Pedido de apoio medico urgente em zona pedonal.',
    distance: 1.2,
    time: 'ha 25 min',
    priority: 'high',
    location: 'Praca do Comercio, Lisboa',
    coordinates: [38.7077, -9.1366],
  },
  {
    id: 3,
    type: 'Incendio',
    description: 'Foco de incendio controlado junto a edificio residencial.',
    distance: 2.1,
    time: 'ha 45 min',
    priority: 'medium',
    location: 'Bairro Alto, Lisboa',
    coordinates: [38.7139, -9.1468],
  },
  {
    id: 4,
    type: 'Assistencia medica',
    description: 'Idoso com dificuldades respiratorias a aguardar equipa.',
    distance: 3.5,
    time: 'ha 1 h',
    priority: 'medium',
    location: 'Alfama, Lisboa',
    coordinates: [38.711, -9.1295],
  },
  {
    id: 5,
    type: 'Queda em via publica',
    description: 'Pessoa assistida por populares e a aguardar transporte.',
    distance: 4.2,
    time: 'ha 1 h',
    priority: 'low',
    location: 'Belem, Lisboa',
    coordinates: [38.6977, -9.2068],
  },
];
