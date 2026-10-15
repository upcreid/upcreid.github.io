+++
title = "Veolia — Progiciel de trésorerie"
description = "Sortir une plateforme de trésorerie de son hébergement, la connecter aux banques et garder les flux en marche."
date = 2015-04-11
weight = 30

[extra]
lead = "Consultant technique — progiciel de gestion de trésorerie · 2015 – 2017"
+++

J'étais le consultant technique d'un progiciel de gestion de trésorerie (Wallstreet Systems). En deux ans, la plateforme a changé d'hébergement, s'est connectée à toujours plus de banques, et a dû continuer de tourner sans interruption.

## Ce que j'y faisais

### Analyse et mise en œuvre

- Outillage Python pour injecter des transactions en masse depuis un CSV, pour déployer de nouvelles entités
- Migration de BugZilla de Windows vers Linux (apache2, mysql, Bugzilla)
- Exports comptables (xml, xsl) vers SAP et SAGE
- Accompagnement à l'externalisation du service bureau (Next → Datalog) : MT940, puis MT101 / MT210 / MT300
- Export du référentiel (banques, entités, comptes) vers Datalog
- Mise en place de FxAll avec Reuters et WSS
- Migration de l'hébergement : HP-UX → Linux, environnement ISO (réplique de la PROD à J-1, RMAN), réseau (deux datacenters, MPLS), revue de l'exploitation

### Amélioration continue

- Développement, packaging, intégration et livraison
- Procédures stockées pour accélérer les rapports
- Framework XML pour les flux bancaires : AFB120, MT101, MT940
- Change control sous SVN
- Optimisation SQL (vues, index, triggers)
- Rapports et tableaux d'activité dans la suite WSS

## Environnement technique

- HP-UX, Windows Server 2003, Citrix
- Oracle, SQL Developer, PL/SQL
- Weblogic, WSS Suite (CMM, TRM, ACM), activeMQ
- SVN
- shell, Python, Perl
- SWIFT Alliance, esiadapter, FTP
