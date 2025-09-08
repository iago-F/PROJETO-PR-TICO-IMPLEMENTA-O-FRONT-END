import { useState } from 'react'

export default function SearchBar({
    initial,
    onSubmit,
}: {
    initial?: { nome?: string; sexo?: string }
    onSubmit: (v: { nome?: string; sexo?: string }) => void
}) {
    const [nome, setNome] = useState(initial?.nome ?? '')
    const [sexo, setSexo] = useState(initial?.sexo ?? '')

    return (
        <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); onSubmit({ nome: nome || undefined, sexo: sexo || undefined }) }}>
            <input
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar por nome..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />
            <select
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
            >
                <option value="">Sexo (todos)</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
            </select>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Buscar</button>
        </form>
    )
}
