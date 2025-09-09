import { Link } from "react-router-dom"
import type { PessoaDTO } from "../../services/type"






function formatDate(date?: string) {
    if (!date) return "-"
    const d = new Date(date)
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function CardPessoa({ p }: { p: PessoaDTO }) {
    const encontrada = !!p.ultimaOcorrencia?.encontradoVivo
    const idade = typeof p.idade === "number" ? p.idade : undefined
    const desde = formatDate(p.ultimaOcorrencia?.dtDesaparecimento)

    return (
        <Link
            to={`/pessoa/${p.id}`}
            className="group bg-white rounded-[28px] border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            {/* Moldura da foto */}
            <div className="m-3 rounded-3xl border-2 border-purple-700/30 overflow-hidden">
                <div className="relative bg-gray-200 h-80">
                    {p.urlFoto ? (
                        <img
                            src={p.urlFoto}
                            alt={p.nome}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            width={480}
                            height={640}
                        />
                    ) : (
                        <div className="w-full h-full grid place-items-center text-gray-400 text-xs">
                            sem foto
                        </div>
                    )}
                </div>
            </div>

            { }
            <div className="px-5 pb-5">
                <div className="grid grid-cols-2 gap-3 items-start">
                    { }
                    <div className="min-w-0">
                        <h3
                            className="text-lg sm:text-xl font-extrabold tracking-tight uppercase text-black truncate"
                            title={p.nome}
                        >
                            {p.nome}
                        </h3>
                    </div>

                    { }
                    <div className="text-right space-y-1">
                        {typeof idade === "number" && (
                            <div className="text-sm font-bold text-gray-800">
                                IDADE: <span className="font-extrabold">{idade}</span>
                            </div>
                        )}

                        <div>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold inline-block
                ${encontrada ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {encontrada ? "ENCONTRADA" : "DESAPARECIDA"}
                            </span>
                        </div>

                        <div className="text-xs sm:text-sm font-bold text-gray-700">
                            DESDE: <span className="font-extrabold">{desde}</span>
                        </div>
                    </div>
                </div>

                { }
                {!encontrada && p.sexo && (
                    <p className="mt-2 text-[12px] text-gray-500">SEXO: {p.sexo}</p>
                )}
            </div>
        </Link>
    )
}
