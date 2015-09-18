var keyuser = localStorage.getItem('keyuser');

var id = getGET().id;

$(".sendtxtd").keyup(function(event){
	if($(".sendtxtd").val() != ''){
		$('.sendmsmsdiv img').hide();
		$('a.sendbutn').show();
	}else{
		$('.sendmsmsdiv img').show();
		$('a.sendbutn').hide();
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
  		success: function(data) {
  			var id = data.id,
            name = data.groupname,
            imagein = data.imagein,
            private = data.private,
            admininfo = data.admininfo,
            official = data.official,
            local = data.local,
            decription = data.description,
            peoplejoin = data.peoplejoined,
            mutegroup = data.mute;
  			$('.forw .usernlk').html(name);
        if(!localStorage.getItem('imguse')){
          $('.imguserdf').attr('src', "images/icon-user-default.png");
          imageinme = "images/icon-user-default.png";
        }else{
  			  $('.imguserdf').attr('src', localStorage.getItem('imguse'));
          imageinme = localStorage.getItem('imguse');
        }
        $('a.profilelink').attr('href', 'profilegr.html?id='+id);
        if(mutegroup == 'yes'){
          $('.mutebutnss').html(Language.unmutegroup);
        }
        if (admininfo == 'me') {
          $('.leavegrpu').hide();
          $('.admingrpu').attr('href', 'admingr.html?id='+id);
        }else{
          $('.admingrpu').hide();
        }
  		}
	});

	chat(id);

	var chatrefresh = setInterval(function() {
   		updatechats(id);
	}, 14000);

	$('.share-more').click(function(){
   		$('.share-moreapp').show();
	})

	$('.modal-share .mdi-navigation-close.remove').click(function(){
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

	$('#btn-location').click(function() {
    	if ($('#btn-location.btn-info').length != '0') {
      		if(navigator.geolocation){
        		navigator.geolocation.getCurrentPosition(function(position) {
           			console.log('Loading location...');
           			var latitud = position.coords.latitude;
           			var longitud = position.coords.longitude;
           			var latlong = latitud + ' ' + longitud;
           			console.log('Location:' + latlong);
           			$('.sendmsmsdiv').append(
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
	
	$('.bargroup-emo span').click(function(){
  		name = $(this).attr('class');
  		$('.icon-group').hide();
  		$('.icon-group#'+name).show();
	})
}

function updatechats(id) {
  console.log('Checking new messages...');
  $.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/chat-gr.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    success: function(data) {
      for (var i = 0; i < data.messages.length; i++) {
        if ($('.nochat').lenght != '0') {
          $('.nochat').remove();
        }
        idc = data.messages[i].id;
        username = data.messages[i].username;
        iduser = data.messages[i].iduser;
        imgr = data.messages[i].imgr;
        textmsm = data.messages[i].textmsm;
        locat = data.messages[i].locat;
        admin = data.messages[i].admin;
        fecha = data.messages[i].fecha;
        me = data.messages[i].me;
        stick = data.messages[i].stick;
        tableid = data.messages[i].tableid;
        if(imgr == null){
          imgr = 'images/icon-user-default.png';
        }
        if ($('#'+idc).length == '0') {
          var localid = "cgr"+tableid;
          var messages = new Object();
          messages.id = id;
          messages.username = username;
          messages.iduser = iduser;
          messages.textmsm = textmsm;
          messages.imgr = imgr;
          messages.locat = locat;
          messages.fecha = fecha;
          messages.me = me;
          messages.stick = stick;
          messages.tableid = tableid;
          messages.admin = admin;
          if (!localStorage.getItem(localid)) {
            localStorage.setItem(localid, "[" + JSON.stringify(messages) + "]");
          }else{
            var antes = JSON.parse(localStorage.getItem(localid));
            antes.push(messages);
            localStorage.setItem(localid, JSON.stringify(antes));
          }
          datosmem = crearmsmd(idc, username, iduser, imgr, textmsm, locat, admin, fecha, me, stick, tableid);
          $('.' + 'msmdiv').append(datosmem);
          var soundtap = new Media("/android_asset/www/sounds/tap.ogg");
          soundtap.play();
          notifications();
          $("#"+idc).swipe({
              swipe:function(event, direction, distance, duration, fingerCount) {
                if(direction == 'left'){
                  $(".trash", this).css('display', 'block');
                  console.log('swipe!'+idc);
                }
                if(direction == 'right'){
                  $(".trash", this).css('display', 'none');
                }
              },
              threshold:0
          });
          if(stick != '1'){
              localStorage.setItem('lastmsmcgr-'+tableid, textmsm);
          }else{
              localStorage.setItem('lastmsmcgr-'+tableid, '[stick]');
          }
          localStorage.setItem('lastmsmcgrd-'+tableid, fecha);
          var d = $('.msmdiv');
          d.scrollTop(d.prop("scrollHeight"));
          }
        }
        if($('.msmdiv').html() == ''){
          $('.' + 'msmdiv').html('<div class="center nochat"><h3><i class="mdi-communication-forum"></i>'+Language.nomessageschat+'</h3></div>'); 
        }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.error(textStatus + ' ' + XMLHttpRequest.status);
      var divno = document.createElement('div');
      divno.innerHTML = '<div id="list-notifications" style="text-align:center;cursor:pointer"></div>';
      divno.className = 'background-dark';
      var modsv = document.getElementById('modsv');
      modsv.appendChild(divno);
      $('#list-notifications').append(Language.errorpetitionm2s);
      $('#list-notifications').click(function() {
        window.location.reload();
      })
    }
  });
}

function crearmsmd(id, username, iduser, imgr, textmsm, locat, admin, fecha, me, stick, tableid) {
  if (admin == 'yes') {
    msm = '<div class="sms admin" id="' + id + '">';
    if (me == 'yes') {
      msm += '<a href="javascript:deletemessage(' + id + ',' + tableid + ',1)" class="trash" style="text-decoration:none;color:#fff;font-size: 24px;text-align: center;position: absolute;right: 10px;background-color: rgb(198, 40, 40);padding: 2px 9px;border-radius: 21px;display:none"><i class="mdi-action-delete"></i></a>';
    } else {
      msm += '<a href="javascript:deletemessage(' + id + ',' + tableid + ',0)" class="trash" style="text-decoration:none;color:#fff;font-size: 24px;text-align: center;position: absolute;right: 10px;background-color: rgb(198, 40, 40);padding: 2px 9px;border-radius: 21px;display:none"><i class="mdi-action-delete"></i></a>';
    };
    msm += '<blockquote>';
    if (imgr != 'no') {
      msm += '<img src="' + imgr + '" width="55px" height="55px" style="float:left;margin-left:-5px;margin-top:3px;border-radius:27px"/><div style="padding-left:60px;margin-top:3px">'
    }
    msm += '<span class="user" style="font-size:16px;">Admin:</span>';
    if (stick == 'yes') {
      msm += textmsm;
    } else {
      msm += '<p class="selecton">' + linkscom(textmsm) + '</p>';
    }
    if (locat.latitude != null) {
      longitud = locat.longitud;
      longitud = longitud.substring(0, longitud.length - 2);
      msm += '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locat.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
    }
    msm += '<div class="foot">';
    msm += convert(fecha);
    msm += '</div>';
    if (imgr != 'no') {
      msm += '</div>';
    };
    msm += '</div></blockquote>';
  } else {
  if (me == '1') {
    var contind = '';
    if($(".msmdiv .sms:last-child").hasClass("me")){
      if($(".msmdiv .sms:last-child").attr('date') == fecha){
        contind += 'continu';
        $(".msmdiv .sms:last-child .foot").hide();
      }
    }
    msm = '<div class="sms me '+contind+'" id="' + id + '" date="'+fecha+'">';
    msm += '<a href="javascript:deletemessage(' + id + ',' + tableid + ',1)" class="trash" style="text-decoration:none;color:#fff;font-size: 24px;text-align: center;position: absolute;right: 10px;background-color: rgb(198, 40, 40);padding: 2px 9px;border-radius: 21px;display:none"><i class="mdi-action-delete"></i></a>';
    msm += '<img src="' + imageinme + '" class="imgp" style="right:0px;"/>';
    msm += '<blockquote>'
    if (stick == '1') {
      msm += textmsm;
    } else {
      msm += '<p class="selecton">' + linkscom(textmsm) + '</p>';
    }
    if (locat.latitude != null) {
      longitud = locat.longitud;
      longitud = longitud.substring(0, longitud.length - 2);
      msm += '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locat.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
    }
    msm += '<div class="foot">';
    msm += convert(fecha);
    msm += '</div></div></blockquote>'
  } else {
    var contind = '';
    if(!$(".msmdiv .sms:last-child").hasClass("me")){
      if($(".msmdiv .sms:last-child .nameusrf").attr('username') == username){
        if($(".msmdiv .sms:last-child").attr('date') == fecha){
          contind += 'continu';
          $(".msmdiv .sms:last-child .foot").hide();
        }
      }
    }
    msm = '<div id="' + id + '" class="sms '+contind+'" date="'+fecha+'" username="'+username+'">';
    msm += '<a href="javascript:deletemessage(' + id + ',' + tableid + ',0)" class="trash" style="text-decoration:none;color:#fff;font-size: 24px;text-align: center;position: absolute;right: 10px;background-color: rgb(198, 40, 40);padding: 2px 9px;border-radius: 21px;display:none"><i class="mdi-action-delete"></i></a>';
    msm += '<a href="profile.html?id='+iduser+'">';
    msm += '<img src="' + imgr + '" class="imgp"/></a>';
    msm += '<blockquote>';
    msm += '<div class="nameusrf">'+username+':</div>';
    if (stick == '1') {
      msm += textmsm;
    } else {
      msm += '<p class="selecton">' + linkscom(textmsm) + '</p>';
    }
    if (locat.latitude != null) {
      longitud = locat.longitud;
      longitud = longitud.substring(0, longitud.length - 2);
      msm += '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locat.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
    }
    msm += '<div class="foot">';
    msm += convert(fecha);
    msm += '</div></div></blockquote>'
  }
  }
  return msm;
  var d = $('.msmdiv');
  d.scrollTop(d.prop("scrollHeight"));
}

function loadchat(id, type) {
  $('.' + 'msmdiv').html('');
  if (localidsf != '') {
    var localidsf = JSON.parse(localStorage.getItem('cgr' + id));
  }
  if (localidsf) {
    for (var i = 0; i < localidsf.length; i++) {
      idc = localidsf[i].id;
      usernamec = localidsf[i].username;
      iduserc = localidsf[i].iduser;
      imgrc = localidsf[i].imgr;
      textmsmc = localidsf[i].textmsm;
      locatc = localidsf[i].locat;
      fechac = localidsf[i].fecha;
      mec = localidsf[i].me;
      stickc = localidsf[i].stick;
      tableidc = localidsf[i].tableid;
      adminc = localidsf[i].admin;
      datosmem = crearmsmd(idc, usernamec, iduserc, imgrc, textmsmc, locatc, adminc, fechac, mec, stickc, tableidc);
      $('.' + 'msmdiv').append(datosmem);
      $("#"+idc).swipe({
          swipe:function(event, direction, distance, duration, fingerCount) {
              if(direction == 'left'){
                  $(".trash", this).css('display', 'block');
                  console.log('swipe!'+idc);
              }
              if(direction == 'right'){
                  $(".trash", this).css('display', 'none');
              }
          },
          threshold:0
      });
    }
  }
  updatechats(id);
  var d = $('.msmdiv');
  d.scrollTop(d.prop("scrollHeight"));
  if (!localStorage.getItem('cgr' + id)) {
    $('.' + 'msmdiv').html('<div class="center nochat"><h3><i class="mdi-communication-forum"></i>'+Language.nomessageschat+'</h3></div>');
  }else{
    if($('.msmdiv').html() == ''){
      localStorage.removeItem('cgr' + id);
      $('.' + 'msmdiv').html('<div class="center nochat"><h3><i class="mdi-communication-forum"></i>'+Language.nomessageschat+'</h3></div>');
    }
  }
}

function chat(id) {
  id = id.toString();
  if ($('.input-chat').length) {
    $('.input-chat').remove();
  }
  $("input[name='txt']").keypress(function(event) {
    if (event.keyCode == 13) {
      if (!event.shiftKey) sendmsm()
    }
  });
  $(".button-send").click(function(){
    sendmsm();
  })
  loadchat(id, 'pr');
}

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

function sendmsmsh(){
    sendmsm();
}

function poststick(text) {
  $('.share-moreapp').hide();
  sendchats('<div class="'+text+'"></div>', '');
}

function sendmsm() {
  var txtvalue = document.getElementsByName('txt')[0].value;
  if (document.getElementsByName('map')[0]) {
    var mapv = document.getElementsByName('map')[0].value;
  } else {
    var mapv = "";
  }
  sendchats(txtvalue, mapv);
}

function sendchats(text, map) {
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/chat-gr.php",
      data: {"txt": text, "map": map, "id": id, "key": keyuser},
      cache: false,
      dataType: 'json',
      beforeSend: function() {
        console.log('Connecting...');
        $('input[name="txt"]').css('opacity','0.7');
        $('input[name="txt"]').val(Language.sending);
        $('input[name="txt"]').attr('disabled', 'disabled');
        $('.sendbutn').attr('href', '#');
        $('.sendbutn i').attr('class', 'mdi-hardware-keyboard-control');
      },
      complete: function() {
        console.log('Completed');
        document.getElementsByName('txt')[0].value = '';
        $('input[name="txt"]').css('opacity','1');
        $('input[name="txt"]').removeAttr('disabled');
        $('.sendmsmsdiv img').show();
        $('a.sendbutn').hide();
        $('.sendbutn').attr('href', 'javascript:sendmsmsh()');
        $('.sendbutn i').attr('class', 'mdi-content-send');
        updatechats(id, 'prs');
      },
      success: function(result) {
        console.log(result.mensaje);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod("Error");
      }
    })
};

function deletemessage(id, tableid, med) {
  id = id.toString();
  tableid = tableid.toString();
  tabledf = JSON.parse(localStorage.getItem('cgr' + tableid));
  Array.prototype.removeValue = function(name, value) {
    var array = $.map(this, function(v, i) {
      return v[name] === value ? null : v;
    });
    this.length = 0; //clear original array
    this.push.apply(this, array); //push all elements except the one we want to delete
  }
  tabledf.removeValue('id', id);
  localStorage.setItem('cgr' + tableid, JSON.stringify(tabledf));
  if (med == 1) {
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/delete-message-gr.php",
      data: {"id": id, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(data) {
        if (data.mensaje == 'ok') {
          console.log('Message deleted succesfully');
          $('#' + id).fadeOut(1000, function() {
            var dategd = $('#' + id).attr('date');
            if($('.sms.me[date="'+dategd+'"]').length > '1'){
               if($('#'+id+'.continu').length != '0'){
                  if($('.sms.me[date="'+dategd+'"]').length == '2'){
                    $('#' + id).remove();
                    $('.sms.me[date="'+dategd+'"] .foot').show();
                  }else{
                    $('#' + id).remove();
                    var lastdis = $('.sms.me[date="'+dategd+'"]').length - 1;
                    $('.sms.me[date="'+dategd+'"]:eq('+lastdis+') .foot').show();
                  }
               }else{
                  $('#' + id).remove();
                  $('.sms.me[date="'+dategd+'"]:eq(0)').removeClass('continu');
                  $('.sms.me[date="'+dategd+'"] .foot')[0].show();
               }
            }else{
              $('#' + id).remove();
            }
          })
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
    });
  } else {
    console.log('Message deleted succesfully');
    $('#' + id).fadeOut(1000, function() {
        if($('#'+id).hasClass('admin')){
          $('#' + id).remove();
        }else{
          var dategd = $('#' + id).attr('date');
          var usergd = $('#' + id).attr('username');
          if($('.sms:not(.me)[date="'+dategd+'"][username="'+usergd+'"]').length > '1'){
            if($('#'+id+'.continu').length != '0'){
                if($('.sms:not(.me)[date="'+dategd+'"][username="'+usergd+'"]').length == '2'){
                  $('#' + id).remove();
                  $('.sms:not(.me)[date="'+dategd+'"][username="'+usergd+'"] .foot').show();
                }else{
                  $('#' + id).remove();
                  var lastdis = $('.sms:not(.me)[date="'+dategd+'"][username="'+usergd+'"]').length - 1;
                  $('.sms:not(.me)[date="'+dategd+'"][username="'+usergd+'"]:eq('+lastdis+') .foot').show();
                }
            }else{
                $('#' + id).remove();
                $('.sms:not(.me)[date="'+dategd+'"][username="'+usergd+'"]:eq(0)').removeClass('continu');
                $('.sms:not(.me)[date="'+dategd+'"][username="'+usergd+'"] .foot')[0].show();
            }
        }else{
            $('#' + id).remove();
        }
      }
    })
  }
  if(localStorage.getItem('cgr' + tableid) == '[]'){
    localStorage.removeItem('cgr' + tableid);
    localStorage.removeItem('lastmsmcgr-' + tableid);
    localStorage.removeItem('lastmsmcgrd-' + tableid);
    $('.' + 'msmdiv').html('<div class="center nochat"><h3><i class="mdi-communication-forum"></i>'+Language.nomessageschat+'</h3></div>');
  }else{
    var json = JSON.parse(localStorage.getItem('c' + tableid));
    var lend = json.length;
    var lastKey = json[lend-1];
    if(lastKey.stick != '1'){
        localStorage.setItem('lastmsmcgr-'+tableid, lastKey.textmsm);
    }else{
        localStorage.setItem('lastmsmcgr-'+tableid, '[stick]');
    }
    localStorage.setItem('lastmsmcgrd-'+tableid, lastKey.fecha);
  }
}

var openDiv;

function moreoptions(divID){
    $("#" + divID).fadeToggle(200, function() {
        openDiv = $(this).is(':visible') ? divID : null;
    });
}

$(document).click(function(e) {
    if (!$(e.target).closest('#'+openDiv).length) {
        moreoptions(openDiv);
    }
});

function deleteconversation(){
  navigator.notification.confirm(
    Language.deleteconver, function(buttonIndex){
          if(buttonIndex == '2'){
            localStorage.removeItem("cgr"+id);
            $('.' + 'msmdiv').html('<div class="center nochat"><h3><o class="mdi-communication-forum"></o>'+Language.nomessageschat+'</h3></div>');
          }
          moreoptions(openDiv);
    },
    Language.deleteconversu,
    ['Cancel','Yes']);
}

function mutegrs(){
  $.ajax({
      type: "POST",
      crossDomain: true,
      url: 'http://m2s.es/app/api/connect/mutegroup.php',
      data: {"id": id, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function (data) {
          if (data.mensaje == 'ok') {
              if($('.mutebutnss').html() == Language.unmutegroup){
                  $('.mutebutnss').html(Language.mutegroup);
              }else{
                  $('.mutebutnss').html(Language.unmutegroup);
              }
              moreoptions(openDiv);
          }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error(textStatus + ' ' + XMLHttpRequest.status);
          errormod(Language.errorpetitionm2s);
      }
  })
}

function leavegrpu(){
  navigator.notification.confirm(
    Language.leavegroup, function(buttonIndex){
          if(buttonIndex == '2'){
              $.ajax({
                    type: "POST",
                    crossDomain: true,
                    url: 'http://m2s.es/app/api/connect/leavegroup.php',
                    data: {"id": id, "key": keyuser},
                    cache: false,
                    dataType: 'json',
                    success: function (data) {
                        if (data.mensaje == 'ok') {
                            salert(Language.leftgroup, function(){document.location.href='groups.html'})
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(textStatus + ' ' + XMLHttpRequest.status);
                        errormod(Language.errorpetitionm2s);
                    }
              })
          }
          moreoptions(openDiv);
    },
    Language.sureleavegroup,
    ['Cancel','Yes']);
}

