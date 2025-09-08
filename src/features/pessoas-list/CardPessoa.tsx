import { Link } from "react-router-dom"
import type { PessoaDTO } from "../../services/type"


import StatusPill from "./StatusPill";

export default function CardPessoa({ p }: { p: PessoaDTO }) {
    const localizada = !!p.ultimaOcorrencia?.encontradoVivo;

    return (
        <Link
            to={`/pessoa/${p.id}`}
            className="group bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {/* Foto com proporção fixa 4:5 para padronizar */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gray-100 aspect-[4/5]">
                {p.urlFoto ? (
                    // padroniza renderização, sem estourar
                    <img
                        src={p.urlFoto}
                        alt={p.nome}
                        className="size-full object-cover"
                        loading="lazy"
                        width={400}
                        height={500}
                    />
                ) : (
                    <div className="size-full grid place-items-center text-gray-400 text-xs">sem foto</div>
                )}
                {/* canto superior direito com status */}
                <div className="absolute top-2 right-2">
                    <StatusPill localizada={localizada} />
                </div>
            </div>

            {/* Corpo do card */}
            <div className="p-3 space-y-1.5">
                <h3
                    className="font-semibold leading-tight truncate group-hover:text-blue-700"
                    title={p.nome}
                >
                    {p.nome}
                </h3>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    {p.sexo && <span>{p.sexo}</span>}
                    {typeof p.idade === "number" && <span>{p.idade} anos</span>}
                </div>

                {p.ultimaOcorrencia?.dtDesaparecimento && (
                    <p className="text-xs text-gray-500">
                        Desapareceu em{" "}
                        {new Date(p.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString()}
                    </p>
                )}
            </div>
        </Link>
    );
}
