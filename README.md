# Education Portal Monorepo

This monorepo contains three main applications for the education portal system:

## Projects

### Admin Portail (`admin-portail/`)
Angular-based administrative portal for managing the education system.

**Tech Stack:** Angular, TypeScript, SCSS
**Purpose:** Administrative interface for school management

### API Backend (`portail-education-api-remaster/`)
Laravel-based REST API backend serving all applications.

**Tech Stack:** Laravel, PHP, Postgres
**Purpose:** Core API providing data and business logic

### Mobile App (`portail-education-eleve-parent/`)
Flutter mobile application for students and parents.

**Tech Stack:** Flutter, Dart
**Purpose:** Mobile interface for students and parents to access portal features

## Getting Started

Each project has its own setup instructions in their respective directories:

- [Admin Portal Setup](./admin-portail/README.md)
- [API Backend Setup](./portail-education-api-remaster/README.md)  
- [Mobile App Setup](./portail-education-eleve-parent/README.md)

## Migration Information

This monorepo was created by merging three separate repositories while preserving all commit history. See [MONOREPO_MIGRATION.md](./MONOREPO_MIGRATION.md) for details.
