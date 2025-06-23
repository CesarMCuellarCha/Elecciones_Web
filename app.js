/**
 * Varibales para guardar los candidatos
 * obtenidos desde el archivo json utilizando api fetch
 */
let candidatos=[]
/**
 * Variable para almacenar los votos
 */
let votos
/**
 * Variable para guardar los datos del administrador que se 
 * obtienen mediante api fetch
 */
let administrador=null

/**
 * div donde se van a colocar los candidatos
 */
const divCandidatos = document.querySelector("#candidatos")

/**
 * hace referencia al botón para abrir las elecciones
 */
const btnAbrir = document.querySelector("#btnAbrir")

/**
 * Hace referencia al botón para cerrar las elcciones
 */
const btnCerrar = document.querySelector("#btnCerrar")

/**
 * Para ir guardando el estado de las eleccioes
 * que puede ser cerrado o abierto
 */
let estadoElecciones

if (localStorage.estadoElecciones){
    estadoElecciones = localStorage.estadoElecciones
    if (estadoElecciones=="Abierto"){
        divCandidatos.classList.remove('div-deshabilitado')   
        btnCerrar.disabled=false
        btnAbrir.disabled=true 
    }else{
        divCandidatos.classList.add('div-deshabilitado')   
        btnCerrar.disabled=true
        btnAbrir.disabled=false 
    }    
}else{
    estadoElecciones="Cerrado"
    localStorage.setItem("estadoElecciones", estadoElecciones)
    divCandidatos.classList.add('div-deshabilitado')   
    btnCerrar.disabled=true
    btnAbrir.disabled=false 
}
/**
 * Validación si existe la variable resultadovotos mediante
 * localstorage. Si existe actualiza votos, de lo contrario
 * inicia la variable con 0.
 */
if (localStorage.resultadoVotos){
    votos = JSON.parse(localStorage.resultadoVotos)
}else{
    votos = [0,0,0,0]
    localStorage.setItem("resultadoVotos", JSON.stringify(votos))
}
/**
 * Llamar a la función que obtiene los candidatos cuando carga el documento
 */
document.addEventListener("DOMContentLoaded", obtenerCandidatos)

/**
 * función que obtiene los candidatos
 * desde un archivo json externo
 */
function obtenerCandidatos(){
    const url = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/candidatos.json"
    const opciones = {
        "method": "GET"
    }    
    fetch(url,opciones)
    .then(respuesta=>respuesta.json())
    .then(datos=>{
        console.log(datos)
        /**
         * asignamos a candidatos los datos que contiene un arreglo
         * con objetos json         * 
         */
        candidatos = datos
        /**
         * Llamar a la función mostrarCandidatos quien se encarga de 
         * crearlos dinicamente en el documento html
         */
        mostrarCandidatosVersion2()
    })
    .catch(error=>console.log(error))
}

/**
 * Función que obtiene las credenciales del administrador
 * usando api fetch
 */
function obtenerDatosAdministrador(){
    const url = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/administrador.json"

    const opciones = {
        "method": "GET"
    }

    fetch(url,opciones)
    .then(resultado=>resultado.json())
    .then(datos=>{
        administrador=datos
        console.log(administrador)
    })
    .catch(error=>console.log(error))
}

/**
 * Función que se encarga de crear los candidatos
 * de forma dinamica en el documento html
 */
function mostrarCandidatos(){
    const divCandidatos = document.querySelector("#candidatos")
    candidatos.forEach((candidato,index) => {
        let divCandidato = document.createElement("div")
        divCandidato.classList.add("card")
        divCandidato.classList.add("col")
        divCandidato.classList.add("ms-1")
        divCandidatos.appendChild(divCandidato)
        /////
        let divEncabezado = document.createElement("div")
        divEncabezado.classList.add("card-header")
        divEncabezado.textContent=candidato.curso
        divCandidato.appendChild(divEncabezado)
        /////
        let divBody = document.createElement("div")
        divBody.classList.add("card-body")
        let foto = document.createElement("img")
        foto.classList.add("rounded")
        foto.classList.add("img-fluid")
        foto.classList.add("mx-auto")
        foto.classList.add("d-block")
        foto.src=candidato.foto
        foto.style.width=50
        foto.style.height=50
        /**
         * Agregar el evento click al elemento img. La cual
         * se muestra una interfaz mediante la librería sweetalert
         * para verificar si está seguro de votar por el candidato
         */
        foto.addEventListener("click",()=>{
            Swal.fire({
                title: "¿Esta usted seguro de Votar?",
                text: "Por " + candidato.nombre + " " + candidato.apellido,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "SI",
                cancelButtonText: "NO"
                }).then((result) => {
                if (result.isConfirmed) {
                     votos[index]++
                    localStorage.setItem("resultadoVotos",JSON.stringify(votos))
                }
            });
           
        })
        divBody.appendChild(foto)
        divCandidato.appendChild(divBody)
        ///
        divFooter = document.createElement("div")
        divFooter.classList.add("card-footer")
        let aprendizFooter = document.createElement("p") 
        aprendizFooter.innerHTML="<b>Aprendiz: </b> " + candidato.nombre 
                                + " " + candidato.apellido
        divFooter.appendChild(aprendizFooter)
        let fichaFooter = document.createElement("p")
        fichaFooter.innerHTML="<b>Ficha: </b> " + candidato.ficha
        divFooter.appendChild(fichaFooter)
        divCandidato.appendChild(divFooter)
        divCandidatos.appendChild(divCandidato)

    });
}

/**
 * función que crea los candidatos de manera dinamica
 * en el documento thml
 */
function mostrarCandidatosVersion2(){
  
    let tarjetaCandidato = ""
    candidatos.forEach((candidato,index) => {
        tarjetaCandidato += '<div class="card col ms-1">' 
        tarjetaCandidato += '<div class="card-header">'+ candidato.curso +'</div>'
        tarjetaCandidato += '<div class="card-body"><img src="'+ candidato.foto  
                                +'" class="rounded img-fluid mx-auto d-block" '
                                + 'width="150" height="180" onclick="votar('+index+')"></div>'
        tarjetaCandidato += '<div class="card-footer"><p><b>Aprendiz:</b>'+candidato.nombre 
                                + " " + candidato.apellido +'</p><p><b>Ficha: </b>'
                                + candidato.ficha  +'</p</div></div>'
        tarjetaCandidato += '</div>'
    })
    divCandidatos.innerHTML=tarjetaCandidato
}

/**
 * Función que recibe la posición en el arreglo
 * del candidato al cuál se le da click para
 * votar
 * @param {int} index 
 */
function votar(index){
    Swal.fire({
        title: "¿Esta usted seguro de Votar?",
        text: "Por " + candidatos[index].nombre + " " + candidatos[index].apellido,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "SI",
        cancelButtonText: "NO"
        }).then((result) => {
            if (result.isConfirmed) {
                    votos[index]++
                    localStorage.setItem("resultadoVotos",JSON.stringify(votos))
            }
        });
}



btnAbrir.addEventListener("click", ()=>{
    obtenerDatosAdministrador()
})


btnCerrar.addEventListener("click", ()=>{
    obtenerDatosAdministrador()
})

const btnValidarAdministrador = document.querySelector("#btnValidarAdministrador")
btnValidarAdministrador.addEventListener("click",()=>{
    let username = document.querySelector("#txtUsername")
    let password = document.querySelector("#txtPassword")

    if(username.value === administrador.username &&
        password.value === administrador.password
    ){
        if (localStorage.estadoElecciones=="Cerrado"){
            Swal.fire("Inicio de Elecciones","Se da inicio a las elecciones","success")
            votos = [0,0,0,0]
            localStorage.setItem("resultadoVotos", JSON.stringify(votos))
            btnCerrar.disabled=false
            btnAbrir.disabled=true
            //habilitar el div donde están los candidatos
            divCandidatos.classList.remove('div-deshabilitado')        
            localStorage.estadoElecciones="Abierto"          
        }else{
            let resultados = "<b>"+candidatos[0].nombre+ " "+candidatos[0].apellido + "</b> =" + votos[0] + "<br>" + 
                    "<b>"+candidatos[1].nombre+ " "+candidatos[1].apellido + "</b>=" + votos[1] + "<br>" + 
                   "<b>"+ candidatos[2].nombre+ " "+candidatos[2].apellido + "</b>=" + votos[2] + "<br>" + 
                    "<b>"+candidatos[3].nombre+ " "+candidatos[3].apellido + "</b>=" + votos[3]
            Swal.fire("Cierre de Elecciones","Resultado Elecciones: <br>" + resultados,"success")            
            btnCerrar.disabled=true
            btnAbrir.disabled=false
            //habilitar el div donde están los candidatos
            divCandidatos.classList.add('div-deshabilitado');            
            localStorage.estadoElecciones="Cerrado" 
            votos = [0,0,0,0]
            localStorage.setItem("resultadoVotos", JSON.stringify(votos))
        }
        
    }else{
        Swal.fire("Validar Administrador","Credenciales no validas","warning")
    }

    username.value=""
    password.value=""
})