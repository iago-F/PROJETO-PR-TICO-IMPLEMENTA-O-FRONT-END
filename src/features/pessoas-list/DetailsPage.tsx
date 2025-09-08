import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPessoaById } from '../../services/pessoa/api'

function StatusBadge({ ok }: { ok?: boolean }) {
    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {ok ? 'Localizada' : 'Desaparecida'}
        </span>
    )
}

export default function DetailsPage() {
    const { id = '' } = useParams()
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['pessoa', id],
        queryFn: () => getPessoaById(id),
        enabled: !!id,
    })

    if (isLoading) return <div className="max-w-4xl mx-auto p-4">Carregando...</div>
    if (isError || !data) return <div className="max-w-4xl mx-auto p-4">Erro ao carregar. <button className="underline" onClick={() => refetch()}>Tentar novamente</button></div>

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{data.nome}</h1>
                <StatusBadge ok={data.ultimaOcorrencia?.encontradoVivo} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="h-64 bg-gray-100 rounded-xl overflow-hidden">
                        {data.urlFoto
                            ? <img src={data.urlFoto} alt={data.nome} className="w-full h-full object-cover" />
                            : <div className="w-full h-full grid place-items-center text-gray-400">sem foto</div>}
                    </div>
                    {data.ultimaOcorrencia?.dtDesaparecimento && (
                        <p><b>Desaparecimento:</b> {new Date(data.ultimaOcorrencia.dtDesaparecimento).toLocaleString()}</p>
                    )}
                    {data.ultimaOcorrencia?.localDesaparecimentoConcat && (
                        <p><b>Local:</b> {data.ultimaOcorrencia.localDesaparecimentoConcat}</p>
                    )}
                </div>
                <div className="text-sm text-gray-600">
                    <p>Em breve: formulário para enviar informações (observação, fotos, localização).</p>
                </div>
            </div>
        </div>
    )
}
