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
    url: "http://m2s.es/app/api/profileinfo.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    success: function (result) {
        var username = result.username,
            imagein = result.imagein,
            id = result.id,
            state = result.state,
            timeago = result.timeago,
            genre = result.genre,
            telf = result.telf,
            birth = result.birt,
            email = result.email;
        if(imagein == null){
            imagein = 'images/icon-user-default.png';
        }
        $('#loading-user').hide();
        $('.onresd').html(username);

        var modaluser = '';

        $('header').append('<div class="primg"></div>');

        $('.primg').append('<img src="' + imagein + '" class="profile-badge"/>');

        $('.primg').append('<h5>'+username+'</h5>');
        
        if (state == '1' || state == '4'){
           $('.primg h5').append('<p>'+timeago+'</p>');
           /*$('.clasmod .card:first-child .card-content').append('<p>' + linkscom(decription) + '</p>');*/
           if (state != '4') {
              $('.clasmod .card:first-child .card-action').append('<a id="chatbutton" href="chat.html?id='+id+'">'+Language.chat+'</a>');          
              $('.clasmod .card:first-child .card-action').append('<a id="blockfriendbutton">'+Language.block+'</a>');
              $('.clasmod .card:first-child .card-action').append('<a id="deletefriendbutton">'+Language.deletefriend+'</a>');
           }else{
              $('.clasmod .card:first-child .card-action').append('<a href="settings.html">'+Language.settings+'</a>');
           }
            if (result.states != '') {
                for (var i = 0; i < result.states.length; i++) {
                    idt = result.states[i].id;
                    text = result.states[i].text;
                    date = result.states[i].date;
                    locationgg = result.states[i].location;
                    if (state != '4') {
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

                    if(mens == 'me'){
                        $('#'+idt).prepend('<a href="javascript:deletestate(' + idt + ')" class="btn-floating red trash" style="float:right;display:none;left:-10px"><i class="mdi-action-delete"></i></a>');
                    }

                    if(mens == 'me'){
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
        if (result.state == '23') {
            $('.clasmod .card:first-child .card-action').append('<font>'+Language.waitaccept+'</font>');
        }

        if (result.state == '5') {
            $('.clasmod .card:first-child .card-action').append('<a id="addfriendbutton">'+Language.addfriend+'</a>');
        }

        $('#addfriendbutton').click(function () {
            $.ajax({
                type: "POST",
                crossDomain: true,
                url: "http://m2s.es/app/api/connect/addfriend.php",
                data: {"id": id, "key": keyuser},
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    console.log('Connecting to send petition of friend...');
                    $('#addfriendbutton').attr('disabled', 'disabled');
                    $('#addfriendbutton').html(Language.sending);
                },
                success: function (result) {
                    if (result.mensaje == 'ok') {
                          $('#addfriendbutton').remove();
                          $('.clasmod .card:first-child .card-action').append('<font>'+Language.waitaccept+'</font>');
                    }else{
                          errormod(Language.errorpetitionm2s);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(textStatus + ' ' + XMLHttpRequest.status);
                    errormod(Language.errorpetitionm2s);
                }
            })
        });

        $('#blockfriendbutton').click(function () {
            navigator.notification.confirm(
                Language.block,
                function(buttonIndex){
                    if(buttonIndex == '2'){
                        blockuser(id);
                    }
                },
                Language.blockfriendsu,
                ['Cancel','Yes']
            );
        })

        $('#deletefriendbutton').click(function(){
            navigator.notification.confirm(
                Language.deletefriend,
                function(buttonIndex){
                    if(buttonIndex == '2'){
                        deletefriend(id);
                    }
                },
                Language.removefriend,
                ['Cancel','Yes']
            );
        })
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
    }
})
}

function deletestate(idf){
   $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/connect/delete-state.php",
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