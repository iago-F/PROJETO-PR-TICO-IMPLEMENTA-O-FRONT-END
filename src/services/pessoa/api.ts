import { api } from '../../shared/lib/axios'
import type { PagePessoaDTO, PessoaDTO } from '../type';

export type FiltroPessoasQuery = {
    nome?: string; sexo?: string; idadeMin?: number; idadeMax?: number;
    page?: number; size?: number;
}

export async function getPessoasFiltro(q: FiltroPessoasQuery) {
    const { data } = await api.get<PagePessoaDTO>('/pessoas/aberto/filtro', { params: q })
    return data
}

export async function getPessoaById(id: string | number) {
    const { data } = await api.get<PessoaDTO>(`/pessoas/${id}`)
    return data
}
