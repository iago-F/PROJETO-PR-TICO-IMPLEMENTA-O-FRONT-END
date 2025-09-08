import { Link } from 'react-router-dom'
export default function NotFound() {
    return (
        <div className="min-h-screen grid place-items-center text-center space-y-2">
            <h1 className="text-3xl font-bold">404</h1>
            <p>Página não encontrada.</p>
            <Link to="/" className="text-blue-600 underline">Voltar para a Home</Link>
        </div>
    )
}
