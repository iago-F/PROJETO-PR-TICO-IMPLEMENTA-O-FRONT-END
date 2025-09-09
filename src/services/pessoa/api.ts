import { api } from '../../shared/lib/axios'
import type { PagePessoaDTO, PessoaDTO, } from '../type';

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

// export async function addInformacao(p: NovaInfoPayload) {
//     const fd = new FormData()
//     fd.set('informacao', p.informacao)
//     fd.set('data', p.data)
//     fd.set('ocoId', p.ocoId)
//     if (p.telefone) fd.set('telefone', p.telefone)
//     if (p.latitude != null) fd.set('latitude', String(p.latitude))
//     if (p.longitude != null) fd.set('longitude', String(p.longitude))
//     p.anexos?.forEach(f => fd.append('anexos', f))

//     const { data } = await api.post('/ocorrencias/informacoes-desaparecido', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return data
// }

export type NovaInfoPayload = {
    informacao: string
    data: string        // envie no formato 'yyyy-MM-dd' pra primeiro teste
    ocoId: string
    anexos?: File[]
}

export async function addInformacao(p: NovaInfoPayload) {
    const fd = new FormData()
    fd.set('informacao', p.informacao)
    fd.set('data', p.data)         // '2025-09-08'
    fd.set('ocoId', p.ocoId)
    p.anexos?.forEach(f => fd.append('anexos', f))

    // DEBUG: ver o que está indo
    if (import.meta.env.DEV) {
        console.group('[DEBUG] FormData /ocorrencias/informacoes-desaparecido')
        for (const [k, v] of (fd as any).entries()) {
            console.log(k, v instanceof File ? `[File] ${v.name} ${v.type} ${v.size}B` : v)
        }
        console.groupEnd()
    }

    // ⚠️ Não force 'Content-Type': deixe o Axios definir o boundary correto
    const { data } = await api.post('/ocorrencias/informacoes-desaparecido', fd)
    return data
}

