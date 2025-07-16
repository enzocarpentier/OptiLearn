# Design Document

## Overview

Cette fonctionnalité transforme l'interface de visualisation PDF avec assistant IA en une expérience pleine page, maximisant l'espace disponible et offrant une flexibilité de redimensionnement. L'interface utilisera toute la hauteur et largeur de la fenêtre, avec des panneaux redimensionnables et des contrôles adaptatifs.

## Architecture

### Structure des composants

```
DeckDetailView (Full Screen)
├── FloatingHeader (Auto-hide)
├── ResizablePanelLayout
│   ├── PDFPanel (Resizable)
│   │   └── CustomPDFViewer (Enhanced)
│   ├── ResizeHandle (Draggable)
│   └── AIPanel (Collapsible)
│       └── AIAssistant (Enhanced)
└── ResponsiveBreakpoints
```

### Gestion d'état

- **Layout State**: Tailles des panneaux, état de collapse, mode responsive
- **UI State**: Visibilité des contrôles, état de redimensionnement
- **Persistence**: Sauvegarde des préférences utilisateur dans localStorage

## Components and Interfaces

### 1. FullScreenLayout Component

```typescript
interface FullScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  onBack: () => void;
  title: string;
  subtitle?: string;
}

interface LayoutState {
  leftWidth: number;
  rightWidth: number;
  isRightCollapsed: boolean;
  isHeaderVisible: boolean;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}
```

**Responsabilités:**
- Gestion de l'espace pleine page (100vh/100vw)
- Coordination des panneaux redimensionnables
- Gestion responsive des breakpoints
- Auto-masquage du header

### 2. ResizablePanel Component

```typescript
interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  isCollapsed: boolean;
  onResize: (width: number) => void;
  onToggleCollapse: () => void;
}
```

**Responsabilités:**
- Redimensionnement par glisser-déposer
- Animation de collapse/expand
- Contraintes de taille min/max
- Persistance des dimensions

### 3. FloatingHeader Component

```typescript
interface FloatingHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}
```

**Responsabilités:**
- Affichage flottant avec auto-masquage
- Animation d'apparition/disparition
- Détection de survol pour réapparition

### 4. Enhanced CustomPDFViewer

**Améliorations:**
- Adaptation à la taille dynamique du panneau
- Optimisation du rendu pour les grands écrans
- Contrôles de zoom adaptatifs

### 5. Enhanced AIAssistant

**Améliorations:**
- Interface compacte pour les petites largeurs
- Mode collapse avec indicateur de messages
- Adaptation responsive du layout des messages

## Data Models

### LayoutPreferences

```typescript
interface LayoutPreferences {
  leftPanelWidth: number;
  rightPanelWidth: number;
  isRightPanelCollapsed: boolean;
  autoHideHeader: boolean;
  lastUsed: Date;
}
```

### ResponsiveBreakpoints

```typescript
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
  desktop: Infinity
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;
```

## Error Handling

### Redimensionnement

- **Contraintes de taille**: Empêcher les panneaux de devenir trop petits
- **Limites d'écran**: Adaptation automatique aux écrans étroits
- **Performance**: Throttling des événements de redimensionnement

### Responsive

- **Fallback mobile**: Mode empilé si le redimensionnement échoue
- **Détection d'orientation**: Adaptation aux changements d'orientation
- **Sauvegarde d'état**: Restauration des préférences après erreur

### Persistance

- **localStorage indisponible**: Fonctionnement en mode session uniquement
- **Données corrompues**: Reset aux valeurs par défaut
- **Quota dépassé**: Nettoyage automatique des anciennes préférences

## Testing Strategy

### Tests unitaires

- **ResizablePanel**: Logique de redimensionnement et contraintes
- **FullScreenLayout**: Calculs de dimensions et responsive
- **FloatingHeader**: Logique d'auto-masquage et animations

### Tests d'intégration

- **Interaction panneaux**: Redimensionnement coordonné
- **Persistance**: Sauvegarde et restauration des préférences
- **Responsive**: Transitions entre breakpoints

### Tests visuels

- **Animations**: Fluidité des transitions de collapse/expand
- **Responsive**: Rendu correct sur différentes tailles d'écran
- **Performance**: Pas de lag pendant le redimensionnement

### Tests utilisateur

- **Ergonomie**: Facilité de redimensionnement et navigation
- **Accessibilité**: Support clavier et lecteurs d'écran
- **Performance**: Temps de réponse sur différents appareils

## Implementation Notes

### CSS/Styling

- Utilisation de CSS Grid pour le layout principal
- Flexbox pour les composants internes
- CSS custom properties pour les dimensions dynamiques
- Transitions CSS pour les animations fluides

### Performance

- `useCallback` et `useMemo` pour optimiser les re-renders
- Throttling des événements de redimensionnement (16ms)
- Lazy loading des préférences depuis localStorage

### Accessibilité

- Support complet du clavier pour le redimensionnement
- ARIA labels pour les contrôles de layout
- Focus management lors des transitions
- Respect des préférences de mouvement réduit

### Browser Support

- Support moderne (ES2020+)
- Fallbacks pour les navigateurs sans CSS Grid
- Polyfills pour ResizeObserver si nécessaire