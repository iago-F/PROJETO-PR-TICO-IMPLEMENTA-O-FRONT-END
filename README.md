# IAGO FERREIRA DIAS 
- **iagoferreira278@gmail.com 
- **65998179749

# FrontDesaparecidos

SPA em React + Vite para consulta e registro de informações sobre pessoas desaparecidas, consumindo a API pública `abitus-api.geia.vip`.

##  Stack

- **React 18** + **Vite**
- **React Router** (navegação)
- **@tanstack/react-query** (fetch/cache)
- **Axios** (requisições HTTP)
- **Tailwind v4** (+ `@tailwindcss/vite`)
- **React Hook Form**
- **Zod** (validações opcionais)
- **Docker** (build de produção com Nginx; opção dev com hot-reload)

---

##  Requisitos

- Node **>= 18** (recomendado **20**)
- NPM **>= 9**
- (Opcional) Docker Desktop (Windows/macOS) ou Docker Engine (Linux)

---

##  Instalação

```bash
# na raiz do projeto
npm ci



 Variáveis de ambiente

O Vite injeta variáveis que começam com VITE_ no build.

Crie .env.production (para build e Docker):

VITE_API_BASE_URL=https://abitus-api.geia.vip



▶️ Execução

Você pode rodar o projeto de duas formas:

🔹 1. Sem Docker (direto com Node/NPM)
# instalar dependências
npm ci

# rodar em modo dev (http://localhost:5173)
npm run dev

# ou gerar build de produção
npm run build
npm run preview   # serve build em http://localhost:4173

🔹 2. Com Docker (execução em container)



# build da imagem
docker build -t frontdesaparecidos:prod .

# rodar o container (http://localhost:8080)
docker run --rm -p 8080:80 frontdesaparecidos:prod


O Dockerfile usa multi-stage build → instala dependências, gera o build com Vite e serve com Nginx.



 Estrutura resumida
src/
  App.tsx
  main.tsx
  index.css
  shared/
    lib/
      axios.ts
      queryClient.ts
    ui/
      Modal.tsx
  features/
    pessoas-list/
      ListPage.tsx
      CardPessoa.tsx
      SearchBar.tsx
    pessoa-details/
      DetailsPage.tsx
      InfoForm.tsx
  services/
    pessoa/
      api.ts
    ocorrencias/
      api.ts



 Funcionalidades

Tela inicial

Lista de desaparecidos com paginação (≥10 por página).

Cards com foto, nome, idade, status (vermelho/verde).

Campo de busca/filtro por nome, sexo, faixa etária.

Tela de detalhes

Foto, status, idade, sexo, data “desde”, local.

Botão Registrar informação.

Formulário modal com:

máscaras para telefone e data (dd/mm/aaaa)

geolocalização (preenche lat/lng)

upload de fotos com preview

envio em multipart/form-data para POST /v1/ocorrencias/informacoes-desaparecido

data enviada no formato yyyy-MM-dd (compatível com LocalDate no backend)




   Testes
Testes manuais

Acesse a home → veja GET /v1/pessoas/aberto/filtro no DevTools.

Abra uma pessoa → clique em Registrar informação → envie:

ver POST /v1/ocorrencias/informacoes-desaparecido no DevTools → Payload contém informacao, data (yyyy-MM-dd), ocoId, e anexos (quando houver).

Status 201 → sucesso.




 Troubleshooting

Página em branco ao dar refresh em rotas
→ o nginx.conf já inclui try_files $uri /index.html; (SPA fallback).

Erro 500 no envio de informação
→ use data no formato yyyy-MM-dd (já tratado no form).

Anexo aparece null no preview da resposta
→ normal: alguns backends não retornam metadados do arquivo no POST.
→ verifique em DevTools → Payload → Form Data (o arquivo deve aparecer como (binary)).
