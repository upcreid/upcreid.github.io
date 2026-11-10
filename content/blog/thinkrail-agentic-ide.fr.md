+++
title = "ThinkRail : JetBrains construit un vrai IDE autour de l'agent pi"
description = "ThinkRail enveloppe l'agent de code pi dans un IDE de bureau : worktrees git isolés, graphe de specs que l'agent lit vraiment, et revue de code tour par tour. Ce qu'il fait, comment l'installer, et ce qui coince encore."
slug = "thinkrail-agentic-ide"
date = 2026-11-10T10:00:00+01:00
updated = 2026-11-10T10:00:00+01:00
draft = false
aliases = ["/fr/blog/2026/11/10/thinkrail-agentic-ide/"]

[extra]
lead = "Pas un énième panneau de chat greffé sur un éditeur : une fine couche graphique autour de pi, où chaque tâche a son worktree et chaque projet garde ses specs."
authors = ["UpCreid"]
+++

Il y a un moment, après quelques semaines de vibe coding dans un terminal, où l'on réalise qu'on ne programme plus. On regarde un transcript défiler, on remonte pour retrouver quel fichier l'agent a touché, et on tape `git diff` en panique. L'agent va bien. C'est notre façon de travailler qui ne va pas.

**ThinkRail** est la réponse de JetBrains à ce problème. C'est un *IDE agentique* : un vrai éditeur, un vrai terminal, un vrai diff, enveloppés autour de l'agent de code **pi**. Le projet vient de l'incubateur **InnovationHub** de JetBrains, pas de l'équipe IntelliJ, et il est **open source (Apache-2.0), gratuit et sans compte**. Ce dernier point compte plus qu'il n'y paraît : pas de login, pas de licence par siège, pas de vente incrémentale pilotée par la télémétrie.

## Ce qu'est réellement ThinkRail

ThinkRail n'est pas un plugin IntelliJ, et ce n'est pas non plus un fork de VS Code. C'est un hôte mince : le moteur `pi` tourne **dans le même processus** que ThinkRail et possède les parties difficiles (modèles, skills, compactage du contexte, coût en tokens, état de session). ThinkRail possède tout ce qu'il y a autour : les workspaces, l'interface, et le contrat typé entre le moteur et l'UI.

Sous le capot, l'architecture est rafraîchissante de banalité, dans le bon sens :

- un hôte HTTP + WebSocket (Bun) avec une session `pi` par chat ;
- un protocole typé et versionné entre l'hôte et l'UI ;
- un client web React, livré indépendamment ;
- deux façades pour le même moteur : une application de bureau native (empaquetée avec Electrobun) et une CLI `thinkrail` qui ouvre la même UI dans le navigateur.

Parce que c'est un *hôte*, ThinkRail ne fabrique jamais de prompts dans votre dos. Votre configuration `~/.pi` fait foi : providers, modèles, skills, extensions, historique des chats. On peut démarrer une session dans ThinkRail et la reprendre dans la CLI pi, ou l'inverse. C'est l'exact opposé du verrouillage propriétaire habituel, et c'est la décision de conception la plus importante du produit.

## Les workspaces : les agents méritent des worktrees, pas votre arbre de travail

L'idée centrale est simple : un **projet** est n'importe quel dépôt git local, et un **workspace** est un `git worktree` découpé dedans. Chaque workspace a sa branche, son répertoire de travail, ses fichiers, ses terminaux, ses diffs et ses chats.

Concrètement, on clique sur « Start building », on choisit une branche de base, on écrit une description (qui sert aussi de premier prompt), et l'agent commence à travailler dans `~/.thinkrail/worktrees/<projet>/workspace-1`. Votre checkout n'est pas touché. Si l'agent réécrit un fichier, supprime quelque chose ou lance un formateur non demandé, les dégâts restent confinés à cette branche. On fusionne ce qui plaît, on supprime le reste.

La conséquence que tout le monde sous-estime : **le parallélisme devient sûr**. Trois agents sur trois worktrees ne peuvent pas se battre pour les mêmes fichiers, puisqu'ils ne sont pas dans le même répertoire. L'un peut refactoriser un module pendant qu'un autre réécrit les specs, sans que ni l'un ni l'autre ne tombe sur un fichier à moitié écrit.

Les petits détails qui prouvent que la fonctionnalité a été utilisée : les workspaces terminés se rangent tout seuls sur une étagère **Settled** quand leur PR est fusionnée ou fermée, ou après une période d'inactivité configurable (un, trois, sept ou quatorze jours, ou jamais) ; et ils reviennent dès qu'on y retouche.

## Le développement piloté par les specs, sans la cérémonie

Le deuxième pilier, c'est le **graphe de specs**. Chaque module peut porter un fichier `SPEC.md` avec un en-tête YAML qui le relie aux autres :

```yaml
---
id: module-server
type: module-design
status: active
parent: architecture
depends-on: [goal-and-requirements]
tags: [engine, contracts]
---
```

Le champ `status` à lui seul (`draft`, `active`, `stale`, `done`, `deprecated`) vaut le détour : une spec ne peut pas pourrir en silence, puisque sa péremption est écrite noir sur blanc. À la racine du dépôt, on garde `goal-and-requirements.md` et `architecture.md` ; en dessous, un `SPEC.md` par véritable module.

Le point crucial n'est pas le format, c'est celui qui le maintient. ThinkRail embarque une extension `pi-spec-graph` qui donne à l'agent des outils `spec_*` dédiés pour chercher, naviguer et mettre à jour le graphe. Quand un changement déplace une frontière ou casse un contrat, la spec est censée être mise à jour **dans le même tour**, jamais après. L'agent lit la spec la plus proche au lieu de tout le code, ce qui garde son contexte petit et ses réponses ancrées.

C'est le Spec-Driven Development tel que JetBrains le présente : la documentation revient non pas parce qu'un manager l'a exigée, mais parce que c'est le moyen le moins cher de garder un agent sur les rails d'une session à l'autre. Les specs sont les garde-fous — toujours présents, jamais gênants quand tout se passe bien.

## La partie IDE n'est pas décorative

Un panneau de chat n'est pas un IDE. ThinkRail fournit les briques indispensables et ennuyeuses :

- des **onglets Monaco** (le moteur d'édition de VS Code), avec coloration syntaxique, Markdown rendu et bascule vers la source ;
- une **arborescence de fichiers** limitée au worktree actif, avec filtre sur les fichiers modifiés ;
- un **panneau de changements git** qui affiche le diff de la branche en direct, pendant que l'agent tape encore ;
- de **vrais PTY**, pour lancer ses tests soi-même pendant que l'agent continue ;
- un **panneau de revue** où l'on collecte des commentaires ligne à ligne et où on les renvoie à l'agent en un seul message.

Le flux de revue est la fonctionnalité dont je ne pensais pas avoir besoin. Quand un tour modifie des fichiers, il se termine par un reçu du type `3 files changed · +27 −4` et un bouton **Review turn**. Ces chiffres ne viennent pas des déclarations de l'agent : l'hôte prend un instantané du worktree au début et à la fin du run, donc un formateur ou un `sed` lancé dans le shell compte aussi. On lit ensuite tout d'un seul défilement, avec `Keep`, `Revert` et `Ask agent about this hunk` sur chaque hunk, et `J` pour passer au fichier non relu suivant. `Keep` est indexé sur le contenu du hunk, donc il survit aux décalages de lignes.

Ce seul changement de conception — *relire le tour, pas le journal de chat* — est ce qui transforme un agent en collègue plutôt qu'en jouet.

## Chat, modèles et petits détails qui comptent

Le chat est conçu pour le vrai travail, pas pour la démo :

- plusieurs sessions simultanées par workspace, **chacune avec son modèle et son effort de raisonnement** ;
- on peut **infléchir un tour en cours** ou mettre une suite en file d'attente au lieu d'attendre la fin ;
- comptabilité des tokens en direct : entrée, sortie, lectures et écritures de cache, coût, et remplissage de la fenêtre de contexte ;
- un **plan** partagé entre vous et l'agent, avec une page complète montrant, pour chaque étape terminée, son résumé et sa vérification ;
- les ressources d'arrière-plan (commandes, sous-agents, serveurs MCP) dans un seul popup ;
- **`⌘K` / `Ctrl+K` / double appui sur Shift** ouvre une boîte unique qui trouve les chats *et les messages qu'ils contiennent*, les workspaces, les projets, les fichiers, les specs et les plans, lance les commandes de l'application et — quand elle est vide — liste tous les chats qui vous attendent, tous projets confondus. Ce dernier tour de passe-passe règle le vrai goulot d'étranglement des agents parallèles : remarquer lequel est bloqué sur une question.
- des outils interactifs : l'agent peut vous poser des questions à choix multiples dans le chat au lieu de deviner, dessiner des diagrammes Mermaid, et afficher des maquettes avant/après commentables comme un diff.

Côté modèles, ThinkRail n'a **aucun compte à lui**. On se connecte avec JetBrains AI ou on branche n'importe quel provider via l'authentification de pi. On peut aussi viser une passerelle d'entreprise ou un serveur local — Ollama, LM Studio, vLLM, llama.cpp, LiteLLM, sglang — via Settings → Providers → Add server : coller une adresse, cliquer sur *Find models*, sauvegarder. Le tout atterrit dans le `models.json` de pi, donc la CLI pi profite de la même configuration, et la clé API ne transite jamais par le navigateur.

Les extensions suivent la même philosophie. On peut installer n'importe quel paquet pi par nom npm, URL git ou dossier local, voir ce qu'il apporte avant de l'activer, et basculer individuellement les paquets, extensions, skills ou fonctions internes de pi. Les extensions embarquées incluent `pi-web-access`, `pi-visualize`, `pi-spec-graph`, `pi-thinkrail-workflow` et `pi-todos`. Les skills sont découverts dans `~/.pi`, `~/.claude`, `~/.codex`, `~/.copilot` et `~/.gemini`, plus leurs équivalents locaux au projet — une installation Claude Code existante n'est donc pas perdue.

MCP est pris en charge sans les pièges habituels : les serveurs viennent de votre `mcp.json` ou des réglages, les secrets doivent être des références `${VAR}` ou `!command` (coller un identifiant dans une URL est refusé), les serveurs fournis par un dépôt restent éteints tant que vous n'avez pas approuvé précisément ce qu'ils vont exécuter, et tout appel susceptible de modifier des données demande d'abord : `Deny`, `Allow once`, `Allow in this chat`, `Always allow`.

## Installation et première tâche

Récupérez la version bureau sur [thinkrail.ai](https://thinkrail.ai/) (macOS Apple Silicon ou Intel, Windows x64, Linux x64/ARM64), ou passez par la CLI :

```bash
# macOS, Linux, WSL (et Windows sous Git Bash)
curl -fsSL https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.ps1 | iex

thinkrail ~/code/mon-depot
```

Sous Linux, la version bureau est la plus capricieuse : il faut glibc 2.38+ et GTK 3 / WebKitGTK 4.1 / Ayatana AppIndicator 3 / librsvg 2, ce qui signifie en pratique Ubuntu 24.04 ou plus récent :

```bash
sudo apt install libgtk-3-0 libwebkit2gtk-4.1-0 \
  libayatana-appindicator3-1 librsvg2-2
```

Ensuite, une première session raisonnable ressemble à ceci :

1. Ouvrez un dépôt. Si vous n'en avez pas sous la main, *Start a new project* crée un dépôt git vide.
2. Allez dans Settings, connectez un provider (JetBrains AI ou votre propre clé), puis choisissez un modèle par défaut.
3. Créez un workspace depuis `main` et décrivez la tâche en une phrase — cette description est le premier prompt.
4. Laissez l'agent travailler. Regardez le diff arriver dans le panneau Changes ; ouvrez un terminal si vous voulez lancer les tests vous-même.
5. Appuyez sur **Review turn**, lisez l'ensemble du changement, gardez ou annulez des hunks, et renvoyez des commentaires si quelque chose cloche.
6. Publiez la branche et ouvrez une pull request depuis la barre supérieure. ThinkRail affiche les checks CI et la décision de revue, et permet de marquer prête, fusionner ou supprimer la branche distante.
7. Fusionnez ou fermez la PR : le workspace se range tout seul.

Pour le travail piloté par les specs, ajoutez une cinquième étape : demandez à l'agent d'écrire ou de mettre à jour le `SPEC.md` du module touché, et vérifiez le graphe dans le panneau Specs. Après quelques tâches, les specs deviennent ce que l'on lit avant d'ouvrir le code.

## Ce qu'il fait bien

**L'isolation est réelle.** Les worktrees ne sont pas un gadget : c'est le seul mécanisme que je connaisse qui rende des agents parallèles réellement sûrs sur un dépôt partagé, sans copier tout le dépôt ni inventer un format de workspace propriétaire.

**L'agent garde la mémoire de l'intention.** Specs, skills et plan partagé font qu'une nouvelle session ne repart pas de zéro. Le graphe garde le contexte petit, et les outils `spec_*` rendent l'agent responsable de sa propre documentation.

**Rien n'est verrouillé.** Apache-2.0, pas de compte, vos providers, votre `~/.pi`, votre `models.json`, votre git. On peut quitter ThinkRail en gardant sa configuration, ou lancer la CLI dans un navigateur via SSH sur une machine distante.

**L'interface est honnête sur l'agent.** Diffs pris par instantané, revue hunk par hunk, coût en tokens dans l'en-tête, ressources et sous-agents visibles : on sait toujours ce qui s'est passé, combien ça a coûté, et ce qui tourne encore.

**C'est gratuit.** L'application ne coûte rien ; vous payez votre fournisseur de modèles, point.

## Là où ça coince encore

**C'est un produit 0.x.** Version 0.3.1 au moment d'écrire ces lignes (novembre 2026). Attendez-vous à des aspérités, à des canaux nightly, et à des fonctionnalités qui bougent d'une release à l'autre. Les notes de version listent elles-mêmes les limites — par exemple, keep/revert ne fonctionne que sur le diff de branche, pas sur la vue d'un seul tour, et les très gros diffs s'ouvrent repliés.

**C'est pi, et seulement pi.** ThinkRail est un hôte pour un moteur. Si votre flux de travail est bâti autour de Claude Code, Cursor ou Codex, ce n'est pas un remplacement direct — des forks communautaires explorent la piste, mais le produit officiel assume pi. Le pari : un harnais minimal et extensible plus une bonne interface bat un monolithe.

**L'empaquetage Linux est le point faible.** Ubuntu 24.04+ en pratique, builds non signés, CLI macOS signée mais non notariée. La CLI Windows et les binaires de bureau sont signés, les DMG macOS sont signés et notariés. Sous Linux, prévoyez de vérifier les sommes de contrôle vous-même.

**Il téléphone à la maison par défaut.** Les lancements, créations de chat, envois de messages et connexions de providers sont collectés sous un identifiant d'installation aléatoire ; les rapports d'erreur sont toujours envoyés, avec le type d'erreur et l'endroit dans le code de ThinkRail, jamais les prompts ni les chemins de fichiers. On peut désactiver le partage supplémentaire avec `thinkrail --no-analytics` ou `THINKRAIL_NO_ANALYTICS=1`. C'est modéré pour de la télémétrie, mais c'est actif par défaut : décidez consciemment.

**Le développement piloté par les specs est une discipline, pas un interrupteur.** Si vous et l'agent ne maintenez pas les `SPEC.md`, le graphe devient de l'archéologie. L'outillage aide ; il ne remplace pas l'habitude.

**Il faut quand même relire.** Tout l'intérêt est de rendre la revue bon marché, pas facultative. Un agent avec un shell, un worktree et le droit de fusionner finira par produire quelque chose de plausible et de faux ; le reçu et la revue hunk par hunk existent précisément parce que la confiance se vérifie.

## Verdict

ThinkRail est la réponse la plus cohérente que j'aie vue à une question que l'industrie cherche encore : *à quoi ressemble un IDE quand le code est écrit par un agent ?* Pas une barre latérale de chat collée sur l'éditeur d'hier, pas un bac à sable navigateur qui cache le système de fichiers, mais un gestionnaire de workspaces où l'unité de travail est une branche isolée, l'unité de revue un tour, et l'unité de mémoire un graphe de specs.

C'est jeune, c'est pi-only, et son empaquetage Linux agacera certains. Mais les idées sont justes, l'implémentation est rafraîchissante de simplicité, et le prix — gratuit, open source, sans compte, avec votre propre modèle — en fait une expérimentation très peu coûteuse. Si vous vivez déjà dans pi, installez-le aujourd'hui. Sinon, c'est la meilleure excuse que je connaisse pour essayer pi.
