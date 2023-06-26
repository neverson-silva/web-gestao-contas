
import { Pessoa } from "./auth";
import { Mes } from "./faturaItem";

export interface TotalPessoa {
    id:        number;
    pessoa:    Pessoa;
    mes:       Mes;
    ano:       number;
    total:     number;
    valorPago: number;
    diferenca: number;
}

