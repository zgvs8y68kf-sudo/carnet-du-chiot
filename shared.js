/* Carnet du Chiot : données et calcul du planning, partagés entre l'app (window.CHIOT) et les fonctions Vercel (require). */
(function(root){
"use strict";

const THEMES={nom:{l:"Son prénom",c:"var(--c-nom)"},mors:{l:"Mordillements",c:"var(--c-mors)"},laisse:{l:"Laisse",c:"var(--c-laisse)"},prop:{l:"Propreté",c:"var(--c-prop)"},bonus:{l:"Bases & calme",c:"var(--c-bonus)"},soc:{l:"Socialisation",c:"var(--c-soc)"},maison:{l:"Vie à la maison",c:"var(--c-maison)"}};

const EX={
n1:{t:"nom",ti:"Le jeu du prénom",d:"2 min · 3×/jour",s:["Pièce calme, 10 petites friandises (prises dans sa ration).","Dis « {N} » une seule fois, voix joyeuse.","Dès qu'il tourne la tête vers toi : « Oui ! » et friandise.","Recommence 10 fois, puis arrête avant qu'il se lasse."],h:"Son prénom doit toujours annoncer quelque chose de bien. Jamais pour gronder.",src:"Dogs Trust, Toronto Humane Society"},
n2:{t:"nom",ti:"Ping-pong du prénom",d:"3 min · 2×/jour",s:["Une friandise dans chaque main.","Lance la première à 1 m. Pendant qu'il la mange, dis « {N} ».","Quand il revient vers toi, donne la seconde tout près de tes pieds.","Lance de l'autre côté et recommence (8 à 10 fois)."],h:"Il apprend que son nom veut dire « reviens vers moi ».",src:"SF SPCA"},
n3:{t:"nom",ti:"Prénom avec distraction",d:"3 min · 2×/jour",s:["Pose un jouet calme par terre, à 2 m.","Attends qu'il le renifle, puis dis « {N} » une fois.","Il te regarde : « Oui ! » + friandise de grande valeur (poulet, fromage).","S'il ne réagit pas, rapproche-toi ou baisse la distraction."],h:"Si tu dois répéter son nom, c'est trop difficile. On recule d'une marche.",src:"Toronto Humane Society"},
n4:{t:"nom",ti:"Le cercle des rappels",d:"5 min · 1×/jour",s:["2 à 4 personnes assises en cercle, chacune avec des friandises.","Chacun son tour appelle « {N}, viens ! » une seule fois.","Celui qui appelle fête son arrivée : friandise + caresse.","Agrandis le cercle au fil des jours."],h:"Idéal avec les enfants : ça leur donne un rôle positif.",src:"Toronto Humane Society, Blue Cross"},
n5:{t:"nom",ti:"Cache-cache dans la maison",d:"5 min · 1×/jour",s:["Pendant qu'il est occupé, cache-toi derrière une porte.","Appelle « {N} ! » une seule fois.","Quand il te trouve, grosse fête et friandise.","Cachettes de plus en plus difficiles."],h:"Le rappel devient un jeu, pas une obligation.",src:"Dogs Trust (rappel)"},
n6:{t:"nom",ti:"Rappel en longe",d:"5 min · pendant la balade",s:["Longe de 5 à 10 m sur le harnais, endroit calme.","Laisse-le explorer, puis « {N}, viens ! » une seule fois.","Recule en l'encourageant ; récompense au contact, prends doucement le harnais.","Relâche-le aussitôt : venir ne signifie pas la fin de la balade."],h:"Ne l'appelle jamais pour finir un moment agréable : va plutôt le chercher.",src:"Toronto Humane Society, Dogs Trust"},

m1:{t:"mors",ti:"Toujours un jouet entre vous",d:"Toute la journée",s:["Garde plusieurs jouets souples dans la maison, et change-les tous les 2-3 jours.","Pour jouer, c'est toujours le jouet, jamais les mains ou les pieds.","Fais glisser le jouet au sol dans tous les sens, laisse-le gagner et l'emporter.","Range pour un temps les chaussons moelleux, ceintures de peignoir et vêtements qui flottent."],h:"Pas de jeux de bagarre avec les mains, même pour rire, et ne filme pas les morsures « mignonnes ».",src:"Dogs Trust, Blue Cross, Kennel Club"},
m2:{t:"mors",ti:"Mains immobiles et pause",d:"À chaque séance de jeu",s:["Les dents touchent ta peau : tu t'immobilises. Ne retire pas la main d'un coup (ça relance le jeu).","Tu caches le jouet, tu croises les bras et tu détournes la tête. Assis par terre ? Lève-toi.","Il continue : sors quelques secondes derrière une barrière ou une porte.","Il est calme : tu reviens et tu relances le jeu avec le jouet, ou tu sèmes quelques friandises."],h:"Les associations britanniques déconseillent de crier « aïe » : chez beaucoup de chiots, ça excite encore plus.",src:"Dogs Trust, Battersea, Kennel Club, Blue Cross"},
m3:{t:"mors",ti:"L'échange",d:"3 min · 2×/jour",s:["Il tient un jouet : présente une friandise devant sa truffe.","Il lâche : « Donne » + friandise, puis rends-lui le jouet.","Répète 5 fois. Il apprend que lâcher rapporte.","Plus tard, échange aussi les objets interdits (chaussette) sans courir après lui."],h:"Courir après un golden qui a volé un objet, c'est lui offrir le meilleur jeu du monde.",src:"Battersea (« drop it »), AKC"},
m4:{t:"mors",ti:"Tir à la corde avec règles",d:"5 min · 1×/jour",s:["Prends un gros jouet souple et long : tes mains restent loin de ses dents.","Dis « Donne », immobilise la corde contre toi. Il lâche : friandise et reprise.","Les dents touchent ta main : pause immédiate.","Finis sur un « assis » récompensé."],h:"Bien encadré, ce jeu canalise l'énergie sans encourager à mordre.",src:"Blue Cross, Kennel Club"},
m5:{t:"mors",ti:"Accueil avec un jouet en gueule",d:"À chaque retour",s:["Garde une peluche près de la porte d'entrée.","En rentrant, tends-la-lui avant qu'il saute ou mordille.","Félicite-le calmement quand il la porte.","Demande aux invités de faire pareil."],h:"Le golden est un rapporteur : il se calme plus vite quand il a quelque chose à porter.",src:"Battersea (apprendre une alternative), AKC Golden"},
m6:{t:"mors",ti:"Sieste au calme",d:"Plusieurs fois par jour",s:["Note quand il mord le plus : jeu, fatigue, faim, fin de journée.","Un chiot dort 18 à 20 h par jour : après environ 1 h d'éveil (à 2-3 mois), pipi puis sieste dans son parc avec un objet à mâcher. L'onglet Planning le calcule pour toi.","Ce n'est pas une punition : c'est une pause.","Plusieurs petits repas par jour : la faim aussi fait mordiller."],h:"Un chiot trop fatigué ne s'endort pas tout seul : il s'excite, mord plus fort, fait des « zoomies ». La réponse, c'est une sieste, pas plus de jeu.",src:"Dogs Trust, Blue Cross, AKC (sommeil du chiot)"},
m7:{t:"mors",ti:"Zéro dent sur la peau",d:"Toute la journée",s:["Toute la famille applique la même règle : la moindre dent sur la peau arrête le jeu.","Pause immédiate, tu sors 30 secondes maximum, tu reviens quand il est calme.","Récompense tous les moments où il choisit le jouet.","Continue à lui donner des choses à mâcher : les dents de lait tombent vers 3-4 mois, les définitives sont là vers 7 mois."],h:"Si ça empire, si ça semble lié à la peur ou à la frustration, consulte un vétérinaire comportementaliste.",src:"Dogs Trust, Blue Cross, Zoopsy (Dr Chevallier)"},

l1:{t:"laisse",ti:"Le harnais, c'est magique",d:"2 min · 2×/jour",s:["Montre le harnais : friandise.","Passe-le sur sa tête quelques secondes : friandise, puis retire.","Augmente la durée chaque jour, puis ferme les attaches.","Joue avec lui pendant qu'il le porte pour qu'il l'oublie."],h:"Un harnais limite les risques de blesser le cou pendant l'apprentissage.",src:"Battersea (déclencheurs : mise du harnais), Dogs Trust"},
l2:{t:"laisse",ti:"La laisse qui traîne",d:"5 min · sous surveillance",s:["Accroche une laisse légère au harnais, dans le jardin ou une pièce sûre.","Laisse-le se promener avec, sans la tenir.","Puis prends-la en main et suis-le, laisse détendue.","Ne tire jamais : il doit trouver ça banal."],h:"On commence là où il est déjà à l'aise, idéalement le jardin.",src:"Dogs Trust"},
l3:{t:"laisse",ti:"Suis-moi à la maison",d:"3 min · 3×/jour",s:["Sans laisse, marche quelques pas dans le salon.","Dès qu'il est à côté de ta jambe : friandise pile à cet endroit.","Change de direction souvent, toujours en récompensant à côté de toi.","Ajoute ensuite la laisse, même exercice."],h:"Toujours le même côté au début : ça l'aide à comprendre où est la « bonne place ».",src:"RSPCA, Dogs Trust"},
l4:{t:"laisse",ti:"Je deviens un arbre",d:"Chaque sortie",s:["Dès que la laisse se tend : tu t'arrêtes net, sans tirer ni parler.","Attends que la laisse se détende (il se retourne, recule d'un pas).","« Oui ! » et tu repars.","Pendant qu'il marche laisse détendue, donne des friandises en continuant d'avancer."],h:"Il comprend que tirer ne fait plus avancer. Les premières sorties sont très lentes, c'est normal.",src:"Dogs Trust, RSPCA"},
l5:{t:"laisse",ti:"Demi-tour joyeux",d:"Chaque sortie",s:["Quand il fonce vers le bout de la laisse, dis « On y va ! » gaiement.","Fais demi-tour et marche dans l'autre sens.","Il te rejoint : friandise à côté de ta jambe.","Alterne avec « l'arbre »."],h:"Utile quand une odeur est trop tentante pour qu'il remarque que tu t'es arrêté.",src:"Dogs Trust, RSPCA"},
l6:{t:"laisse",ti:"Balade renifle",d:"Courte · à son rythme",s:["Une sortie calme où il a le droit de renifler (c'est épuisant pour le cerveau).","Laisse détendue récompensée, arrêts quand ça tire.","Varie les lieux : trottoir, chemin, parking, marché tranquille.","Préfère les sols souples (herbe, chemin) au bitume, et rentre avant qu'il soit épuisé."],h:"Golden = grande race qui grandit jusqu'à 18-24 mois : pas de footing ni de longues balades. Le repère « 5 min par mois d'âge » n'a pas de base scientifique (PDSA) : observe-le plutôt, et rentre au premier signe de fatigue.",src:"PDSA, Kennel Club, AKC Golden, Krontveit 2012"},

p1:{t:"prop",ti:"Les sorties clés",d:"Toute la journée",s:["Au réveil, après chaque sieste et chaque jeu, et dès qu'il est excité.","Après le repas : vers 15 min pour le pipi, vers 30 min pour la crotte.","Au début, au moins toutes les 1 à 2 heures en journée.","La nuit, un très jeune chiot ne peut pas tenir : prévois une sortie nocturne."],h:"Ne compte pas sur lui pour te prévenir. C'est à toi d'anticiper.",src:"Kennel Club, AKC"},
p2:{t:"prop",ti:"Les mots magiques",d:"À chaque sortie",s:["Toujours le même coin du jardin, en laisse, et tu restes avec lui (porte fermée).","Pendant qu'il fait : un mot pour le pipi, un autre pour la crotte, voix calme.","Juste après : friandise dehors, avec le mot, pas seulement « bon chien ».","Joue quelques minutes avant de rentrer, sinon il apprend à se retenir pour rester dehors."],h:"En rentrant à la maison, sors-le avant de lui dire bonjour, et accueille-le calmement.",src:"Kennel Club, AKC"},
p3:{t:"prop",ti:"Repérer les signaux",d:"Observation",s:["Il renifle le sol en tournant en rond : dehors tout de suite.","Il s'éloigne dans un coin, gémit ou va vers la porte : dehors.","Note les signes propres à {N}.","Quand tu ne peux pas surveiller : parc ou caisse."],h:"Retire les tapis pendant quelques semaines : ils absorbent comme de l'herbe.",src:"Kennel Club, AKC"},
p5:{t:"prop",ti:"Journal de propreté",d:"1 min · à chaque besoin",s:["Note l'heure des repas, des siestes et de chaque besoin.","Après 3 ou 4 jours, des horaires réguliers apparaissent.","Avance les sorties juste avant ces heures-là.","Repas à heures fixes, pas de changement d'aliment, rien de salé."],h:"Accident ? Nettoyant enzymatique, jamais d'ammoniaque, et on ne gronde pas : il apprendrait à se cacher pour faire.",src:"Kennel Club"},
p6:{t:"prop",ti:"Allonger les intervalles",d:"Toute la journée",s:["Plusieurs jours sans accident : espace les sorties de 15 à 30 min.","Repère AKC : âge en mois + 1 = heures maximum qu'il peut tenir.","Garde le rituel : réveil, repas, jeu, coucher.","Pour lui apprendre à faire en balade : sors tôt le matin et ne rentre qu'après le pipi."],h:"Un accident ? Reviens au rythme précédent quelques jours.",src:"AKC, Kennel Club"},

b1:{t:"bonus",ti:"Regarde-moi",d:"2 min · 2×/jour",s:["Friandise dans la main, amène-la à hauteur de tes yeux.","Il croise ton regard une seconde : « Oui ! » et friandise.","Allonge peu à peu à 2, 3, 5 secondes.","Ajoute le mot « Regarde »."],h:"Un chiot qui te regarde est un chiot qui écoute.",src:"Battersea (bases du marqueur)"},
b2:{t:"bonus",ti:"Assis au leurre",d:"2 min · 3×/jour",s:["Friandise devant sa truffe, monte-la doucement au-dessus de sa tête.","Ses fesses touchent le sol : « Oui ! » et friandise.","Après 5 réussites, dis « Assis » juste avant le geste.","Demande-le avant la gamelle, avant de sortir, avant une caresse."],h:"Un « assis » remplace plein de bêtises : sauter, voler, mordiller.",src:"ASPCA, RSPCA"},
b3:{t:"bonus",ti:"Couché",d:"2 min · 2×/jour",s:["Depuis l'assis, descends la friandise de sa truffe vers le sol, entre ses pattes.","Puis éloigne-la un peu au ras du sol.","Les coudes au sol : « Oui ! » et friandise.","Ajoute le mot « Couché » quand le geste est fiable."],h:"Séances courtes : 5 réussites et on arrête.",src:"RSPCA, Dogs Trust"},
b4:{t:"bonus",ti:"Le settle sur couverture",d:"5 min · 1×/jour",s:["Assis sur une chaise, lui en laisse, une couverture au sol. Tu ne dis rien.","Lance une mini-friandise sur la couverture dès qu'il ne te fixe pas et ne tire pas.","Puis récompense seulement quand il se couche, puis quand il se détend (soupir, tête posée).","Attends 2 secondes de plus à chaque séance. Ensuite sans laisse, puis avec un peu d'agitation autour."],h:"Pas d'ordre ici : il apprend à se poser tout seul, très utile pour un golden plein d'énergie.",src:"Dogs Trust (settle training)"},
b5:{t:"bonus",ti:"Touche : le bonjour avec la truffe",d:"2 min · 2×/jour",s:["Présente ta main ouverte, paume vers lui, à 5 cm de sa truffe. Pas de friandise dans cette main.","Sa truffe touche ta paume : « Oui ! » et friandise donnée avec l'autre main.","Après 5 réussites, dis « Touche » juste avant de tendre la main. Change de hauteur, de côté, puis éloigne un peu la main.","Avec les enfants et les invités : ils tendent la paume, « Touche », « Oui ! » et ils lancent la friandise au sol."],h:"Un bonjour poli qui remplace les sauts et le reniflage insistant. Il peut toujours partir s'il n'a pas envie : on ne le suit pas.",src:"AKC (« touch »), Oregon Humane Society"},
b10:{t:"bonus",ti:"La gamelle zen",d:"À chaque repas",s:["Gamelle à la main : demande « Assis ». Il s'assoit : tu commences à baisser la gamelle.","Il se relève : tu remontes la gamelle, sans rien dire. Il se rassoit : tu recommences.","Gamelle au sol, attends une seconde, puis « OK » : il mange. Allonge l'attente très doucement, jamais plus de quelques secondes.","Pendant qu'il mange, passe parfois à côté et ajoute un morceau de poulet dans la gamelle, puis éloigne-toi. On ne retire jamais la gamelle pendant qu'il mange."],h:"Il apprend la patience, et que ta présence près de sa gamelle annonce du bon : c'est la meilleure prévention de la protection de nourriture. Les enfants ne s'approchent pas pendant le repas.",src:"Battersea, AKC (protection des ressources)"},
b6:{t:"bonus",ti:"Manipulation douce",d:"2 min · 1×/jour",s:["Touche une oreille : friandise. Une patte : friandise. La queue : friandise.","Regarde ses dents une seconde : friandise.","Passe la brosse doucement sur le dos, juste avant une sieste quand il est calme.","Il se tortille et mordille ? Donne-lui un Kong fourré à lécher pendant qu'on le touche."],h:"Prépare le vétérinaire, la coupe des griffes et le brossage, indispensables avec un poil de golden.",src:"ASPCA, Kennel Club, AKC Golden"},
b7:{t:"bonus",ti:"Laisse ça",d:"3 min · 1×/jour",s:["Une friandise top dans une main, un objet ennuyeux (croquette sèche, papier) dans l'autre.","Présente l'objet ennuyeux. Il détourne le regard ou recule : « Oui ! » et friandise de l'autre main.","Quand il le fait à coup sûr, dis « Laisse » juste avant de présenter l'objet.","Puis objet posé au sol, puis lâché d'un peu haut, puis objets plus tentants."],h:"Vital pour un chiot qui ramasse tout en balade.",src:"Dogs Trust, RSPCA"},

b8:{t:"bonus",ti:"Reste",d:"3 min · 2×/jour",s:["Demande « Couché ». Montre ta paume ouverte vers lui (geste « stop ») et dis « Reste ».","Attends 2 secondes, puis donne la friandise pendant qu'il est encore couché, jamais quand il s'est relevé.","Libère-le avec un mot toujours le même (« OK ») et une friandise lancée plus loin : c'est toi qui dis quand c'est fini.","Ajoute quelques secondes à chaque fois, puis un pas en arrière, puis deux. Une seule difficulté à la fois : durée, distance ou distractions."],h:"S'il se relève, c'est que tu es allé trop vite : reviens à l'étape d'avant. Récompense juste avant qu'il craque.",src:"RSPCA, Battersea"},
b9:{t:"bonus",ti:"Va au panier",d:"3 min · 2×/jour",s:["Debout à côté de son panier, attire-le dessus avec une friandise. Récompense une patte, puis deux, puis les quatre.","Sur le panier, demande « Couché » et donne la friandise entre ses pattes. Libère avec « OK » et une friandise lancée hors du panier. 5 fois.","Arrête d'attirer : quand il y va tout seul et se couche, grosse récompense. Puis dis « Panier » au moment où il part vers le panier.","Récompense souvent pendant qu'il y reste (toutes les quelques secondes), puis espace jusqu'à 20 secondes et plus. Ensuite recule d'un pas, puis assieds-toi plus loin, puis ajoute des distractions."],h:"Le panier doit rester un endroit agréable : jamais pour punir. Il faut qu'il connaisse déjà « Couché ».",src:"Battersea (« bed command »)"},
c1:{t:"maison",ti:"La caisse, un bon endroit",d:"5 min · 2×/jour",s:["Caisse en métal assez grande pour se lever, tourner et s'étirer, avec un lit, de l'eau et des jouets. Porte ouverte.","Sème des friandises devant, puis dedans. S'il ressort, attends qu'il y retourne seul, sans l'appeler.","Donne ses repas ou un Kong dedans.","Ferme la porte quelques secondes, rouvre. Allonge petit à petit, d'abord en restant dans la pièce."],h:"Jamais de caisse comme punition. S'il gémit ou gratte, reviens à l'étape d'avant.",src:"Dogs Trust, Blue Cross, ASPCA"},
s1:{t:"maison",ti:"Seul : un pas, une porte",d:"5 min · 1×/jour",s:["Il est couché dans son lit ou son parc avec un objet à mâcher.","Fais un pas en arrière, reviens, récompense s'il est resté calme.","Puis sors de la pièce quelques secondes, puis ferme la porte, puis reste dehors un peu plus.","Varie les durées. Signes de stress (halètement, va-et-vient, bâillements, léchage de babines, pleurs) : raccourcis."],h:"Une barrière bébé l'aide : il te voit et t'entend sans être collé à toi.",src:"RSPCA, PDSA, Dogs Trust"},
s2:{t:"maison",ti:"Départs et retours sans fête",d:"À chaque sortie",s:["Avant de partir : pipi, un peu d'exercice, puis un jouet distributeur de nourriture.","Pars avec une phrase calme toujours la même (« À tout à l'heure »).","En rentrant, accueil tranquille. Tu le félicites quand il est calme.","Allonge les absences petit à petit, une fois qu'il gère bien quand tu es dans la maison."],h:"4 heures, c'est le maximum pour un adulte. Pour un jeune chiot, c'est déjà trop long.",src:"Dogs Trust, PDSA, RSPCA"},
j1:{t:"maison",ti:"Quatre pattes au sol",d:"À chaque retour",s:["Il saute sur toi : tu te tournes et tu t'éloignes sans un mot. Assis ? Lève-toi.","En rentrant, s'il saute, ressors, attends un instant, et rentre à nouveau.","Dès que ses 4 pattes sont au sol (ou qu'il s'assoit) : attention et friandise.","Entraîne-toi avec toute la famille et quelques amis. Avec des invités : pose le pied sur la laisse pour qu'il puisse s'asseoir mais pas sauter."],h:"Un petit golden qui saute, c'est mignon. À 30 kg, beaucoup moins, surtout pour les enfants.",src:"Nevada SPCA, Dogs Trust"},
e1:{t:"maison",ti:"Enfants : c'est lui qui choisit",d:"5 min · avec un adulte",s:["L'enfant s'accroupit et appelle le chiot doucement. S'il vient, il est d'accord pour une caresse.","Caresses douces sur le côté, pas de câlin serré, pas de visage contre le sien, pas le porter.","On ne le dérange jamais quand il mange, mâche ou dort.","L'enfant peut l'aider à apprendre l'« assis » ou le « cercle des rappels »."],h:"Toujours sous surveillance d'un adulte. Une barrière ou le parc quand tout le monde s'excite.",src:"Blue Cross, Kennel Club, Battersea"}
};

const PLAN={
 nom:["n1","n1","n2","n2","n3","n4","n4","n5","n5","n6","n6","n6"],
 mors:["m1","m2","m6","m3","m3","m5","m4","m4","m7","m7","m7","m7"],
 laisse:["l1","l2","l3","l3","l4","l4","l5","l5","l6","l6","l6","l6"],
 prop:["p1","p2","p3","p3","p5","p5","p6","p6","p6","p6","p6","p6"],
 maison:["e1","c1","c1","s1","j1","s1","j1","s2","e1","s2","j1","s2"],
 bonus:["b6","b1","b2","b10","b5","b3","b7","b8","b4","b9","b7","b8"]
};
const SLOTS=["nom","mors","laisse","prop","maison","bonus"];
const WEEKS=[
 ["Bienvenue à la maison","On pose les repères : routine, sorties, siestes, et des règles claires avec les enfants dès le premier jour."],
 ["Premières règles","Les dents se posent sur les jouets, pas sur les mains. La caisse devient un endroit agréable."],
 ["Petit explorateur","On découvre le monde, on suit ses signaux pour la propreté, on protège ses siestes."],
 ["Ça se corse un peu","Petites distractions, apprendre à lâcher, la gamelle zen et les premières minutes seul."],
 ["Toute la famille s'y met","Rappel en cercle, laisse avec la technique de l'arbre, quatre pattes au sol, et « Touche » pour dire bonjour."],
 ["Plus d'autonomie","Accueil avec un jouet en gueule, « Couché », journal de propreté."],
 ["Jeux encadrés","Tir à la corde avec règles, demi-tours en balade, et « Laisse ça »."],
 ["Consolidation","On répète partout, avec tout le monde. Nouveau : un premier « Reste »."],
 ["Nouveaux lieux","Balades renifle dans des endroits différents, zéro dent sur la peau, et se poser sur sa couverture."],
 ["Rappel en longe","Le rappel sort de la maison, toujours avec une longe. Nouveau : « Va au panier »."],
 ["Généraliser","Mêmes exercices, plus de distractions, plus de distance."],
 ["Bilan","Ce qui marche, ce qui reste à travailler. Vers 6 mois, l'adolescence arrive : on garde le cap."]
];
const SOC=[
 "Bruit d'aspirateur à distance, friandises pendant qu'il tourne","Marcher sur du carrelage, de l'herbe et du gravier","Rencontrer une personne avec un chapeau ou une capuche","Écouter le bruit de la cuisine : casseroles, mixeur (de loin)","5 minutes en voiture, moteur allumé, sans rouler","Observer un vélo ou une trottinette passer, de loin","Rencontrer un enfant calme, assis par terre","Toucher une grille ou une plaque d'égout en métal","Un chien adulte calme et vacciné, quelques minutes, sans le prendre dans les bras","Le sèche-cheveux à distance, friandises","Rencontrer une personne avec des lunettes ou une barbe","Une rue animée, assis sur un banc avec lui","Le bruit d'un orage enregistré, très bas","Une poubelle qu'on déplace, de loin","Rencontrer un chat qui reste à distance","Un parapluie qu'on ouvre lentement, de loin","Visite de courtoisie chez le vétérinaire, juste pour des friandises","Le bruit de la sonnette, puis friandise","Marcher sur une serviette froissée ou une bâche","Une terrasse de café, couché à tes pieds avec un objet à mâcher"
];
const GAMES=[
 {a:"sniff",ti:"Chasse aux croquettes",m:"Flair · intérieur · 5 min",p:"Montre une croquette, dis « Cherche » et lance-la à 1 m. Puis cache-les sous des coussins. Ça fatigue sans abîmer les articulations."},
 {a:"sniff",ti:"Tapis de fouille maison",m:"Flair · calme · 5 min",p:"Étale une serviette, saupoudre des croquettes, roule-la sans serrer. Il déroule avec le museau. Parfait avant une sieste."},
 {a:"hide",ti:"Cache-cache",m:"Rappel · maison · 5 min",p:"Quelqu'un le tient, tu te caches et tu l'appelles une fois. Grosse fête quand il te trouve."},
 {a:"fetch",ti:"Rapporte",m:"Instinct de golden · 5 lancers",p:"Lance un jouet à 2 m dans un couloir (il ne peut que revenir vers toi). Échange contre une friandise. 5 lancers maximum."},
 {a:"box",ti:"La boîte surprise",m:"Confiance · 5 min",p:"Un carton avec du papier froissé et 3 friandises. Il fouille, déchire, découvre. Bon pour l'assurance face aux bruits."},
 {a:"sit",ti:"Statue",m:"Calme · 3 min",p:"Joue avec le jouet, puis arrête net et demande « assis ». Il s'assoit : le jeu reprend. Il apprend à redescendre d'un coup."},
 {a:"ping",ti:"Le relais du prénom",m:"Famille · 5 min",p:"Deux personnes à chaque bout d'un couloir l'appellent à tour de rôle. Chaque arrivée est récompensée."},
 {a:"hands",ti:"Quelle main ?",m:"Flair · 2 min",p:"Une friandise dans un poing fermé, l'autre vide. Il renifle le bon : tu ouvres. Il gratte ou mordille : tu attends."},
 {a:"crate",ti:"Le Kong congelé",m:"Calme · 15 min",p:"Remplis un Kong de croquettes trempées et un peu de yaourt nature, congèle. À donner dans la caisse ou pendant tes absences."},
 {a:"jump",ti:"Le jeu de la porte",m:"Politesse · 3 min",p:"Sors et rentre plusieurs fois. Chaque fois qu'il reste les 4 pattes au sol, il gagne une friandise. Il saute : tu ressors."}
];
const TIPS=[
 "Des séances très courtes (2 à 5 minutes) plusieurs fois par jour valent mieux qu'une longue séance.",
 "Prends une partie de sa ration de croquettes pour l'éducation : pas de surpoids, et des récompenses toute la journée.",
 "Récompense dans la seconde qui suit le bon geste. Après, il ne fait plus le lien.",
 "Toute la famille utilise les mêmes mots et les mêmes règles, sinon il ne s'y retrouve pas.",
 "Pas de punition physique, pas de cris : selon Dogs Trust, ça augmente la peur et la frustration.",
 "Un chiot dort 18 à 20 heures par jour. S'il fait des bêtises en fin de journée, il a souvent besoin de dormir.",
 "Balades : le repère « 5 minutes par mois d'âge, 2 fois par jour » est très cité, mais le PDSA rappelle qu'il n'a pas de base scientifique. Courtes sorties, jeux libres sur sol souple, et beaucoup de repos.",
 "Épillets (spigaous) : après chaque balade dans les herbes sèches, regarde ses oreilles, entre ses doigts et sa truffe. S'il secoue la tête d'un coup : vétérinaire.",
 "Chenilles processionnaires (janvier à mai sous les pins) : en laisse près des pins. Contact avec la gueule = urgence vétérinaire, rince à l'eau sans frotter.",
 "Pendant le repas, on laisse {N} tranquille : les enfants ne s'approchent pas de sa gamelle.",
 "Avant 3 mois, évite les escaliers : une étude norvégienne sur des chiens de grande race l'associe à plus de dysplasie de la hanche.",
 "Les jeux en liberté sur un sol souple, avant 3 mois, étaient au contraire associés à moins de dysplasie dans cette même étude.",
 "Socialiser, ce n'est pas l'exposer à tout : il doit rester curieux. S'il recule, on s'éloigne et on récompense.",
 "Les vétérinaires comportementalistes conseillent de sortir le chiot avant la fin des vaccins, dans des lieux maîtrisés : la période favorable se termine vers 3 mois.",
 "Ne rappelle jamais {N} pour quelque chose qu'il n'aime pas (bain, fin de jeu) : va le chercher.",
 "Une laisse fixe de 1,5 à 2 m est plus claire pour lui qu'un enrouleur.",
 "Golden = double poil : brosse-le un peu chaque jour dès maintenant. Ne le rase jamais.",
 "Le dernier geste avant ton coucher : une sortie pipi.",
 "Finis toujours une séance sur une réussite, même facile.",
 "Vers 6 mois, le golden entre dans l'adolescence : ce qu'il savait peut sembler « oublié ». C'est normal, on continue.",
 "Une peur soudaine d'un objet connu (une poubelle par exemple) peut arriver : c'est une phase. Reste calme, éloigne-toi, récompense.",
 "Garde ses jouets à part de ceux des enfants : ils se ressemblent et un petit jouet peut être avalé.",
 "Pas de jeux de bagarre avec les mains, même pour rire : il apprendrait que les mains sont des jouets."
];

const SHEETS=[
 {k:"nom",ti:"Lui apprendre son prénom",lead:"Son prénom veut dire « regarde-moi, il va se passer quelque chose de bien ». C'est la première marche vers le rappel, qui est souvent cité comme l'apprentissage le plus important.",
  yes:["Dire le prénom une seule fois, voix joyeuse","Récompenser dès qu'il tourne la tête","Commencer dans une pièce calme, puis le jardin, puis dehors","Faire participer toute la famille, chacun son tour","Récompenser à chaque fois qu'il arrive, même en retard"],
  no:["Répéter « {N}, {N}, {N} » : il apprend à ignorer les premiers","Utiliser son nom pour gronder","L'appeler pour finir une balade ou un jeu : va le chercher"],
  src:"Dogs Trust, Toronto Humane Society, SF SPCA"},
 {k:"mors",ti:"Ne pas mordre les humains",lead:"Mordiller est normal chez le chiot et ne veut pas dire qu'il est agressif. Les dents de lait tombent vers 3-4 mois et les définitives arrivent vers 7 mois. On redirige vers les jouets et on retire l'attention quand les dents touchent la peau.",
  yes:["Rester immobile, cacher le jouet, se détourner, puis sortir quelques secondes si besoin","Proposer le jouet avant qu'il commence (il rebondit, bondit, tape avec les pattes)","Gros jouets souples pour le tir à la corde : les mains restent loin","Objets à mâcher pour les dents","Siestes régulières et plusieurs petits repas","Approcher par l'arrière quand il est très excité, éviter les mouvements devant ses yeux"],
  no:["Taper, crier, le plaquer au sol, pincer les babines","Retirer la main d'un coup (ça relance le jeu)","Jeux de bagarre avec les mains","Utiliser la caisse comme punition","Laisser les enfants courir et crier près de lui"],
  debate:"Les pros ne sont pas tous d'accord sur deux points. Le « aïe ! » aigu : l'AKC et le Dr Ian Dunbar le conseillent, Dogs Trust, Blue Cross, Battersea et le Kennel Club le déconseillent car il excite beaucoup de chiots. Essaie, et s'il en rajoute, arrête. Les mordillements doux : le Dr Dunbar les tolère au début pour que le chiot apprenne à doser sa mâchoire, la vétérinaire comportementaliste Jasmine Chevallier (Zoopsy) conseille de refuser tout mordillement des mains, même léger.",
  src:"Dogs Trust, Blue Cross, Battersea, Kennel Club, AKC, Dr Ian Dunbar, Zoopsy"},
 {k:"laisse",ti:"Marcher en laisse",lead:"Un chiot tire parce qu'il a appris que ça le fait avancer. On lui apprend l'inverse : laisse détendue = on avance, laisse tendue = on s'arrête.",
  yes:["Harnais et laisse fixe légère","Commencer au jardin ou à la maison","Récompenser en marchant quand la laisse est détendue","S'arrêter dès que la laisse se tend","Sorties courtes : environ 5 min par mois d'âge, 2 fois par jour","Sols souples plutôt que bitume"],
  no:["Tirer ou donner des à-coups","Laisse à enrouleur pendant l'apprentissage","Footing ou longues balades avant la fin de croissance","Escaliers à répétition avant 3 mois"],
  src:"Dogs Trust, RSPCA, Kennel Club, Krontveit et al. 2012"},
 {k:"prop",ti:"Faire ses besoins dehors",lead:"La propreté se construit avec une routine et beaucoup d'anticipation, dès l'arrivée. Le Kennel Club rappelle qu'on ne peut pas demander à un très jeune chiot de tenir toute la nuit.",
  yes:["Sortir au réveil, après les siestes, le jeu, l'excitation, et avant le coucher","Après le repas : vers 15 min (pipi) et 30 min (crotte)","Au moins toutes les 1 à 2 h au début","Rester dehors avec lui, porte fermée, et récompenser tout de suite","Un mot pour chaque besoin","Repas à heures fixes","Âge en mois + 1 = heures maximum sans sortie"],
  no:["Gronder après un accident : il apprendrait à se cacher","Nettoyant à l'ammoniaque (odeur d'urine) : préfère un enzymatique","Laisser la porte du jardin ouverte pour qu'il aille et vienne seul","Accueillir le chiot avec excitation (pipis d'excitation)","Laisser des tapis à sa portée"],
  src:"Kennel Club, AKC"},
 {k:"maison",ti:"Caisse et parc",lead:"Bien présentés, la caisse ou le parc deviennent son coin à lui, où il se repose et où rien ne risque d'arriver quand tu ne peux pas le surveiller.",
  yes:["Caisse en métal, assez grande pour se lever, tourner et s'étirer","Lit, eau, jouets, et un Kong pour rendre l'endroit agréable","Porte ouverte au début, friandises semées, repas dedans","Fermer quelques secondes, puis allonger petit à petit","La nuit, un parc offre plus de place qu'une caisse"],
  no:["L'utiliser comme punition ou comme « coin pénitence »","Le rappeler ou le pousser dedans s'il ressort","Fermer trop tôt, ignorer les pleurs ou le grattage","Le laisser dedans trop longtemps"],
  src:"Dogs Trust, Blue Cross, ASPCA"},
 {k:"maison",ti:"Rester seul",lead:"Apprendre à être seul se fait petit à petit, en commençant quand tu es encore dans la maison. Ça aide à prévenir l'anxiété de séparation.",
  yes:["Commencer par quelques secondes, puis quelques minutes","Barrière bébé : il te voit sans être collé à toi","Jouet distributeur de nourriture pendant l'absence","Pipi et un peu d'exercice avant de partir","Départs et retours calmes, toujours la même petite phrase"],
  no:["Partir longtemps dès les premiers jours","Revenir pendant qu'il pleure","Faire une grande fête en partant ou en rentrant","Plus de 4 heures, même pour un adulte"],
  signs:"Signes de stress : halètement, va-et-vient, bâillements sans fatigue, léchage de babines, pleurs, pipis, destructions. Dans ce cas, on raccourcit.",
  src:"Dogs Trust, PDSA, RSPCA, Blue Cross"},
 {k:"maison",ti:"Enfants et chiot",lead:"Avec des enfants à la maison, les règles se posent dès le premier jour, pour la sécurité de tous. Le Kennel Club estime qu'un enfant doit avoir au moins 10 ans pour être responsable d'un chien hors de la maison.",
  yes:["Toujours un adulte présent, surtout avec les plus jeunes","Le chiot vient de lui-même : s'il vient, il dit oui à la caresse","Caresses douces, voix calme","Les enfants l'aident à l'éducation (assis, rappel en cercle)","Barrière ou parc quand quelqu'un est trop excité","Ranger les jouets des enfants"],
  no:["Câlins serrés, visage contre visage, le porter souvent","Le réveiller ou le surprendre","Le toucher quand il mange ou mâche","Courir, crier, jouer à se faire poursuivre"],
  signs:"Signes que le chiot est mal à l'aise : il s'éloigne, se cache, queue rentrée, se lèche les babines, bâille sans fatigue, grogne. On lui laisse de l'espace.",
  src:"Blue Cross, Kennel Club, Battersea"},
 {k:"bonus",ti:"Spécial golden : croissance et caractère",lead:"Le golden est un chien calme à l'âge adulte, mais il a besoin d'éducation régulière et d'activité pour y arriver. Il grandit jusqu'à environ 2 ans.",
  yes:["Exercice court et fréquent, sur sol souple","Des « jobs » de chien de rapport : porter, rapporter, chercher","Brossage et manipulation des oreilles, pattes et griffes dès le début","Le jeu « laisse ça », « donne » et « rapporte » pour canaliser la gueule","Activités plus tard : flair, obéissance, rally, travail à l'eau"],
  no:["Escaliers à répétition avant 3 mois","Footing avant la fin de croissance","Le raser (double poil)","Le forcer à jouer avec des chiens qu'il n'aime pas"],
  signs:"Âges repères (AKC) : 2-6 mois, période d'apprentissage et de socialisation ; 6-18 mois, adolescence avec parfois une nouvelle phase de peur ; 18-24 mois, maturité.",
  src:"AKC (Golden Retriever Training Timeline), Krontveit et al. 2012, Kennel Club"},
 {k:"bonus",ti:"Reste et va au panier",lead:"Deux exercices utiles au quotidien : pendant les repas, quand on sonne à la porte, quand tu passes la serpillière. Il doit déjà connaître « Couché ».",
  yes:["Récompenser pendant qu'il tient la position, pas après","Un mot de libération toujours le même (« OK ») : c'est toi qui dis quand c'est fini","Une seule difficulté à la fois : d'abord la durée, puis la distance, puis les distractions","Quelques secondes de plus à chaque séance","Panier confortable, à un endroit calme","S'entraîner dans plusieurs pièces, puis chez des amis"],
  no:["Récompenser quand il s'est déjà relevé","Le rappeler alors qu'il est en « Reste » (ça brouille les deux)","Envoyer au panier pour le punir","Des séances longues : arrête dès qu'il s'agace"],
  src:"RSPCA (stay), Battersea (bed command)"},
 {k:"soc",ti:"Socialisation",lead:"Selon l'AVSAB, la période la plus importante va jusqu'à environ 3 mois, et on continue jusqu'à 16 semaines. Les vétérinaires comportementalistes français (Zoopsy) conseillent de sortir le chiot dès les premiers jours, sans attendre la fin des vaccins.",
  yes:["Une découverte par jour, de loin d'abord","Friandises pendant qu'il observe","Rues, transports, terrasses, maisons d'amis","Des chiens adultes calmes et vaccinés","Le laisser communiquer avec les chiens adultes au lieu de le prendre dans les bras à chaque rencontre","École du chiot dans un club d'éducation (dès 7-8 semaines, premier vaccin au moins 7 jours avant)"],
  no:["Forcer le contact","Le submerger (fête bruyante, foule)","Les lieux fréquentés par des chiens inconnus non vaccinés"],
  src:"AVSAB, Zoopsy (sortie précoce), Dr Kersti Seksel, Chiens Guides d'Aveugles de Paris"},
 {k:"prop",ti:"La journée type (onglet Planning)",lead:"Le planning est recalculé chaque jour selon son âge, l'heure du lever et l'heure du coucher. Il suit des règles simples, communes aux sources ci-dessous. Garde-le comme une trame : si {N} se réveille plus tôt d'une sieste, on sort faire pipi tout de suite et on décale.",
  yes:["Un cycle qui se répète : réveil → pipi → repas ou activité → pipi → sieste","Éveil court : environ 1 h avant 3 mois, 1 h 15 jusqu'à 4 mois, puis plus long","Siestes au calme dans le parc ou la caisse, environ 1 h 30","Repas à heures fixes : 4 par jour jusqu'à 3 mois, 3 jusqu'à 6 mois, puis 2","Pipi au réveil, après chaque repas (la crotte vient 10 à 30 min après), après le jeu et avant chaque sieste","Séances d'éducation de 3 à 5 min, une par cycle","Le soir : on lève la gamelle d'eau environ 1 h 30 avant le coucher (sauf forte chaleur), dernier pipi juste avant","La nuit : au début, une ou deux sorties pipi, en silence, sans jouer, puis retour au lit"],
  no:["Le laisser éveillé et excité des heures « pour qu'il dorme mieux la nuit »","Rallonger les intervalles pipi avant plusieurs jours sans accident","Faire de la sortie de nuit un moment de jeu","Supprimer l'eau en journée"],
  signs:"Signes qu'il est temps de faire une sieste : il mord plus fort, court partout, aboie sans raison, ignore ce qu'il sait faire, mâchouille frénétiquement.",
  src:"AKC (sommeil et routine), Zoopsy (arrivée du chiot), CNIB et Guide Dogs Ireland (propreté), Dogs for Good (nuits)"},
 {k:"maison",ti:"Dangers du Vaucluse",lead:"Autour de Carpentras, quelques dangers reviennent chaque année. Garde le numéro de ton vétérinaire et celui des urgences dans ton téléphone.",
  yes:["Chenilles processionnaires (surtout janvier à mai, sous les pins et les chênes) : laisse courte près des pins. Contact : rince la gueule à l'eau froide sans frotter et file chez le vétérinaire, c'est une urgence","Épillets (« spigaous », de mai à octobre) : après chaque balade dans les herbes sèches, inspecte oreilles, doigts, truffe, yeux. S'il secoue la tête, se frotte l'oreille ou éternue d'un coup : vétérinaire","Coups de chaleur : en été, sorties tôt le matin et tard le soir, de l'ombre et de l'eau à volonté. Le bitume brûle les coussinets","Laurier-rose (dans beaucoup de jardins du Midi) : toutes les parties sont toxiques. Empêche-le de mâchouiller feuilles et branches","Dans la cuisine : chocolat (surtout noir et cacao), raisin et raisins secs, xylitol (chewing-gums, certains gâteaux), oignon, ail, noix de macadamia","Centre antipoison vétérinaire (CNITV, Lyon) : 04 78 87 10 40, de 8 h 30 à minuit"],
  no:["Le faire vomir ou lui donner un médicament sans avis vétérinaire","Le laisser seul dans une voiture, même quelques minutes au soleil","Les balades dans les hautes herbes sèches en été","Les pommes de pin et les branches comme jouets : elles cassent et blessent la gueule"],
  signs:"Urgence immédiate : salive abondante, langue gonflée, difficulté à respirer, vomissements répétés, convulsions, abattement brutal. Appelle ton vétérinaire ou le 3115 (urgences vétérinaires).",
  src:"République et canton de Genève (processionnaires), Ville de Lyon (épillets), ASPCA Animal Poison Control, CNITV"}
];

const SOURCES=[
 ["Vétérinaires et comportementalistes",[
  ["AVSAB : prises de position (socialisation, éducation sans violence)","https://avsab.org/resources/position-statements/"],
  ["AVMA : l'AVSAB et la socialisation précoce","https://www.avma.org/News/JAVMANews/Pages/081001c.aspx"],
  ["AVMA : prévention des morsures","https://www.avma.org/resources-tools/pet-owners/dog-bite-prevention"],
  ["Zoopsy, Dr Jasmine Chevallier : mordillements du chiot","https://www.zoopsy.com/fiches_conseils/comportement-animal33-comprendre-et-faire-cesser-les-mordillements-du-chiot-chevallier.pdf"],
  ["Zoopsy : sortie précoce des chiots","https://www.zoopsy.com/fiches_conseils/sortie-precoce-des-chiots.pdf"],
  ["Dr Kersti Seksel (Veterinary Focus) : la socialisation du chiot","https://www.ivis.org/library/veterinary-focus/canine-and-feline-behavioral-matters-veterinary-focus-vol-201-mar-2010/la-socialisation-du-chiot?page=1"],
  ["Dr Ian Dunbar : inhibition de la morsure","https://www.cabq.gov/pets/documents/puppy_biting.pdf/@@download/file/puppy biting.pdf"],
  ["Zoopsy : l'arrivée du chiot (sommeil, repas, propreté)","https://www.zoopsy.com/public/fiches/arrivee-chiot-dans-foyer.php"],
  ["CNITV : centre national d'informations toxicologiques vétérinaires","https://www.helloasso.com/associations/cnitv"],
  ["ASPCA Animal Poison Control : plantes et aliments toxiques","https://www.aspca.org/pet-care/animal-poison-control"]]],
 ["Propreté, sommeil et routine",[
  ["AKC : combien dort un chiot","https://www.akc.org/expert-advice/health/how-much-do-puppies-sleep/"],
  ["CNIB (chiens guides) : routine de propreté","https://www.cnib.ca/en/relieving-guidelines"],
  ["CNIB : la première semaine avec un chiot","https://www.cnib.ca/en/first-week-puppy-setting-expectations"],
  ["Guide Dogs Ireland : apprendre où faire","https://www.guidedogs.ie/getting-support/information-and-resources/the-paw-files-teaching-puppies-where-to-go-"],
  ["Dogs for Good : propreté et nuits","https://www.dogsforgood.org/media/crupyevl/family-dog-programme-house-training.pdf"],
  ["PDSA : l'exercice du chiot (et les limites de la règle des 5 minutes)","https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/exercising-your-puppy"]]],
 ["Exercices ajoutés",[
  ["AKC : apprendre « Touche »","https://www.akc.org/expert-advice/training/target-the-fun-teach-your-dog-to-touch/"],
  ["Oregon Humane Society : hand target","https://www.oregonhumane.org/training/hand-target-touch/"],
  ["AKC : prévenir la protection des ressources","https://www.akc.org/expert-advice/training/preventing-resource-guarding"],
  ["Battersea : protection des ressources","https://www.battersea.org.uk/pet-advice/dog-advice/resource-guarding/transcript"]]],
 ["Dangers locaux",[
  ["Genève : chenilles processionnaires, précautions et urgences","https://www.ge.ch/chenilles-processionnaires/precautions-prendre-chiens-urgences-veterinaires"],
  ["Ville de Lyon : gare aux épillets","https://www.lyon.fr/node/752612"]]],
 ["Associations de protection animale",[
  ["Dogs Trust : mordillements","https://www.dogstrust.org.uk/dog-advice/training/unwanted-behaviours/mouthing-nipping-and-biting"],
  ["Dogs Trust : quoi apprendre au chiot","https://www.dogstrust.org.uk/dog-advice/training/basics/puppy-training"],
  ["Dogs Trust : caisse et parc","https://www.dogstrust.org.uk/dog-advice/training/home/crate-training"],
  ["Dogs Trust : rester seul","https://www.dogstrust.org.uk/dog-advice/training/home/time-alone"],
  ["Dogs Trust : settle (se poser)","https://www.dogstrust.org.uk/dog-advice/training/basics/settle-training"],
  ["Dogs Trust : laisse ça","https://www.dogstrust.org.uk/dog-advice/training/basics/leave-training"],
  ["Blue Cross : mordillements","https://www.bluecross.org.uk/advice/dog/behaviour-and-training/puppy-biting-and-mouthing"],
  ["Blue Cross : caisse","https://www.bluecross.org.uk/advice/dog/behaviour-and-training/how-to-crate-train-your-puppy"],
  ["Blue Cross : chiots et enfants","https://www.bluecross.org.uk/advice/dog/wellbeing-and-care/puppies-and-children"],
  ["Battersea : mordillements","https://www.battersea.org.uk/pet-advice/dog-advice/how-stop-my-puppy-mouthing"],
  ["Battersea : aller au panier","https://www.battersea.org.uk/pet-advice/dog-advice/teach-your-dog-%E2%80%98bed%E2%80%99-command"],
  ["RSPCA : apprendre « reste »","https://www.rspca.org.uk/adviceandwelfare/pets/dogs/training/stay"],
  ["PDSA : seul à la maison","https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/home-alone-preventing-separation-anxiety"],
  ["RSPCA : rester seul","https://www.rspca.org.uk/adviceandwelfare/pets/dogs/training/leftalone"],
  ["RSPCA : marcher sans tirer","https://www.rspca.org.uk/adviceandwelfare/pets/dogs/training/walknicely"],
  ["ASPCA Pro : Puppy Training 101","https://www.aspcapro.org/sites/default/files/PuppyTraining101.pdf"],
  ["Nevada SPCA : sauter sur les gens","https://dev.nevadaspca.org/assets/docs/Dogs-Jumping-Up.pdf"],
  ["SF SPCA : apprendre son nom","https://www.7x7.com/ask-a-trainer-how-to-teach-your-dog-its-name-in-60-seconds-1786516791.html"],
  ["Toronto Humane Society : règles du rappel","https://www.torontohumanesociety.com/wp-content/uploads/2023/11/How-to-Teach-Recall.pdf"]]],
 ["Clubs canins",[
  ["Kennel Club : mordillements","https://www.thekennelclub.org.uk/dog-training/getting-started-in-dog-training/dog-training-and-games/how-do-i-stop-my-puppy-mouthing/"],
  ["Kennel Club : propreté","https://www.thekennelclub.org.uk/dog-training/getting-started-in-dog-training/dog-training-and-games/how-do-i-toilet-train-my-dog/"],
  ["Kennel Club : enfants et chiens","https://www.thekennelclub.org.uk/getting-a-dog/caring-for-your-new-puppy/child-safety-around-dogs/"],
  ["AKC : étapes du chiot golden retriever","https://www.akc.org/expert-advice/dog-breeds/golden-retriever-puppy-training-timeline/"],
  ["AKC : mordillements","https://www.akc.org/expert-advice/training/puppy-mouthing-expert-tips/"],
  ["AKC : calendrier de propreté","https://www.akc.org/expert-advice/training/potty-training-your-puppy-timeline-and-tips/"],
  ["AKC : routine du chiot","https://www.akc.org/expert-advice/training/setting-schedules-and-developing-a-routine-for-your-new-puppy/"],
  ["Chiens Guides d'Aveugles de Paris : familles d'accueil","https://www.chiensguidesparis.fr/nos-missions/familles-accueil/"]]],
 ["Études scientifiques",[
  ["Krontveit et al. 2012 : exercice et dysplasie de la hanche (résumé)","https://www.instituteofcaninebiology.org/dog-news/effects-of-exercise-on-risk-of-hip-dysplasia-in-newfoundland-labrador-leonberger-and-wolfhound-puppies"],
  ["Purdue / Kennel Club : exercice du chiot","https://caninewelfare.centers.purdue.edu/wp-content/uploads/2022/12/Dog-Fitness-and-Exercise.pdf"]]]
];

/* ---------- soucis à travailler ----------
   En plus du programme, la famille choisit jusqu'à 3 soucis. Chaque souci apporte : une explication
   (pourquoi il fait ça), ce qu'il faut vérifier d'abord, un plan, ce qu'il faut éviter, quand appeler
   un pro, des exercices de renfort ajoutés à la journée, et un petit suivi chiffré pour voir les progrès. */
Object.assign(EX,{
r1:{t:"prop",ti:"Toujours sous tes yeux",d:"Pendant les moments libres",s:["Accroche une laisse légère à son harnais et à ta ceinture, ou ferme les portes de la pièce.","Dès qu'il renifle le sol, tourne en rond ou s'éloigne : « On sort ! », gaiement, et dehors.","Quand tu ne peux pas le regarder (douche, cuisine, coup de téléphone) : parc ou caisse, avec un objet à mâcher.","Après 3 jours sans accident, rends-lui une pièce de plus."],h:"Un accident que tu ne vois pas, c'est une occasion ratée de lui montrer où faire.",src:"Kennel Club, AKC"},
r2:{t:"prop",ti:"Accident : le bon réflexe",d:"À chaque accident",s:["Tu le prends sur le fait : dis son prénom ou tape doucement dans tes mains, sans crier, et emmène-le dehors tout de suite.","S'il finit dehors : récompense comme d'habitude.","Tu découvres l'accident après coup : ne dis rien, il ne ferait pas le lien. Éloigne-le pendant que tu nettoies.","Nettoyant enzymatique, puis note l'accident dans le suivi pour repérer le moment à risque."],h:"Le but n'est pas de lui faire peur, c'est d'arriver dehors à temps la prochaine fois.",src:"Kennel Club, Dogs Trust"},
r3:{t:"mors",ti:"La boîte à mâchouilles",d:"Tous les jours",s:["Prépare 4 ou 5 objets différents : Kong fourré, lanière en caoutchouc dur, corde, gant de toilette mouillé roulé puis congelé.","N'en sors que deux par jour : la nouveauté les rend intéressants.","Donne-en un avant chaque sieste et aux heures où il mord le plus.","Il mâche le bon objet : félicite calmement, sans le relancer dans un jeu."],h:"Mâcher le calme et soulage ses gencives. Surveille l'usure et jette ce qui se casse.",src:"AKC, Blue Cross"},
r4:{t:"maison",ti:"Enfants : je deviens un arbre",d:"2 min avec les enfants",s:["Apprends aux enfants le jeu de l'arbre : on s'arrête, on croise les bras contre soi, on regarde ses pieds, on ne parle plus.","Entraînez-vous sans le chiot, comme un jeu, jusqu'à ce que ce soit un réflexe.","Avec le chiot : dès qu'il saute ou mordille un enfant, l'enfant fait l'arbre et un adulte appelle le chiot vers un jouet.","Félicite les enfants chaque fois qu'ils font l'arbre."],h:"Un enfant qui court et crie lance une partie de poursuite. Un arbre, ça n'a rien d'amusant à mordiller.",src:"Blue Cross, Kennel Club"},
r5:{t:"maison",ti:"La routine du coucher",d:"Chaque soir · 20 min",s:["30 min avant le coucher : jeu calme (tapis de fouille, mâchouille), plus de jeu excité.","Dernier pipi, toujours au même endroit, avec le mot du pipi.","Au lit dans la caisse près de toi, avec un objet à mâcher et un tissu qui sent la maison. Toujours la même phrase (« Bonne nuit »).","Lumière éteinte. S'il pleure, main contre la grille et voix basse, sans le sortir pour jouer."],h:"La même suite chaque soir le rassure : il sait ce qui vient ensuite.",src:"Zoopsy, Dogs Trust, CNIB"},
r6:{t:"maison",ti:"Les mini-départs",d:"5 fois par jour · 1 min",s:["Il est occupé dans son parc (mâchouille, Kong). Prends tes clés, sors de la pièce 5 secondes, reviens sans rien dire.","Recommence au fil de la journée en variant les durées : 10 s, 3 s, 20 s, 5 s, 30 s.","Fais aussi les gestes du départ sans partir : chaussures, clés, puis tu te rassieds.","Quand 30 secondes se passent bien, passe à 1 minute, puis 2, puis 5."],h:"On vise des centaines de petites réussites, pas une grande épreuve.",src:"Dogs Trust, RSPCA, PDSA"},
r7:{t:"laisse",ti:"La zone magique",d:"3 min · avant chaque sortie",s:["Au jardin ou dans un couloir : marche, et donne une friandise à côté de ta jambe tous les 2 pas.","Puis tous les 4 pas, puis tous les 6.","Change de rythme : lent, normal, demi-tour. Récompense chaque fois qu'il suit.","Ne pars en balade qu'après : il sait déjà où est la bonne place."],h:"Plus il gagne de friandises à côté de toi, plus cet endroit l'attire.",src:"RSPCA, Dogs Trust"},
r8:{t:"bonus",ti:"Apporte et échange",d:"3 min · 2 fois par jour",s:["Donne-lui un jouet qu'il aime porter. Recule de deux pas en l'appelant gaiement.","Il vient avec le jouet : friandise contre le jouet (« Donne »), puis rends-lui le jouet.","Recommence en reculant plus loin, puis depuis une autre pièce.","Quand il prend un objet interdit, fais exactement pareil : recule, appelle, échange."],h:"Il apprend que t'apporter un objet rapporte gros, au lieu de partir se cacher avec.",src:"Battersea, AKC"},
r9:{t:"bonus",ti:"Le silence qui paie",d:"Toute la journée",s:["Garde des friandises sur toi.","Il aboie pour réclamer : regarde ailleurs, sans un mot.","Dès 2 secondes de silence : « Oui ! » et friandise, ou ce qu'il demandait si c'est raisonnable.","Allonge peu à peu : 3 secondes, puis 5 secondes de calme avant de répondre."],h:"C'est le calme qui obtient les choses, pas le bruit. Au début, ça empire souvent un peu avant de s'améliorer : tiens bon.",src:"Dogs Trust, RSPCA"},
r10:{t:"soc",ti:"Ça annonce du bon",d:"5 min · 1 fois par jour",s:["Place-toi assez loin de ce qui l'inquiète pour qu'il le regarde sans reculer.","Dès qu'il regarde la chose : « Oui ! » et une friandise de grande valeur.","La chose disparaît : plus de friandise. Elle revient : friandises.","Rapproche-toi d'un ou deux pas seulement s'il reste détendu et mange bien."],h:"S'il refuse une friandise qu'il adore, tu es trop près. Recule : ce n'est pas un échec.",src:"AVSAB, Dogs Trust"},
r11:{t:"soc",ti:"Les sons pendant le repas",d:"Pendant 1 repas par jour",s:["Choisis un enregistrement : orage, feux d'artifice, aspirateur, cris d'enfants.","Mets-le tout bas pendant qu'il mange, si bas qu'il ne réagit pas.","Monte d'un cran seulement si les 2 derniers repas se sont passés sans réaction.","Il arrête de manger ou sursaute : reviens au niveau d'avant."],h:"À commencer au moins 6 semaines avant le 14 juillet, le nouvel an ou la saison des orages.",src:"Dogs Trust (Sounds Scary)"},
r12:{t:"nom",ti:"Le rappel d'urgence",d:"2 min · 2 fois par jour",s:["Choisis un mot jamais utilisé (« Ici ! » ou un sifflet) et garde-le pour ça.","Dans la maison, sans distraction : dis le mot, puis aussitôt donne 5 friandises de grande valeur, une par une. Il n'a rien à faire. 10 fois.","Après quelques jours, dis le mot quand il est un peu plus loin : il arrive, jackpot.","Ajoute les distractions très progressivement, toujours avec une longe dehors."],h:"Ce mot ne doit jamais annoncer quelque chose de désagréable.",src:"Toronto Humane Society, Dogs Trust"},
r13:{t:"bonus",ti:"Le menton posé",d:"2 min · 1 fois par jour",s:["Assieds-toi, une main ouverte paume vers le haut devant lui, une friandise dans l'autre main.","Il pose le menton dans ta main, même par hasard : « Oui ! » et friandise.","Allonge à 2, puis 5 secondes, pendant que l'autre main touche une oreille ou une patte.","S'il retire la tête, tu arrêtes tout : c'est lui qui dit stop."],h:"Il donne son accord pour les soins. Brossage, griffes et vétérinaire deviennent beaucoup plus simples.",src:"Kennel Club, ASPCA"},
r14:{t:"bonus",ti:"Le tapis du repas",d:"Pendant chaque repas de la famille",s:["Avant de vous installer : pipi, puis son tapis à 2 ou 3 m du canapé ou de la table, et un Kong fourré avec une partie de sa ration.","Les premiers jours, un adulte lance une croquette sur le tapis toutes les 10 à 20 secondes tant qu'il y reste. Puis toutes les 30 secondes, puis toutes les minutes.","Il quitte le tapis pour réclamer : sans un mot ni un regard, ramène-le doucement par le harnais, ou lève-toi et barre-lui le passage avec ton corps. Croquette dès qu'il est de nouveau dessus.","Repas fini, assiettes rangées : grosse récompense sur le tapis, puis « OK », il est libre."],h:"Les premiers soirs, le repas est un peu bricolé. Après une ou deux semaines, il va tout seul sur son tapis quand vous vous installez.",src:"Dogs Trust (settle), Battersea (bed command)"},
r15:{t:"maison",ti:"La table basse, on n'y touche pas",d:"2 min · 2 fois par jour, hors repas",s:["Pose une assiette avec un aliment peu tentant (pain sec) sur la table basse. Lui en laisse, toi à côté.","Il regarde l'assiette sans y aller, ou il te regarde : « Oui ! » et une friandise de grande valeur, donnée par toi, loin de la table.","Il approche la truffe ou pose les pattes : barre-lui le passage avec la main ou le corps, sans gronder, et récompense dès qu'il recule.","Puis assiette plus tentante, toi un peu plus loin, et enfin pendant que vous êtes assis sur le canapé."],h:"Il apprend que la nourriture de la table ne vient jamais de la table, mais de toi quand il l'ignore. C'est « Laisse ça » appliqué au salon.",src:"Dogs Trust, RSPCA"}
});

/* log.k : "down" = on veut voir le chiffre baisser, "up" = monter. */
const ISSUES=[
 {id:"proprete",t:"prop",ti:"Pipi ou caca à l'intérieur",log:{q:"Accidents à l'intérieur",k:"down"},
  why:"Avant 4 à 6 mois, sa vessie est petite et il ne sait pas encore prévenir. Les accidents viennent presque toujours de sorties trop espacées, d'un moment sans surveillance ou d'une odeur restée au sol.",
  first:["Accidents soudains alors qu'il était propre, pipis très fréquents, sang ou odeur forte : vétérinaire (infection urinaire possible).","Il fait juste après être rentré : il n'avait pas fini. Reste dehors plus longtemps, sans jouer, et attends.","Il fait pipi quand on rentre ou qu'on se penche sur lui : c'est un pipi d'émotion. Accueil très calme, accroupi de côté, et ça passe avec l'âge."],
  plan:["Pendant 7 jours, le planning ajoute un pipi de sécurité au milieu de chaque période d'éveil.","Surveillance totale : soit sous tes yeux, soit dans son parc. Jamais libre seul dans la maison.","Note chaque accident ici. Après 3 jours, on voit le moment à risque et on avance la sortie.","Récompense dehors, dans les 2 secondes, avec une friandise de grande valeur.","Nettoyant enzymatique sur chaque accident, même ancien."],
  avoid:["Gronder ou lui mettre le nez dedans : il apprend à se cacher pour faire","Laisser la porte ouverte en espérant qu'il sorte seul","Les tapis éducateurs dans la maison si le but est le jardin"],
  pro:"Toujours des accidents après 6 mois malgré le plan, ou des pipis d'émotion qui ne diminuent pas : vétérinaire, puis éducateur.",
  ex:["r1","r2","p2","p3"],src:"Kennel Club, AKC, Dogs Trust"},
 {id:"mord",t:"mors",ti:"Il mord ou mordille fort",log:{q:"Crises de mordillement",k:"down"},
  why:"Un chiot explore avec sa gueule et soulage ses dents. Ça empire quand il est fatigué ou trop excité, et quand le jeu avec les mains a été récompensé sans le vouloir. Le golden, chien de rapport, a un grand besoin de porter et de mâcher.",
  first:["Regarde l'heure des crises : très souvent en fin de journée ou après plus d'une heure d'éveil. C'est de la fatigue : sieste.","Morsure avec grognement, corps raide, regard fixe, ou quand on le touche ou qu'il mange : ce n'est plus du jeu. Demande un avis pro."],
  plan:["Respecte les siestes du planning : c'est la mesure la plus efficace.","Un jouet à la main chaque fois que tu l'approches pour jouer ou le caresser.","Une dent sur la peau : mains immobiles, tu te détournes. S'il continue, tu sors 20 à 30 secondes derrière la barrière.","Des objets à mâcher sûrs et variés, donnés avant chaque sieste.","Note les crises ici pour voir si ça baisse."],
  avoid:["Taper la truffe, pincer, plaquer au sol, tenir par la peau du cou","Les jeux de mains et les chatouilles","Courir en criant (les enfants) : il prend ça pour une chasse"],
  pro:"Il mord plus fort après 5 ou 6 mois, ou les enfants ont peur de lui : éducateur canin en méthodes positives ou vétérinaire comportementaliste.",
  ex:["r3","m2","m3","r4"],src:"Dogs Trust, Blue Cross, Zoopsy"},
 {id:"nuit",t:"maison",ti:"Il pleure la nuit",log:{q:"Réveils avec pleurs",k:"down"},
  why:"Les premières nuits, il dort loin de sa mère et de sa portée pour la première fois. Pleurer est un appel. Il peut aussi avoir besoin de faire pipi : à cet âge, c'est normal.",
  first:["Il pleure 2 à 3 heures après le coucher : c'est souvent un pipi. Sors-le en silence, puis retour au lit.","Il pleure dès que tu quittes la pièce : il a besoin de proximité, pas d'être endurci."],
  plan:["Caisse ou parc à côté de ton lit les premières semaines.","Routine du coucher identique chaque soir : le planning l'ajoute 30 minutes avant le coucher.","S'il pleure : une main contre la grille et une voix douce suffisent souvent. On ne le sort pas pour jouer.","Sortie de nuit en silence, sans lumière forte, puis retour au lit.","Quand les nuits sont calmes une semaine, éloigne la caisse de 50 cm à 1 m par semaine."],
  avoid:["Le laisser pleurer seul des heures pour qu'il s'habitue","Le prendre dans ton lit si tu ne veux pas que ça dure","Les grosses séances de jeu juste avant le coucher"],
  pro:"Pleurs intenses toutes les nuits après 2 ou 3 semaines malgré la caisse près du lit : parles-en au vétérinaire.",
  ex:["r5","c1"],src:"Zoopsy, Dogs Trust, CNIB"},
 {id:"seul",t:"maison",ti:"Il pleure ou casse quand il est seul",log:{q:"Minutes seul et calme",k:"up"},
  why:"Être seul ne va pas de soi pour un chiot : ça s'apprend par toutes petites étapes. Le golden, très tourné vers sa famille, y est sensible.",
  first:["Filme-le quand tu pars. Quelques pleurs puis il s'endort : c'est bien parti. Halètement, grattage de la porte, pipis, hurlements continus : il panique, on recule d'une étape.","Il ne pleure que quand la porte se ferme : commence avec une barrière bébé."],
  plan:["Des absences si courtes qu'il ne s'en rend pas compte, plusieurs fois par jour.","Avant chaque absence : pipi, un peu de dépense, puis Kong fourré ou tapis de fouille.","Départ et retour sans cérémonie.","N'allonge que si les 3 dernières absences étaient calmes.","Note ici la plus longue absence calme de la journée."],
  avoid:["Revenir pendant qu'il pleure fort : attends 2 secondes de calme","Les longues absences le premier mois","Gronder une bêtise découverte au retour"],
  pro:"Signes de panique (halètement, bave, pipis, griffures sur la porte) : vétérinaire comportementaliste. L'anxiété de séparation se traite mieux tôt.",
  ex:["r6","s1","s2"],src:"Dogs Trust, RSPCA, PDSA"},
 {id:"saute",t:"maison",ti:"Il saute sur les gens",log:{q:"Sauts sur quelqu'un",k:"down"},
  why:"Il saute pour atteindre les visages : c'est sa façon de dire bonjour. Chaque fois que quelqu'un lui parle, le regarde ou le caresse pendant qu'il saute, il apprend que ça marche.",
  first:["Qui le récompense sans le vouloir ? Souvent les invités et les enfants.","Il saute surtout quand on rentre : les retours sont trop excitants. On les calme d'abord."],
  plan:["Règle commune : 4 pattes au sol = attention. Il saute = on se tourne.","Apprends-lui « Touche » : un bonjour poli qu'il peut faire à la place.","Avec les invités : il est en laisse, pied sur la laisse, et l'invité ne dit bonjour que quand il est assis.","Accueil calme au retour, à sa hauteur."],
  avoid:["Le repousser avec les mains ou le genou : pour lui, c'est un jeu","Crier « non » en le regardant"],
  pro:"Rarement nécessaire. Un éducateur peut aider si les sauts sont violents ou visent les enfants.",
  ex:["j1","b5","b2"],src:"Nevada SPCA, Dogs Trust, AKC"},
 {id:"laisse",t:"laisse",ti:"Il tire en laisse",log:{q:"Note de la balade (1 à 5)",k:"up",max:5},
  why:"Il tire parce que ça l'a déjà fait avancer, et parce que dehors tout est passionnant. À 30 kg, ce sera un vrai problème : c'est maintenant qu'on l'évite.",
  first:["Harnais bien ajusté (deux doigts sous les sangles) et laisse fixe de 2 m. Pas d'enrouleur.","Il tire surtout en début de balade : il est trop excité. 5 minutes de jeu calme au jardin avant."],
  plan:["La zone magique avant chaque sortie : il commence en sachant où est la bonne place.","Laisse tendue : tu t'arrêtes. Laisse détendue : on repart.","Des balades courtes où le but est de renifler, pas d'aller loin.","Note chaque balade de 1 à 5 : ça monte en quelques semaines."],
  avoid:["Les à-coups sur la laisse","Les colliers étrangleurs ou à pointes","Les longues balades avant la fin de la croissance"],
  pro:"Il se jette sur les chiens ou les vélos en aboyant : éducateur en méthodes positives.",
  ex:["r7","l4","l5"],src:"RSPCA, Dogs Trust, AVSAB"},
 {id:"vol",t:"bonus",ti:"Il vole des objets ou mange tout dehors",log:{q:"Objets volés",k:"down"},
  why:"Un golden aime porter. Prendre une chaussette et voir toute la famille courir derrière lui, c'est le meilleur jeu du monde. Dehors, il goûte tout pour découvrir.",
  first:["Il grogne ou se fige quand on approche de l'objet : voir le souci « Il grogne près de sa gamelle ou d'un objet ».","Il avale des cailloux, du tissu ou des objets : danger d'occlusion. Parles-en au vétérinaire."],
  plan:["Ne cours jamais après lui : recule, appelle, propose un échange.","Échange toujours contre mieux, et rends l'objet quand il n'est pas dangereux.","Range chaussettes, chaussures et jouets des enfants hors de portée pendant quelques mois.","Donne-lui un travail de chien de rapport : porter son jouet, rapporter, chercher."],
  avoid:["Le poursuivre","Lui ouvrir la gueule de force","Gronder quand il t'apporte un objet : il ne te l'apportera plus"],
  pro:"Il avale régulièrement des objets non comestibles : vétérinaire.",
  ex:["r8","m3","b7"],src:"Battersea, AKC, Dogs Trust"},
 {id:"mache",t:"mors",ti:"Il mâchouille les meubles",log:{q:"Dégâts",k:"down"},
  why:"Entre 3 et 7 mois, ses dents définitives poussent et mâcher le soulage. L'ennui et la fatigue font le reste. Il ne fait pas la différence entre un pied de chaise et un bâton.",
  first:["Ça arrive quand il est seul ou pas surveillé : c'est une question d'organisation, pas d'éducation.","Il mâche surtout en fin de journée : il a besoin de dormir."],
  plan:["Quand tu ne surveilles pas : parc ou caisse, avec ses objets à mâcher.","La boîte à mâchouilles : deux objets différents chaque jour.","Il mâche un meuble : interromps doucement, propose un objet autorisé, félicite quand il le prend.","Plus de flair et de jeux de tête : un chiot occupé mâche moins."],
  avoid:["Gronder après coup","Lui donner de vieilles chaussures (il ne fera pas la différence avec les neuves)"],
  pro:"Destructions uniquement quand il est seul, avec pleurs ou halètement : voir le souci « Il pleure ou casse quand il est seul ».",
  ex:["r3","r1","b7"],src:"Blue Cross, AKC, Dogs Trust"},
 {id:"aboie",t:"bonus",ti:"Il aboie ou réclame",log:{q:"Épisodes d'aboiement",k:"down"},
  why:"Il aboie pour demander (attention, jeu, nourriture), par ennui, pour alerter, ou parce qu'il a peur. La réponse dépend de la raison.",
  first:["Il aboie en te regardant : il réclame. Vers la fenêtre ou la porte : il alerte. En reculant : il a peur (voir le souci « Il a peur »).","Il aboie dans sa caisse : besoin de pipi, ou il n'est pas encore à l'aise dedans."],
  plan:["Réclamation : pas de réponse tant qu'il aboie, réponse dès 2 secondes de silence.","Anticipe les moments où il réclame (repas des humains, appels) avec une mâchouille.","Alerte : « Merci ! », appelle-le vers toi, friandise. Occulte le bas des fenêtres si besoin.","Apprends-lui à se poser sur sa couverture."],
  avoid:["Crier « tais-toi » : pour lui, tu aboies avec lui","Les colliers anti-aboiement"],
  pro:"Aboiements de peur ou en ton absence qui durent : vétérinaire comportementaliste.",
  ex:["r9","b4"],src:"Dogs Trust, RSPCA, AVSAB"},
 {id:"peur",t:"soc",ti:"Il a peur (bruits, gens, voiture…)",log:{q:"Frayeurs",k:"down"},
  why:"Jusqu'à 16 semaines, tout ce qu'il découvre en sécurité devient normal pour lui. Une peur mal gérée peut grandir. On ne force jamais : on joue sur la distance.",
  first:["Signes de peur : queue basse, oreilles en arrière, il recule, se fige, se lèche les babines, refuse une friandise qu'il aime.","Il refuse la friandise : tu es trop près. Éloigne-toi."],
  plan:["Repère ce qui lui fait peur et note-le.","Place-toi à la distance où il remarque la chose mais mange encore : friandise chaque fois qu'il la voit ou l'entend.","Rapproche-toi très lentement, sur plusieurs jours.","Laisse-le choisir d'approcher : ne le porte pas vers ce qui lui fait peur.","Pour les bruits : enregistrement très bas pendant les repas, un peu plus fort au fil des jours."],
  avoid:["Le forcer ou le porter vers ce qui fait peur","Le gronder parce qu'il aboie ou recule","Le plonger dans la foule pour qu'il s'habitue"],
  pro:"Peur qui augmente, panique, grognements : vétérinaire comportementaliste rapidement. La période sensible est courte.",
  ex:["r10","r11"],src:"AVSAB, Dogs Trust"},
 {id:"rappel",t:"nom",ti:"Il ne revient pas quand on l'appelle",log:{q:"Rappels réussis",k:"up"},
  why:"Revenir doit toujours valoir plus que ce qu'il est en train de faire. Souvent, le rappel a été gâché sans le vouloir : on l'appelle pour rentrer, pour le bain, pour gronder.",
  first:["Son nom ou « viens » est-il souvent suivi de quelque chose de désagréable ? Si oui, change de mot.","Tu répètes l'appel plusieurs fois : il apprend qu'il peut attendre."],
  plan:["Choisis un mot de rappel tout neuf et ne le dis que si tu es presque sûr qu'il viendra. Sinon, va le chercher.","Chaque retour : jackpot de 5 friandises, fête, puis il repart jouer.","Dehors, longe de 5 à 10 m tant que le rappel n'est pas fiable.","Note les rappels réussis de la journée."],
  avoid:["L'appeler pour finir la balade ou pour un moment qu'il n'aime pas","Le gronder quand il revient, même en retard","Le lâcher en terrain ouvert trop tôt"],
  pro:"Rarement nécessaire. Un éducateur aide si l'instinct de chasse prend le dessus.",
  ex:["r12","n6","n5"],src:"Toronto Humane Society, Dogs Trust"},
 {id:"garde",t:"bonus",ti:"Il grogne près de sa gamelle ou d'un objet",log:{q:"Grognements",k:"down"},
  why:"Protéger ce qui est précieux est naturel. Si on lui reprend souvent sa gamelle ou ses trésors, il apprend à les défendre. Ça se prévient bien, mais un grognement est un message à respecter.",
  first:["Ne punis jamais un grognement : c'est un avertissement. Sans lui, il mordrait directement.","Avec des enfants : jamais près de lui quand il mange ou mâche, pendant toute la durée du travail."],
  plan:["Laisse-le manger au calme, dans un coin à lui ou dans son parc.","Gamelle zen : passe à distance, lance un morceau de poulet, éloigne-toi.","Échange les objets contre mieux, et rends-les.","Objet dangereux à récupérer : lance des friandises plus loin et ramasse l'objet pendant qu'il mange."],
  avoid:["Lui prendre sa gamelle pour lui montrer qui commande","Mettre la main dans sa gamelle pendant qu'il mange","Le punir de grogner"],
  pro:"Grognement, corps figé ou morsure autour de la nourriture ou d'un objet : un professionnel dès maintenant (vétérinaire comportementaliste ou éducateur en méthodes positives), surtout avec des enfants.",
  ex:["b10","m3","r8"],src:"Battersea, AKC, Dogs Trust"},
 {id:"soins",t:"bonus",ti:"Il refuse le brossage ou les soins",log:{q:"Note de la séance (1 à 5)",k:"up",max:5},
  why:"Être tenu et manipulé n'a rien de naturel pour lui. Un golden aura besoin de brossage, de griffes coupées, d'oreilles nettoyées et de vétérinaire toute sa vie : autant en faire un moment agréable.",
  first:["Il a mal quelque part (oreille, patte) : il refuse qu'on y touche. Vétérinaire.","Tu le brosses quand il est très éveillé : choisis un moment de fatigue, avant la sieste."],
  plan:["Séances d'une minute, juste avant une sieste.","Un geste, une friandise.","Il se tortille : reviens à un geste plus facile.","Un tapis de léchage avec du fromage frais pendant le brossage.","Note chaque séance de 1 à 5."],
  avoid:["Le tenir de force jusqu'au bout","Les longues séances de toilettage au début"],
  pro:"Il grogne ou mord pendant les soins : vétérinaire, pour vérifier une douleur, puis éducateur.",
  ex:["r13","b6"],src:"Kennel Club, ASPCA, AKC"},
 {id:"table",t:"bonus",ti:"Il réclame pendant nos repas ou monte sur la table",log:{q:"Fois où il a réclamé ou visé la table",k:"down"},
  why:"Il a appris que réclamer rapporte : une miette, un bout de croûte, ou simplement de l'attention, même un « non ! ». Quand ça marche une fois sur dix, c'est encore plus tenace qu'à chaque fois. Une table basse est pile à hauteur de truffe, et un golden est très gourmand.",
  first:["Toute la famille arrête de donner à table, enfants compris, même « juste un petit bout ». Une seule exception relance tout.","Il a faim à l'heure de votre repas ? Garde une partie de sa ration pour un Kong à ce moment-là.","Ce qui traîne sur une table basse peut être dangereux pour lui : oignon, ail, chocolat, raisin, os cuits, plats salés."],
  plan:["Avant chaque repas : pipi, puis son tapis avec un Kong fourré, à 2 ou 3 m de vous.","Au début, des croquettes lancées sur le tapis toutes les 10 à 20 secondes tant qu'il y reste, puis de plus en plus espacées.","Il vient réclamer ou vise la table : pas un mot, pas un regard. On le ramène au tapis ou on lui barre le passage, et on récompense dès qu'il y est.","En dehors des repas, l'exercice de la table basse : il apprend à l'ignorer.","Tant que ce n'est pas acquis, pendant les repas devant la télé : parc ou barrière avec son Kong, ou repas à la grande table quelques semaines."],
  avoid:["Donner depuis l'assiette ou la table, même une fois","Le repousser ou répéter « non » : c'est de l'attention","Laisser des assiettes sur la table basse sans surveillance","Le punir après coup s'il a volé quelque chose"],
  pro:"Il grogne ou se fige quand on approche alors qu'il a attrapé de la nourriture : voir le souci « Il grogne près de sa gamelle ou d'un objet » et demande l'avis d'un professionnel.",
  ex:["r14","r15","b4","b7"],src:"Dogs Trust, Battersea, RSPCA, ASPCA"},
 {id:"enfants",t:"maison",ti:"Il s'excite avec les enfants",log:{q:"Moments trop excités",k:"down"},
  why:"Les enfants bougent vite, crient et courent : pour un chiot, ce sont des compagnons de jeu parfaits, qu'il traite comme d'autres chiots, avec les dents.",
  first:["Les moments à risque : retour de l'école, jeux de course, goûter. Prévois le parc à ces moments-là.","Les enfants ont-ils peur de lui ? Si oui, on avance plus doucement."],
  plan:["Les enfants apprennent à faire l'arbre.","Des rôles positifs pour eux : distribuer les friandises du rappel, faire « Touche », préparer le Kong.","Barrière ou parc dès que l'excitation monte, avant que ça dégénère.","Toujours un adulte présent."],
  avoid:["Les jeux de poursuite","Le porter partout","Le laisser seul avec un jeune enfant"],
  pro:"Un enfant a été mordu ou a peur de lui : éducateur canin en méthodes positives.",
  ex:["r4","e1","b5"],src:"Blue Cross, Kennel Club, Battersea"}
];
const MAX_ISSUES=3;
function issueById(id){return ISSUES.find(x=>x.id===id)}
// Renfort du jour pour un souci : ses exercices en rotation.
function issueEx(id,dIdx,exclude){
  const i=issueById(id); if(!i) return null;
  const c=i.ex.filter(x=>!(exclude||[]).includes(x)), l=c.length?c:i.ex;
  return l[dIdx%l.length];
}

/* ---------- dangers selon le lieu et la saison ----------
   Le département vient du code postal. Les zones sont larges et indicatives. */
const ZONES={
  leish:"04 05 06 07 09 11 12 13 26 30 31 32 34 46 48 66 81 82 83 84 2A 2B",
  sud:"04 05 06 07 09 11 12 13 24 26 30 31 32 33 34 40 46 47 48 64 65 66 81 82 83 84 2A 2B",
  mer:"06 11 13 14 17 22 29 30 33 34 35 40 44 50 56 59 62 64 66 76 80 83 85 2A 2B",
  montagne:"01 04 05 06 07 09 15 25 26 31 38 39 43 48 63 64 65 66 68 73 74 88 90 2A 2B",
  tiques:"03 09 12 15 16 17 19 23 24 31 32 33 40 43 46 47 63 64 65 79 81 82 86 87",
  nordest:"02 08 54 55 57 59 62 67 68 80 88"
};
function depOf(cp){
  cp=String(cp||"").trim();
  if(!/^\d{5}$/.test(cp)) return null;
  if(cp.startsWith("20")) return +cp.slice(0,3)<202?"2A":"2B";
  if(cp.startsWith("97")) return cp.slice(0,3);
  return cp.slice(0,2);
}
function zonesOf(dep){const z={};Object.keys(ZONES).forEach(k=>z[k]=!!dep&&ZONES[k].split(" ").includes(dep));return z}

/* m : mois concernés (1-12). w(z) : vrai si le risque concerne la zone. lvl(z) : 2 = fort, 1 = à connaître. */
const RISKS=[
 {id:"proc",ti:"Chenilles processionnaires",m:[1,2,3,4,5],w:z=>!z.nordest,lvl:z=>z.sud?2:1,
  tx:"Elles descendent des pins (et des chênes) en file indienne. Un chiot curieux qui les renifle ou les lèche peut perdre une partie de la langue.",
  do:["Laisse courte près des pins, surtout en fin d'hiver et au printemps","Contact : rince la gueule à l'eau froide sans frotter, mains protégées, et file chez le vétérinaire","Signes : salive abondante, langue gonflée, il se frotte la gueule"],src:"République et canton de Genève"},
 {id:"epillet",ti:"Épillets",m:[5,6,7,8,9,10],w:()=>true,lvl:z=>z.sud?2:1,
  tx:"Ces petits épis d'herbe sèche s'accrochent au poil et migrent dans les oreilles, entre les doigts, dans le nez. Les oreilles tombantes du golden y sont exposées.",
  do:["Évite les hautes herbes sèches","Après chaque balade : oreilles, entre les doigts, truffe, yeux","Il secoue la tête d'un coup, éternue sans arrêt ou boite : vétérinaire le jour même"],src:"Ville de Lyon"},
 {id:"chaleur",ti:"Chaleur et coup de chaleur",m:[6,7,8,9],w:()=>true,lvl:z=>z.sud?2:1,
  tx:"Un chiot régule mal sa température, et le bitume brûle les coussinets.",
  do:["Sorties tôt le matin et tard le soir","Ombre et eau fraîche à volonté","Jamais seul dans une voiture, même quelques minutes","Test du dos de la main : si le sol est trop chaud pour ta main 5 secondes, il l'est pour ses pattes"],src:"PDSA, RSPCA"},
 {id:"tiques",ti:"Tiques et piroplasmose",m:[3,4,5,6,9,10,11],w:()=>true,lvl:z=>z.tiques?2:1,
  tx:"Les tiques transmettent la piroplasmose, une maladie grave du sang. Elles sont surtout actives au printemps et à l'automne.",
  do:["Antiparasitaire adapté à son âge et son poids : demande à ton vétérinaire","Inspection après chaque balade, retrait avec un tire-tique","Urines foncées, fièvre, abattement dans les 3 semaines après une tique : vétérinaire en urgence"],src:"Conseils vétérinaires courants"},
 {id:"leish",ti:"Leishmaniose",m:[4,5,6,7,8,9,10],w:z=>z.leish,lvl:()=>2,
  tx:"Maladie grave transmise par un petit moucheron (le phlébotome), présente surtout dans le sud de la France, d'avril à octobre. Il pique surtout du crépuscule à l'aube.",
  do:["Demande à ton vétérinaire quelle protection convient à son âge (répulsif, collier, vaccin)","Évite les sorties longues au crépuscule pendant la saison","Il dort à l'intérieur la nuit"],src:"Santé publique France"},
 {id:"cyano",ti:"Rivières et lacs : cyanobactéries",m:[6,7,8,9],w:()=>true,lvl:z=>z.sud?2:1,
  tx:"Des algues microscopiques produisent des toxines mortelles pour les chiens, surtout dans les eaux calmes et chaudes. Des chiens en meurent chaque été en France, y compris dans le Vaucluse.",
  do:["Pas de baignade ni de boisson dans une eau verdâtre, trouble ou avec de la mousse","Respecte les panneaux et les alertes de l'ARS","Tremblements, perte d'équilibre, bave après une baignade : vétérinaire immédiatement"],src:"ARS, syndicats de rivière"},
 {id:"mer",ti:"Plage",m:[5,6,7,8,9],w:z=>z.mer,lvl:()=>1,
  tx:"L'eau de mer bue en quantité le rend malade, le sable chaud brûle, et beaucoup de plages sont interdites aux chiens l'été.",
  do:["Eau douce avec toi, et empêche-le de boire l'eau de mer","Rince le sel et le sable au retour","Vérifie les plages autorisées aux chiens auprès de la mairie"],src:"Conseils vétérinaires courants"},
 {id:"montagne",ti:"Montagne : patous et troupeaux",m:[5,6,7,8,9,10],w:z=>z.montagne,lvl:()=>1,
  tx:"Les chiens de protection des troupeaux (patous) voient ton chiot comme une menace pour leurs brebis.",
  do:["En laisse à l'approche d'un troupeau","Contourne largement, ralentis, ne cours pas","Un patou approche : arrête-toi, reste calme, ne le fixe pas"],src:"FFRandonnée"},
 {id:"vipere",ti:"Vipères",m:[4,5,6,7,8,9],w:()=>true,lvl:z=>(z.sud||z.montagne)?2:1,
  tx:"Un chiot curieux met sa truffe dans les buissons et les tas de pierres. Une morsure est toujours une urgence.",
  do:["En laisse dans les zones de pierres, de broussailles et de hautes herbes","Morsure : porte-le, garde-le calme, appelle le vétérinaire en route","Pas de garrot, pas d'incision, ne suce pas la plaie"],src:"Conseils vétérinaires courants"},
 {id:"chasse",ti:"Saison de la chasse",m:[9,10,11,12,1,2],w:()=>true,lvl:()=>1,
  tx:"En forêt et dans la garrigue, les battues ont lieu surtout le week-end et le mercredi selon les communes.",
  do:["Harnais ou gilet de couleur vive","En laisse ou en longe en forêt","Renseigne-toi sur les jours de chasse de ta commune"],src:"Conseils de prudence courants"},
 {id:"laurier",ti:"Laurier-rose et plantes du jardin",m:[1,2,3,4,5,6,7,8,9,10,11,12],w:z=>z.sud,lvl:()=>2,
  tx:"Très présent dans les jardins du Midi, le laurier-rose est toxique dans toutes ses parties, comme le cycas et l'if.",
  do:["Repère ces plantes dans ton jardin et chez les proches","Empêche-le de mâchouiller feuilles et branches tombées","Il en a mangé : vétérinaire ou centre antipoison (CNITV : 04 78 87 10 40)"],src:"ASPCA, CNITV"},
 {id:"fetes",ti:"Pétards et feux d'artifice",m:[6,7,12,1],w:()=>true,lvl:()=>1,
  tx:"Le 14 juillet et le nouvel an font peur à beaucoup de chiens. Un chiot préparé à l'avance s'en sort bien mieux.",
  do:["Commence l'exercice « Les sons pendant le repas » 6 semaines avant","Ce soir-là : à l'intérieur, volets fermés, musique, son coin à lui","Pipi en laisse avant la nuit : un chiot effrayé peut s'enfuir"],src:"Dogs Trust (Sounds Scary)"},
 {id:"choco",ti:"Chocolat et fêtes",m:[12,1,3,4],w:()=>true,lvl:()=>1,
  tx:"Noël et Pâques : chocolat, raisins secs, xylitol des confiseries et pâte crue traînent partout.",
  do:["Rien sur les tables basses ni sous le sapin","Les enfants rangent leurs chocolats","Il en a mangé : appelle le vétérinaire avec le poids du chiot et ce qu'il a mangé"],src:"ASPCA, CNITV"}
];
function risksFor(cp,month){
  const z=zonesOf(depOf(cp));
  return RISKS.filter(r=>r.w(z)).map(r=>Object.assign({},r,{now:r.m.includes(month),level:r.lvl(z)}))
    .sort((a,b)=>(b.now-a.now)||(b.level-a.level));
}

/* ---------- dates ---------- */
// Toujours passer par addDays (new Date(y,m,d+n)) : getTime()+n*86400000 décale d'un jour au changement d'heure.
const DAY=86400000;
function parse(s){const p=(s||"").split("-").map(Number);return p.length===3&&p[0]?new Date(p[0],p[1]-1,p[2]):null}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function midnight(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function addDays(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)}
function daysBetween(a,b){return Math.round((midnight(b)-midnight(a))/DAY)}
function hm(s,def){const m=/^(\d{1,2}):(\d{2})$/.exec(s||"");return m?(+m[1])*60+(+m[2]):def}
function fmtMin(m){m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,"0")+"h"+String(m%60).padStart(2,"0")}

function dayInfo(date,pup){
  const arr=parse(pup.arrival)||midnight(new Date()), birth=parse(pup.birth);
  const dIdx=Math.max(0,daysBetween(arr,date));
  const week=Math.min(12,Math.floor(dIdx/7)+1);
  const ageDays=birth?daysBetween(birth,date):null;
  return {dIdx,week,ageDays,ageW:ageDays!=null?Math.floor(ageDays/7):null,ageM:ageDays!=null?ageDays/30.44:null};
}
function itemsFor(date,pup){const w=dayInfo(date,pup).week-1;return SLOTS.map(k=>PLAN[k][w])}

/* ---------- planning de la journée ----------
   Rythmes selon l'âge (en semaines) : éveil, sieste, nombre de repas, sorties de nuit.
   Repères : AKC (18-20 h de sommeil), Zoopsy (3-4 repas à heures fixes), CNIB / Guide Dogs (pipi au réveil,
   après repas, jeu, sieste), Dogs for Good (sorties de nuit qu'on espace peu à peu). */
function rhythm(ageW){
  if(ageW==null) ageW=10;
  return {
    awake: ageW<12?60:ageW<16?75:ageW<26?105:150,
    nap: ageW<26?90:75,
    meals: ageW<12?4:ageW<26?3:2,
    night: ageW<10?2:ageW<14?1:0,
    session: ageW<16?3:5
  };
}

/* Événements de la journée `date` (minutes depuis minuit ; la nuit peut dépasser 1440).
   cat : repas | pipi | educ (éducation et jeux) | sieste | nuit */
function dayPlan(date,pup){
  const info=dayInfo(date,pup), r=rhythm(info.ageW);
  const W=hm(pup.wake,420), B=Math.max(hm(pup.bed,1350),W+600);
  const N=pup.name||"ton chiot";
  const issues=(pup.issues||[]).filter(issueById).slice(0,MAX_ISSUES);
  const has=id=>issues.includes(id);
  const renforts=issues.map(id=>issueEx(id,info.dIdx,itemsFor(date,pup))).filter(x=>x&&!itemsFor(date,pup).includes(x));
  const exIds=itemsFor(date,pup).concat([...new Set(renforts)]);
  const soc=SOC[info.dIdx%SOC.length], game=GAMES[info.dIdx%GAMES.length];
  const zen=PLAN.bonus.indexOf("b10")<info.week; // la gamelle zen est vue en semaine 4
  const ev=[];
  const add=(m,cat,ti,tx,extra)=>ev.push(Object.assign({m:Math.round(m),cat,ti,tx:tx||""},extra||{}));

  // Cycles éveil + sieste, du lever jusqu'au coucher.
  const cycles=[];
  // Avec des heures de repas imposées, on cale les siestes pour qu'un repas tombe toujours pendant un éveil.
  const fixedMeals=customMeals(pup);
  for(let t=W;t<B-30;){
    let end=Math.min(t+r.awake,B), next=end+r.nap;
    const ml=fixedMeals.find(m=>m>end-15&&m<next+10);
    if(ml!=null){
      if(ml-10-end>=45) next=ml-10;               // sieste raccourcie : on se réveille 10 min avant le repas
      else {end=Math.min(Math.max(end,ml+30),B);next=end+r.nap}  // sinon on mange avant la sieste
    }
    const last=end+r.nap+20>=B;
    cycles.push({start:t,end,last});
    if(last) break;
    t=next;
  }
  // Repas : heures choisies par la famille (pup.meals), sinon répartis régulièrement sur les cycles
  // qui commencent avant 18h30 (et 3 h 30 avant le coucher).
  const custom=fixedMeals;
  let nm;
  if(custom.length){
    nm=custom.length;
    custom.forEach((mt,k)=>{
      let i=cycles.length-1;
      for(let j=0;j<cycles.length;j++){if(cycles[j].start>mt){i=Math.max(0,j-1);break}}
      cycles[i].mealAt=cycles[i].mealAt||[];cycles[i].mealAt.push({m:mt,k:k+1});
    });
  } else {
    const lastMeal=Math.min(1110,B-210);
    const eligible=cycles.map((c,i)=>i).filter(i=>cycles[i].start<=lastMeal);
    nm=Math.min(r.meals,eligible.length);
    for(let k=0;k<nm;k++){
      const i=eligible[nm===1?0:Math.round(k*(eligible.length-1)/(nm-1))];
      cycles[i].mealAt=[{m:cycles[i].start+10,k:k+1}];
    }
  }
  // Séances : les 6 exercices du jour répartis à tour de rôle sur les cycles.
  const extras=["soc","game","walk","handle","chew"];
  cycles.forEach((c,i)=>{
    const first=i===0;
    add(c.start,"pipi",first?"Lever : pipi tout de suite":"Fin de sieste : pipi dehors",first?"Porte-le ou guide-le dehors sans attendre, avant de lui dire bonjour longuement. Mot du pipi, friandise.":"Dès qu'il se réveille, dehors. Mot du pipi, friandise, puis on rentre.");
    let t=c.start+10;
    (c.mealAt||[]).forEach(ml=>{
      add(ml.m,"repas","Repas "+ml.k+" sur "+nm,(zen?"Gamelle zen : « Assis », gamelle posée, « OK ». ":"")+"Ration pesée, moins les croquettes gardées pour l'éducation. On le laisse manger tranquille.");
      add(ml.m+15,"pipi","Pipi / caca après le repas","La crotte arrive souvent 10 à 30 min après le repas : reste dehors avec lui, mot de la crotte, friandise.");
      if(ml.m<=t+5&&ml.m+25<c.end) t=Math.max(t,ml.m+25); // repas en début d'éveil : la séance vient après
    });
    const ids=exIds.filter((_,k)=>k%cycles.length===i);
    const x=extras[i%extras.length];
    const xTxt=x==="soc"?"Découverte du jour : "+soc+"."
      :x==="game"?"Jeu du jour : "+game.ti+"."
      :x==="walk"?"Petite sortie renifle au calme, sur sol souple, quelques minutes."
      :x==="handle"?"Manipulation douce et brossage, quelques minutes."
      :"Jeu libre avec un jouet, puis un objet à mâcher pour redescendre.";
    if(c.end-t>=10){
      const names=ids.map(id=>EX[id].ti.replace(/\{N\}/g,N));
      add(t,"educ",names.length?"Éducation : "+names.join(" + "):"Jeu et découverte",(names.length?"Séance de "+r.session+" min, 5 réussites et on arrête. ":"")+xTxt,{ex:ids});
    }
    // Souci « propreté » : un pipi de sécurité au milieu de chaque éveil.
    if(has("proprete")&&c.end-c.start>=50){
      const mid=Math.round((c.start+c.end)/2/5)*5;
      if(!ev.some(e=>e.cat==="pipi"&&Math.abs(e.m-mid)<20)) add(mid,"pipi","Pipi de sécurité","Renfort propreté : dehors, mot du pipi, récompense. Même s'il ne fait rien, tu as gagné une occasion.");
    }
    if(c.last){
      if(B-c.end>45) add(c.end-5,"sieste","Pipi puis sieste au calme","Dernière sieste avant la nuit, dans son parc avec un objet à mâcher.");
    } else add(c.end-5,"sieste","Pipi puis sieste ("+fmtDur(r.nap)+")","Pipi dehors, puis dans son parc ou sa caisse avec un objet à mâcher. Calme, lumière douce. On ne le réveille pas.");
  });
  // Soirée
  add(B-90,"repas","On lève la gamelle d'eau","Sauf forte chaleur. Elle revient au lever.",{quiet:1});
  const lastC=cycles[cycles.length-1];
  if(lastC&&B-lastC.end>45&&!has("nuit")) add(B-25,"pipi","Réveil doux et moment calme","Pipi dehors, câlins calmes, pas de jeu excitant.");
  if(has("nuit")) add(B-30,"educ","Routine du coucher","Jeu calme, dernier pipi, au lit avec une mâchouille et un tissu qui sent la maison. Toujours les mêmes gestes.",{ex:["r5"]});
  add(B-10,"pipi","Dernier pipi de la journée","Dehors, en laisse, mot du pipi. Puis directement au lit.");
  add(B,"sieste","Au lit","Dans son parc ou sa caisse, près de vous les premières semaines. Lumière éteinte, voix douce.",{quiet:1});
  // Nuit : sorties réparties entre le coucher et le lever suivant.
  const nightLen=W+1440-B;
  for(let j=1;j<=r.night;j++){
    add(B+nightLen*j/(r.night+1),"nuit","Pipi de nuit","En silence, sans lumière forte ni jeu. Pipi, friandise, retour au lit. Si "+N+" dort profondément et reste propre plusieurs nuits, décale ce réveil de 30 min.");
  }
  ev.sort((a,b)=>a.m-b.m);
  ev.forEach(e=>e.id=e.cat+"-"+e.m);
  return {events:ev,rhythm:Object.assign({},r,{meals:nm,advisedMeals:r.meals}),info,wake:W,bed:B,customMeals:custom.length>0};
}
// Heures de repas choisies ("HH:MM"), triées, sans doublon, 6 au plus.
function customMeals(pup){
  return [...new Set((Array.isArray(pup.meals)?pup.meals:[]).map(x=>hm(x,null)).filter(x=>x!=null))].sort((a,b)=>a-b).slice(0,6);
}
function fmtDur(m){const h=Math.floor(m/60),r=m%60;return h?h+" h"+(r?" "+String(r).padStart(2,"0"):""):r+" min"}

const CATS={
  repas:{l:"Repas",ico:"🍽️"},
  pipi:{l:"Pipi / caca",ico:"🌿"},
  educ:{l:"Éducation et jeux",ico:"🎾"},
  sieste:{l:"Siestes et coucher",ico:"💤"},
  nuit:{l:"Sorties de nuit",ico:"🌙"}
};

const API={THEMES,EX,PLAN,SLOTS,WEEKS,SOC,GAMES,TIPS,SHEETS,SOURCES,CATS,DAY,ISSUES,MAX_ISSUES,issueById,issueEx,RISKS,ZONES,depOf,zonesOf,risksFor,
  parse,iso,midnight,addDays,daysBetween,hm,fmtMin,fmtDur,dayInfo,itemsFor,rhythm,dayPlan,customMeals};
if(typeof module!=="undefined"&&module.exports) module.exports=API; else root.CHIOT=API;
})(typeof self!=="undefined"?self:this);
