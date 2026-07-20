# Plano de Projeto — Sistema de Confirmação de Participação (RSVP)
### Maputo Província a Caminho da 61ª edição da FACIM 2026

*Elaborado como gestor de marketing e especificação técnica de desenvolvimento*

---

## 1. Objetivo

Reduzir a fricção entre o lead clicar no link recebido no WhatsApp e confirmar a presença, maximizando a taxa de conversão. Cada campo extra ou segundo de carregamento reduz a conversão — por isso o princípio-guia deste projeto é: o mínimo de atrito possível.

## 2. Fluxo do Lead

- Recebe o link personalizado no WhatsApp
- Abre a página (carregamento inferior a 2 segundos, mobile-first)
- Vê o nome do evento, data, hora e local
- Preenche: Nome completo, Email e Celular/WhatsApp
- Marca o aceite da política de privacidade (obrigatório, conforme LGPD)
- Clica em "Confirmar Participação"
- Recebe confirmação visual de sucesso, com opção de adicionar ao calendário

## 3. Campos e Validações

| Campo | Validação |
|---|---|
| Nome | Obrigatório, mínimo 2 palavras |
| Email | Formato válido |
| Celular | Máscara automática + validação de formato |
| Checkbox de privacidade | Obrigatório |

Recomenda-se ainda bloqueio de duplicados (por email ou telefone) e um honeypot invisível como proteção anti-spam/bot.

## 4. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend (formulário do lead) | React + Vite ou Next.js — mobile-first, 100% responsivo |
| Backend | Node.js + Express |
| Base de dados | CockroachDB (tier Basic, compatível com Postgres) |
| Deploy inicial | Vercel |
| Deploy final | Host dedicado a Node (ver secção 7) |
| Notificações (opcional) | Email via SendGrid/Resend, ou WhatsApp via API oficial/Twilio |

**Nota técnica:** como o lead acede por um link e não instala nada, o frontend deve ser web responsivo — não um app nativo (React Native/Expo exigiria instalação via loja, o que reduziria a conversão).

## 5. Design

- Minimalista: uma cor de destaque + neutros, tipografia clara
- Um único CTA visível: "Confirmar Participação"
- Sem menu, sem distrações, sem scroll desnecessário
- Estado de carregamento no botão ao submeter (evita duplo clique)

## 6. Métricas de Acompanhamento (KPIs)

- Taxa de conversão (confirmações ÷ cliques no link)
- Tempo médio até confirmar
- Taxa de abandono no formulário
- Origem do clique (parâmetros UTM, caso o link seja distribuído em vários grupos/campanhas)

## 7. Especificações Técnicas de Hospedagem

### 7.1 Compatibilidade Vercel + CockroachDB

A Vercel executa funções serverless, onde cada requisição pode abrir uma nova conexão à base de dados. Como o CockroachDB tem um limite rígido de conexões ativas por vCPU e arquiteturas serverless não fazem pooling do lado do cliente, recomenda-se usar o connection pooling nativo do CockroachDB Cloud (porta "pooled" da connection string) em vez de gerir isso manualmente.

Com Fluid Compute (ativado por padrão na Vercel), as funções podem correr até 1 minuto no plano gratuito e até 14 minutos em planos pagos — mais do que suficiente para este formulário.

### 7.2 Capacidade do CockroachDB (tier gratuito)

O plano Basic inclui $15/mês de crédito gratuito, equivalente a 50 milhões de Request Units e 10 GiB de armazenamento — suficiente para um evento com milhares de confirmações, sem custo esperado.

### 7.3 Checklist para o host final

| Requisito | Motivo |
|---|---|
| Suporte a Node.js LTS | Compatibilidade com Express |
| Conexões TCP persistentes de saída | Necessário para conectar ao CockroachDB |
| Domínio próprio + SSL automático | O link do WhatsApp precisa de HTTPS |
| Variáveis de ambiente/secrets | Guardar a connection string do banco com segurança |
| Região próxima a Moçambique/África Austral | Reduzir latência para os leads locais |
| Sem "sleep" agressivo | Evitar demora no primeiro clique após inatividade |

### 7.4 Comparação de hosts para o deploy final

| Host | Free tier | Observação |
|---|---|---|
| Render | 750h grátis/mês, Postgres gerido gratuito (expira) | Free tier "dorme" após 15 min de inatividade (30-50s para acordar) |
| Railway | Sem free tier contínuo; crédito único de teste | Deploy mais rápido e simples; ótimo para prototipagem |
| Fly.io | Trial limitado | Melhor para baixa latência global; mais configuração |

**Recomendação:** para este projeto (evento pontual, tráfego concentrado em dias específicos), sugere-se o Render no plano pago básico (~7 USD/mês), evitando o "sleep" que prejudicaria a conversão no momento exato da divulgação do link.

### 7.5 Preview do link no WhatsApp (Open Graph)

Como o link será partilhado no WhatsApp, o preview (imagem, título, descrição) depende de meta tags Open Graph na página. Sem isso, o link aparece sem formatação, reduzindo a taxa de clique.

- `og:title` — "Maputo Província a Caminho da 61ª edição da FACIM 2026"
- `og:description` — "Confirme a sua participação"
- `og:image` — imagem de 1200x630 px

## 8. Painel do Administrador

### 8.1 Autenticação

Início com um único utilizador admin (login por utilizador/senha, protegido por JWT). Evolução futura para múltiplos admins com níveis de acesso é possível.

- Rota `/admin` não é pública — exige login
- Senha com hash (bcrypt), nunca em texto plano
- Sessão expira automaticamente (ex.: 2 horas)

### 8.2 Conteúdo do dashboard

- KPI no topo: total de confirmados em tempo real
- Tabela paginada com Nome, Email, Celular e Data/Hora da confirmação
- Busca por nome ou email
- Filtro por período (ex.: confirmados hoje / esta semana)

A paginação é obrigatória — carregar todos os registos de uma vez travaria a página caso haja milhares de inscritos.

### 8.3 Exportação para Excel formatado

Utiliza-se a biblioteca ExcelJS (em vez de uma exportação simples), permitindo controlar a formatação real do ficheiro:

- Cabeçalho em negrito com cor de fundo
- Largura de coluna automática, ajustada ao conteúdo
- Primeira linha fixa (freeze pane) para facilitar a rolagem
- Filtro automático (AutoFilter) já ativo no cabeçalho
- Nome do ficheiro: `inscritos-facim-2026-[data-da-exportação].xlsx`
- Colunas: Nome | Email | Celular | Data de Confirmação

O ficheiro é gerado sob demanda no backend (não fica guardado em disco) e enviado diretamente para download ao clicar em "Exportar".

### 8.4 Novos endpoints da API

| Rota | Método | Acesso |
|---|---|---|
| `/api/rsvp` | POST | Público (formulário do lead) |
| `/api/admin/login` | POST | Público (valida credenciais) |
| `/api/admin/inscritos` | GET | Protegido — lista paginada |
| `/api/admin/exportar` | GET | Protegido — gera .xlsx |

### 8.5 Segurança adicional

- Rate limiting em `/api/admin/login` (evitar força bruta)
- Rate limiting em `/api/admin/exportar` (evitar geração repetida em loop)
- Credenciais de admin guardadas como variável de ambiente, nunca no código

## 9. Cronograma Estimado

| Dia | Etapa |
|---|---|
| 1-2 | Wireframe + protótipo visual |
| 3-4 | Frontend do formulário (RSVP) + validações |
| 5 | Backend + base de dados (schema CockroachDB) |
| 6 | Painel do administrador — tabela, filtros e autenticação |
| 7 | Exportação Excel formatada |
| 8 | Testes de responsividade em diferentes dispositivos |
| 9 | Deploy final + geração do link e configuração Open Graph |
