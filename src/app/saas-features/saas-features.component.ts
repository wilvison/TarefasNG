import { Component } from '@angular/core';
import { fadeInOut, scaleInOut, listAnimation } from '../animations';

interface SubscriptionPlan {
  name: string;
  price: string;
  features: string[];
  highlighted: boolean;
  current: boolean;
}

interface Organization {
  id: number;
  name: string;
  members: number;
  plan: string;
  usage: {
    tasks: number;
    projects: number;
    storage: string;
  };
}

@Component({
  selector: 'app-saas-features',
  templateUrl: './saas-features.component.html',
  styleUrls: ['./saas-features.component.css'],
  animations: [fadeInOut, scaleInOut, listAnimation]
})
export class SaasFeaturesComponent {
  currentView: 'plans' | 'organization' | 'settings' = 'plans';
  
  subscriptionPlans: SubscriptionPlan[] = [
    {
      name: 'Free',
      price: 'R$ 0',
      features: [
        '1 organização',
        '2 membros',
        '1 projeto',
        '10 tarefas',
        'Matriz de Eisenhower básica',
        'Suporte por email'
      ],
      highlighted: false,
      current: true
    },
    {
      name: 'Pro',
      price: 'R$ 29',
      features: [
        '1 organização',
        '5 membros',
        'Projetos ilimitados',
        'Tarefas ilimitadas',
        'Relatórios avançados',
        'Integrações (Google Calendar)',
        'Notificações automáticas',
        'Suporte prioritário'
      ],
      highlighted: true,
      current: false
    },
    {
      name: 'Business',
      price: 'R$ 89',
      features: [
        '1 organização',
        'Membros ilimitados',
        'Projetos ilimitados',
        'Tarefas ilimitadas',
        'Todos os relatórios',
        'Todas as integrações',
        'SSO opcional',
        'API completa',
        'Suporte telefônico',
        'Onboarding personalizado'
      ],
      highlighted: false,
      current: false
    }
  ];

  organization: Organization = {
    id: 1,
    name: 'Minha Empresa Ltda',
    members: 2,
    plan: 'Free',
    usage: {
      tasks: 4,
      projects: 1,
      storage: '0.2 MB'
    }
  };

  setView(view: 'plans' | 'organization' | 'settings'): void {
    this.currentView = view;
  }

  upgradePlan(planName: string): void {
    alert(`Redirecionando para checkout do plano ${planName}...`);
  }

  inviteMember(): void {
    alert('Função de convite seria implementada aqui...');
  }

  manageIntegrations(): void {
    alert('Gerenciamento de integrações seria implementado aqui...');
  }
}
