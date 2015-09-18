   if (!localStorage.getItem('user')) {
       window.location.href = "login.html"
   }
   var user = localStorage.getItem('user');
   var passmd5 = localStorage.getItem('passwd');
   var keyuser = localStorage.getItem('keyuser');

   if(localStorage.getItem('barnotif')){
      $('body').prepend('<div class="bar-notification"></div>');
      $('nav').css('margin-top','21px');
      if($('nav.profile').length != '0'){
        $('header').css('top','21px');
        $('.clasmod').css('top','341px');
      }
   }

   if(localStorage.getItem('darkmode')){
      $('body').addClass('dark');
      $('.black-text').addClass('white-text');
      $('.black-text').removeClass('black-text');
      $('textarea').addClass('white-text');
      $('input').addClass('white-text');
      $('label').addClass('white-text');
   }

   $('.msmdiv').css('height','100%').css('height','-=170px');
   $('.sendtxtd').css('width','100%').css('width','-=130px');
   
   if(localStorage.getItem('customfont')){
      $('body').addClass(localStorage.getItem('customfont'));
   }

   var pushNotification;

   document.addEventListener("deviceready", onDeviceReady, false);

   function onDeviceReady() {
      pushNotification = window.plugins.pushNotification;
      pushNotification.register(succeshnaj, erorhanj,{"senderID":"131220166142","ecb":"onNotificationGCM"});
   }

   function succeshnaj(){
        console.log('Notifications push correct!');
      };
      function erorhanj(){
        alert("Error of notifications push");
      }
      function onNotificationGCM(e) {
        switch(e.event) {
        case 'registered':
            if ( e.regid.length > 0 ) {
                console.log("Id registro: " + e.regid);
                 $.ajax({
                    type: "POST",
                    crossDomain: true,
                    url: "http://m2s.es/app/api/androidnwdevice.php",
                    data: {"idregd": e.regid, "key": keyuser},
                    cache: false,
                    dataType: 'json',
                    success: function (result) {
                      if(result.mensaje == 'ok'){
                        console.log('Notifications push: OK');
                        /*alert(e.regid);*/
                      }else{
                        alert('Error of notifications push!');
                      }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                      console.error(textStatus + ' ' + XMLHttpRequest.status);
                      if ($('#list-notifications .item').length == '0') {
                        $('.background-dark').remove();
                      }
                      errormod(Language.errorpetitionm2s);
                    }
                })
            }
        break;
        case 'message':
          if(e.typegd == 'usc'){
              alert('chat.html?id='+e.iduser);
          }else{
             if(e.typegd == 'uscgr'){
                document.location.href= 'chatgr.html?id='+e.iduser;
             }
          }
          var my_media = new Media("/android_asset/www/sounds/notification.ogg");
          my_media.play();
          notifications();
        break;
        case 'error':
            alert('GCM error = '+e.msg);
        break;
        default:
           alert('Ocurrió un evento desconocido de GCM');
        break;
        }
      }

   function errormod(texrt){
        navigator.notification.alert(
            texrt,  
            function(){},         
            'Error',            
            'OK'
        );
   }

   function salert(texrt, funck){
        navigator.notification.alert(
            texrt,  
            funck,         
            'Info',            
            'OK'
        );
   }

   navigator.geolocation = {};
   navigator.geolocation.getCurrentPosition = function(callback) {
    $.get('https://maps.googleapis.com/maps/api/browserlocation/json?browser=chromium&sensor=true', function(data) { 
        var position = {
            coords : {
                latitude : data.location.lat,
                longitude : data.location.lng
            }
        };
        callback(position);
    });
  };

   function convertImgToBase64(url, callback, outputFormat){
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var img = new Image;
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up
        canvas = null; 
      };
      img.src = url;
  }

   function datahours() {
       var now = new Date();
       var hour = 60 * 60 * 1000;
       var min = 60 * 1000;
       var madrid = new Date(now.getTime() + (now.getTimezoneOffset() * min) + ('1' * hour)).getHours();
       var d = new Date();
       var local = d.getHours();
       var diference = madrid - local;
       if (diference < '0') {
           var diferencenew = diference *= -1;
       } else {
           if (diference != '0') {
               var diferencenew = '-' + diference;
           } else {
               var diferencenew = '0';
           }
       }
       if (localStorage) {
           localStorage.setItem("datehours", diferencenew);
       }
   }


   function convert(data) {
       if (localStorage.getItem('datehours')) {
           var diferenced = parseInt(localStorage.getItem('datehours'));
       } else {
           if (localStorage) {
               datahours();
               var diferenced = parseInt(localStorage.getItem('datehours'));
           } else {
               datahours();
               var diferenced = parseInt(diferencenew);
           }
       }
       t = data.split(' ');
       r = new Object;
       r.dia = t[0].substr(8, 2);
       r.mes = t[0].substr(5, 2);
       r.ano = t[0].substr(0, 4);
       r.hora = parseInt(t[1].substr(0, 2));
       r.minutos = t[1].substr(3, 2);
       d = new Date(r.ano, r.mes, r.dia, r.hora + diferenced, r.minutos);
       resdia = ("0" + d.getDate()).slice(-2);
       resmes = ("0" + d.getMonth()).slice(-2);
       resano = d.getFullYear();
       reshora = ("0" + d.getHours()).slice(-2);
       resminutos = ("0" + d.getMinutes()).slice(-2);
       ret = resdia + "/" + resmes + "/" + resano + " "+Language.at+" " + reshora + ":" + resminutos;
       return ret;
   };

   function showBrowser(url){
        window.open(url, '_blank', 'location=yes');
    }

    function imageView(url){
        var imgd = document.createElement("div");
        imgd.setAttribute("id", "materialbox-overlay");
        imgd.setAttribute("class", "materialboxclossed");
        document.body.appendChild(imgd);
        var imgdd = document.createElement("img");
        imgdd.setAttribute("class", "materialboxed responsive-img active");
        imgdd.setAttribute("src", url);
        imgdd.setAttribute("style", "position: fixed;z-index: 10000000000;padding: 40px;top: 50%;height: 100%;padding-bottom: 95px;text-align: center;left:50%");
        document.body.appendChild(imgdd);
        $('.materialboxed').css('margin-top', ($('.materialboxed').height() + 135)/2 * -1);
        $('.materialboxed').css('margin-left', ($('.materialboxed').width() + 80)/2 * -1);
        var imgbir = document.createElement("div");
        imgbir.setAttribute("class", "btn downloadimgr");
        imgbir.appendChild(document.createTextNode(Language.download));
        imgbir.setAttribute("style", "position: fixed;z-index: 10000000000;");
        document.body.appendChild(imgbir);
        $('.downloadimgr').css("top", $('.materialboxed').height() + 60);
        $('.downloadimgr').css("left", $('img.materialboxed').offset().left + 40);
        $('.downloadimgr').css("width", $('.materialboxed').width());
        $('.downloadimgr').click(function(){
          $('.downloadimgr').addClass('disabled');
          $('.downloadimgr').html(Language.loading);
          LibraryHelper.saveImageToLibrary(function(){$('.downloadimgr').removeClass('disabled'); $('.downloadimgr').html(Language.download); salert('Image downloaded succesfully in your gallery!', function(){})}, function(){errormod('Error downloading image!')}, url, 'M2S images'); 
        });
        $(window).resize(function() {
          $('.materialboxed').css('margin-top', ($('.materialboxed').height() + 135)/2 * -1);
          $('.materialboxed').css('margin-left', ($('.materialboxed').width() + 80)/2 * -1);
          $('.downloadimgr').css("top", $('.materialboxed').height() + 60);
          $('.downloadimgr').css("left", $('img.materialboxed').offset().left + 40);
          $('.downloadimgr').css("width", $('.materialboxed').width());
        });
        $('img.materialboxed').click(function(){
            $('.materialboxclossed').remove();
            $('img.materialboxed').remove();
            $('.downloadimgr').remove();
        })
    }

   function linkscom(textdf) {
       var str = textdf;
       var exp = /((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?=([^"']*["'][^"']*["'])*[^"']*$)/ig;
       var exp2 = /((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+\.(?:jpe?g|gif|png))(?=([^"']*["'][^"']*["'])*[^"']*$)/ig;
       var exp3 = /(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/ig;
       var instag = /(?:http:\/\/)?(?:www\.)?(?:instagram\.com)\/(?:p)\/?(.+)\/(?:([^"']*["'][^"']*["'])*[^"']*$)/ig;
       var images = str.replace(exp2, "<a href=\"javascript:imageView(&quot;$1&quot;)\"><div class=\"imagechat\"><img src=\"$1\"/></div></a>");
       var youtube = images.replace(exp3, "<div id='maxwidthyo'><div class='videoWrapper'><iframe frameborder='0' allowfullscreen src='http://www.youtube.com/embed/$1'/></div></div>");
       var linksd = youtube.replace(instag, "<style>.embed-container {position: relative; padding-bottom: 110%; height: 0; overflow: hidden;} .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container' ><iframe src='http://instagram.com/p/$1/embed/' frameborder='0' scrolling='no' allowtransparency='true'></iframe></div>");
       var links = linksd.replace(exp, "<a href=\"javascript:showBrowser('$1')\">$1</a>");
       return links
   }

   function acceptgrj(idgroup, id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/acceptpjg.php",
           data: {"id": idgroup, "iduser": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#acceptpeogroup-' + id).attr('disabled', true);
               $('#acceptpeogroup-' + id).html(Language.loading)
           },
           success: function (result) {
               if (result.mensaje == 'ok') {
                   setInterval(function () {
                       $('#fgr-' + id).fadeOut(500, function () {
                           $('#fgr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                   }, 3000);
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   }

   function blockgrj(idgroup, id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/blockpjg.php",
           data: {"id": idgroup, "iduser": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#blockpeogroup-' + id).attr('disabled', true);
               $('#blockpeogroup-' + id).html(Language.loading)
           },
           success: function (result) {
               if (result.mensaje == 'ok') {
                   setInterval(function () {
                       $('#fgr-' + id).fadeOut(500, function () {
                           $('#fgr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                   }, 3000);
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   }

   function acceptfriend(id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/acceptfriend.php",
           data: {"id": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#acceptfriend-' + id).attr('disabled', true);
               $('#acceptfriend-' + id).html(Language.loading)
           },
           success: function (result) {
               if (result.mensaje == 'ok') {
                   setInterval(function () {
                       $('#fr-' + id).fadeOut(500, function () {
                           $('#fr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                       if (document.location.pathname.indexOf("index.html") != 0) {
                           document.location.href = 'index.html';
                       }
                   }, 3000);
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   };

   function blockuser(id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/blockuser.php",
           data: {"recid2": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#blockuser-' + id).attr('disabled', true);
               $('#blockuser-' + id).html(Language.loading)
           },
           success: function (result) {
               console.log(result.mensaje);
               if (result.mensaje == 'ok') {
                  if($('#closenotifications')){
                   setInterval(function () {
                       $('#fr-' + id).fadeOut(500, function () {
                           $('#fr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                   }, 3000);
                  }else{
                    var pathname = window.location.pathname;
                    if(pathname == '/chat.html'){
                      document.location.href = 'app.html';
                    }
                  }
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   };
   function deletefriend(id){
      $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/connect/deletefriend.php",
          data: {"id": id, "key": keyuser},
          cache: false,
          dataType: 'json',
          beforeSend: function () {
              console.log('Connecting to delete friend...');
          },
          success: function (result) {
              if (result.mensaje == 'ok') {
                  salert(Language.succesdeletefriend, function(){
                  var pathname = window.location.pathname;
                  if(pathname == '/chat.html'){
                    document.location.href= 'app.html';
                  }
                  if(pathname == '/profile.html'){
                    document.location.href= 'profile.html?id='+id;
                  }
                });
              }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.error(textStatus + ' ' + XMLHttpRequest.status);
              errormod(Language.errorpetitionm2s);
          }
      })
   }
   function notifications() {
       console.log('Checking notifications...');
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: 'http://m2s.es/app/api/notifications.php',
           data: {"key": keyuser},
           cache: false,
           dataType: 'json',
           success: function (result) {
               if (result.listnotify != null) {
                   function litsnotify() {
                       if($('.background-dark').length != '0'){
                         $('.background-dark').remove();
                       }
                       var divno = document.createElement('div');
                       divno.innerHTML = '<span id="closenotifications"><i class="mdi-content-clear"></i></span><div id="list-notifications"></div>';
                       divno.className = 'background-dark';
                       var modsv = document.getElementById('modsv');
                       modsv.appendChild(divno);
                       for (var i = 0; i < result.listnotify.length; i++) {
                           id = result.listnotify[i].id;
                           username = result.listnotify[i].username;
                           imgp = result.listnotify[i].imgp;
                           type = result.listnotify[i].type;
                           if (type == 'friend-request') {
                               itemlist = '<div class="item" id="fr-' + id + '">';
                           } else {
                               if (type == 'addgroup-request') {
                                   itemlist = '<div class="item" id="fgr-' + id + '">';
                               } else {
                                   if(type == 'message'){
                                     itemlist = '<div class="item chmsmb-' + id + '">';
                                   }else{
                                     if(type == 'message-group'){
                                       itemlist = '<div class="item chgrmsmb-' + id + '">';
                                     }else{
                                       itemlist = '<div class="item">';
                                     }
                                 }
                               }
                           }
                           itemlist += '<img class="circle responsive-img" src="' + imgp + '"/>';
                           itemlist += '<div class="right-img">';
                           itemlist += '<span>' + username + '</span>';
                           if (type == 'friend-request') {
                               itemlist += ' '+Language.wantsyourfriend;
                               itemlist += '<button id="acceptfriend-' + id + '" onclick="acceptfriend(' + id + ')" class="waves-effect waves-light btn">'+Language.accept+'</button>';
                               itemlist += '<button id="blockuser-' + id + '" onclick="blockuser(' + id + ')" class="waves-effect waves-light btn red">'+Language.block+'</button>';
                           };
                           if (type == 'message') {
                               msm = result.listnotify[i].msm;
                               itemlist += ' '+Language.saidyou+': ' + msm;
                               var url = 'chat.html?id=' + id +'';
                               itemlist += '<a href="' + url + '" id="close-click"><button class="waves-effect waves-light btn">'+Language.read+'</button></a>';
                           };
                           if (type == 'message-group') {
                               msm = result.listnotify[i].msm;
                               namegroup = result.listnotify[i].namegroup;
                               itemlist += ' '+Language.saidingroup+' ' + namegroup + ': ' + msm;
                               itemlist += '<a href="chatgr.html?id=' + id + '"><button class="waves-effect waves-light btn">'+Language.read+'</button></a>';
                           }
                           if (type == 'addgroup-request') {
                               idgroup = result.listnotify[i].idgroup;
                               namegroup = result.listnotify[i].namegroup;
                               itemlist += ' '+Language.joinyourgroup+' ' + namegroup;
                               itemlist += '<button onclick="acceptgrj(' + idgroup + ',' + id + ')" id="acceptpeogroup-' + id + '" class="waves-effect waves-light btn">'+Language.accept+'</button>';
                               itemlist += '<button onclick="blockgrj(' + idgroup + ',' + id + ')" id="blockpeogroup-' + id + '" class="waves-effect waves-light btn red">'+Language.block+'</button>';
                           }
                           itemlist += '</div></div>';
                           $('#list-notifications').append(itemlist);
                           $('#list-notifications').css('height','100%').css('height','-=120px');
                       }
                       $('#closenotifications').click(function () {
                           $('.background-dark').remove();
                       })
                       $('#close-click').click(function () {
                           $('.background-dark').remove();
                       })
                   }
               }
               if (result.mensaje == 'nologin') {
                   console.log('No session');
                   login(user, passmd5, 'session');
               } else {
                   if (result.newnotication != '0') {
                   }
                   if (result.notification != '0') {
                        if($('.bar-notification').length == '0'){
                          $('body').prepend('<div class="bar-notification clickable">'+Language.havenewnotifications+'</div>');
                          $('nav').css('margin-top','21px');
                          if($('nav.profile').length != '0'){
                              $('header').css('top','21px');
                              $('.clasmod').css('top','341px');
                          }
                          $('.bar-notification').click(function(){
                              litsnotify();
                          });
                          localStorage.setItem('barnotif', '1');
                          console.log('You have notifications!');
                        }else{
                          if($('.bar-notification clickable').length == '0'){
                             $('.bar-notification').html(Language.havenewnotifications);
                             $('.bar-notification').click(function(){
                                 litsnotify();
                             });
                             $('.bar-notification').addClass('clickable');
                          }
                        }
                   } else {
                       $('.bar-notification').remove();
                       $('nav').css('margin-top','0px');
                       if($('nav.profile').length != '0'){
                          $('header').css('top','0px');
                          $('.clasmod').css('top','320px');
                       }
                       console.log('No notifications!');
                       localStorage.removeItem('barnotif');
                   }
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
           }
       })
   }


   function signout() {
      navigator.notification.confirm(
        Language.suresignout, function(buttonIndex){
          if(buttonIndex == '2'){
            var pushNotification;
            pushNotification = window.plugins.pushNotification;
            pushNotification.unregister(successHaddndler, errorfffHandler, {"senderID":"131220166142"});
          }
    },
    Language.signout,
    ['Cancel','Yes']);
   }

   function errorfffHandler(){
      alert('error!');
   }

   function successHaddndler(){
      $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/androidrmdevice.php",
          data: {"key": keyuser},
          cache: false,
          dataType: 'json',
          success: function (result) {
            if (result.mensaje == 'ok') {
                localStorage.clear();
                document.location.href = "firstin.html"
            } else {
                console.log('Error to sign out');
                alert('Error!');
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus + ' ' + XMLHttpRequest.status);
            errormod(Language.errorpetitionm2s);
          }
      })
   }