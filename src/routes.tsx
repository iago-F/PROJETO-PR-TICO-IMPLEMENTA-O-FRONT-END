import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const ListPage = lazy(() => import('../src/features/pessoas-list/ListPage'))
const DetailsPage = lazy(() => import('../src/features/pessoas-list/DetailsPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

const router = createBrowserRouter([
    { path: '/', element: <Suspense fallback="Carregando..."><ListPage /></Suspense> },
    { path: '/pessoa/:id', element: <Suspense fallback="Carregando..."><DetailsPage /></Suspense> },
    { path: '*', element: <Suspense fallback="Carregando..."><NotFound /></Suspense> },
])

export default function AppRoutes() {
    return <RouterProvider router={router} />
}
