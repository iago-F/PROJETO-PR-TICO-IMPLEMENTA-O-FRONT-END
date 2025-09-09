
import { useForm } from 'react-hook-form'

export type InfoValues = {
    informacao: string
    telefone?: string
    dataBR?: string
    latitude?: number
    longitude?: number
    anexos?: File[]
    ocoId: string
}

function maskTelefone(v: string) {
    const n = v.replace(/\D/g, '')
    if (n.length <= 10)
        return n.replace(
            /^(\d{0,2})(\d{0,4})(\d{0,4}).*/,
            (m, a, b, c) => [a && `(${a})`, b && ` ${b}`, c && `-${c}`].filter(Boolean).join('')
        )
    return n.replace(
        /^(\d{0,2})(\d{0,5})(\d{0,4}).*/,
        (m, a, b, c) => [a && `(${a})`, b && ` ${b}`, c && `-${c}`].filter(Boolean).join('')
    )
}
function maskDateBR(v: string) {
    const n = v.replace(/\D/g, '').slice(0, 8)
    const p1 = n.slice(0, 2), p2 = n.slice(2, 4), p3 = n.slice(4, 8)
    return [p1, p2 && `/${p2}`, p3 && `/${p3}`].filter(Boolean).join('')
}
function toDateOnly(dateBR?: string) {
    // dd/mm/aaaa -> aaaa-mm-dd
    if (!dateBR) {
        const d = new Date()
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }
    const [dd, mm, yyyy] = dateBR.split('/').map(Number)
    return `${String(yyyy).padStart(4, '0')}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
}

export default function InfoForm({
    ocoId,
    onSubmit,
    onCancel,
    submitting = false,
}: {
    ocoId: string
    onSubmit: (payload: {
        informacao: string
        telefone?: string
        data: string        // yyyy-MM-dd
        latitude?: number
        longitude?: number
        anexos?: File[]
    }) => void
    onCancel: () => void
    submitting?: boolean
}) {
    const { register, handleSubmit, setValue, watch } = useForm<InfoValues>({
        defaultValues: { ocoId, dataBR: new Date().toLocaleDateString('pt-BR') },
    })
    const anexos = watch('anexos') as File[] | undefined

    function handleGeo() {
        if (!navigator.geolocation) return alert('Seu navegador não suporta geolocalização.')
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setValue('latitude', +pos.coords.latitude.toFixed(6))
                setValue('longitude', +pos.coords.longitude.toFixed(6))
            },
            () => alert('Não foi possível obter a localização.'),
            { enableHighAccuracy: true, timeout: 8000 }
        )
    }

    return (
        <form
            className="space-y-3"
            onSubmit={handleSubmit((v) => {
                const payload = {
                    informacao: (v.informacao || '').trim(),
                    telefone: v.telefone?.trim() || undefined,
                    data: toDateOnly(v.dataBR),
                    latitude: v.latitude,
                    longitude: v.longitude,
                    anexos: v.anexos,
                }
                console.log('[DEBUG submit] payload', payload)
                onSubmit(payload)
            })}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Informação</label>
                <textarea
                    rows={5}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    {...register('informacao')}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <input
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="(65) 99999-9999"
                        {...register('telefone')}
                        onChange={(e) => { e.target.value = maskTelefone(e.target.value) }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Data</label>
                    <input
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="dd/mm/aaaa"
                        {...register('dataBR')}
                        onChange={(e) => { e.target.value = maskDateBR(e.target.value) }}
                    />
                </div>
                <div className="sm:col-span-1 flex items-end">
                    <button type="button" onClick={handleGeo} className="w-full px-3 py-2 rounded-xl border bg-indigo-600 text-white hover:bg-indigo-700">
                        Usar minha localização
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <input type="number" step="any" className="w-full px-3 py-2 border rounded-xl" {...register('latitude', { valueAsNumber: true })} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <input type="number" step="any" className="w-full px-3 py-2 border rounded-xl" {...register('longitude', { valueAsNumber: true })} />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Fotos</label>
                    <input
                        multiple
                        accept="image/*"
                        type="file"
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                        onChange={(e) => setValue('anexos', Array.from(e.target.files ?? []))}
                    />
                    {anexos && anexos.length > 0 && (
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            {anexos.map((f, i) => (
                                <img
                                    key={i}
                                    src={URL.createObjectURL(f)}
                                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    className="w-full h-20 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border">Cancelar</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
                    {submitting ? 'Enviando...' : 'Enviar'}
                </button>
            </div>
        </form>
    )
}
