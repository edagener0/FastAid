export interface Operador {
  id: number
  username: string
  profissao: string
}

export interface Ocorrencia {
  id: number
  titulo: string
  descricao: string
  tipo: string
  estado: 'ABERTA' | 'EM_CURSO' | 'RESOLVIDA' | 'CANCELADA'
  distrito: string
  latitude: number
  longitude: number
  operadores: Operador[]
  criado_em: string
}
