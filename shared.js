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
  const exIds=itemsFor(date,pup);
  const soc=SOC[info.dIdx%SOC.length], game=GAMES[info.dIdx%GAMES.length];
  const zen=PLAN.bonus.indexOf("b10")<info.week; // la gamelle zen est vue en semaine 4
  const ev=[];
  const add=(m,cat,ti,tx,extra)=>ev.push(Object.assign({m:Math.round(m),cat,ti,tx:tx||""},extra||{}));

  // Cycles éveil + sieste, du lever jusqu'au coucher.
  const cycles=[];
  for(let t=W;t<B-30;t+=r.awake+r.nap){
    const end=Math.min(t+r.awake,B);
    cycles.push({start:t,end,last:end+r.nap+20>=B});
    if(end+r.nap+20>=B) break;
  }
  // Repas : répartis régulièrement sur les cycles qui commencent avant 18h30 (et 3 h 30 avant le coucher).
  const lastMeal=Math.min(1110,B-210);
  const eligible=cycles.map((c,i)=>i).filter(i=>cycles[i].start<=lastMeal);
  const nm=Math.min(r.meals,eligible.length);
  for(let k=0;k<nm;k++){
    const i=eligible[nm===1?0:Math.round(k*(eligible.length-1)/(nm-1))];
    cycles[i].meal=k+1;
  }
  // Séances : les 6 exercices du jour répartis à tour de rôle sur les cycles.
  const extras=["soc","game","walk","handle","chew"];
  cycles.forEach((c,i)=>{
    const first=i===0;
    add(c.start,"pipi",first?"Lever : pipi tout de suite":"Fin de sieste : pipi dehors",first?"Porte-le ou guide-le dehors sans attendre, avant de lui dire bonjour longuement. Mot du pipi, friandise.":"Dès qu'il se réveille, dehors. Mot du pipi, friandise, puis on rentre.");
    let t=c.start+10;
    if(c.meal){
      add(t,"repas","Repas "+c.meal+" sur "+nm,(zen?"Gamelle zen : « Assis », gamelle posée, « OK ». ":"")+"Ration pesée, moins les croquettes gardées pour l'éducation. On le laisse manger tranquille.");
      add(t+15,"pipi","Pipi / caca après le repas","La crotte arrive souvent 10 à 30 min après le repas : reste dehors avec lui, mot de la crotte, friandise.");
      t+=25;
    }
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
    if(c.last){
      if(B-c.end>45) add(c.end-5,"sieste","Pipi puis sieste au calme","Dernière sieste avant la nuit, dans son parc avec un objet à mâcher.");
    } else add(c.end-5,"sieste","Pipi puis sieste ("+fmtDur(r.nap)+")","Pipi dehors, puis dans son parc ou sa caisse avec un objet à mâcher. Calme, lumière douce. On ne le réveille pas.");
  });
  // Soirée
  add(B-90,"repas","On lève la gamelle d'eau","Sauf forte chaleur. Elle revient au lever.",{quiet:1});
  const lastC=cycles[cycles.length-1];
  if(lastC&&B-lastC.end>45) add(B-25,"pipi","Réveil doux et moment calme","Pipi dehors, câlins calmes, pas de jeu excitant.");
  add(B-10,"pipi","Dernier pipi de la journée","Dehors, en laisse, mot du pipi. Puis directement au lit.");
  add(B,"sieste","Au lit","Dans son parc ou sa caisse, près de vous les premières semaines. Lumière éteinte, voix douce.",{quiet:1});
  // Nuit : sorties réparties entre le coucher et le lever suivant.
  const nightLen=W+1440-B;
  for(let j=1;j<=r.night;j++){
    add(B+nightLen*j/(r.night+1),"nuit","Pipi de nuit","En silence, sans lumière forte ni jeu. Pipi, friandise, retour au lit. Si "+N+" dort profondément et reste propre plusieurs nuits, décale ce réveil de 30 min.");
  }
  ev.sort((a,b)=>a.m-b.m);
  ev.forEach(e=>e.id=e.cat+"-"+e.m);
  return {events:ev,rhythm:r,info,wake:W,bed:B};
}
function fmtDur(m){const h=Math.floor(m/60),r=m%60;return h?h+" h"+(r?" "+String(r).padStart(2,"0"):""):r+" min"}

const CATS={
  repas:{l:"Repas",ico:"🍽️"},
  pipi:{l:"Pipi / caca",ico:"🌿"},
  educ:{l:"Éducation et jeux",ico:"🎾"},
  sieste:{l:"Siestes et coucher",ico:"💤"},
  nuit:{l:"Sorties de nuit",ico:"🌙"}
};

const API={THEMES,EX,PLAN,SLOTS,WEEKS,SOC,GAMES,TIPS,SHEETS,SOURCES,CATS,DAY,
  parse,iso,midnight,addDays,daysBetween,hm,fmtMin,fmtDur,dayInfo,itemsFor,rhythm,dayPlan};
if(typeof module!=="undefined"&&module.exports) module.exports=API; else root.CHIOT=API;
})(typeof self!=="undefined"?self:this);
