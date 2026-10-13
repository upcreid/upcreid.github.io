# upcreid — documentation personnelle (Zola)

Site statique personnel : aide-mémoire techniques, guides de jeux et blog, en français et en anglais.

Migré depuis [upcreid.github.io](https://github.com/upcreid/upcreid.github.io) (MkDocs Material) vers
[Zola](https://www.getzola.org/), pour avoir un moteur unique, binaire, avec un support multilingue
natif et sans plugins à faire cohabiter.

## Commandes

```bash
zola serve          # serveur local avec rechargement sur http://127.0.0.1:1111
zola build          # génère le site dans public/
zola check          # vérifie les liens internes et les liens externes
```

Zola 0.23.6 est requis. `zola.toml` référence les thèmes de coloration `github-light` / `github-dark`.

## Structure

```
zola.toml            configuration du site, des langues et de la navigation
content/             contenu Markdown, front matter TOML entre +++
templates/           templates Tera (base, index, section, blog, page, 404, partials)
static/              CSS, JS, images
public/              sortie générée (ignorée par git)
```

## Multilingue

Le français est la langue par défaut, l'anglais est construit sous `/en/`.

- `page.md` = français, `page.en.md` = anglais, dans le même dossier.
- Chaque section doit avoir son `_index.md` **et** son `_index.en.md` : Zola ne fait aucun repli
  automatique. Un contenu sans traduction n'existe que dans sa langue.
- Le sélecteur de langue utilise `page.translations`, donc il pointe vers la traduction quand elle
  existe et vers la racine `/en/` sinon.
- Les libellés d'interface sont dans `[translations]` (français) et `[languages.en.translations]`
  (anglais) dans `zola.toml`.
- Les flux RSS et l'index de recherche sont générés par langue (`/atom.xml`, `/en/atom.xml`,
  `search_index.fr.json`, `search_index.en.json`).

### Ajouter un article

Article français avec sa traduction anglaise :

```
content/blog/mon-article.md       # front matter : title, description, date, [extra] authors
content/blog/mon-article.en.md
```

Article dans une seule langue : ne créer qu'un seul fichier (`mon-article.md` pour le français,
`mon-article.en.md` pour l'anglais).

Le `slug` du front matter est **obligatoire** quand le titre français et le titre anglais diffèrent :
sans lui, Zola dérive l'URL du nom de fichier, et le sélecteur de langue ne retrouve plus la
traduction.

## État du contenu

Le fond technique (aide-mémoire, guides de jeux) est en anglais et vit dans la locale française :
il est donc accessible à une seule URL, sans duplication. Les sections anglaises
(`content/cheat-sheet/_index.en.md`, `content/games/_index.en.md`) listent ce contenu via l'option
`extra.docs_section`.

Comme ces pages sont en anglais dans une locale française, leurs sections portent
`extra.pages_language = "en"` : le contenu est alors rendu dans un bloc `lang="en"`, ce qui évite
qu'un lecteur d'écran ou un moteur de recherche le traite comme du français. Retirer cette option
ferait retomber ces pages sur la langue de la locale.

Les articles de blog sont dans leur langue : les quatre articles récents existent en français et en
anglais, les quatre plus anciens (rédigés en anglais) n'existent qu'en anglais.

## URLs

Les anciennes URLs de MkDocs sont conservées via `aliases` dans le front matter (pages de
redirection générées par Zola) :

- les articles de blog gardent leur URL datée : `/blog/2026/10/13/deepseek-flash-4-1/` ;
- les aide-mémoire passent de `/cheat-sheet/docker/docker/` à `/cheat-sheet/docker/`, l'ancienne URL
  redirige.

Les pages d'archive `/blog/archive/AAAA/` de MkDocs n'ont pas d'équivalent et ne sont pas
redirigées.

## Déploiement

La CI (`.github/workflows/ci.yml`) installe Zola, lance `zola check`, construit le site et pousse
`public/` sur la branche `gh-pages`.

`base_url` dans `zola.toml` vaut `https://upcreid.github.io` : à adapter si le site est publié sous
un sous-chemin (par exemple `https://upcreid.github.io/upcreid-zola/`).

## Détails d'implémentation

- `skip_content_templating = ["**"]` : le contenu Markdown n'est pas interprété par Tera, sinon les
  exemples de code contenant `{{ }}` (Ansible, GitHub Actions) cassent le build.
- La recherche est un filtre client léger (`static/js/search.js`) qui charge les deux index JSON :
  chercher depuis `/en/` trouve donc aussi le fond technique, qui vit dans la locale française.
- Les onglets de contenu de MkDocs ont été convertis en sous-titres (`#### titre`) et les
  admonitions en alertes GitHub (`> [!NOTE]`).
- `edit_base` dans `[extra]` active le lien « Modifier cette page » ; le laisser vide le désactive.
