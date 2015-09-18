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

var keyuser = localStorage.getItem('keyuser');

function pagefunctions(){
	var divs = '';
	$.ajax({
  		type: "POST",
  		crossDomain: true,
  		url: "http://m2s.es/app/api/getfriends.php",
  		data: {"key": keyuser},
  		cache: false,
  		dataType: 'json',
  		beforeSend: function() {
      		console.log('Reading list of your friends...');
      		$('.collection.withimages').append('<div id="loading-user" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
  		},
  		success: function(result) {
    		if (result.friends) {
      			if (result.friends.length == '0') {
        			$('.collection.withimages').append("<div class='no-friends'><h4>"+Language.nofriends+"</h4><p>"+Language.nofriendsinfo+"</p></div>");
      			}
      		for (var i = 0; i < result.friends.length; i++) {
        		id = result.friends[i].id;
        		username = result.friends[i].username;
        		imagepr = result.friends[i].imagepr;
            if(imagepr == null){
              imagepr = 'images/icon-user-default.png';
            }
        		state = result.friends[i].lastmessage;
        		unreadmsm = result.friends[i].unreadmsm;
        		if(state != null){
          			statemeis = result.friends[i].lastmessage.meis;
        		}else{
          			statemeis = 'yes';
        		}
        		if (unreadmsm == '0') {
          			unreadmsm = '';
        		}
        		var localidsfdf = localStorage.getItem('lastmsmc-' + result.friends[i].id);
        		if(localidsfdf != null){
            		mstate = localidsfdf;
            		mstated = localStorage.getItem('lastmsmcd-' + result.friends[i].id);
        		}else{
            		mstate = '--';
            		mstated = '';
        		}

        		divs += '<a href="chat.html?id=' + id + '" class="collection-item';

        		if (state == null) {
            		divs += '" last-date="'+mstated+'"><li>';
        		} else {
          			if(statemeis == 'yes'){
            			divs += '" last-date="'+mstated+'"><li>';
          			}else{
            			divs += ' mark" last-date="'+state.date+'"><li>';
          			}
        		}	
        		if(unreadmsm != ''){
        			divs += '<span class="new badge">'+unreadmsm+'</span>';
        		}
        		divs += '<img src="'+imagepr+'" class="profile-badge"/>';
        		divs += '<div class="cont"><font class="title">'+username+'</font> <font class="message">';
        		if (state == null) {
            		divs += mstate;
        		} else {
          			if(statemeis == 'yes'){
            			divs += mstate;
          			}else{
            			divs += state.text;
          			}
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