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
    const page = Number(sp.get('page') || 1) // UI 1-based
    const size = 10
    const nome = sp.get('nome') || undefined
    const sexo = sp.get('sexo') || undefined

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['pessoas', { page, size, nome, sexo }],
        queryFn: () => getPessoasFiltro({ page: page - 1, size, nome, sexo }), // API 0-based
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
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            <div className="flex items-end justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold">Pessoas desaparecidas</h1>
                {/* opcional: total */}
                {typeof total === "number" && <span className="text-sm text-gray-500">{total} resultado(s)</span>}
            </div>

            <SearchBar initial={{ nome, sexo }} onSubmit={onSubmit} />

            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {isError && (
                <div className="text-red-700">
                    Erro ao carregar. <button className="underline" onClick={() => refetch()}>Tentar novamente</button>
                </div>
            )}

            {!isLoading && !isError && items.length === 0 && (
                <p className="text-gray-500">Nenhum registro encontrado.</p>
            )}

            {!!items.length && (
                <>
                    {/* grid mais compacto (cards menores) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {items.map((p) => <CardPessoa key={String(p.id)} p={p} />)}
                    </div>

                    <div className="pt-2">
                        <Pagination page={page} pageSize={size} total={total} onChange={onChangePage} />
                    </div>
                </>
            )}
        </div>
    );
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


