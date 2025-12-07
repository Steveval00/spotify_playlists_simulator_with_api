/*
File per il login e la registrazione all'interno del sito
*/
    

    console.log(localStorage)
//Se l'elemento l (playlist private) è nullo o non definito, lo inizializzo
    if(localStorage.getItem('l')==null || localStorage.getItem('l')==undefined){

        localStorage.setItem('l', JSON.stringify([]))
    }

//Se l'elemento users (utenti) è nullo o non definito, lo inizializzo
    if(localStorage.getItem('users')==null || localStorage.getItem('users')==undefined){

        localStorage.setItem('users', JSON.stringify([]))
        var control = localStorage.getItem('users')
        
    }else{
        var control=localStorage.getItem('users')
        control = JSON.parse(control)
    }
console.log(control)




//registro un nuovo utente e controllo se è gia registrato
    function store(){
        event.preventDefault()
   
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var esiste = false
        var name = document.getElementById('name').value;
        var pw = document.getElementById('pw').value;
        var email = document.getElementById('email').value;
        var sGeneri = document.getElementById('generi').value;
        var sArtisti = document.getElementById('artisti').value;

       

        //Controlla prima che l'inserimento non sia vuoto
        //Poi controlla se ho dei dati degli utenti nel local storage, se sì,
        //controllo che non sia già presente, e lo aggiungo
        
        
        if (name == "" || pw == ""||email =="" || !(email.match(mailformat)) ){
            alert("Non puoi registrarti senza dati o con email errata");
        } else if (control!=[]){

            for(let i =0; i<control.length; i++){
        
                if(control[i].nome==name || control[i].email==email){
                    alert('account gia esistente riprovare')
                    esiste = true
                    break
                }
        
            }

            //Se l'account non è già esistente, lo aggiungo
            if (!esiste){
                control.push({nome:name, password:pw, email:email, generi: sGeneri, artisti: sArtisti})
                alert('account creato con successo')
                localStorage.setItem('users', JSON.stringify(control));
            }

        }

    }


//bolcking se l'utente è gia registrato e può accedere
    function check(){
   
        var esiste = false
        control=localStorage.getItem('users')
        control= JSON.parse(control)
        var userName = document.getElementById('userName').value;
        var userPw = document.getElementById('userPw').value;
        

        //Controllo che l'inserimento non sia vuoto
        if (userName == "" || userPw == ""){
            alert('Devi inserire dei dati per accedere');
        } else{
            //Controllo se nella mia lista di utenti ci sia quello inserito
             if(control!=[]){
                for(let i =0; i<control.length; i++){
                    if((control[i].nome==userName || control[i].email==userName) && control[i].password==userPw){
                        alert('sei loggato')
                        localStorage.setItem('nome', control[i].nome)
                        localStorage.setItem('password',control[i].password)
                        localStorage.setItem('email',control[i].email)
                        localStorage.setItem('generi',control[i].generi)
                        localStorage.setItem('artisti',control[i].artisti)

                        console.log(localStorage.setItem('nome', control[i].nome))
                        console.log(localStorage.setItem('password',control[i].password))
                        console.log(localStorage.setItem('email',control[i].email))
                        console.log(localStorage.setItem('generi',control[i].generi))
                        console.log(localStorage.setItem('artisti',control[i].artisti))
                     
                        esiste= true
                        break

                    }


                }
                if (!esiste){
                    alert('account inesistente')
                    event.preventDefault()
                }
        
            }
        }
    }
    
console.log('users')