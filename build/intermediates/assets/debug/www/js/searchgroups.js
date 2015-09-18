var keyuser = localStorage.getItem('keyuser');

function pagefunctions(){
$('.collection.withimages').append('<div id="loading-user" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');

$.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/searchgroups.php",
    data: {"key": keyuser},
    cache: false,
    dataType: 'json',
    success: function(result) {
      $('#loading-user').remove();
      $('.collection.withimages').append('<div class="officials"></div>');
      for (var i = 0; i < result.officialgr.length; i++) {
        id = result.officialgr[i].id;
        namegroup = result.officialgr[i].namegroup;
        official = result.officialgr[i].official;
        imagepr = result.officialgr[i].imagepr;
        state = result.officialgr[i].state;
        grsearchitem = searchmount(id, namegroup, official, imagepr, state);
        $('.collection.withimages .officials').append(grsearchitem);
      }
      $('.collection.withimages').append('<div class="news"></div>');
      for (var i = 0; i < result.newgr.length; i++) {
        id = result.newgr[i].id;
        namegroup = result.newgr[i].namegroup;
        official = result.newgr[i].official;
        imagepr = result.newgr[i].imagepr;
        state = result.newgr[i].state;
        grsearchitem = searchmount(id, namegroup, official, imagepr, state);
        $('.collection.withimages .news').append(grsearchitem);
      }
      $('.collection.withimages').append('<div class="intgr"></div>');
      for (var i = 0; i < result.intgr.length; i++) {
        id = result.intgr[i].id;
        namegroup = result.intgr[i].namegroup;
        official = result.intgr[i].official;
        imagepr = result.intgr[i].imagepr;
        state = result.intgr[i].state;
        grsearchitem = searchmount(id, namegroup, official, imagepr, state);
        $('.collection.withimages .intgr').append(grsearchitem);
      }
      $('.officials').addClass(langdefault);
      $('.news').addClass(langdefault);
      $('.intgr').addClass(langdefault);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.error(textStatus + ' ' + XMLHttpRequest.status);
      errormod(Language.errorpetitionm2s);
      $('#loading-user').remove();
    }
});
}

function submitsearch() {
	$('.collection.withimages').append('<div id="loading-user" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
  	$('.collection.withimages .officials').hide();
  	$('.collection.withimages .news').hide();
  	$('.collection.withimages .intgr').hide();
  	if (document.getElementById('search-items')) {
    	$('#search-items').remove();
  	}
  	$('.collection.withimages').append('<div id="search-items"></div>');
  	var valueinput = $('#search-useradd').val();
  	if (valueinput != '') {
    	$.ajax({
      		type: "POST",
      		crossDomain: true,
      		url: "http://m2s.es/app/api/searchgroups.php",
      		data: {"s": valueinput, "key": keyuser},
      		cache: false,
      		dataType: 'json',
      		success: function(data) {
        		if (data.search.length == 0) {
          			$('.collection.withimages #search-items').append("<p class='center'>"+Language.noresultsearch+"</p>");
        		}
        		for (var i = 0; i < data.search.length; i++) {
          			id = data.search[i].id;
          			namegroup = data.search[i].namegroup;
          			official = data.search[i].official;
          			imagepr = data.search[i].imagepr;
          			state = data.search[i].state;
          			grsearchitem = searchmount(id, namegroup, official, imagepr, state);
          			$('.collection.withimages #search-items').append(grsearchitem);
        		}
      		},
      		complete: function() {
        		if ($('#loading-user').length) {
          			$('#loading-user').remove()
        		}
      		},
      		error: function(XMLHttpRequest, textStatus, errorThrown) {
        		console.error(textStatus + ' ' + XMLHttpRequest.status);
        		errormod(Language.errorpetitionm2s);
        		$('#loading-user').remove();
      		}
    	});
  	}else{
    	$('#loading-user').remove();
    	$('.collection.withimages .officials').show();
    	$('.collection.withimages .news').show();
    	$('.collection.withimages .intgr').show();
  	};
}

function searchmount(id, namegroup, official, imagepr, state) {
  searchdiv = '';
  searchdiv += '<a href="profilegr.html?id=' + id + '" class="collection-item' 
  if (official == 'yes') {
    searchdiv += ' official'; 
  }
  searchdiv += '"><li>';
  if (imagepr != null) {
    searchdiv += '<img src="' + imagepr + '" class="profile-badge"/>';
  } else {
    var namesplit = namegroup.split(' ');
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
    searchdiv += '<div class="img profile-badge ';
    searchdiv += colorfinal;
    searchdiv += ' lighten-3"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>';
  }
  searchdiv += '<div class="cont"><font class="title">'+namegroup+'</font> <font class="message">';
  if (state == '') {
    searchdiv += '--';
  } else {
    searchdiv += state;
  }
  searchdiv += '</font><font class="more-info">+ INFO</font></div></li></a>';
  return searchdiv;
};