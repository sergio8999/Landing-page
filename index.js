var nombre = false, email = false, contrasena=false;
var vista1 = true, mostrado = false;

$(function(){
    obtenerUbicacion();
    obtenerServicios();
    comprobarFormulario();

    /* Mostrar efecto al llegar a los comentarios */
    $(window).on('scroll',function(){
        if($(window).scrollTop()+$(window).height() >= $("#sectionTestimonios").position().top + 50 && !mostrado){
            obtenerTestimonios();
            mostrado = true;
        }
    });
 
    /* Animacion para boton subscribirte */
    $("#subscribirse").on('click',function(){
        $("html").animate({
            scrollTop: $("#sectionForm").position().top
        },3000);
    })

    /* Animacion para boton subir */
    $("#subir").on('click',function(){
        $("html").animate({
            scrollTop: $("header").position().top
        },4000);
    })

    /* Advertencia al enviar formulario */
    $("#botonEnviar").on('click',function(){
        if(!nombre || !email || !contrasena)
            $("form p").css("visibility","visible")
        else
            enviarFormulario();
    })

    /* Cambiar vista testimonios */
    $("#cambiarVista").on('click',function(){
        vista1 = !vista1;
        obtenerTestimonios();
    });

    setInterval(cambiarTestimonios,10000);   
})

function obtenerUbicacion(){
    let reverseGeocoder=new BDCReverseGeocode();
    reverseGeocoder.getClientLocation(function(result) {
        console.log(result.city);
    })
}



function enviarFormulario(){
    $("form p").css("visibility","hidden");
    $("#nombre").val("");
    $("#email").val("").prop("disabled",true);
    $("#contrasena").val("").prop("disabled",true);
    nombre = false;
    email = false;
    contrasena = false;
}

function comprobarFormulario(){
    let comprobarEmail = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);

    $("#nombre").on('keyup',function(){
        if($("#nombre").val().length > 2){
            $("#email").prop("disabled",false);
            $("form p").css("visibility","hidden");
            nombre =true;
        }else{
            $("#email").prop("disabled",true);
            $("#contrasena").prop("disabled",true);
            nombre = false;
        }
    })

    $("#email").on('keyup',function(){
        if(comprobarEmail.test($("#email").val())){
            $("#contrasena").prop("disabled",false);
            $("form p").css("visibility","hidden");
            email = true;
        }else{
            $("#contrasena").prop("disabled",true);
            email = false;
        } 
    })

    $("#contrasena").on('keyup',function(){
        if($("#contrasena").val().length > 2 && nombre && email){
            $("form p").css("visibility","hidden");
            contrasena =true;
        }else{
            contrasena = false;
        }
    })
}

function obtenerTestimonios(){
    $.ajax("testimonios.json")
     .done(function(testimonios) {
        maquetarTestimonios(testimonios);
    })
    .fail(function() {
        setTimeout(obtenerTestimonios,5000);
        console.log("intentando");
    })
    .always(function(){
    } )
  } 

  function obtenerServicios(){
    $.ajax("servicios.json")
     .done(function(servicios) {
        maquetarServicios(servicios);
    })
    .fail(function() {
        setTimeout(obtenerServicios,5000);
        console.log("intentando");
    })
    .always(function(){
    } )
  } 

  function maquetarTestimonios(testimonios){
    $("#sectionTestimonios").empty();
    let max = testimonios.testimonios.length;
    
    if(!vista1){
        let tabla = $("<table>").append($("<tr>")
                                .append($("<th>Nombre</th>"))
                                .append($("<th>Comentario</th>"))
                                .append($("<th>fecha</th>")))
                                .css("display","none");

        $("#sectionTestimonios").append($(tabla).fadeIn(3000,"linear"));
    }

    for(let i=0;i<3;i++){
        let aleatorio = Math.floor(Math.random() * (max - 0)+ 0);
        if(vista1)
            maquetarTestimonioNormal(testimonios.testimonios[aleatorio]);
        else
            maquetarTestimonioTabla(testimonios.testimonios[aleatorio]);
      } 
  }

  function maquetarTestimonioNormal(testimonio){
    let divTestimonio = $("<div>").append($("<h4>").text(testimonio.nombre))
                                  .append($("<p>").text(testimonio.texto))
                                  .append($("<p>").text(testimonio.fecha))
                                  .css("display","none");

    $("#sectionTestimonios").append($(divTestimonio).fadeIn(3000,"linear"));
  }

  function maquetarTestimonioTabla(testimonio){
    let fila = $("<tr>").append("<td>"+ testimonio.nombre +"</td>")
                        .append("<td>"+ testimonio.texto +"</td>")
                        .append("<td>"+ testimonio.fecha +"</td>");

    $("table").append($(fila));
  }

  function maquetarServicios(servicios){
      for(let i=0;i<servicios.servicios.length;i++){
        let divServicio = $("<div>")
        let aEnlace = $("<a class='no-decoration' href='"+servicios.servicios[i].link +"' target='_blank'></a>")
                              .append("<img src='"+ servicios.servicios[i].imagen +"'>")
                              .append($("<h3>").text(servicios.servicios[i].titulo))
                              .append($("<p>").text(servicios.servicios[i].texto))

        $(divServicio).append($(aEnlace));
        $("#servicios").append($(divServicio));
      }
  }

  function cambiarTestimonios(){
    $("#sectionTestimonios div").fadeOut(3000,"linear").promise().done(() => {
    obtenerTestimonios();
 });
}