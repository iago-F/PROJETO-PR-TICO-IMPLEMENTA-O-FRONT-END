import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPessoasFiltro } from '../../services/pessoa/api'
import CardPessoa from './CardPessoa'

function Pagination({ page, pageSize, total, onChange }: {
    page: number; pageSize: number; total: number; onChange: (p: number) => void
}) {
    const pages = Math.max(1, Math.ceil(total / pageSize))
    return (
        <div className="flex items-center justify-center gap-2">
            <button className="px-3 py-1 rounded border" disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</button>
            <span className="text-sm">{page} / {pages}</span>
            <button className="px-3 py-1 rounded border" disabled={page >= pages} onClick={() => onChange(page + 1)}>Próxima</button>
        </div>
    )
}

import SearchBar from './SearchBar'

export default function ListPage() {
    const [sp, setSp] = useSearchParams()
    const page = Number(sp.get('page') || 1)
    const size = 10
    const nome = sp.get('nome') || undefined
    const sexo = sp.get('sexo') || undefined

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['pessoas', { page, size, nome, sexo }],
        queryFn: () => getPessoasFiltro({ page: page - 1, size, nome, sexo }),
    })

    const items = data?.content ?? []
    const total = data?.totalElements ?? 0

    const onSubmit = (v: { nome?: string; sexo?: string }) => {
        const next = new URLSearchParams(sp)
        v.nome ? next.set('nome', v.nome) : next.delete('nome')
        v.sexo ? next.set('sexo', v.sexo) : next.delete('sexo')
        next.set('page', '1')
        setSp(next)
    }

    const onChangePage = (p: number) => {
        const next = new URLSearchParams(sp)
        next.set('page', String(p))
        setSp(next)
    }



    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
                { }
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
                            Pessoas desaparecidas
                        </h1>
                        <p className="text-sm text-gray-600">Busque por nome, sexo e faixa etária.</p>
                    </div>
                    {typeof total === "number" && (
                        <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-white/70 backdrop-blur border text-gray-700">
                            <span className="size-1.5 rounded-full bg-indigo-500" />
                            {total} resultado(s)
                        </span>
                    )}
                </div>

                <div className="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-3 sm:p-4">
                    <SearchBar initial={{ nome, sexo }} onSubmit={onSubmit} />
                </div>

                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {items.map((p) => <CardPessoa key={String(p.id)} p={p} />)}
                    </div>
                )}

                {isError && (
                    <div className="text-red-700">
                        Erro ao carregar. <button className="underline" onClick={() => refetch()}>Tentar novamente</button>
                    </div>
                )}

                {!isLoading && !isError && items.length === 0 && (
                    <p className="text-gray-600 bg-white/70 backdrop-blur border rounded-2xl p-4">Nenhum registro encontrado.</p>
                )}

                {!!items.length && (
                    <>
                        { }
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {items.map((p) => <CardPessoa key={String(p.id)} p={p} />)}
                        </div>

                        <div className="pt-2">
                            <Pagination page={page} pageSize={size} total={total} onChange={onChangePage} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )

}
// ...imports (iguais)
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="aspect-[4/5] bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
                <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-2.5 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
}


