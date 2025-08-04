# Monorepo Migration Summary

This document describes how the three separate repositories were merged into this monorepo while preserving all commit history.

## Migration Date
August 4, 2025

## Source Repositories
The following repositories were merged into this monorepo:

1. **admin-portail** → `admin-portail/`
   - Angular application for admin portal
   - All commit history preserved

2. **portailEducationApiRemaster** → `portail-education-api-remaster/`
   - Laravel API backend
   - All commit history preserved

3. **portailEducationEleveParent** → `portail-education-eleve-parent/`
   - Flutter application for students and parents
   - All commit history preserved

## Migration Method
Used `git subtree` strategy to merge repositories:

```bash
# Initialize mono-repo
git init
git commit -m "Initial commit"

# Add each repository as subtree
git remote add admin-portail ../admin-portail
git fetch admin-portail
git subtree add --prefix=admin-portail admin-portail/main

git remote add api-remaster ../portailEducationApiRemaster
git fetch api-remaster
git subtree add --prefix=portail-education-api-remaster api-remaster/main

git remote add eleve-parent ../portailEducationEleveParent
git fetch eleve-parent
git subtree add --prefix=portail-education-eleve-parent eleve-parent/main
```

## Structure
```
mono-repo/
├── README.md
├── MONOREPO_MIGRATION.md
├── admin-portail/                    # Angular Admin Portal
├── portail-education-api-remaster/   # Laravel API Backend
└── portail-education-eleve-parent/   # Flutter Mobile App
```

## Future Updates
To pull updates from original repositories (if they continue to be developed):

```bash
git subtree pull --prefix=admin-portail admin-portail/main

git subtree pull --prefix=portail-education-api-remaster api-remaster/main

git subtree pull --prefix=portail-education-eleve-parent eleve-parent/main
```
