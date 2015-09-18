$(window).scroll(function(){
  if($(window).scrollTop() >= $('nav').height()) {
        $('ul.tabs').css('position','fixed');
        $('ul.tabs').css('z-index','100000');
  }else{
    $('ul.tabs').css('position','relative');
  }
})

var keyuser = localStorage.getItem('keyuser');

function pagefunctions(){
  $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/states.php",
       data: {"s": "friends", "key": keyuser},
       cache: false,
       dataType: 'json',
       success: function(result) {
         if (result.states) {
            for (var i = 0; i < result.states.length; i++) {
              id = result.states[i].id;
              iduser = result.states[i].iduser;
              username = result.states[i].username;
              imagepr = result.states[i].imagepr;
              if(imagepr == null){
                imagepr = 'images/icon-user-default.png';
              }
              message = result.states[i].message;
              date = result.states[i].date;
              message = linkscom(message);
              locationgg = result.states[i].location;
              if (locationgg.longitud != null) {
                  longitud = locationgg.longitud;
                  locatisn = '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locationgg.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
              }else{
                  locatisn = '';
              }

              $('.clasmod').append("<div class='sth state-"+id+"' id='"+date+"' style='display:none'><div class='card white'><div class='card-content'><span class='card-title'><a href='profile.html?id="+iduser+"'><img src='"+imagepr+"'/></a><font style='left:5px'>"+username+"</font></span><p class='black-text'>"+message+"</p>"+ locatisn + "</div><div class='card-action'> <font class='date'>"+convert(date)+"</font></div></div></div>");
                if(username == localStorage.getItem('user')){
                  $('.state-'+id).prepend('<a href="javascript:deletestate(' + id + ')" class="btn-floating red trash" style="float:right;display:none;left:-10px"><i class="mdi-action-delete"></i></a>');
                  $('.state-'+id).swipe({
                            swipe:function(event, direction, distance, duration, fingerCount) {
                                if(direction == 'left'){
                                    $(".trash", this).css('display', 'block');
                                    $(".trash", this).css('margin-top', '34px');
                                    $(".card", this).css('left', '-30px');
                                    $(".card", this).css('opacity', '0.7');
                                    console.log('swipe!'+id);
                                }
                                if(direction == 'right'){
                                    $(".trash", this).css('display', 'none');
                                    $(".card", this).removeAttr('style');
                                }
                            },
                            threshold:0
                  });
                }  
            }
         }
         groupsd();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
  });
}

function groupsd(){
  $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/states.php",
       data: {"s": "groups", "key": keyuser},
       cache: false,
       dataType: 'json',
       success: function(result) {
          if (result.states) {
              for (var i = 0; i < result.states.length; i++) {
                  id = result.states[i].id;
                  idgroup = result.states[i].idgroup;
                  namegr = result.states[i].username;
                  imagepr = result.states[i].imagepr;
                  officiald = result.states[i].official;
                  message = result.states[i].message;
                  date = result.states[i].date;
                  meadmin = result.states[i].meadmin;
                  message = linkscom(message);
                  local = result.states[i].location;
                  var imageprr = '';
                  if(imagepr){
                    imageprr += "<img src='"+imagepr+"'/>";
                  }else{
                    var namesplit = namegr.split(' ');
                    abv1 = namesplit[0].charAt(0);
                    if (namesplit[1]) {
                        abv2 = namesplit[1].charAt(0);
                        abv = abv1 + abv2;
                    }else{
                        abv = abv1;
                    }
                    if(sessionStorage.getItem(idgroup+'-colour')){
                      var colorfinal = sessionStorage.getItem(idgroup+'-colour');
                    }else{
                      var colores = new Array('red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'teal', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey');
                      var colorfinal = colores[Math.floor(Math.random()*colores.length)];
                      sessionStorage.setItem(idgroup+'-colour', colorfinal);
                    }
                    imageprr += '<div class="img '+colorfinal+' lighten-3"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>';
                  }
                  if(officiald == 'yes'){
                    imageprr += '<span class="official"></span>';
                  }
                  if (local.longitud != null) {
                    longitud = local.longitud;
                    locatisn = '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + local.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
                  }else{
                    locatisn = '';
                  }
                  $('.clasmod').append("<div class='sth stategr-"+id+"' id='"+date+"' style='display:none'><div class='card white'><div class='card-content'><span class='card-title'><a href='profilegr.html?id="+idgroup+"'>"+imageprr+"</a><font style='left:5px'>"+namegr+"</font></span><p class='black-text'>"+message+"</p>"+ locatisn + "</div><div class='card-action'> <font class='date'>"+convert(date)+"</font></div></div></div>");
                  if(meadmin == 'yes'){
                    $('.stategr-'+id).prepend('<a href="javascript:deletestategr(' + id + ')" class="btn-floating red trash" style="float:right;display:none;left:-10px"><i class="mdi-action-delete"></i></a>');
                    $('.stategr-'+id).swipe({
                            swipe:function(event, direction, distance, duration, fingerCount) {
                                if(direction == 'left'){
                                    $(".trash", this).css('display', 'block');
                                    $(".trash", this).css('margin-top', '34px');
                                    $(".card", this).css('left', '-30px');
                                    $(".card", this).css('opacity', '0.7');
                                    console.log('swipe!'+id);
                                }
                                if(direction == 'right'){
                                    $(".trash", this).css('display', 'none');
                                    $(".card", this).removeAttr('style');
                                }
                            },
                            threshold:0
                    });
                  }
            }
        }
        $('#loading-user').hide();
        if($('.sth').length == 0){
            $('.clasmod').append("<div class='no-friends' id='nostates'><h4>"+Language.nostatesfriends+"</h4></div>");
        }else{
            tinysort('.clasmod .sth',{attr:'id',order:'desc'});
            $('.clasmod .sth').show();
        }
      },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
  });

  $('.more-forsend').click(function(){
   $('.share-moreapp').show();
})

$('.modal-share i.remove').click(function(){
   $('.share-moreapp').hide();
})

$('.optlink#stickerss').click(function(){
   var slec = $('.optlink.sel').attr('id');
   $('.optlink.sel').removeClass('sel');
   $('.optlink#stickerss').addClass('sel');
   $('.'+slec).hide();
   $('.stickerss').show();
})

$('.optlink#imagest').click(function(){
   var slec = $('.optlink.sel').attr('id');
   $('.optlink.sel').removeClass('sel');
   $('.optlink#imagest').addClass('sel');
   $('.'+slec).hide();
   $('.imagest').show();
})

$('.optlink#locastdfg').click(function(){
   var slec = $('.optlink.sel').attr('id');
   $('.optlink.sel').removeClass('sel');
   $('.optlink#locastdfg').addClass('sel');
   $('.'+slec).hide();
   $('.locastdfg').show();
})

$('.bargroup-emo span').click(function(){
  name = $(this).attr('class');
  $('.icon-group').hide();
  $('.icon-group#'+name).show();
})

$('.back-fileinput').click(function() {
  fileChooser.open(function(uri) {
    $('#upload-imge').show();
    $('#share-mre').hide();
    $('.selct-shareop').hide();
    $('.sections-share').hide();
    $('.imageuplo').show();
    convertImgToBase64(uri, function(base64Img){
      uploadimagefr(base64Img);
    });
  });
});

function uploadimagefr(based) {
    var url = based;
    url = url.replace('data:image/png;base64,', '');
    console.log(url);
    $.ajax({
      url: 'https://api.imgur.com/3/image',
      method: 'POST',
      headers: {
        Authorization: 'Client-ID def4c03828b22c2',
        Accept: 'application/json'
      },
      data: {
        image: url,
        type: 'base64'
      },
      success: function(result) {
        var link = result.data.link;
        $('textarea').val($('textarea').val() + ' ' + link);
        $('#share-mre').show();
        $('.selct-shareop').show();
        $('.sections-share').show();
        $('.imageuplo').hide();
        $('.share-moreapp').hide();
      }
    });
};

$('.send-state').click(function(){
    sendmsm();
})

$('#btn-location').click(function() {
    if ($('#btn-location.btn-info').length != '0') {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
           console.log('Loading location...');
           var latitud = position.coords.latitude;
           var longitud = position.coords.longitude;
           var latlong = latitud + ' ' + longitud;
           console.log('Location:' + latlong);
           $('.sendstategr').append(
             $(document.createElement("input")).attr("value", latlong).attr('name', 'map').attr('type', 'hidden').attr('class', 'map')
           );
           var mapht = '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + latitud + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;margin-top: 10px;max-height: 200px;max-width: 700px;width: 100%;" id="map-html"></iframe>';
           $('#location').append(mapht);
           $('#btn-location').removeAttr("disabled");
           $('#btn-location').html(Language.removelocation);
           $('#btn-location').removeClass('btn-info');
           $('#btn-location').addClass('btn-danger');
        }, function(error) {
                alert('Error occurred. Error code: ' + error.code);         
            },{timeout:5000});
      }else{
        alert("Your browser doesn't the location API");
      }
      $('#btn-location').attr('disabled', 'disabled');
      $('#btn-location').html(Language.locationloading);
    } else {
      $('#btn-location').html(Language.sharelocation);
      $('#btn-location').removeClass('btn-danger');
      $('#btn-location').addClass('btn-info');
      $('#map-html').remove();
      $('input.map').remove();
    }
});
}

function deletestate(id){
   $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/connect/delete-state.php",
       data: {"id": id, "key": keyuser},
       cache: false,
       dataType: 'json',
       success: function(result) {
         if(result.mensaje == 'ok'){
            $('.state-'+id).remove();
         }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
   });
}


function deletestategr(id){
   $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/connect/delete-state-gr.php",
       data: {"id": id, "key": keyuser},
       cache: false,
       dataType: 'json',
       success: function(data) {
         if(data.mensaje == 'ok'){
            $('.state-'+id).remove();
         }else{
          console.log('Error: '+data.mensaje);
         }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
   });
}

function showrittestate(){
    if(!$('.sendstategr').is(":visible")){
        $('.sendstategr').show();
    }else{
        $('.sendstategr').hide();
    }
}

function poststick(text) {
  $('.share-moreapp').hide();
  sendstate('<div class="'+text+'"></div>', '');
}

function sendmsm() {
  var txtvalue = document.getElementsByName('txt')[0].value;
  if (document.getElementsByName('map')[0]) {
    var mapv = document.getElementsByName('map')[0].value;
  } else {
    var mapv = "";
  }
  sendstate(txtvalue, mapv);
}

function sendstate(text, map){
   $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/write-state.php",
      data: {"txt": text, "map": map, "key": keyuser},
      cache: false,
      dataType: 'json',
      beforeSend: function() {
        console.log('Connecting...');
      },
      success: function(writers) {
        if(writers.mensaje == 'ok'){
          document.location.href= 'states.html';
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}
