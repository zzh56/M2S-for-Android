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

if(!localStorage.getItem('imguse')){
  	$('.imguserdf').attr('src', "images/icon-user-default.png");
  	imageinme = "images/icon-user-default.png";
}else{
  	$('.imguserdf').attr('src', localStorage.getItem('imguse'));
  	imageinme = localStorage.getItem('imguse');
}
        	
function pagefunctions(){
	$.ajax({
  		type: "POST",
  		crossDomain: true,
  		url: "http://m2s.es/app/api/profileinfo.php",
  		data: {"id": id, "key": keyuser},
  		cache: false,
  		dataType: 'json',
  		success: function(data) {
  			var username = data.username;
  			var timeago = data.timeago;
  			if(timeago.indexOf("con")>=0){
  				timeago = Language.connected;
  			}else{
  				if(timeago.indexOf("m")>=0){
  					timeago = timeago.replace('m','');
  					timeago = Language.minago+' '+timeago+' '+Language.minagoc;
	  			}
	  	
	  			if(timeago.indexOf("d")>=0){
	  				timeago = timeago.replace('d','');
	  				timeago = Language.daysago+' '+timeago+' '+Language.daysagoc;
				}
		
				if(timeago.indexOf("h")>=0){
					timeago = timeago.replace('h','');
					timeago = Language.hoursago+' '+timeago+' '+Language.hoursagoc;
				}
  			}
  			var email = data.email;
  			imagein = data.imagein;
  			if(imagein == null){
  				imagein = 'images/icon-user-default.png';
        	}
  			$('.forw .usernlk').html(username);
  			
			$('a.profilelink').attr('href', 'profile.html?id='+id);
			
			chat(id);

			var chatrefresh = setInterval(function() {
				updatechats(id);
			}, 14000);
  		}
	});
	
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
    url: "http://m2s.es/app/api/chat.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    success: function(data) {
      for (var i = 0; i < data.messages.length; i++) {
        if ($('.nochat').lenght != '0') {
          $('.nochat').remove();
        }
        id = data.messages[i].id;
        username = data.messages[i].username;
        iduser = data.messages[i].iduser;
        textmsm = data.messages[i].textmsm;
        locat = data.messages[i].locat;
        fecha = data.messages[i].fecha;
        me = data.messages[i].me;
        stick = data.messages[i].stick;
        tableid = data.messages[i].tableid;
        if(data.messages[i].mymessagenor){
          mymessagenor = 'yes';
        }else{
          mymessagenor = 'no';
        }
        if ($('#' + id).length != '0') {
          if(!data.messages[i].mymessagenor){
             $('#'+id+' .foot .tick').remove();
             console.log(id+': nohas');
          }
        } else {
          var localid = "c" + tableid;
          var messages = new Object();
          messages.id = id;
          messages.username = username;
          messages.iduser = iduser;
          messages.textmsm = textmsm;
          messages.locat = locat;
          messages.fecha = fecha;
          messages.me = me;
          messages.stick = stick;
          messages.tableid = tableid;
          if(data.myid != iduser || mymessagenor == 'yes'){
            if (!localStorage.getItem(localid)) {
              localStorage.setItem(localid, "[" + JSON.stringify(messages) + "]");
            }else{
              var antes = JSON.parse(localStorage.getItem(localid));
              antes.push(messages);
              localStorage.setItem(localid, JSON.stringify(antes));
            }
            datosmem = crearmsmd(id, username, iduser, textmsm, locat, fecha, me, stick, tableid, 'NO');
            $('.' + 'msmdiv').append(datosmem);
            var soundtap = new Media("/android_asset/www/sounds/tap.ogg");
            soundtap.play();
            notifications();
            $("#"+id).swipe({
                swipe:function(event, direction, distance, duration, fingerCount) {
                  if(direction == 'left'){
                    $(".trash", this).css('display', 'block');
                    console.log('swipe!'+id);
                  }
                  if(direction == 'right'){
                    $(".trash", this).css('display', 'none');
                  }
                },
                threshold:0
            });
            if(stick != '1'){
              localStorage.setItem('lastmsmc-'+tableid, textmsm);
            }else{
              localStorage.setItem('lastmsmc-'+tableid, '[stick]');
            }
            localStorage.setItem('lastmsmcd-'+tableid, fecha);
            var d = $('.msmdiv');
            d.scrollTop(d.prop("scrollHeight"));
          }
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

function crearmsmd(id, username, iduser, textmsm, locat, fecha, me, stick, tableid, leido) {
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
      msm += '<div class="' + textmsm + '"></div>';
    } else {
      msm += '<p class="selecton">' + linkscom(textmsm) + '</p>';
    }
    if (locat.latitude != null) {
      longitud = locat.longitud;
      longitud = longitud.substring(0, longitud.length - 2);
      msm += '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locat.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
    }
    msm += '<div class="foot">';
    if (leido != 'NO') {
      msm += '<i class="mdi-action-done tick"></i>';
    }
    msm += convert(fecha);
    msm += '</div></div></blockquote>'
  } else {
    var contind = '';
    if(!$(".msmdiv .sms:last-child").hasClass("me")){
      if($(".msmdiv .sms:last-child").attr('date') == fecha){
        contind += 'continu';
        $(".msmdiv .sms:last-child .foot").hide();
      }
    }
    if(typeof imagein == 'undefined'){
       imagein = 'images/icon-user-default.png';
    }
    msm = '<div id="' + id + '" class="sms '+contind+'" date="'+fecha+'">';
    msm += '<a href="javascript:deletemessage(' + id + ',' + tableid + ',0)" class="trash" style="text-decoration:none;color:#fff;font-size: 24px;text-align: center;position: absolute;right: 10px;background-color: rgb(198, 40, 40);padding: 2px 9px;border-radius: 21px;display:none"><i class="mdi-action-delete"></i></a>';
    msm += '<a href="profile.html?id='+iduser+'">';
    msm += '<img src="' + imagein + '" class="imgp"/></a>';
    msm += '<blockquote>'
    if (stick == '1') {
      msm += '<div class="' + textmsm + '"></div>';
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
  return msm;
  var d = $('.msmdiv');
  d.scrollTop(d.prop("scrollHeight"));
}

function loadchat(id, type) {
  $('.' + 'msmdiv').html('');
  if (localidsf != '') {
    var localidsf = JSON.parse(localStorage.getItem('c' + id));
  }
  if (localidsf) {
    for (var i = 0; i < localidsf.length; i++) {
      idc = localidsf[i].id;
      username = localidsf[i].username;
      iduser = localidsf[i].iduser;
      textmsm = localidsf[i].textmsm;
      locat = localidsf[i].locat;
      fecha = localidsf[i].fecha;
      me = localidsf[i].me;
      stick = localidsf[i].stick;
      tableid = localidsf[i].tableid;
      datosmem = crearmsmd(idc, username, iduser, textmsm, locat, fecha, me, stick, tableid, 'YES');
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
  if (!localStorage.getItem('c' + id)) {
    $('.' + 'msmdiv').html('<div class="center nochat"><h3><i class="mdi-communication-forum"></i>'+Language.nomessageschat+'</h3></div>');
  }else{
    if($('.msmdiv').html() == ''){
      localStorage.removeItem('c' + id);
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
  sendchats(text, '');
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
      url: "http://m2s.es/app/api/connect/chat.php",
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
  tabledf = JSON.parse(localStorage.getItem('c' + tableid));
  Array.prototype.removeValue = function(name, value) {
    var array = $.map(this, function(v, i) {
      return v[name] === value ? null : v;
    });
    this.length = 0; //clear original array
    this.push.apply(this, array); //push all elements except the one we want to delete
  }
  tabledf.removeValue('id', id);
  localStorage.setItem('c' + tableid, JSON.stringify(tabledf));
  if (med == 1) {
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/delete-message.php",
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
        var dategd = $('#' + id).attr('date');
        if($('.sms:not(.me)[date="'+dategd+'"]').length > '1'){
            if($('#'+id+'.continu').length != '0'){
                if($('.sms:not(.me)[date="'+dategd+'"]').length == '2'){
                  $('#' + id).remove();
                  $('.sms:not(.me)[date="'+dategd+'"] .foot').show();
                }else{
                  $('#' + id).remove();
                  var lastdis = $('.sms:not(.me)[date="'+dategd+'"]').length - 1;
                  $('.sms:not(.me)[date="'+dategd+'"]:eq('+lastdis+') .foot').show();
                }
            }else{
                $('#' + id).remove();
                $('.sms:not(.me)[date="'+dategd+'"]:eq(0)').removeClass('continu');
                $('.sms:not(.me)[date="'+dategd+'"] .foot')[0].show();
            }
        }else{
            $('#' + id).remove();
        }
    })
  }
  if(localStorage.getItem('c' + tableid) == '[]'){
    localStorage.removeItem('c' + tableid);
    localStorage.removeItem('lastmsmc-' + tableid);
    localStorage.removeItem('lastmsmcd-' + tableid);
    $('.' + 'msmdiv').html('<div class="center nochat"><h3><i class="mdi-communication-forum"></i>'+Language.nomessageschat+'</h3></div>');
  }else{
    var json = JSON.parse(localStorage.getItem('c' + tableid));
    var lend = json.length;
    var lastKey = json[lend-1];
    if(lastKey.stick != '1'){
        localStorage.setItem('lastmsmc-'+tableid, lastKey.textmsm);
    }else{
        localStorage.setItem('lastmsmc-'+tableid, '[stick]');
    }
    localStorage.setItem('lastmsmcd-'+tableid, lastKey.fecha);
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
            localStorage.removeItem("c"+id);
            localStorage.removeItem('lastmsmc-' + id);
			localStorage.removeItem('lastmsmcd-' + id);
            $('.' + 'msmdiv').html('<div class="center nochat"><h3><o class="mdi-communication-forum"></o>'+Language.nomessageschat+'</h3></div>');
          }
          moreoptions(openDiv);
    },
    Language.deleteconversu,
    ['Cancel','Yes']);
}

function blockuserd(){
  navigator.notification.confirm(
    Language.blockusr, function(buttonIndex){
          if(buttonIndex == '2'){
            blockuser(id);
          }
          moreoptions(openDiv);
    },
    Language.blockfriendsu,
    ['Cancel','Yes']);
}

function deletefrg(){
  navigator.notification.confirm(
    Language.deletefriend, function(buttonIndex){
          if(buttonIndex == '2'){
            deletefriend(id);
          }
          moreoptions(openDiv);
    },
    Language.removefriend,
    ['Cancel','Yes']);
}

