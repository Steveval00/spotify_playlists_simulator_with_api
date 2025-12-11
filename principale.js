if (localStorage.getItem("nome") == null || localStorage.getItem("nome") == "" || localStorage.getItem("nome") == "0") {
	window.location.replace("login.html");
}

console.log(localStorage);

function calcolaSecondi(msDurata) {
	//Funzione che permette di trasformare i millisecondi in secondi : minuti
	var secondi = parseInt((msDurata / 1000) % 60);
	var minuti = parseInt((msDurata / (1000 * 60)) % 60);

	minuti = minuti < 10 ? minuti : minuti;
	secondi = secondi < 10 ? "0" + secondi : secondi;

	return minuti + ":" + secondi;
}

//Inizializzo delle variabili globali che userò nelle funzioni
var l = [];
var pubbliche = [];
var play = "";
var song = 0;

liste();
glo();
var sessname = localStorage.getItem("nome");
sesspassword = sessionStorage.getItem("password");

//Fa apparire il nome in alto a destra nella navbar
document.getElementById("nomeProfilo").innerHTML += sessname;

function liste() {
	//Inizializza lo spazio per le playlist private se non sono ancora presenti,
	//le salva nella variabile l
	if (localStorage.getItem("l") != null && localStorage.getItem("l") != undefined) {
		l = localStorage.getItem("l");
		l = JSON.parse(l);
	} else {
		localStorage.setItem("l", JSON.stringify([]));
		l = [];
	}
}

function glo() {
	//Inizializza lo spazio per le playlist pubbliche se non sono ancora presenti,
	//le salva nella variabile pubbliche
	if (localStorage.getItem("pubbliche") != null) {
		pubbliche = localStorage.getItem("pubbliche");
		pubbliche = JSON.parse(pubbliche);
	} else {
		localStorage.setItem("pubbliche", JSON.stringify([]));
	}
}

// richiesta delle credenziali per accesso tramite funzione serverless (Netlify)
const spotifyTokenEndpoint = "/.netlify/functions/get-spotify-token";

function fetchSpotifyToken() {
	fetch(spotifyTokenEndpoint)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Token request failed");
			}
			return response.json();
		})
		.then((tokenResponse) => {
			console.log(tokenResponse.access_token);
			localStorage.setItem("token", tokenResponse.access_token);
		})
		.catch((error) => {
			console.error("Errore nel recupero del token Spotify:", error);
			alert("Errore nel recupero del token. Riprova piu tardi.");
		});
}

fetchSpotifyToken();

function profilo() {
	// funzione per mostrare a schermo i nomi delle playlist e permettere la modifica e la creazione
	//permette  anche il reset delle playlist da mostrare

	document.getElementById("titoloPagina").innerHTML = "Playlist di " + sessname + "<br><br>";
	var l = localStorage.getItem("l");
	l = JSON.parse(l);

	var t = document.getElementById("canzoni");

	elementi = false;

	t.innerHTML = " ";

	for (var i = l.length; i >= 0; i--) {
		if (l[i] != null) {
			document.getElementById("avviso").style.display = "none";

			if (l[i].utente == sessname) {
				elementi = true;
				var mostra = "onclick = \"mostra('" + l[i].nome + "')\"";

				//Stampo la playlist con il bottone rendi pubblica o rendi privata
				if (l[i].pubblica == false) {
					t.innerHTML +=
						'<tr id= "' +
						l[i].nome +
						'" class="playlist"><td class="addtag"><img style="height:24px; margin-left:20px;" title="Aggiungi Tag" src="assets/images/addtag.png" class="cuore" onclick = "mostraAggiuntaTag(\'' +
						l[i].nome +
						'\')"></td><td class="nomePlaylist" title="Mostra Playlist" onclick = "mostra(\'' +
						l[i].nome +
						'\')" " >' +
						l[i].nome +
						'</td><td class="iconaPlaylist"><img src="assets/images/addsongs.png" class="cuore" title="Aggiungi Canzoni" id="' +
						l[i].nome +
						'" onclick="modifica(\'' +
						l[i].nome +
						'\')"></td><td class="iconaPlaylist"><label class="switch"  id="global' +
						l[i].nome +
						'"  onclick="pubPriv(\'' +
						l[i].nome +
						'\')"><input type="checkbox" unchecked><span class="slider round"></span><p style="font-size:12px; margin-top:25px;">pubblica</p></label></td><td style="border-top-right-radius:25px; border-bottom-right-radius:25px;" class="iconaPlaylist"><img src="assets/images/delete.png" class="cuore" title="Cancella Playlist" id="cancella' +
						l[i].nome +
						'" onclick="cancellaplaylist(\'' +
						l[i].nome +
						"')\"></td></tr>" +
						'<tr><td colspan="5" >' +
						'<div id="aggiungiTag' +
						l[i].nome +
						'"  style=" background-color:white; display:none; margin:0 auto; margin-bottom: 10px; width:800px;">' +
						'<input type="text" class="insTag" id="insTag' +
						l[i].nome +
						'" placeholder="#tag">' +
						'<input type="button" class="nascondi" style="float:right; margin-right:32%; height:40px; width:40px; padding:0px;" value="+" onclick="tags(\'' +
						l[i].nome +
						"')\"> </div>" +
						'<table id ="tags' +
						l[i].nome +
						'" class="canzoni"></table></td></tr>' +
						'<tr><td colspan="5" ><table id ="brani' +
						l[i].nome +
						'" class="canzoni"></table></td></tr>';
				} else {
					t.innerHTML +=
						'<tr id= "' +
						l[i].nome +
						'" class="playlist"><td class="addtag"><img style="height:24px; margin-left:20px;" title="Aggiungi Tag" src="assets/images/addtag.png" class="cuore" onclick = "mostraAggiuntaTag(\'' +
						l[i].nome +
						'\')"></td><td class="nomePlaylist" title="Mostra Playlist" onclick = "mostra(\'' +
						l[i].nome +
						'\')" " >' +
						l[i].nome +
						'</td><td class="iconaPlaylist"><img src="assets/images/addsongs.png" class="cuore" title="Aggiungi Canzoni" id="' +
						l[i].nome +
						'" onclick="modifica(\'' +
						l[i].nome +
						'\')"></td><td class="iconaPlaylist"><label class="switch"  id="global' +
						l[i].nome +
						'"  onclick="pubPriv(\'' +
						l[i].nome +
						'\')"><input type="checkbox" checked><span class="slider round"></span><p style="font-size:12px; margin-top:25px;">pubblica</p></label></td><td style="border-top-right-radius:25px; border-bottom-right-radius:25px;" class="iconaPlaylist"><img src="assets/images/delete.png" class="cuore" title="Cancella Playlist" id="cancella' +
						l[i].nome +
						'" onclick="cancellaplaylist(\'' +
						l[i].nome +
						"')\"></td></tr>" +
						'<tr><td colspan="5">' +
						'<div id="aggiungiTag' +
						l[i].nome +
						'"  style=" background-color:white; display:none; margin:0 auto; margin-bottom: 10px; width:800px;">' +
						'<input type="text" class="insTag" id="insTag' +
						l[i].nome +
						'" placeholder="#tag">' +
						'<input type="button" class="nascondi" style="float:right; margin-right:32%; height:40px; width:40px; padding:0px;" value="+" onclick="tags(\'' +
						l[i].nome +
						"')\"> </div>" +
						'<table id ="tags' +
						l[i].nome +
						'" class="canzoni"></table></td></tr>' +
						'<tr><td colspan="5" ><table id ="brani' +
						l[i].nome +
						'" class="canzoni"></table></td></tr>';
				}
			}
		} else {
			document.getElementById("avviso").style.display = "block";
		}
	}

	if (elementi == false) {
		document.getElementById("avviso").style.display = "block";
	}
}

function cancellaplaylist(nome) {
	//Funzione che permette la cancellazione della playlist Privata

	var l = localStorage.getItem("l");
	l = JSON.parse(l);

	var p = localStorage.getItem("pubbliche");
	p = JSON.parse(p);

	for (var i = 0; i < l.length; i++) {
		if (l[i].nome == nome && l[i].utente == sessname) {
			l.splice(i, 1);
		}

		localStorage.setItem("l", JSON.stringify(l));
	}

	//Cancella la nostra playlist anche dalle playlist pubbliche
	for (var z = 0; z < p.length; z++) {
		if (p[z].nome == nome && p[z].utente == sessname) {
			p.splice(z, 1);
		}
		localStorage.setItem("pubbliche", JSON.stringify(p));
	}

	//Ristampa tutte le nostre playlist private dopo la cancellazione
	profilo();
}

var click = 0;

function pubPriv(nomeplay) {
	//Rende la playlist Pubblica/Privata a seconda di com'era prima

	l = localStorage.getItem("l");
	l = JSON.parse(l);
	pubbliche = localStorage.getItem("pubbliche");
	pubbliche = JSON.parse(pubbliche);
	eraPubblica = false;
	click++;

	//Controllo bug -> faccio funzionare la funzione solo con un doppio click,
	//Ovvero quando premo sullo swtich, questo generava 2 click e l'ho trasformato in 1
	if (click == 2) {
		click = 0;

		for (var s = 0; s < l.length; s++) {
			if (l[s].pubblica == false && l[s].nome == nomeplay && l[s].utente == sessname) {
				l[s].pubblica = true;
				localStorage.setItem("l", JSON.stringify(l));
			} else if (l[s].pubblica == true && l[s].nome == nomeplay && l[s].utente == sessname) {
				l[s].pubblica = false;
				localStorage.setItem("l", JSON.stringify(l));
				eraPubblica = true;
			}
		}

		if (eraPubblica) {
			for (var s = 0; s < pubbliche.length; s++) {
				if (pubbliche[s].nome == nomeplay && pubbliche[s].utente == sessname) {
					pubbliche.splice(s, 1);
					localStorage.setItem("pubbliche", JSON.stringify(pubbliche));
				}
			}
		} else {
			for (let t = 0; t < l.length; t++) {
				if (l[t].nome == nomeplay && l[t].utente == sessname) {
					// per modificare il JSON devo prima trasformarlo in un array, modificare quello e poi riconventirlo in stringa
					pubbliche.push({
						utente: sessname,
						nome: nomeplay,
						id: l[t].id,
						descrizione: l[t].descrizione,
						tags: l[t].tags,
					});
					localStorage.setItem("pubbliche", JSON.stringify(pubbliche));
				}
			}
		}
	}
}

function makeplaylist() {
	//funzione che permette di mostrare il campo per inserire il nome della playlist

	document.getElementById("aggiungiPlaylist").style.display = "block";
	document.getElementById("aggiungiPlaylist").style.height = "100px";
	document.getElementById("creaplaylist").style.display = "none";
	document.getElementById("avviso").style.display = "none";
}

function creaplay(nome) {
	//funzione che crea la playlist

	if (nome == "") {
		alert("inserisci un nome valido");
	} else {
		var l = localStorage.getItem("l");
		l = JSON.parse(l);
		esiste = false;

		if (l != null || l != "" || l != " ") {
			for (let i = 0; i < l.length; i++) {
				if (l[i].nome == nome && l[i].utente == sessname) {
					esiste = true;
				}
			}
		}

		if (!esiste) {
			l.push({ nome: nome, id: [], utente: sessname, pubblica: false, descrizione: "", tags: [] });
			localStorage.setItem("l", JSON.stringify(l));
			document.getElementById("aggiungiPlaylist").style.display = "none";
			document.getElementById("creaplaylist").style.display = "block";
			document.getElementById("nomeplaylist").value = "";

			profilo();
		} else {
			alert("nome gia presente nella tua playlist riprova");
		}
	}
}

function mostraInCerca() {
	//Funzione che permette di mostrare la playlist mentre si cercano le canzoni
	mostra(play);
}

function modifica(nome) {
	//Permette di accedere alla modifica della playlist, ovvero all'aggiunta dei nuovi brani
	document.getElementById("bottoneMostraPlaylist").style.display = "block";
	document.getElementById("bottoneMostraPlaylist").name = nome;
	document.getElementById("mostraPlaylist").innerHTML +=
		'<tr><td><table id ="brani' + nome + '" class="canzoni"></table></td></tr>';
	document.getElementById("cerca").style.display = "block";
	document.getElementById("canzoni").innerHTML = " ";
	document.getElementById("creaplaylist").style.display = "none";
	document.getElementById("titoloPagina").innerHTML =
		"Aggiungi Canzoni alla playlist: <br><h1 style='padding:0px;'>" + nome + "</h1>";
	play = nome;
}

function mostraPreview(canzone, link) {
	//Permette di mostrare la preview della canzone
	var tabella = document.getElementById(canzone);

	if (tabella.innerHTML == "") {
		tabella.innerHTML +=
			'<link rel="alternate" type="application/json+oembed" href="' +
			link +
			'" />' +
			'<iframe id="preview' +
			canzone +
			'" style="display:block; margin: 0 auto; border-radius:12px" src="https://open.spotify.com/embed/track/' +
			canzone +
			'?utm_source=generator" width="91%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
	} else {
		tabella.innerHTML = "";
	}
}

function cercacanzoni(testo) {
	//Permette di mostrare i risultati di ricerca dato un testo

	var tabella = document.getElementById("canzoni");

	//Faccio la richiesta HTTP al server di spotify usando il token
	event.preventDefault();
	fetch("https://api.spotify.com/v1/search?type=track&q=" + testo + "", {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	})
		.then((response) => response.json())
		.then((searchResults) => {
			if (searchResults.tracks.items.length == 0) {
				document.getElementById("testo").style.borderColor = "red";
				tabella.innerHTML = "";
			} else {
				document.getElementById("testo").style.borderColor = "white";

				tabella.innerHTML =
					'<tr class="intestazione"><td class="copertina" ></td><td class="titolo">TITOLO</td><td>ARTISTA</td><td>DURATA</td><td> </td></tr><br>';
				for (var i = 0; i < searchResults.tracks.items.length; i++) {
					var canzone = searchResults.tracks.items[i].id;
					var espandi =
						"onclick=\"mostraPreview('" +
						canzone +
						"','" +
						searchResults.tracks.items[i].external_urls.spotify +
						"')\"";
					console.log(searchResults.tracks.items[i]);
					tabella.innerHTML =
						tabella.innerHTML +
						'<tr  class="canzone" ><td ' +
						espandi +
						' class="copertina" ><img class="copertina"  src="' +
						searchResults.tracks.items[i].album.images[0].url +
						'"></a></td><td ' +
						espandi +
						' class="titolo"><h2>' +
						searchResults.tracks.items[i].name +
						"</h2></td><td " +
						espandi +
						"><h2>" +
						searchResults.tracks.items[i].album.artists[0].name +
						"</h2></td><td " +
						espandi +
						"><h2>" +
						calcolaSecondi(searchResults.tracks.items[i].duration_ms) +
						'</h2><td><a><img class = "cuore" src="assets/images/plus.png" id="add' +
						canzone +
						'"  onclick="prefe(\'' +
						canzone +
						'\')"> </a></td></tr><tr id ="' +
						canzone +
						'"></tr>';
				}
			}
		})
		.catch((err) => {
			document.getElementById("testo").style.borderColor = "red";
			tabella.innerHTML = "";
		});
}

function battito1(img) {
	//Ingrandisce leggermente l'immagine una volta cliccata
	img.style.transform = "scale(1.1)";
	img.style.margin = "0% 25% 0% 0%";
	img.style.transition = "transform 0.25s ease";
}

function prefe(val) {
	//permette di aggiungere alla playlist la canzone selezionata

	//cambio l'immagine da + a V
	var immagine = document.getElementById("add" + val);
	immagine.src = "assets/images/added.png";
	battito1(immagine);

	for (var i = 0; i < l.length; i++) {
		if (l[i].nome == play && l[i].utente == sessname) {
			if (l[i].id.indexOf(val) == -1) {
				l[i].id.push(val);
				song = i;
				localStorage.setItem("l", JSON.stringify(l));

				if (document.getElementById("bottoneMostraPlaylist").value == "nascondi playlist") {
					mostra(play);
					mostra(play);
				}

				if (l[i].pubblica == true) {
					aggiorna(play);
				}
			} else {
				window.alert("canzone gia presente");
			}
		}
	}
}

function tags(playlist) {
	//Permette di mostra i tag di una determinata playlist

	play = playlist;
	l = localStorage.getItem("l");
	l = JSON.parse(l);

	var tag = document.getElementById("insTag" + playlist).value;

	if (tag != "") {
		for (var i = 0; i < l.length; i++) {
			if (l[i].nome == play && l[i].utente == sessname) {
				if (l[i].tags.indexOf(tag) == -1) {
					l[i].tags.push(tag);
					localStorage.setItem("l", JSON.stringify(l));

					if (l[i].pubblica == true) {
						aggiorna(play);
					}
				} else {
					window.alert("tag gia presente");
				}
			}
		}

		document.getElementById("insTag" + playlist).value = "";
	} else {
		alert("inserisci un valore");
	}
	console.log(l);

	document.getElementById("tags" + playlist).innerHTML = "";
	mostraTag(playlist);
}

function aggiorna(nomeplay) {
	//Aggiorna la playlist pubblica

	l = localStorage.getItem("l");
	l = JSON.parse(l);
	p = localStorage.getItem("pubbliche");
	p = JSON.parse(p);

	for (var s = 0; s < p.length; s++) {
		if (p[s].nome == nomeplay && p[s].utente == sessname) {
			p.splice(s, 1);
		}
	}

	for (let t = 0; t < l.length; t++) {
		if (l[t].nome == nomeplay && l[t].utente == sessname) {
			p.push({ utente: sessname, nome: nomeplay, id: l[t].id, descrizione: l[t].descrizione, tags: l[t].tags });
			localStorage.setItem("pubbliche", JSON.stringify(p));
		}
	}
}

function deletesong(idsong, nomePlaylist) {
	//Cancella una determinata canzone di una determinata playlist

	play = nomePlaylist;

	//Questo permette di trasformare durante la ricerca il bottone V in un +
	//quando viene rimossa una canzone presente direttamente dalla sezione di ricerca
	document.getElementById("del" + idsong).style.display = "none";
	if (document.getElementById("bottoneMostraPlaylist").style.display != "none") {
		if (document.getElementById("add" + idsong) != undefined && document.getElementById("add" + idsong) != null) {
			document.getElementById("add" + idsong).src = "assets/images/plus.png";
		}
	}

	l = localStorage.getItem("l");
	l = JSON.parse(l);

	for (var i = 0; i < l.length; i++) {
		if (l[i].nome == play && l[i].utente == sessname) {
			var index = l[i].id.indexOf(idsong);

			//Se la canzone è presente, la rimuovo
			if (index != -1) {
				l[i].id.splice(index, 1);
				localStorage.setItem("l", JSON.stringify(l));

				if (l[i].pubblica == true) {
					aggiorna(play);
				}

				if (l[i].id.length == 0) {
					var tab = document.getElementById("brani" + nomePlaylist);

					tab.innerHTML =
						'<tr><td><p class="nosongs" >Nessuna canzone e\' stata aggiunta alla playlist per il momento</p></td></tr>';

					//document.getElementById('intestazione'+nomePlaylist).style.display='none'
				}
			}
		}
	}
}

function removetag(tag, nome) {
	//Rimuove il tag di una playlist

	l = localStorage.getItem("l");
	l = JSON.parse(l);

	for (var i = 0; i < l.length; i++) {
		if (l[i].nome == nome && l[i].utente == sessname) {
			var index = l[i].tags.indexOf(tag);
			if (index != -1) {
				document.getElementById(tag + nome).style.display = "none";
				l[i].tags.splice(index, 1);
				localStorage.setItem("l", JSON.stringify(l));

				if (l[i].pubblica == true) {
					aggiorna(nome);
				}
			}
		}
	}
}

function cambiaTasto() {
	//Cambia il bottone Mostra Playlist in Nascondi Playlist e viceversa nella sezione di ricerca brani
	if (document.getElementById("bottoneMostraPlaylist").value == "nascondi playlist") {
		document.getElementById("bottoneMostraPlaylist").value = "mostra playlist";
		document.getElementById("bottoneMostraPlaylist").className = "crea";
	} else {
		document.getElementById("bottoneMostraPlaylist").value = "nascondi playlist";
		document.getElementById("bottoneMostraPlaylist").className = "nascondi";
	}

	mostra(document.getElementById("bottoneMostraPlaylist").name);
}

function mostra(nomignolo) {
	//permette di mostrare la nostra playlist cioe tutte le nostre canzoni

	if (document.getElementById("bottoneMostraPlaylist").style.display != "block") {
		if (document.getElementById("aggiungiTag" + nomignolo).style.display != "block") {
			mostraTag(nomignolo);
		}
	}

	l = localStorage.getItem("l");
	l = JSON.parse(l);
	var tab = document.getElementById("brani" + nomignolo);

	if (tab.innerHTML == "") {
		//Scorre sulle playlist
		for (var y = 0; y < l.length; y++) {
			//Se la playlist ha canzoni, crea l'intestazione
			if (l[y].nome == nomignolo && l[y].utente == sessname && l[y].id.length > 0) {
				tab.innerHTML =
					'<tr id="intestazione' +
					nomignolo +
					'" class= "intestazione"><td style="width:5%"></td><td class= "titolo">TITOLO</td><td>ARTISTA</td><td>DURATA</td><td></td></tr>';
			} else if (l[y].nome == nomignolo && l[y].utente == sessname && l[y].id.length == 0) {
				tab.innerHTML =
					'<tr><td><p class="nosongs" >Nessuna canzone e\' stata aggiunta alla playlist per il momento</p></td></tr>';
			}

			if (l[y].nome == nomignolo && l[y].utente == sessname && l[y].id.length > 0) {
				//Scorre su i brani
				for (var z = 0; z < l[y].id.length; z++) {
					//Richiesta HTTP della canzone una ad una all'endpoint Spotify
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
								'</td><td><img class = "cuore" src="assets/images/remove.png"  title="Rimuovi canzone" onclick="deletesong(\'' +
								songs.id +
								"','" +
								nomignolo +
								"')\"></td></tr>";
						});
				}
				tab.innerHTML += "<br>";
			}
		}
	} else {
		tab.innerHTML = "";
	}
}

function mostraAggiuntaTag(playlist) {
	//Mostra il pulsante per l'inserimento e aggiunta di un nuovo tag

	//Se i tag non sono mostrati, li mostra
	if (document.getElementById("aggiungiTag" + playlist).style.display == "none") {
		document.getElementById("aggiungiTag" + playlist).style.display = "block";
		if (document.getElementById("tags" + playlist).innerHTML == "") {
			mostraTag(playlist);
		}
	} else {
		document.getElementById("aggiungiTag" + playlist).style.display = "none";
		if (document.getElementById("brani" + playlist).innerHTML == "") {
			document.getElementById("tags" + playlist).innerHTML = "";
		}
	}
}

function mostraTag(playlist) {
	//Mostra i tag di una playlist

	l = localStorage.getItem("l");
	l = JSON.parse(l);

	var tag = document.getElementById("tags" + playlist);

	if (tag.innerHTML == "") {
		for (let i = 0; i < l.length; i++) {
			if (l[i].nome == playlist && l[i].utente == sessname) {
				tag.innerHTML += '<tr><td style="margin:0 auto; margin-left:20%;">';

				l[i].tags.forEach((element) => {
					tag.innerHTML +=
						'<div class="tag" id="' +
						element +
						playlist +
						'" >' +
						'<p align="left" style="float: left; margin-top:11px "># ' +
						element +
						"</p>" +
						'<img style="cursor:pointer; margin-right: -15px; margin-left:7px; margin-top:10px; float:right; height:22px;" onclick="removetag(\'' +
						element +
						"','" +
						playlist +
						'\')" src="assets/images/rimuoviTag.png"></div></td>';
				});

				tag.innerHTML += "</td></tr>";
			}
		}
	} else {
		tag.innerHTML = "";
	}
}

//Stampa il profilo con le playlist private
profilo();

console.log(localStorage.getItem("l"));
