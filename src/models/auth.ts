export class Usuario {
	id: number
	login: string
	roles: string[]
	pessoa: Pessoa
}

export class Pessoa {
	id: number
	nome: string
	sobrenome: string
	dataNascimento: Date
	perfil: string
  sexo: string
}
