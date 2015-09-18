function login(usern,pass,type){
	  $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/connect/login.php",
          data: {"user": usern, "passmd5": pass},
          cache:false,
          dataType: 'json',
          beforeSend: function() {
          console.log('Connecting...');
          if(type == 'login'){
            $('#login-button').hide();
            $('.card-content').css('display','none');
            var sending = '<div id="loading" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>';
            $('.card').append(sending);
          }
          },
          success: function(result) {
            if(result.mensaje == 'OK'){
              if(type == 'key'){
	             keyuser = result.key;
                 keyuser = keyuser.replace('==','');
                 localStorage.setItem("keyuser", keyuser); 
                 var href = $(location).attr('href'); 
 	             window.location.href = href;
              }
              if(type == 'login'){
                if (localStorage) {
                  localStorage.setItem("user", usern);  
                  localStorage.setItem("passwd", pass); 
                  if(result.data.imagepr != null){
                    localStorage.setItem("imguse", result.data.imagepr); 
                  }
                  localStorage.setItem("emailMD5", md5(result.data.email));  
                  keyuser = result.key;
                 keyuser = keyuser.replace('==','');
                 localStorage.setItem("keyuser", keyuser);
                  setInterval(function(){
                    window.location.href="index.html";
                  },4000);
                }else{
	              Android.showDialog('This app needs localstorage!');
                };
              }else{ 
               if(type == 'session'){
	             $.ajax({
                   type: "POST",
                   crossDomain: true,
                   url: 'http://m2s.es/app/api/notifications.php',
                   data:{},
                   cache:false,
                   dataType: 'json',
                   success: function(data) {
                     if(data.nosession == '1'){
                       login(user,passmd5,'key');
                     }else{
	                   var href = $(location).attr('href'); 
 	                   window.location.href = href;  
                     }
                   }
                 })
               }
              }
              console.log('Completed session');
              };
            if(result.mensaje == 'e2'){
              navigator.notification.alert(Language.datanotenter, alertDismissed,'M2S','OK');
              function alertDismissed(){
                if(type == 'login'){
                  $('.card-content').css('display','block');
                  $('#loading').remove();
                  $('#login-button').show();
                }
              }
              console.log("Data not entered");
            }
            if(result.mensaje == 'e3'){
             if(type == 'login'){
              navigator.notification.alert(Language.userpassincorrect, alertDismissede,'M2S','OK');
              function alertDismissede(){
                $('.card-content').css('display','block');
                $('#loading').remove();
                $('#login-button').show();
                $('input[name="user"]').val('');
                $('input[name="pass"]').val('');
              }
              }else{
	              localStorage.removeItem('user');
	              localStorage.removeItem('passwd');
	              window.location.href="login.html"
              }
              console.log("The username or password are incorrect.");
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus+' '+XMLHttpRequest.status); 
            if(type == 'login'){
              navigator.notification.alert(Language.errorpetitionm2s, alertDismissedee,'M2S','OK');
              function alertDismissedee(){
                $('.card-content').css('display','block');
                $('#loading').remove();
                $('#login-button').show();
                $('input[name="user"]').val('');
                $('input[name="pass"]').val('');
              }
            }else{
	          var divno = document.createElement('div');
              divno.innerHTML='<div id="list-notifications" style="text-align:center;cursor:pointer"></div>';
              divno.className='background-dark';
              var modsv = document.getElementById('modsv');
              modsv.appendChild(divno);
              $('#list-notifications').append(Language.errorconection);
              $('#list-notifications').click(function(){
                window.location.reload(); 
              })
            }  
          }
     })
	}