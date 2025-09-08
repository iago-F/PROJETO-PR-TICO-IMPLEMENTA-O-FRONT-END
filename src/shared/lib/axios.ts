import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://abitus-api.geia.vip/v1',
    timeout: 15000,
})

api.interceptors.response.use(
    (r) => r,
    (err) =>
        Promise.reject({
            status: err?.response?.status ?? 0,
            message: err?.response?.data?.message ?? 'Erro inesperado',
            details: err?.response?.data,
        })
)
