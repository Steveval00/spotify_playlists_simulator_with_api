/*
File per la gestione delle playlist pubbliche:
- Visualizzazione playlist pubbliche
- Importazione playlist pubbliche
- Ricerca Playlist tramite tag
*/

function calcolaSecondi(msDurata) {
	//Funzione che permette di trasformare i millisecondi in secondi : minuti
	var secondi = parseInt((msDurata / 1000) % 60);
	var minuti = parseInt((msDurata / (1000 * 60)) % 60);

	minuti = minuti < 10 ? minuti : minuti;
	secondi = secondi < 10 ? "0" + secondi : secondi;

	return minuti + ":" + secondi;
}

//Imposto il nome della sessione al nome locale, e star alle playlist pubbliche
sessname = localStorage.getItem("nome");
star = localStorage.getItem("pubbliche");
star = JSON.parse(star);
var storage = localStorage.getItem("nome");

document.getElementById("nomeProfilo").innerHTML += sessname;

//La variabile lista contiene tutte le playlsit locali
if (localStorage.getItem("l") != []) {
	var lista = localStorage.getItem("l");
	lista = JSON.parse(lista);
}

//Se non ci sono elementi nelle playlist pubbliche stampa un messaggio,
//altrimenti stampa tutte le playlist pubbliche
if (star.length == 0) {
	document.getElementById("tabella").innerHTML =
		'<tr><td><h1 style="margin:0 auto; font-weight:500; padding:20px; font-size:18px;">Nessun utente ha pubblicato la sua playlist per il momento</h1></td></tr>';
} else {
	liste();
}

function ricerca() {
	//Ricerca delle playlist tramite tag
	document.getElementById("canzoniere").style.display = "block";
	document.getElementById("esperimento").innerHTML = "";

	search = localStorage.getItem("pubbliche");
	search = JSON.parse(search);

	var d = document.getElementById("ricerca").value;

	if (d == "") {
		document.getElementById("esperimento").innerHTML =
			'<tr><td colspan="4"><br><h1 style="padding:0; margin: 0 auto; font-size:16px;">inserisci tag di ricerca</h1></td></tr><br>';
		liste();
	} else {
		//Quando si inizia a cercare, mostra i risultati solo 1 volta nascondendo il resto
		for (z = 0; z < search.length; z++) {
			count = 0;
			for (i = 0; i < search[z].tags.length; i++) {
				if (search[z].tags[i] != "") {
					if (search[z].tags[i].toLowerCase().includes(d.toLowerCase()) && count == 0) {
						mostriamo(search[z].nome, search[z].utente);
						count++;
					}
				}
			}
		}
	}
}

function mostriamo(nomeplaylist, utente) {
	//Mostra le playlist
	star = localStorage.getItem("pubbliche");
	star = JSON.parse(star);

	tab = document.getElementById("esperimento");

	for (let i = 0; i < star.length; i++) {
		if (star[i].nome == nomeplaylist && star[i].utente == utente) {
			tab.innerHTML +=
				'<tr id= "' +
				star[i].nome +
				'"  class="playlist"><td class="nomePlaylist" style="margin-top:30px;border-top-left-radius:25px; border-bottom-left-radius:25px;" title="Mostra Playlist" onclick = "mostra(\'' +
				star[i].nome +
				"','" +
				star[i].utente +
				"')\" >" +
				star[i].nome +
				'<p style="margin-top:0px;;padding:0;font-size:14px;">di ' +
				star[i].utente +
				'</p></td><td class="iconaPlaylist" style="text-align:center;border-top-right-radius:25px; border-bottom-right-radius:25px;"><img src="assets/images/import.png" style=" margin-top:15px; height:25px; float:center;" class="cuore" title="Importa Playlist" id="importa' +
				star[i].nome +
				'" onclick="importa(\'' +
				star[i].nome +
				"','" +
				star[i].utente +
				'\')"><p style="float:center; text-align:center;font-size:12px; margin-top:45px; margin-right:20px;">importa</p></td></tr>' +
				'<tr><td colspan="2" >' +
				'<table id ="tags' +
				star[i].nome +
				'" class="canzoni"></table></td></tr>' +
				'<tr><td colspan="2" ><table id ="brani' +
				star[i].nome +
				'" class="canzoni"></table></td></tr>';

			mostraTag(star[i].nome, star[i].utente);
		}
	}
}

function liste() {
	//Mostra tutta la lista delle playlist pubbliche richiamando mostriamo()

	tab = document.getElementById("esperimento");
	tab.innerHTML += "<br>";

	for (let i = 0; i < star.length; i++) {
		mostriamo(star[i].nome, star[i].utente);
	}
}

function battito1(img) {
	//Ingrandisce leggermente l'immagine una volta cliccata
	img.style.transform = "scale(1.1)";
	img.style.transition = "transform 0.25s ease";
}

function importa(nomepl, ut) {
	//Permette di importare le playlist

	if (document.getElementById("importa" + nomepl).src != "assets/images/imported.png") {
		document.getElementById("importa" + nomepl).src = "assets/images/imported.png";
	}
	battito1(document.getElementById("importa" + nomepl));

	star = localStorage.getItem("pubbliche");
	star = JSON.parse(star);
	var l = localStorage.getItem("l");
	l = JSON.parse(l);
	var esiste = false;

	//Controllo che la playlist non sia già presente nelle nostre
	for (let i = 0; i < l.length; i++) {
		if (l[i].nome == nomepl && l[i].utente == storage) {
			esiste = true;
		}
	}

	if (ut == storage) {
		alert("stai cercando di importare una tua playlist");
	} else if (!esiste) {
		for (var s = 0; s < star.length; s++) {
			if (star[s].nome == nomepl && star[s].utente == ut) {
				lista.push({ utente: storage, nome: nomepl, id: star[s].id, pubblica: false, tags: star[s].tags });
				localStorage.setItem("l", JSON.stringify(lista));
			}
		}
	} else {
		//Se l'utente importa una playlist con lo stesso nome di una che ha già
		alert("playlist già presente");
	}
}

function mostraTag(playlist, utente) {
	//Permette di mostra tutti i tag di una playlsit di un utente
	star = localStorage.getItem("pubbliche");
	star = JSON.parse(star);

	var tag = document.getElementById("tags" + playlist);

	for (let i = 0; i < star.length; i++) {
		if (star[i].nome == playlist && star[i].utente == utente) {
			tag.innerHTML += '<tr><td style="margin:0 auto; margin-left:20%;">';

			star[i].tags.forEach((element) => {
				tag.innerHTML +=
					'<div class="tag" id="' +
					element +
					playlist +
					'" >' +
					'<p align="left" style="float: left; margin-top:11px "># ' +
					element +
					"</p>";
			});

			tag.innerHTML += "</td></tr>";
		}
	}
}

function mostra(nomignolo, utente) {
	//Mostra tutte le canzoni di una playlist di un utente

	l = localStorage.getItem("pubbliche");
	l = JSON.parse(l);
	var tab = document.getElementById("brani" + nomignolo);

	if (tab.innerHTML == "") {
		for (var y = 0; y < l.length; y++) {
			if (l[y].nome == nomignolo && l[y].utente == utente && l[y].id.length > 0) {
				tab.innerHTML =
					'<tr id="intestazione' +
					nomignolo +
					'" class= "intestazione"><td style="width:5%"></td><td class= "titolo">TITOLO</td><td>ARTISTA</td><td>DURATA</td><td></td></tr>';
			} else if (l[y].nome == nomignolo && l[y].utente == utente && l[y].id.length == 0) {
				tab.innerHTML =
					'<tr><td><p class="nosongs" >Nessuna canzone e\' stata aggiunta alla playlist per il momento</p></td></tr>';
			}

			if (l[y].nome == nomignolo && l[y].utente == utente && l[y].id.length > 0) {
				for (var z = 0; z < l[y].id.length; z++) {
					event.preventDefault();
					fetch("https://api.spotify.com/v1/tracks/" + l[y].id[z] + "", {
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + localStorage.getItem("token"),
						},
					})
						.then((response) => response.json())
						.then((songs) => {
							tab.innerHTML +=
								'<tr class="canzone" id="del' +
								songs.id +
								'"><td class="copertina"><img class="copertina"  src="' +
								songs.album.images[0].url +
								'"></td><td class="titolo">' +
								songs.name +
								"</td><td>" +
								songs.artists[0].name +
								"</td><td>" +
								calcolaSecondi(songs.duration_ms) +
								"</td><td></tr></tr>";
						});
				}
				tab.innerHTML += "<br>";
			}
		}
	} else {
		tab.innerHTML = "";
	}
}

console.log(localStorage.getItem("pubbliche"));
