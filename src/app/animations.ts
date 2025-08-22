import { trigger, state, style, transition, animate, query, stagger, group, keyframes } from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('300ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
  ])
]);

export const scaleInOut = trigger('scaleInOut', [
  transition(':enter', [
    style({ transform: 'scale(0.8)', opacity: 0 }),
    animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'scale(0.8)', opacity: 0 }))
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(15px)' }),
      stagger('50ms', [
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const routeSlideAnimation = trigger('routeSlideAnimation', [
  transition('* <=> *', [
    group([
      query(':enter', [
        style({ position: 'absolute', width: '100%', transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true }),
      query(':leave', [
        style({ position: 'absolute', width: '100%' }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ], { optional: true })
    ])
  ])
]);

export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', keyframes([
      style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
      style({ transform: 'scale(1.1)', opacity: 0.8, offset: 0.7 }),
      style({ transform: 'scale(1)', opacity: 1, offset: 1 })
    ]))
  ])
]);

export const slideUpDown = trigger('slideUpDown', [
  transition(':enter', [
    style({ height: '0px', opacity: 0, overflow: 'hidden' }),
    animate('300ms ease-out', style({ height: '*', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ height: '*', opacity: 1, overflow: 'hidden' }),
    animate('300ms ease-in', style({ height: '0px', opacity: 0 }))
  ])
]);