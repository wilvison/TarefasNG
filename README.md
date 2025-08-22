# TarefasNG

**TarefasNG** é uma aplicação de gerenciamento de tarefas desenvolvida em Angular, otimizada para deploy na Azure Static Web Apps.

## 🚀 Características

- ✅ **Criação de Tarefas**: Adicione tarefas com título e descrição
- ✅ **Marcação de Conclusão**: Marque tarefas como concluídas ou pendentes
- ✅ **Exclusão de Tarefas**: Remova tarefas desnecessárias
- ✅ **Filtros**: Visualize todas as tarefas ou apenas as pendentes
- ✅ **Progress Tracking**: Acompanhe o progresso com barra visual
- ✅ **Design Responsivo**: Interface adaptada para desktop e mobile
- ✅ **Localização em Português**: Interface completamente em português brasileiro

## 🛠️ Tecnologias Utilizadas

- **Angular 16**: Framework principal
- **TypeScript**: Linguagem de programação
- **CSS3**: Estilização com design moderno
- **Azure Static Web Apps**: Platform de deploy e hospedagem

## 📱 Interface

A aplicação possui uma interface moderna e intuitiva com:

- **Painel de Progresso**: Mostra estatísticas das tarefas concluídas
- **Formulário de Criação**: Para adicionar novas tarefas
- **Lista de Tarefas**: Visualização organizada das tarefas
- **Filtros**: Opção para mostrar/ocultar tarefas concluídas

## 🚦 Como Executar Localmente

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Build para produção
npm run build
```

## 🌐 Deploy

A aplicação está configurada para deploy automático na Azure Static Web Apps através do GitHub Actions. O workflow está configurado em `.github/workflows/azure-static-web-apps-polite-rock-08ce7420f.yml`.

### Configuração do Deploy:
- **Source**: Código fonte na raiz do repositório
- **Build Output**: `dist/tarefas-ng`
- **Deploy**: Automático via pull requests e push para main

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── task-list/          # Componente de lista de tarefas
│   ├── app.component.*     # Componente principal
│   ├── app.module.ts       # Módulo principal
│   ├── task.model.ts       # Interface das tarefas
│   └── task.service.ts     # Serviço de gerenciamento
├── index.html              # Página principal
├── main.ts                 # Bootstrap da aplicação
└── styles.css              # Estilos globais
```

## 📋 Funcionalidades Implementadas

### Gerenciamento de Tarefas
- Criar tarefa com título obrigatório e descrição opcional
- Marcar/desmarcar tarefas como concluídas
- Excluir tarefas
- Filtrar visualização de tarefas

### Interface do Usuário
- Design responsivo e moderno
- Indicadores visuais de progresso
- Feedback visual para interações
- Layout otimizado para dispositivos móveis

### Persistência Local
- Dados mantidos em memória durante a sessão
- Tarefas de exemplo pré-carregadas

## 🔧 Correções Realizadas

Este projeto foi criado para resolver problemas de build e deploy, incluindo:

1. **Estrutura Angular Completa**: Criação de toda estrutura necessária
2. **Configuração de Build**: Setup do Angular CLI e dependências
3. **Output Directory**: Configuração correta do diretório de saída
4. **Index.html**: Criação do arquivo principal necessário para deploy
5. **Workflow Azure**: Atualização do pipeline de deploy

## 📄 Licença

Projeto desenvolvido para fins educacionais e demonstração de deploy em Azure Static Web Apps.
