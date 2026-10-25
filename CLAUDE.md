# Carnet du Chiot

App web d'éducation pour **Buck**, chiot golden retriever de Thomas (arrivé mi-octobre 2026, environ 10 semaines à l'arrivée). Famille avec deux enfants, près de Carpentras (Vaucluse). Interface et contenus en **français**, tutoiement.

Quatre onglets (barre en bas) : **Aujourd'hui** (étape en cours, exercices à cocher, renforts, alerte locale), **Journée** (planning heure par heure), **Soucis** (aide immédiate « Là, tout de suite » + protocoles), **Guide** (programme, fiches, jeux, dangers locaux, numéros utiles, méthode, sources). Les détails s'ouvrent dans un panneau qui monte du bas. Accueil en 5 étapes au premier lancement.

Contenus :
- **Programme de 12 semaines** calé sur la date d'arrivée. Chaque jour : 6 exercices, une découverte de socialisation, un jeu et un conseil, avec des cases à cocher. Chaque exercice et chaque jeu a une petite animation SVG.
- **Planning de la journée** recalculé chaque jour selon l'âge, l'heure du lever et l'heure du coucher : repas, pipis, séances d'éducation et jeux, siestes, sorties de nuit.
- **Soucis à travailler** (jusqu'à 3) : pourquoi il le fait, à vérifier d'abord, plan, à éviter, quand appeler un pro, exercices de renfort (un par jour, ajouté à la journée), suivi chiffré sur 14 jours.
- **Dangers locaux** selon le code postal (département) et le mois.
- **Rappels** (notifications push) à chaque étape du planning, sur chaque téléphone de la famille qui les active.

Hébergé sur Vercel, déployé à chaque push sur `main`.

## Fichiers

```
├── index.html            # l'interface : HTML + CSS + JS (animations, rendu, réglages, activation des rappels)
├── shared.js             # données (exercices, programme, fiches, sources…) + calcul du planning ; chargé par l'app ET par l'API
├── sw.js                 # service worker : réception des push, clic sur une notification, cache hors ligne
├── manifest.webmanifest  # PWA (installation sur l'écran d'accueil, obligatoire pour les push sur iPhone)
├── icon-*.png, apple-touch-icon.png, badge-96.png
├── api/
│   ├── subscribe.js      # POST : enregistre/met à jour un téléphone ; DELETE : le retire
│   ├── tick.js           # envoie les rappels dus ; appelé toutes les 5 min
│   ├── _store.js         # état dans Vercel Blob (un seul fichier JSON)
│   ├── _push.js          # envoi Web Push (VAPID)
│   └── _util.js          # fuseaux horaires, lecture du corps de requête
├── .github/workflows/
│   ├── rappels.yml       # cron GitHub toutes les 5 min → GET /api/tick
│   └── keepalive.yml     # commit vide mensuel (GitHub coupe les crons après 60 jours sans activité)
├── vercel.json           # en-têtes de cache
└── package.json          # dépendances de l'API : web-push, @vercel/blob
```

Pas de build. Les fichiers commençant par `_` dans `api/` ne sont pas exposés comme routes.

## Lancer en local

```bash
python3 -m http.server 8000   # puis http://localhost:8000 (tout sauf les rappels)
npx vercel dev                # avec l'API (nécessite les variables d'environnement)
```

## `shared.js`

Module UMD : `window.CHIOT` dans le navigateur, `require("../shared.js")` dans l'API. **Tout ce qui sert au calcul du planning doit y rester**, sinon les notifications divergent de ce que l'app affiche.

| Élément | Contenu |
|---|---|
| `THEMES` | Libellé + couleur de chaque thème |
| `EX` | **Les exercices**, indexés par id (format ci-dessous) |
| `PLAN` | Pour chaque thème, un tableau de 12 ids (un par semaine) |
| `SLOTS` | Ordre des thèmes dans la journée : `nom, mors, laisse, prop, maison, bonus` |
| `WEEKS` | 12 × `[titre, description]` (la description cite les nouveautés de la semaine : à tenir à jour avec `PLAN`) |
| `SOC` | 20 découvertes de socialisation (rotation par jour) |
| `GAMES` | 10 jeux `{a: clé d'animation, ti, m: méta, p: texte}` (rotation par jour) |
| `TIPS` | Conseils du jour (rotation par jour) |
| `SHEETS` | Fiches thématiques `{k, ti, lead, yes[], no[], signs?, debate?, src}` |
| `SOURCES` | Groupes `[titre, [[libellé, url], …]]` |
| `ISSUES`, `MAX_ISSUES` | Les soucis `{id, t, ti, log:{q,k:"down"\|"up"}, why, first[], plan[], avoid[], pro, ex[], src}` ; exercices de renfort `r1`…`r13` ajoutés à `EX` |
| `issueEx(id,dIdx,exclude)` | Renfort du jour d'un souci (rotation, en évitant les exercices déjà au programme) |
| `RISKS`, `ZONES`, `depOf`, `risksFor(cp,mois)` | Dangers : mois concernés, zones (listes de départements), niveau |
| `CATS` | Catégories de rappels : `repas`, `pipi`, `educ`, `sieste`, `nuit` (libellé + emoji) |
| Dates | `parse`, `iso`, `midnight`, `addDays`, `daysBetween`, `dayInfo(date,pup)`, `itemsFor(date,pup)` |
| Planning | `rhythm(ageSemaines)`, `dayPlan(date,pup)` |

### Format d'un exercice

```js
b8:{t:"bonus",                 // thème (clé de THEMES)
    ti:"Reste",                // titre
    d:"3 min · 2×/jour",       // durée / fréquence
    s:["étape 1","étape 2"],   // étapes (3 à 4)
    h:"astuce",                // phrase en italique sous les étapes
    src:"RSPCA, Battersea"}    // source affichée
```

`{N}` dans un texte est remplacé par le prénom du chiot (fonction `nm()` de l'app). Toujours passer le texte par `esc()` ou `nm()` avant de l'injecter en HTML.

Ids actuels :
- **nom :** n1 à n6
- **mors :** m1 à m7
- **laisse :** l1 à l6
- **prop :** p1, p2, p3, p5, p6 (pas de p4)
- **maison :** c1, s1, s2, j1, e1
- **bonus :** b1 à b10 (b5 = Touche, b10 = Gamelle zen)

### Ajouter un exercice

1. Ajouter l'entrée dans `EX`.
2. La placer dans `PLAN[thème]` à la ou aux semaines voulues. Le tableau doit garder 12 cases. Mettre à jour le texte de la semaine dans `WEEKS`.
3. Lui associer une scène dans `EX_ANIM` (dans `index.html`, scène existante ou nouvelle).
4. Si la source est nouvelle, l'ajouter dans `SOURCES`.

### Le planning (`dayPlan`)

Rythmes selon l'âge (`rhythm`) :

| Âge | Éveil | Sieste | Repas | Sorties de nuit | Séance |
|---|---|---|---|---|---|
| < 10 sem. | 1 h | 1 h 30 | 4 | 2 | 3 min |
| 10-11 sem. | 1 h | 1 h 30 | 4 | 1 | 3 min |
| 12-13 sem. | 1 h 15 | 1 h 30 | 3 | 1 | 3 min |
| 14-15 sem. | 1 h 15 | 1 h 30 | 3 | 0 | 3 min |
| 16-25 sem. | 1 h 45 | 1 h 30 | 3 | 0 | 5 min |
| ≥ 26 sem. | 2 h 30 | 1 h 15 | 2 | 0 | 5 min |

La journée est une suite de cycles du lever au coucher : réveil → pipi → (repas → pipi/caca 15 min après) → séance d'éducation + activité (découverte, jeu du jour, sortie renifle, manipulation, jeu libre) → pipi → sieste. Les repas sont répartis régulièrement sur les cycles qui commencent avant 18 h 30 (et 3 h 30 avant le coucher). Les 6 exercices du jour sont distribués à tour de rôle sur les cycles. Le soir : gamelle d'eau levée 1 h 30 avant le coucher (`quiet`, pas de notification), dernier pipi 10 min avant. Les sorties de nuit sont réparties entre le coucher et le lever (minutes > 1440).

**Heures de repas choisies** (`pup.meals`, liste de "HH:MM", par défaut 10h30 et 15h30 pour Buck, comme le fait la famille) : elles remplacent le rythme conseillé. Les siestes sont recalées pour qu'un repas tombe toujours pendant un éveil (`customMeals`). Si la famille donne moins de repas que conseillé pour l'âge, l'onglet Journée affiche un avis calme, sans bloquer. Liste vide = rythme conseillé.

Les soucis modifient la journée : leurs exercices de renfort entrent dans la rotation des séances ; « propreté » ajoute un pipi de sécurité au milieu des éveils ; « nuit » ajoute la routine du coucher ; « mord » / « mâche » changent le texte des siestes. `pup.issues` est donc envoyé au serveur avec l'abonnement.

Chaque événement : `{m: minutes depuis minuit, cat, ti, tx, id, quiet?, ex?}`.

Sources des règles : AKC (18-20 h de sommeil), Zoopsy (3-4 repas à heures fixes), CNIB et Guide Dogs Ireland (pipi au réveil, après repas, jeu, sieste), Dogs for Good (sorties de nuit qu'on espace), PDSA (le « 5 min par mois d'âge » n'a pas de base scientifique).

### Animations (dans `index.html`)

Les scènes sont dans un SVG `viewBox="0 0 240 110"` (sol à y=95), avec une boucle de `D=5` secondes. Une animation se met en pause au toucher, et reste figée si `prefers-reduced-motion` est activé.

Briques disponibles :
- **Personnages :** `dog(pose,{trot,wag,toy,ball,harness,sleep})`, avec les poses `stand`, `sit`, `lie`, `sniff` ; `person(x,mainX,mainY,{crouch,armX,armY,keys})`.
- **Éléments de décor :** `bubble(x,y,texte,début,fin)` et `treat(valeurs,keyTimes,début,fin)`.
- **Mouvement et visibilité :** `TR` (translation), `FLIP` (retournement), `AV` (attribut), `VIS` et `HIDE` (apparition et disparition sur une plage de 0 à 1 de la boucle), `FADE`, `at(x,y,contenu,flip)`, `mover(...)`.

Pièges :
- Un tableau `keyTimes` doit avoir autant de valeurs que `values`, être croissant, commencer à 0 et finir à 1. Sinon l'animation est ignorée sans erreur.
- `hide` est un alias de `come` avec une porte.

### Dates (attention)

Toujours utiliser `addDays(d,n)` (via `new Date(y,m,d+n)`). Ne jamais faire `getTime()+n*86400000` : le changement d'heure décale d'un jour. Côté serveur (fuseau UTC sur Vercel), les heures locales sont converties avec `localToUtc` (`api/_util.js`) dans le fuseau envoyé par le téléphone (par défaut `Europe/Paris`).

## Stockage

**Navigateur** (`localStorage`, chaque accès dans un `try/catch`) :
- `pup` → `{name,birth,arrival,wake,bed,meals,cp,city,vet,issues,example}` (fusionné avec `DEFAULT` = Buck)
- `checks` → `{ "AAAA-MM-JJ": {idExercice:true, "ev:<id étape>":true, "rf:<id souci>":true} }`
- `log` → `{ "AAAA-MM-JJ": {idSouci: nombre} }` (suivi des soucis)
- `onboarded` → accueil déjà vu
- `notifPrefs` → `{repas,pipi,educ,sieste,nuit}` (booléens)
- `pushSync` → signature du dernier envoi à `/api/subscribe` (évite de renvoyer à chaque ouverture)

Pas de synchronisation des cases cochées entre téléphones.

**Serveur** (Vercel Blob, fichier `state/<STATE_KEY>.json`, public mais à chemin secret) :
```js
{ subs: { <sha256(endpoint) 24 car.>: { sub, pup, prefs, tz, sentUntil, updated } } }
```
Quota Hobby : 10 000 lectures (« simple operations ») et 2 000 écritures (« advanced operations ») par mois. `tick` lit 1 fois par appel (~8 600/mois à 5 min) et n'écrit que s'il a envoyé quelque chose. **Ne pas passer le cron à 1 minute avec ce stockage** : le quota serait dépassé et Blob bloqué 30 jours.

## Rappels : fonctionnement

1. L'app (onglet Planning) demande la permission, abonne le téléphone (`pushManager.subscribe` avec la clé publique VAPID inscrite dans `index.html`) et envoie l'abonnement + les réglages du chiot + les catégories choisies à `/api/subscribe`. Une notification de test confirme.
2. Toutes les 5 min, GitHub Actions appelle `/api/tick`. Pour chaque téléphone, `tick` recalcule `dayPlan` (veille et jour même), envoie les événements dont l'heure est passée depuis `sentUntil` (30 min de retard maximum, au-delà on saute), puis avance `sentUntil`. Les abonnements expirés (404/410) sont supprimés.
3. Le service worker affiche la notification ; un clic ouvre `/#planning`.

Sur iPhone, les push ne marchent que si l'app est **ajoutée à l'écran d'accueil** (Safari → Partager → Sur l'écran d'accueil) et ouverte depuis l'icône (iOS 16.4+).

Variables d'environnement Vercel : `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (facultative), `STATE_KEY` (chemin secret du fichier d'état), `BLOB_READ_WRITE_TOKEN` (ajoutée en reliant le store Blob au projet). Si on change la paire VAPID, mettre à jour `VAPID_PUBLIC` dans `index.html` : tous les téléphones devront réactiver les rappels.

## Design

Direction « Clinique chaleureuse » (choisie parmi 5 démos : https://claude.ai/artifact/BHvYR74funjTSZMV6x7JWn) : police du système, fond gris doux, cartes blanches, une seule couleur d'accent (`--accent`, doré), icônes au trait en `<symbol>` SVG, pas d'emoji dans l'interface. Toutes les couleurs sont des variables (`:root` clair, sombre via `prefers-color-scheme` et `[data-theme]`). Espaces insécables du français ajoutés par `fr()` (appelée par `esc()`). Les animations ne s'affichent que dans le panneau d'un exercice.

API externes côté navigateur (sans clé) : `geo.api.gouv.fr` (ville d'un code postal), `api-adresse.data.gouv.fr` puis `data.geopf.fr` (code postal depuis la position GPS).

## Contenu : règles à respecter

- **Uniquement des méthodes douces par la récompense,** sans punition physique ni cris.
- **Pas de « dominance ».**
- **Sources pros uniquement :**
  - Vétérinaires et comportementalistes : AVSAB, AVMA, Zoopsy (Dr Jasmine Chevallier), Dr Kersti Seksel, Dr Ian Dunbar, CNITV.
  - Associations : Dogs Trust, Blue Cross, Battersea, PDSA, RSPCA, ASPCA, Oregon Humane Society.
  - Écoles de chiens guides : CNIB, Guide Dogs Ireland, Dogs for Good, Chiens Guides d'Aveugles de Paris.
  - Clubs : Kennel Club, AKC.
  - Collectivités (dangers locaux) : canton de Genève, Ville de Lyon.
  - Étude : Krontveit 2012, sur les escaliers et la dysplasie.
  - Pas de sites de marques (croquettes, assurances).
- **Ton :** phrases courtes et concrètes, pas de style « trop IA ».
- **Désaccord entre pros sur le « aïe » quand il mord :** l'AKC et Dunbar sont pour, les associations britanniques contre. L'exercice m2 suit la position britannique (mains immobiles, puis pause), et la fiche Mordillements explique le débat.
- **Repères chiffrés utilisés :**
  - âge en mois + 1 = heures maximum sans sortie pipi (AKC) ;
  - « 5 min de balade par mois d'âge, 2×/jour » : cité comme repère, mais le PDSA rappelle qu'il n'a pas de base scientifique ;
  - fenêtre de socialisation jusqu'à 16 semaines ;
  - pas d'escaliers répétés avant 3 mois ;
  - un chiot dort 18 à 20 h par jour.

## Idées de suite (non faites)

- Bouton « il vient de se réveiller » qui décale le reste de la journée (et les rappels).
- Carnet de santé : vaccins, vermifuges, antiparasitaires, poids, avec rappels.
- Mode de voix / gros boutons pour la nuit.
- Synchronisation des cases cochées et des réglages entre les téléphones de la famille (un « code famille » dans le Blob).
- Fiche « jours de pluie » : sorties pipi express, jeux de flair à l'intérieur.
- Horaires différents le week-end.
- Rappels à la minute près : un service de cron externe (cron-job.org) qui appelle `/api/tick` chaque minute, mais il faut alors un stockage sans quota de lectures (Upstash Redis via le Marketplace Vercel).

## Vérifier après une modification

```bash
# syntaxe
python3 -c "import re;s=open('index.html').read();open('/tmp/t.js','w').write(re.findall(r'<script>(.*?)</script>',s,re.S)[-1])" && node --check /tmp/t.js && node --check shared.js && for f in api/*.js; do node --check $f; done
# planning d'un jour donné
node -e 'const C=require("./shared.js");const p=C.dayPlan(C.parse("2026-10-24"),{name:"Buck",birth:"2026-08-06",arrival:"2026-10-15",wake:"07:00",bed:"22:30"});p.events.forEach(e=>console.log(C.fmtMin(e.m),e.cat,e.ti))'
```

Ouvrir ensuite la page sur mobile (largeur environ 400 px), en clair et en sombre. Passer par l'onglet Programme et ouvrir les semaines 1 à 12 : chaque semaine doit afficher 8 cartes avec leurs animations. Vérifier l'onglet Planning sur plusieurs âges (changer la date de naissance dans Mon chiot).
