# TarefasNG - Sistema SaaS de Produtividade

**TarefasNG** é um sistema avançado de gerenciamento de tarefas baseado na **Matriz de Eisenhower**, desenvolvido em Angular com funcionalidades de classificação automática, drag-and-drop e interface moderna.

## 🚀 Características Principais

### 📊 Matriz de Eisenhower Completa
- **Q1 (Fazer Agora)**: Tarefas urgentes e importantes - 🔥
- **Q2 (Planejar)**: Tarefas importantes mas não urgentes - 📅
- **Q3 (Delegar)**: Tarefas urgentes mas não importantes - 👥
- **Q4 (Eliminar)**: Tarefas nem urgentes nem importantes - 🗑️

### 🎯 Classificação Automática Inteligente
- **Algoritmo de Prioridade**: `(urgente ? 2 : 0) + (importante ? 3 : 0) + impacto(1-5) - esforço(1-5)`
- **Classificação por Vencimento**: Tarefas com vencimento ≤ 48h são automaticamente marcadas como urgentes
- **Quadrante Automático**: Baseado na combinação urgência + importância

### ✨ Funcionalidades Avançadas
- ✅ **Drag-and-Drop**: Arraste tarefas entre quadrantes para reclassificá-las
- ✅ **Criação Avançada**: Formulário completo com preview em tempo real do quadrante
- ✅ **Métricas Detalhadas**: Esforço estimado (1-5) e impacto esperado (1-5)
- ✅ **Sistema de Tags**: Múltiplas labels por tarefa para organização
- ✅ **Múltiplas Visualizações**: Matriz, Criação de Tarefas e Lista Tradicional
- ✅ **Interface Responsiva**: Otimizada para desktop e mobile
- ✅ **Localização Completa**: Interface em português brasileiro

### 📱 Interface Moderna
- **Design System**: Gradientes, animações e feedback visual
- **Navegação Intuitiva**: Switching entre modos com indicadores visuais
- **Cards Interativos**: Hover effects e transições suaves
- **Cores Temáticas**: Cada quadrante com cor distintiva

## 🛠️ Tecnologias Utilizadas

- **Angular 16**: Framework principal com TypeScript
- **CSS3 Grid**: Layout responsivo da matriz 2x2
- **HTML5 Drag API**: Funcionalidade de arrastar e soltar
- **Modern CSS**: Gradients, animations, flexbox
- **Component Architecture**: Modular e reutilizável

## 📂 Estrutura do Projeto

```
src/app/
├── eisenhower-matrix/          # Componente da matriz principal
├── task-form/                  # Formulário de criação de tarefas
├── task-list/                  # Visualização em lista tradicional
├── task.model.ts               # Interfaces e enums do domínio
├── task.service.ts             # Lógica de negócio e classificação
├── app.component.*             # Componente principal com navegação
└── app.module.ts               # Configuração dos módulos
```

## 🎮 Como Usar

### 1. Visualização da Matriz
- Acesse a aba **"📊 Matriz de Eisenhower"**
- Visualize suas tarefas organizadas nos 4 quadrantes
- Use drag-and-drop para mover tarefas entre quadrantes

### 2. Criação de Tarefas
- Clique em **"➕ Criar Tarefa"**
- Preencha título e descrição
- **Defina urgência e importância** (veja o quadrante previsto em tempo real)
- Configure métricas de esforço e impacto
- Adicione tags para organização
- Tarefa será automaticamente classificada no quadrante correto

### 3. Gestão Avançada
- **Arraste tarefas** entre quadrantes para reclassificar
- **Marque como concluída** clicando no checkbox
- **Exclua tarefas** com o botão 🗑️
- **Visualize métricas** de prioridade, esforço e impacto

## 🚦 Como Executar Localmente

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Build para produção
npm run build
```

## 📊 Lógica de Classificação

### Determinação de Urgência
```typescript
is_urgent = (due_date - now <= 48h) || flag_urgent === true
```

### Cálculo de Prioridade
```typescript
priority_score = (is_urgent ? 2 : 0) + (is_important ? 3 : 0) + impact_score - effort_estimate
```

### Atribuição de Quadrante
- **Q1**: `is_urgent = true` AND `is_important = true`
- **Q2**: `is_urgent = false` AND `is_important = true`
- **Q3**: `is_urgent = true` AND `is_important = false`
- **Q4**: `is_urgent = false` AND `is_important = false`

## 🌐 Deploy

A aplicação está configurada para deploy automático na Azure Static Web Apps através do GitHub Actions.

### Configuração do Deploy:
- **Source**: Código fonte na raiz do repositório
- **Build Output**: `dist/tarefas-ng`
- **Deploy**: Automático via pull requests e push para main

## 📋 Funcionalidades Implementadas

### ✅ Core da Matriz de Eisenhower
- [x] Interface de matriz 2x2 responsiva
- [x] Classificação automática de tarefas
- [x] Drag-and-drop entre quadrantes
- [x] Reclassificação automática ao mover
- [x] Contadores dinâmicos por quadrante

### ✅ Gestão Avançada de Tarefas
- [x] Criação com campos detalhados
- [x] Título, descrição, urgência, importância
- [x] Data de vencimento e alertas automáticos
- [x] Scores de esforço e impacto (1-5)
- [x] Sistema de tags/labels múltiplas
- [x] Status tracking (pendente, concluída, etc.)

### ✅ Interface e Experiência
- [x] Navegação entre múltiplas views
- [x] Preview em tempo real do quadrante
- [x] Cálculo dinâmico de prioridade
- [x] Design responsivo mobile-first
- [x] Feedback visual e animações
- [x] Instruções de uso integradas

### ✅ Funcionalidades de Produtividade
- [x] Visualização de progresso
- [x] Filtering de tarefas concluídas
- [x] Métricas de produtividade
- [x] Sistema de priorização inteligente
- [x] Organização por labels/projetos

## 🎯 Próximas Funcionalidades

### 🔄 Recursos SaaS
- [ ] Sistema de autenticação e usuários
- [ ] Multi-tenancy por organizações
- [ ] Gestão de equipes e permissões
- [ ] Planos de assinatura (Free, Pro, Business)

### 📈 Integrações e Automações
- [ ] Integração com Google Calendar
- [ ] Notificações por email/push
- [ ] API REST completa
- [ ] Webhooks para eventos
- [ ] Slack/Teams integration

### 📊 Analytics e Relatórios
- [ ] Dashboard de produtividade
- [ ] Relatórios de tempo por quadrante
- [ ] Métricas de equipe
- [ ] Insights de otimização

## 🎨 Design System

### Cores dos Quadrantes
- **Q1 (Fazer)**: `#e74c3c` - Vermelho (Urgência)
- **Q2 (Planejar)**: `#27ae60` - Verde (Crescimento)
- **Q3 (Delegar)**: `#f39c12` - Amarelo (Atenção)
- **Q4 (Eliminar)**: `#95a5a6` - Cinza (Baixa prioridade)

### Tipografia e Spacing
- **Headers**: Sistema de gradients azul
- **Cards**: Border radius 12px, shadow suave
- **Grid**: 20px gap, layout CSS Grid
- **Responsivo**: Breakpoints em 768px e 480px

## 📄 Licença

Projeto desenvolvido para demonstração de implementação da Matriz de Eisenhower em aplicações web modernas.

---

**TarefasNG** - Transformando a gestão de tarefas com a metodologia comprovada de Stephen Covey.
