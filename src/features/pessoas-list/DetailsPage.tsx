import { useParams } from 'react-router-dom'
import { getPessoaById } from '../../services/pessoa/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addInformacao } from '../../services/pessoa/api'
import { useState } from 'react'
import InfoForm from './InfoForm'
import Modal from '../../shared/ui/Modal'



function formatDate(date?: string) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DetailsPage() {
    const { id = '' } = useParams()

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['pessoa', id],
        queryFn: () => getPessoaById(id),
        enabled: !!id,
    })

    const [open, setOpen] = useState(false)

    const mut = useMutation({
        mutationFn: addInformacao,
        onSuccess: (resp) => console.log('[POST OK]', resp),
        onError: (err) => console.error('[POST ERRO]', err),
    })

    if (isLoading) return <div className="max-w-6xl mx-auto p-4">Carregando...</div>
    if (isError || !data) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                Erro ao carregar.{' '}
                <button className="underline" onClick={() => refetch()}>
                    Tentar novamente
                </button>
            </div>
        )
    }

    const ocoId = data.ultimaOcorrencia?.ocoId
    const encontrada = !!data.ultimaOcorrencia?.encontradoVivo
    const idade = typeof data.idade === 'number' ? data.idade : undefined

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                { }
                <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4">
                    { }
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-xl sm:text-2xl font-bold leading-tight">{data.nome}</h1>
                        <button
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 self-start sm:self-auto"
                            onClick={() => setOpen(true)}
                            disabled={!ocoId}
                            title={ocoId ? '' : 'Ocorrência não encontrada para este registro'}
                        >
                            Registrar informação
                        </button>
                    </div>

                    { }
                    <div className="rounded-xl overflow-hidden bg-gray-200">
                        <div className="h-100"> { }
                            {data.urlFoto ? (
                                <img src={data.urlFoto} alt={data.nome} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full grid place-items-center text-gray-400">sem foto</div>
                            )}
                        </div>
                    </div>

                    { }
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs">Status</span>
                            <span
                                className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-semibold mt-1
                  ${encontrada ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {encontrada ? 'ENCONTRADA' : 'DESAPARECIDA'}
                            </span>
                        </div>

                        {typeof idade === 'number' && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs">Idade</span>
                                <span className="font-semibold mt-1">{idade} anos</span>
                            </div>
                        )}

                        {data.sexo && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs">Sexo</span>
                                <span className="font-semibold mt-1">{data.sexo}</span>
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs">Desde</span>
                            <span className="font-semibold mt-1">
                                {formatDate(data.ultimaOcorrencia?.dtDesaparecimento)}
                            </span>
                        </div>

                        {data.ultimaOcorrencia?.localDesaparecimentoConcat && (
                            <div className="sm:col-span-2 flex flex-col">
                                <span className="text-gray-500 text-xs">Local</span>
                                <span className="font-semibold mt-1">
                                    {data.ultimaOcorrencia.localDesaparecimentoConcat}
                                </span>
                            </div>
                        )}

                        {ocoId && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs">Ocorrência</span>
                                <span className="font-semibold mt-1">{ocoId}</span>
                            </div>
                        )}
                    </div>

                    { }
                    {mut.isSuccess && <p className="text-green-700 text-sm">Informação enviada com sucesso!</p>}
                    {mut.isError && <p className="text-red-700 text-sm">Erro ao enviar. Tente novamente.</p>}
                </div>
            </div>

            { }
            <Modal open={open} onClose={() => setOpen(false)} title="Registrar informação" maxWidthClass="max-w-3xl">
                {!ocoId ? (
                    <p className="text-sm text-gray-600">Ocorrência não encontrada para este registro.</p>
                ) : (
                    <InfoForm
                        ocoId={ocoId}
                        submitting={mut.isPending}
                        onCancel={() => setOpen(false)}
                        onSubmit={(v) => {
                            mut.mutate(
                                {
                                    ocoId,
                                    informacao: v.informacao,
                                    data: v.data,
                                    anexos: v.anexos,
                                },
                                { onSuccess: () => setOpen(false) }
                            )
                        }}
                    />
                )}
            </Modal>
        </div>
    )
}
