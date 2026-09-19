---
title: "Herdr : le multiplexeur de terminal pour les agents IA 🤖"
description: "Découverte de Herdr, le multiplexeur de terminal persistant conçu pour orchestrer et suivre vos agents de code IA."
lead: "Orchestrer plusieurs agents IA dans votre terminal n'a jamais été aussi simple."
date: 2026-09-19T14:30:00+02:00
lastmod: 2026-09-19T14:30:00+02:00
draft: false
contributors: ["UpCreid"]
---

Avec l'avènement des agents de code IA (Claude Code, GitHub Copilot CLI, Cursor Agent...), la façon de travailler dans le terminal évolue rapidement. Faire tourner plusieurs agents en parallèle dans un multiplexeur classique (comme `tmux` ou `zellij`) peut vite devenir complexe quand il s'agit de suivre qui fait quoi. C'est là qu'intervient **Herdr**.

<!-- more -->

## Qu'est-ce que Herdr ?

**Herdr** est un multiplexeur de terminal persistant spécialement pensé pour l'ère des agents IA. Il s'exécute sous forme de serveur en arrière-plan et apporte une couche de gestion intelligente (*agent-aware*) au-dessus de vos PTY habituels.

## Les possibilités offertes par Herdr

- 🚦 **Suivi d'état en temps réel** : Herdr détecte automatiquement l'état de chaque agent et l'affiche clairement (*en cours*, *en attente d'input*, *bloqué*, ou *terminé*). Plus besoin de scroller sans fin pour savoir si l'agent a besoin de votre intervention !
- 🔄 **Persistance absolue** : Vos tâches continuent de tourner même si vous fermez votre fenêtre de terminal ou déconnectez une session SSH.
- 🔌 **API & Automatisation** : Via sa CLI et son API socket, les agents peuvent eux-mêmes interagir avec le multiplexeur (ouvrir de nouveaux onglets, lancer des sous-tâches).
- 🖥️ **Terminal Natif** : S'intègre harmonieusement avec votre émulateur de terminal favori en utilisant des PTY standard.

## En résumé

Si vous utilisez quotidiennement des agents IA en CLI pour vos projets et souhaitez maximiser votre productivité sans perdre le fil, **Herdr** est un outil à tester d'urgence.
