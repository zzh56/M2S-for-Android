var keyuser = localStorage.getItem('keyuser');
var id = getGET().id;

$(window).scroll(function(){
    if($(window).scrollTop() >= $('header').height() - 10) {
        $('.onresd').show();
    }else{
        $('.onresd').hide();
    }
})

function pagefunctions(){
$.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/groupinfo.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    success: function (result) {
        id = result.id;
        name = result.groupname;
        image = result.imagein;
        private = result.private;
        admininfo = result.admininfo;
        official = result.official;
        local = result.local;
        decription = result.description;
        peoplejoin = result.peoplejoined;
        mutegroup = result.mute;
        $('#loading-user').hide();
        $('.onresd').html(name);

        if(admininfo == 'me'){
            $('.brand-logo.forw').append('<a class="rightna" onclick="writestatemodal()"><i class="mdi-content-create"></i></a>');
            $('.brand-logo .side-nav').remove();
        }

        var modaluser = '';

        $('header').append('<div class="primg"></div>');

        if (image != null) {
            $('.primg').append('<img src="' + image + '" class="profile-badge"/>');
        }else{
            var namesplit = name.split(' ');
            abv1 = namesplit[0].charAt(0);
            if (namesplit[1]) {
                abv2 = namesplit[1].charAt(0);
                abv = abv1 + abv2;
            }else{
                abv = abv1;
            }
            if(sessionStorage.getItem(id+'-colour')){
                var colorfinal = sessionStorage.getItem(id+'-colour');
            }else{
                var colores = new Array('red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'teal', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey');
                var colorfinal = colores[Math.floor(Math.random()*colores.length)];
                sessionStorage.setItem(id+'-colour', colorfinal);
            }
            $('.primg').append('<div class="img profile-badge '+colorfinal+' lighten-3"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>');
        }

        $('.primg').append('<h5>'+name+'</h5>');
        if (official == 'yes') {
           $('.primg').addClass('official');
        }

        if (local.longitud) {
            $('.clasmod .card:first-child .card-content').append('<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + local.latitude + ',' + local.longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;width: 100%;border-radius:5px;margin-bottom:5px"></iframe>');
        }

        $('.clasmod .card:first-child .card-content').append('<p>' + linkscom(decription) + '</p>');
        
        if (result.yourstate == '1') {
           $('.clasmod .card:first-child .card-action').append('<a id="chatbutton" href="chatgr.html?id='+id+'">'+Language.chat+'</a>');          
            if(mutegroup == 'no'){
             $('.clasmod .card:first-child .card-action').append('<a id="mutegroupbutton" class="mute">'+Language.mutegroup+'</a>');
            }else{
              $('.clasmod .card:first-child .card-action').append('<a id="mutegroupbutton" class="unmute">'+Language.unmutegroup+'</a>');
            }
            if (admininfo != 'me') {
                $('.clasmod .card:first-child .card-action').append('<a id="leavegroupbutton">'+Language.leavegroup+'</a>');
            }else{
            	$('.clasmod .card:first-child .card-action').append('<a id="admingroupbutton" href="admingroup.html?id='+id+'">'+Language.admingroup+'</a>');
            }
            if (result.states != '') {
                for (var i = 0; i < result.states.length; i++) {
                    idt = result.states[i].id;
                    text = result.states[i].text;
                    date = result.states[i].date;
                    locationgg = result.states[i].location;
                    if (admininfo != 'me') {
                        mens = '';
                    }else{
                        mens = 'me';
                    }
                    if (locationgg.latitude != '') {
                        longitud = locationgg.longitud;
                        locatisn = '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locationgg.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
                    }else{
                        locatisn = '';
                    }

                    $('.clasmod').append('<div id="'+idt+'"><div class="card white"><div class="card-content black-text"><p>' + linkscom(text) + '</p>' + locatisn + '</div><div class="card-action"> <font class="date">' + convert(date) + '</font></div></div></div>');

                    if(admininfo == 'me'){
                        $('#'+idt).prepend('<a href="javascript:deletestategr(' + idt + ')" class="btn-floating red trash" style="float:right;display:none;left:-10px"><i class="mdi-action-delete"></i></a>');
                    }

                    if(admininfo == 'me'){
                        $("#"+idt).swipe({
                            swipe:function(event, direction, distance, duration, fingerCount) {
                                if(direction == 'left'){
                                    $(".trash", this).css('display', 'block');
                                    $(".trash", this).css('margin-top', '34px');
                                    $(".card", this).css('left', '-30px');
                                    $(".card", this).css('opacity', '0.7');
                                    console.log('swipe!'+idt);
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

                $('.materialboxed').materialbox();
            }
        }
        if (result.yourstate == null || result.yourstate == '0') {
            if (!result.yourstate) {
                $('.clasmod .card:first-child .card-action').append('<a id="joingroupbutton">'+Language.jointhisgroup+'</a>');
            }else{
               $('.clasmod .card:first-child .card-action').append('<font>'+Language.waitadminacceptyou+'</font>');
            }
            if (admininfo != null || peoplejoin != '0') {
                modaluser += '<div class="card white">';
                if (admininfo != null) {
                    if(admininfo.imagein == null){
                      admininfo.imagein = 'images/icon-user-default.png';
                    }
                    modaluser += '<div class="card-content black-text createdby"><div class="center">';
                    modaluser += '<img src="' + admininfo.imagein + '"/>';
                    modaluser += '<p><i>'+Language.createdby+'</i>';
                    modaluser += '<b class="selecton">' + admininfo.username + '</b></p></div></div>';
                }
                if (peoplejoin != '0') {
                    if (admininfo == null) {
                        modaluser += '<div class="card-content black-text createdbyf">';
                    }else{
                        modaluser += '<div class="card-action">';
                    }
                    modaluser += '<i>'+Language.peoplejoined+'</i> <b>' + peoplejoin + '</b></div>';
                }
            modaluser += '</div>';
            $('.clasmod').append(modaluser);
            }
        }
        if (!result.yourstate) {
            $('#joingroupbutton').click(function () {
                $.ajax({
                    type: "POST",
                    crossDomain: true,
                    url: 'http://m2s.es/app/api/connect/joingroup.php',
                    data: {"id": id, "key": keyuser},
                    cache: false,
                    dataType: 'json',
                    beforeSend: function () {
                        console.log('Connecting...');
                        $('#joingroupbutton').attr('disabled', 'disabled');
                        $('#joingroupbutton').html(Language.loading);
                    },
                    success: function (data) {
                        if (data.mensaje == 'ok') {
                            if (private == 'no') {
                                document.location.href= 'profilegr.html?id='+id;
                            }else{
                                document.location.href= 'profilegr.html?id='+id;
                            }
                        }else{
                            console.error('Error to join to the group: ' + data.mensaje);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(textStatus + ' ' + XMLHttpRequest.status);
                        errormod(Language.errorpetitionm2s);
                    }
                })
            });
        }	
        $('#leavegroupbutton').click(function () {
            navigator.notification.confirm( 
              Language.leavegroup,
              function(buttonIndex){
                  if(buttonIndex == '2'){
                        $.ajax({
                            type: "POST",
                            crossDomain: true,
                            url: 'http://m2s.es/app/api/connect/leavegroup.php',
                            data: {"id": id, "key": keyuser},
                            cache: false,
                            dataType: 'json',
                            beforeSend: function () {
                                console.log('Connecting...');
                                $('#leavegroupbutton').attr('disabled', 'disabled');
                                $('#leavegroupbutton').html(Language.loading);
                            },
                            success: function (data) {
                                if (data.mensaje == 'ok') {
                                    document.location.href= 'profilegr.html?id='+id;
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                console.error(textStatus + ' ' + XMLHttpRequest.status);
                                errormod(Language.errorpetitionm2s);
                            }
                        })
                  }
              },
              Language.sureleavegroup,
              ['Cancel','Yes']
            );
        })

        $('#mutegroupbutton').click(function(){
            $.ajax({
                type: "POST",
                crossDomain: true,
                url: 'http://m2s.es/app/api/connect/mutegroup.php',
                data: {"id": id, "key": keyuser},
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    console.log('Connecting...');
                    $('#mutegroupbutton').html(Language.loading);
                },
                success: function (data) {
                    if (data.mensaje == 'ok') {
                       document.location.href= 'profilegr.html?id='+id;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(textStatus + ' ' + XMLHttpRequest.status);
                    errormod(Language.errorpetitionm2s);
                }
            })
        })
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
    }
})

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

function deletestategr(idf){
   $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/connect/delete-state-gr.php",
       data: {"id": idf, "key": keyuser},
       cache: false,
       dataType: 'json',
       success: function(data) {
         if(data.mensaje == 'ok'){
            $('.'+idf+'.trash').remove();
            $('#'+idt+'.card').removeAttr('style');
            $('#' + idf).fadeOut(1000, function() {
              $('#' + idf).remove();
            })
         }else{
          console.log('Error: '+data.mensaje);
         }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
   });
}

function writestatemodal(){
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
      url: "http://m2s.es/app/api/connect/write-state-group.php",
      data: {"txt": text, "map": map, "id": id, "key": keyuser},
      cache: false,
      dataType: 'json',
      beforeSend: function() {
        console.log('Connecting...');
      },
      success: function(writers) {
        if(writers.mensaje == 'ok'){
            document.location.href= 'profilegr.html?id='+id;
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}