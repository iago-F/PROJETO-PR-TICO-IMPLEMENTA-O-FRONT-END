export interface OcorrenciaDTO {
    dtDesaparecimento?: string;
    dataLocalizacao?: string;
    encontradoVivo?: boolean;
    localDesaparecimentoConcat?: string;
    ocoId?: string;
}
export interface PessoaDTO {
    id?: string | number;
    nome?: string;
    idade?: number;
    sexo?: string;
    vivo?: boolean;
    urlFoto?: string;
    ultimaOcorrencia?: OcorrenciaDTO;
}
export interface PagePessoaDTO {
    content?: PessoaDTO[];
    totalElements?: number;
    number?: number;
    size?: number;
}

export interface NovaInfoPayload {
    informacao: string
    data: string
    ocoId: string
    telefone?: string
    latitude?: number
    longitude?: number
    anexos?: File[]
}
