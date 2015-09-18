if(localStorage.getItem('user')){
	window.location.href="index.html"
};

$("input").keypress(function(e) {
    if(e.which == 13) {
        register()
    }
});
function register() {
    var usuario = $("input[name=user]").val();
    var genre = $("select[name=genre]").val();
    var email = $("input[name=email]").val();
    var passin = $("input[name=pass]").val();
    var passinc = $("input[name=confpass]").val();
    var birthday = $("input[name=birthday]").val();
    var telf = $("input[name=telf]").val();
    if(passin == passinc){
    $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/connect/register.php",
          data: {"usuario": usuario, "genero": genre, "email": email, "password": passin, "passwordc": passinc, "cumple": birthday, "telefono": telf},
          cache:false,
          dataType: 'json',
          beforeSend: function() {
          console.log('Connecting...');
           $('#login-button').hide();
           $('.card-content').css('display','none');
           var sending = '<div id="loading" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>';
           $('.card').append(sending);
          },
          success: function(result) {
             $('.card-content').css('display','block');
              $('#loading').remove();
              $('#login-button').show();
             if(result.mensaje == 'ok'){
                console.log(result.mensaje);
                var passinput = md5(passin);
	            login(usuario,passinput,'login');
             }else{
	             if(result.mensaje == 'e1'){
		            $.ajax({
                      type: "POST",
                      crossDomain: true,
                      url: "http://m2s.es/app/api/connect/signout.php",
                      data: {},
                      cache:false,
                      dataType: 'json',
                      success: function(result) {
                       if(result.mensaje == 'ok'){
	                     window.location.href="signup.html"
                       }
                      }
                     })
	             };
	             if(result.mensaje == 'e2'){
                  navigator.notification.alert(Language.passnotmatch, alertDismissed,'M2S','OK');
                  function alertDismissed(){
	                  $('.card-content').css('display','block');
                    $('#loading').remove();
                    $('#login-button').show();
                  }
	             };
	             if(result.mensaje == 'e3'){
                  navigator.notification.alert(Language.userregisterlater, alertDismissede,'M2S','OK');
                  function alertDismissede(){
	                  $('.card-content').css('display','block');
                    $('#loading').remove();
                    $('#login-button').show();
                  }
	             };
	             if(result.mensaje == 'e4'){
                  navigator.notification.alert(Language.emailregisterlater, alertDismissedee,'M2S','OK');
                  function alertDismissedee(){
	                  $('.card-content').css('display','block');
                    $('#loading').remove();
                    $('#login-button').show();
                  }
	             };
	             if(result.mensaje == 'e6'){
                  navigator.notification.alert(Language.requiredfieldsnotenter, alertDismissedeee,'M2S','OK');
                  function alertDismissedeee(){
	                  $('.card-content').css('display','block');
                    $('#loading').remove();
                    $('#login-button').show();
                  }
	             }
             }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus+' '+XMLHttpRequest.status);
            navigator.notification.alert(Language.errorpetitionm2s, alertDismissedeeee,'M2S','OK');
            function alertDismissedeeee(){
              $('.card-content').css('display','block');
              $('#loading').remove();
              $('#login-button').show();
            }
          }
    })
    }else{
	   Android.showDialog(Language.passnotmatch);
    }
}