+++
title = "T3 Code : une seule surface de contrôle pour tous vos agents"
description = "Pas un harness ni un abonnement : T3 Code pilote vos agents Claude Code, Codex et Cursor du bureau au téléphone."
slug = "t3-code-agent-control-surface"
date = 2026-11-11T09:00:00+01:00
updated = 2026-11-11T09:00:00+01:00
draft = false
aliases = ["/fr/blog/2026/11/11/t3-code-agent-control-surface/"]

[extra]
lead = "Vous avez déjà les agents. Il manque un endroit pour tous les piloter, du bureau ou du téléphone."
authors = ["UpCreid"]
+++

Claude Code dans un terminal, Codex dans un autre, Cursor ailleurs : les agents sont bons, la façon de jongler entre eux ne l'est pas. **T3 Code** (MIT, ~56k étoiles GitHub) s'attaque exactement à ce manque, et reste précis sur ce qu'il est.

## Pas un harness

Le README parle d'une *agent harness control surface*. La nuance compte : T3 Code ne fournit aucun outil aux modèles et n'exécute rien lui-même. Claude Code, Codex, Cursor, Grok Build, OpenCode, Antigravity et d'autres le font déjà. T3 Code lance ces CLI, les enveloppe dans une vraie interface et les rend accessibles à distance. Votre abonnement reste le vôtre ; T3 est gratuit, et il n'y a rien à acheter.

## Ce que vous obtenez

- **Tous les clients** : application Electron, web (app.t3.codes), iOS et Android.
- **Pensé pour le distant** : les agents tournent sur la machine qui héberge le serveur. `t3 up` l'expose via T3 Connect, l'appairage LAN ou Tailscale. Fermez le portable, le VPS ou le fixe continue, et le téléphone n'est qu'une télécommande.
- **Modes de permission**, par fil : Supervised, Auto-accept edits, Auto, Full access. Les demandes des sous-agents arrivent dans la conversation parente.
- **Worktrees** pour isoler chaque tâche, avec un écran de nettoyage, car ils remplissent vite le disque.

## Installation

```bash
curl -fsSL https://t3.codes/install.sh | sh
t3
```

Aussi via Homebrew (cask `t3-code`), l'AUR (`t3code-bin`), winget, scoop et nixpkgs.

## À savoir avant de vous lancer

- C'est **jeune** : attendez-vous à des bugs, et les grosses contributions ne sont pas encore acceptées.
- **Pas de modèles locaux**, par choix assumé.
- Claude passe par l'Agent SDK d'Anthropic : la limite de 5 heures se vide plus vite qu'avec Claude Code directement. Les limites hebdomadaires ne bougent pas, et le bug vient d'Anthropic.
- Le code part chez votre fournisseur, pas chez T3. La télémétrie ne couvre que l'usage produit et se désactive.
- T3 Connect est gratuit pour trois machines ; au-delà, il faut un compte T3 Chat payant, sauf à auto-héberger ou passer par Tailscale.

## Verdict

T3 Code ne rend pas vos agents plus intelligents. Il les rend joignables, comparables et correctement supervisés, ce qui couvre l'essentiel du travail quotidien avec des agents. Si vous jonglez entre deux harness ou voulez prompter depuis le canapé, c'est la meilleure option gratuite que j'aie essayée. Si un seul CLI vous suffit, votre terminal fait encore très bien le travail.
