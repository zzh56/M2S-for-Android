var keyuser = localStorage.getItem('keyuser');

function pagefunctions(){}

function submitadd(){
  if (document.getElementById('person')) {
    $('#person').remove();
  }
  var valueinput = $('#search-useradd').val();
  if ($('#search-useradd').val().length != 0) {
    $('.people').html('<div id="loading-user" class="col s12 center" style="padding-bottom:25px"><div class="preloader-wrapper active"><div class="spinner-layer spinner"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/profileinfo.php",
      data: {"username": valueinput, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(data) {
        username = data.username;
        image = data.imagein;
        if(image == null){
          image = 'images/icon-user-default.png';
        }
        id = data.id;
        state = data.state;
        datos = crearNoticiaHtml(username, image, id, state);
        $('.' + 'people').append(datos);
      },
      complete: function() {
        if ($('#loading-user').length) {
          $('#loading-user').css('display', 'none');
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
        if ($('#loading-user').length) {
          $('#loading-user').css('display', 'none');
        }
      }
    });
  };
}

function crearNoticiaHtml(username, image, id, state) {
    if (state == '1') {
      noticiaHTML = '<div id="person">';
      noticiaHTML += '<img src="' + image + '" class="circle responsive-img"/>';
      noticiaHTML += '<p>' + username + '</p>';
      noticiaHTML += '<a href="javascript:addpeople(' + id + ')"><button  class="btn grey" id="addfriendb">'+Language.sendrequestfriend+'</button></a></div>';
    }
    if (state == '2' || state == '5') {
      var searchinput = document.getElementById('search-useradd');
      var valueinput = searchinput.value;
      noticiaHTML = '<div id="person">' + valueinput + ' '+Language.alreadyfriend+'</div>';
    }
    if (state == '3') {
      noticiaHTML = '<div id="person">'+Language.usernotexist+'</div>';
    }
    if (state == '4') {
      noticiaHTML = '<div id="person">'+Language.addyourself+'</div>';
    }
    return noticiaHTML;
}

function addpeople(id) {
  $.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/connect/addfriend.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    beforeSend: function() {
      console.log('Connecting...');
      $('#addfriendb').attr("href", "#");
      $('#addfriendb').html(Language.loading)
    },
    success: function(result) {
      if (result.mensaje == 'ok') {
        $('#addfriendb').html(Language.petitionfriendsend)
      } else {
        $('#addfriendb').html(Language.error);
        setInterval(function() {
          $('#addfriendb').html(Language.sendrequestfriend);
          $('#addfriendb').attr("href", "javascript:addpeople(" + id + ")");
        }, 5000);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.error(textStatus + ' ' + XMLHttpRequest.status);
      errormod(Language.errorpetitionm2s);
      $('#addfriendb').html(Language.sendrequestfriend);
      $('#addfriendb').attr("href", "javascript:addpeople(" + id + ")");
    }
  })
}