var keyuser = localStorage.getItem('keyuser');

 $(document).ready(function() {
    $('select').material_select();
 });

if(localStorage.getItem('darkmode')){
	$('#darkmde').attr('checked', 'checked');
}

if(localStorage.getItem('customfont')){
	$('#custchfon').attr('checked', 'checked');
	$('.fonths').show();
	$('option[value="'+localStorage.getItem('customfont')+'"]').attr('selected','selected');
}

$('.imagechange').click(function(){
	fileChooser.open(function(uri) {
		convertImgToBase64(uri, function(base64Img){
      		url = base64Img;
    		$('.loadingimg').show();
    		$.ajax({
      			type: "POST",
      			crossDomain: true,
      			url: "http://m2s.es/app/api/connect/editprofile.php",
      			data: {"imgeprofile": url, "key": keyuser},
      			cache: false,
      			dataType: 'json',
      			success: function(result) {
          			console.log(result.mensaje);
          			if(result.mensaje == 'ok'){
          				$('.loadingimg').hide();
          				$('.imguserdff').attr('src', url);
          				localStorage.setItem('imguse', url);
          			}else{
          				errormod('Error uploading...');
          				$('.loadingimg').hide();
          			}
      			}
     		})
    	});
    })
});

$('#updtphbtn').click(function(){
	var newphnum = $('#mophn').val();
	$.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/editprofile.php",
      data: {"phonenumber": newphnum, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
          console.log(result.mensaje);
          if(result.mensaje == 'ok'){
          	salert(Language.updatephonesucces, function(){});
          	$('#mophn').val('');
          }else{
          	console.log(result.mensaje);
          }
      }
     })
})

$('#updpassn').click(function(){
	var newpassw = $('#newpassi').val();
	var confpassw = $('#confnewpassi').val();
	if(newpassw != ''){
	$.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/editprofile.php",
      data: {"password": newpassw, "password_conf": confpassw, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
          console.log(result.mensaje);
          if(result.mensaje == 'ok'){
          	salert(Language.updatepasssucces, function(){});
          	$('#newpassi').val('');
          	$('#confnewpassi').val('');
          	localStorage.removeItem('keyuser');
          }else{
            salert(result.mensaje, function(){});
          }
          if(result.mensaje == 'e3'){
          	errormod(Language.passnotmatch);
          }
      }
     })
}else{
  errormod(Language.nointrpass);
}
})

$('#darkmde').change(function(){
	if($('#darkmde').is(':checked')){
	  $('body').addClass('dark');
      $('.black-text').removeClass('black-text');
      localStorage.setItem('darkmode', '1');
	}else{
	  $('body').removeClass('dark');
	  localStorage.removeItem('darkmode');
    $('.white-text').removeClass('white-text');
	}
});

$('#custchfon').change(function(){
	if($('#custchfon').is(':checked')){
		$('.fonths').show();
		$('body').addClass($('#fontja').val());
		localStorage.setItem('customfont', $('#fontja').val());
	}else{
		$('body').removeClass(localStorage.getItem('customfont'));
		localStorage.removeItem('customfont');
		$('.fonths').hide();
	}
});

$('.changefont').click(function(){
	if(localStorage.getItem('customfont')){
	   $('body').removeClass(localStorage.getItem('customfont'));
	}
	$('body').addClass($('#fontja').val());
	localStorage.setItem('customfont', $('#fontja').val());
});


$('.changelang').click(function(){
   if($('#idiomch').val() != langdefault){
     localStorage.setItem('lang', $('#idiomch').val());
     document.location.href='index.html';
   }
});

function pagefunctions(){
	$('.collapsible').collapsible();
	if(!localStorage.getItem('imguse')){
        $('.imguserdff').attr('src', "images/icon-user-default.png");
    }else{
  	    $('.imguserdff').attr('src', localStorage.getItem('imguse'));
    }
    $('option[value="'+langdefault+'"]').attr('selected','selected');

    $('.listfriendblock').html('<div id="loading-user" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
    $.ajax({
    	type: "POST",
    	crossDomain: true,
    	url: "http://m2s.es/app/api/blocklist.php",
    	data: {"key": keyuser},
    	cache: false,
    	dataType: 'json',
    	success: function(result) {
      		if(result.list.length != '0'){
         		$('.listfriendblock').html('');
         		for (var i = 0; i < result.list.length; i++) {
            		idg = result.list[i].id;
            		username = result.list[i].name;
            		imageprofile = result.list[i].imagepr;
            		blockstatesfv = result.list[i].block;
            		divcont = '<div class="userblockgrouplist" id="'+idg+'"><img src="'+imageprofile+'" class="img"/><div class="left-jk"><b>'+username+'</b>';
            		if(blockstatesfv == 'yes'){
              			divcont += ' <button class="btn unblockbu" id="'+idg+'" onclick="unblocpfu('+idg+')">'+Language.unblock+'</button>';
            		}else{
              			divcont += ' <button class="btn blockbu" id="'+idg+'" onclick="blockpfu('+idg+')">'+Language.block+'</button>';
            		}
            		divcont += ' <a href="profile.html?id='+idg+'"><span>'+Language.viewhisprofile+'</span></a> </div></div>';
            		$('.listfriendblock').append(divcont);
         		}
      		}else{
            $('.listfriendblock').html('<p>'+Language.nofriends+'</p>');
          }
    	},
    	error: function(XMLHttpRequest, textStatus, errorThrown) {
      		console.error(textStatus + ' ' + XMLHttpRequest.status);
      		errormod(Language.errorpetitionm2s);
    	}
	})
}

function unblocpfu(datadi){
   $('#'+datadi+'.unblockbu').html(Language.loading);
   $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/acceptuser.php",
      data: {"id": datadi, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
        if(result.mensaje == 'ok'){
          $('#'+datadi+'.unblockbu').html(Language.block);
          $('#'+datadi+'.unblockbu').attr('onclick', 'blockpfu("'+datadi+'")');
          $('#'+datadi+'.unblockbu').addClass('blockbu');
          $('#'+datadi+'.unblockbu').removeClass('unblockbu');
        }else{
          console.log('Error:'+result.mensaje);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}

function blockpfu(datadi){
   $('#'+datadi+'.blockbu').html(Language.loading);
   $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/blockuser.php",
      data: {"recid2": datadi, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
        if(result.mensaje == 'ok'){
          $('#'+datadi+'.blockbu').html(Language.unblock);
          $('#'+datadi+'.blockbu').attr('onclick', 'unblockpfu("'+datadi+'")');
          $('#'+datadi+'.blockbu').addClass('unblockbu');
          $('#'+datadi+'.blockbu').removeClass('blockbu');
        }else{
          console.log('Error:'+result.mensaje);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}