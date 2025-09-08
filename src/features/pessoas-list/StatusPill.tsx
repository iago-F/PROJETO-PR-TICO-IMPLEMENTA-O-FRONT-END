export default function StatusPill({ localizada }: { localizada: boolean }) {
    const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold";
    return (
        <span className={`${base} ${localizada ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <span className={`size-1.5 rounded-full ${localizada ? "bg-green-600" : "bg-red-600"}`} />
            {localizada ? "Localizada" : "Desaparecida"}
        </span>
    );
}
