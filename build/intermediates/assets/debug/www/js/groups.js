$(window).scroll(function(){
	if($(window).scrollTop() >= $('nav').height()) {
        $('ul.tabs').css('position','fixed');
	}else{
		$('ul.tabs').css('position','relative');
	}
})

$('.searchaction').click(function(){
	$('nav').css('height','auto');
	$('.seach').show();
	$('.nonsearch').hide();
});

$('.closesea').click(function(){
	$('nav').css('height','112px');
	$('.seach').hide();
	$('.nonsearch').show();
});

var input = document.getElementById('search-input');
input.onkeyup = function() {
  var filter = input.value.toUpperCase();
  var lis = document.getElementsByClassName('collection-item');
  for (var i = 0; i < lis.length; i++) {
    var name = lis[i].getElementsByClassName('title')[0].innerHTML;
    if (name.toUpperCase().indexOf(filter) == 0)
      lis[i].style.display = 'block';
    else
      lis[i].style.display = 'none';
  }
}

function spanneraddgroups(){
  if($('.navspinner').length == '0'){
    $('.spinele').attr('style', 'position:fixed;top:0px;left:0px;background: rgba(255,255,255,0.6); width:100%;height:100%;z-index:10000000');
    $('.spinele').append('<div class="navspinner"><div><a class="itemspinner z-depth-1" href="searchgroups.html">'+Language.discovergroups+'</a> <a href="searchgroups.html" class="btn-floating yellow darken-3"><i class="mdi-action-language"></i></a></div> <div><a class="itemspinner z-depth-1" href="creategroup.html">'+Language.createnewgroup+'</a> <a href="creategroup.html" class="btn-floating"><i class="mdi-content-add"></i></a></div></div>');
    $('.btn-floating.btn-large.waves-effect.waves-light.green i').removeClass('mdi-content-add');
    $('.btn-floating.btn-large.waves-effect.waves-light.green i').addClass('mdi-content-clear');
  }else{
    $('.navspinner').remove();
    $('.spinele').removeAttr('style');
    $('.btn-floating.btn-large.waves-effect.waves-light.green i').removeClass('mdi-content-clear');
    $('.btn-floating.btn-large.waves-effect.waves-light.green i').addClass('mdi-content-add');
  }
}

var keyuser = localStorage.getItem('keyuser');

function pagefunctions(){
	var divs = '';
	$.ajax({
  		type: "POST",
  		crossDomain: true,
  		url: "http://m2s.es/app/api/getmygroups.php",
  		data: {"key": keyuser},
  		cache: false,
  		dataType: 'json',
  		beforeSend: function() {
      		console.log('Reading list of your friends...');
      		$('.collection.withimages').append('<div id="loading-user" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
  		},
  		success: function(result) {
    		if (result.groups) {
      			if (result.groups == 'no') {
              $('.collection.withimages #loading-user').remove();
        			$('.collection.withimages').append("<div class='no-friends'><h4>"+Language.nogroupsjoin+"</h4><p>"+Language.nogroupsjoininfo+"</p></div>");
      			}
      		for (var i = 0; i < result.groups.length; i++) {
        		id = result.groups[i].id;
            namegroup = result.groups[i].namegroup;
            official = result.groups[i].official;
            imagepr = result.groups[i].imagepr;
            state = result.groups[i].lastmessage;
            statedate = result.groups[i].lastmessagedate;
            unreadmsm = result.groups[i].unreadmsm;
            var localidsfdf = localStorage.getItem('lastmsmcgr-' + result.groups[i].id);
            if(localidsfdf != null){
                mstate = localidsfdf;
                mstated = localStorage.getItem('lastmsmcgrd-' + result.groups[i].id);
            }else{
                mstate = '--';
                mstated = '';
            }

        		divs += '<a href="chatgr.html?id=' + id + '" class="collection-item';

            if (official == 'yes') {
                divs += ' official'; 
            }
        		if (state == null) {
            		divs += '" last-date="'+mstated+'"><li>';
        		} else {
            		divs += ' mark" last-date="'+statedate+'"><li>';
        		}	
        		if(unreadmsm != ''){
        			divs += '<span class="new badge">'+unreadmsm+'</span>';
        		}
            if (imagepr != null) {
              divs += '<img src="'+imagepr+'" class="profile-badge"/>';
            } else {
              var namesplit = namegroup.split(' ');
              abv1 = namesplit[0].charAt(0);
              if (namesplit[1]) {
                abv2 = namesplit[1].charAt(0);
                abv = abv1 + abv2;
              } else {
                abv = abv1;
              }
              divs += '<div class="img profile-badge ';
              if(sessionStorage.getItem(id+'-colour')){
                  var colorfinal = sessionStorage.getItem(id+'-colour');
              }else{
                  var colores = new Array('red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'teal', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey');
                  var colorfinal = colores[Math.floor(Math.random()*colores.length)];
                  sessionStorage.setItem(id+'-colour', colorfinal);
              }
              divs += colorfinal;
              divs += ' lighten-3"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>';
            }
        		
        		divs += '<div class="cont"><font class="title">'+namegroup+'</font> <font class="message">';
        		if (state == null) {
            		divs += mstate;
        		} else {
            		divs += state;
        		}	
        		divs += '</font><font class="more-info">+ INFO</font></div></li></a>';
      		};
      		$('#loading-user').remove();
      		$('.collection.withimages').append(divs);
          tinysort('.collection>a',{attr:'last-date',order:'desc'})
    	}else{
    		alert('error');
    		console.log(result);
    	}
  	},
  	error: function(XMLHttpRequest, textStatus, errorThrown) {
    	console.error(textStatus + ' ' + XMLHttpRequest.status);
    	var divno = document.createElement('div');
    	divno.innerHTML = '<div id="list-notifications" style="text-align:center;cursor:pointer"></div>';
    	divno.className = 'background-dark';
    	var modsv = document.getElementById('modsv');
    	modsv.appendChild(divno);
    	$('#list-notifications').append(Language.errorconection);
    	$('#list-notifications').click(function() {
      		window.location.reload();
    	})
  	}
});
}