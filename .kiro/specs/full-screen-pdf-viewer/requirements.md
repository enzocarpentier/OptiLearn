# Requirements Document

## Introduction

L'interface actuelle de visualisation PDF avec l'assistant IA ne prend pas toute la page disponible, créant une expérience utilisateur sous-optimale. Les utilisateurs ont besoin d'une interface pleine page pour maximiser l'espace de visualisation du PDF et l'interaction avec l'assistant IA.

## Requirements

### Requirement 1

**User Story:** En tant qu'utilisateur, je veux que le visualiseur PDF et l'assistant IA prennent toute la page disponible, afin de maximiser l'espace de travail et améliorer ma productivité.

#### Acceptance Criteria

1. WHEN l'utilisateur ouvre un deck avec PDF THEN l'interface doit occuper 100% de la hauteur et largeur de la fenêtre
2. WHEN l'utilisateur redimensionne la fenêtre THEN l'interface doit s'adapter automatiquement sans espaces vides
3. WHEN l'utilisateur navigue vers la vue deck detail THEN le header global doit être masqué pour maximiser l'espace

### Requirement 2

**User Story:** En tant qu'utilisateur, je veux pouvoir ajuster la répartition entre le visualiseur PDF et l'assistant IA, afin d'adapter l'interface à mes besoins du moment.

#### Acceptance Criteria

1. WHEN l'utilisateur survole la séparation entre les deux panneaux THEN un curseur de redimensionnement doit apparaître
2. WHEN l'utilisateur fait glisser la séparation THEN les panneaux doivent se redimensionner en temps réel
3. WHEN l'utilisateur relâche le glissement THEN la nouvelle taille doit être mémorisée pour la session

### Requirement 3

**User Story:** En tant qu'utilisateur, je veux pouvoir masquer temporairement l'assistant IA, afin de consacrer tout l'espace au PDF quand nécessaire.

#### Acceptance Criteria

1. WHEN l'utilisateur clique sur un bouton de masquage THEN l'assistant IA doit se réduire et le PDF doit prendre tout l'espace
2. WHEN l'assistant est masqué THEN un bouton de restauration doit rester visible
3. WHEN l'utilisateur clique sur restaurer THEN l'assistant doit réapparaître avec sa taille précédente

### Requirement 4

**User Story:** En tant qu'utilisateur, je veux que l'interface soit responsive sur différentes tailles d'écran, afin d'avoir une expérience optimale sur tous mes appareils.

#### Acceptance Criteria

1. WHEN l'utilisateur utilise un écran large (>1200px) THEN les deux panneaux doivent être côte à côte
2. WHEN l'utilisateur utilise un écran moyen (768-1200px) THEN l'interface doit s'adapter avec des proportions ajustées
3. WHEN l'utilisateur utilise un écran petit (<768px) THEN l'interface doit passer en mode empilé avec onglets

### Requirement 5

**User Story:** En tant qu'utilisateur, je veux que les contrôles de navigation restent accessibles, afin de pouvoir revenir facilement à la liste des decks.

#### Acceptance Criteria

1. WHEN l'utilisateur est en mode pleine page THEN le bouton retour doit rester visible et accessible
2. WHEN l'utilisateur survole la zone de navigation THEN les contrôles doivent apparaître avec une animation fluide
3. WHEN l'utilisateur n'interagit pas pendant 3 secondes THEN les contrôles peuvent se masquer automatiquement pour maximiser l'espace