/*
#
# Globais
#
*/
var quant_carta = 10;
var contar = 1;
var endpoint_carta = "https://api.magicthegathering.io/v1/cards";
var endpoint_carta2 = "https://api.magicthegathering.io/v1/cards?page=2";
var tela_detalhe = document.getElementById("conteudo");
var resultados = document.getElementById("resultados");
var data_json;
var CACHE_DINAMICO = "magicdex_dinamico";
/*
#
# Requisição AJAX
#
*/
function carregar_carta(){
    
    let ajax = new XMLHttpRequest();

    ajax.open("GET", endpoint_carta, true);
    ajax.send();
    
    //Lendo requisição
    ajax.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200)
        {
            data_json = JSON.parse(this.responseText).cards;
            if(data_json.length > 0){
                cache_dinamico_json();
                resultados.className = "row";
                //Carga inicial
                carregar_mais();
            }
        }

    }
}

function carregar_mais(){
    
    let ajax = new XMLHttpRequest();

    ajax.open("GET", endpoint_carta2, true);
    ajax.send();
    
    //Lendo requisição
    ajax.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200)
        {
            const cards = JSON.parse(this.responseText).cards;
            data_json.push(...cards);
            data_json = data_json.filter(c => c.imageUrl !== undefined);
            if(data_json.length > 0){
                cache_dinamico_json();
                resultados.className = "row";
                //Carga inicial
                imprimir();
            }
        }

    }
}

carregar_carta();

var files_img_cartas = [];

function imprimir(){

    let html_conteudo = "";
    let limite;
    if((contar+quant_carta) < data_json.length){
        limite = (contar+quant_carta);
    }else{
        limite = data_json.length;
        btCarregarMais.style.display = "none";
    }

    for(let i=contar; i < limite; i++){
        //Montar Card
        const img =  data_json[i].imageUrl || 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130535&type=card';
        html_conteudo+=card_magic(i,data_json[i].name,data_json[i].colors[0],img);  

    }

    resultados.innerHTML += html_conteudo;

    contar+=quant_carta;

}

/*
#
# Comportamento Botões
#
*/

let btVoltar = document.getElementById("btVoltar");

btVoltar.addEventListener("click", function(){
    let color = tela_detalhe.className.substring(tela_detalhe.className.indexOf("color_"));
    tela_detalhe.className = "animate__animated animate__bounceOutLeft "+color;
    
    setTimeout(function(){document.getElementById("conteudo_img").style.display = "none";}, 500);
});

let btCarregarMais = document.getElementById("btCarregarMais");

btCarregarMais.addEventListener("click", function(){
    imprimir();
});

function btCard(id){
    tela_detalhe.style.display = "block";
    const img =  data_json[id].imageUrl || 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130535&type=card';

    document.getElementById("conteudo_img").style.display = "block";
    tela_detalhe.className = "animate__animated animate__bounceInLeft color_"+data_json[id].colors[0];
    document.getElementById("conteudo_img").setAttribute("src", img);
    document.getElementById("conteudo_nome").innerHTML = data_json[id].name;
    document.getElementById("conteudo_tipo").innerHTML = data_json[id].rarity;
    document.getElementById("conteudo_descricao").innerHTML = data_json[id].originalText;
    document.getElementById("conteudo_ataque").innerHTML = data_json[id].power || 'NA';
    document.getElementById("conteudo_defesa").innerHTML = data_json[id].toughness|| 'NA';
    document.getElementById("conteudo_altura").innerHTML = data_json[id].manaCost|| 'NA';
}


/*
#
# Sistema de Template
#
*/

function card_magic(id,nome,tipo,img){

    return '<div class="col-6 col-md-3" onClick="javascript:btCard(\''+id+'\');" data-id="'+id+'">'+
                '<div class="card_magic color_'+tipo+'">'+
                '<div class="info_carta">'+
                    '<h3>'+nome+'</h3>'+
                    '<span class="badge rounded-pill bg-alert-magic">'+tipo+'</span>'+
                '</div>'+
                '<img src="'+img+'" class="img_carta">'+
                '</div>'+
            '</div>';
}

/*
#
# Cache Dinâmico (json / imgs)
#
*/
var cache_dinamico_json = function(){

    localStorage[CACHE_DINAMICO] = JSON.stringify(data_json);
}

/*
#
# Botao de Instalação
#
*/

let janelaInstalacao = null;

const btInstall = document.getElementById("btInstall");

window.addEventListener('beforeinstallprompt', gravarJanela);

function gravarJanela(evt){
    janelaInstalacao = evt;
}

let inicializarInstalacao = function(){

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener("click", function(){

        janelaInstalacao.prompt();

        janelaInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário fez a instalação do app");
            }else{
                console.log("Usuário NÃO fez a instalação do app");
            }

        });

    });

}

/*
#
# Funções Extras
#
*/
function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}