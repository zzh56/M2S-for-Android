var keyuser = localStorage.getItem('keyuser');

function pagefunctions(){
	$('#creategroup-cr').click(function() {
  		namegr = $('#namegroup-cr').val();
  		if ($('#namegroup-cr').val()) {
   	 		descgr = $('#descriptiongroup-cr').val();
    		locgr = '';
    		if ($('#privategroup-cr').is(':checked')) {
      			privategr = 'yes';
    		}else{
      			privategr = 'no';
    		}
    		if ($('#showcreator-cr').is(':checked')) {
      			showcreatr = 'yes';
    		}else{
      			showcreatr = 'no';
    		}
    		$.ajax({
      			type: "POST",
      			crossDomain: true,
      			url: "http://m2s.es/app/api/connect/creategroup.php",
      			data: {
        			'name': namegr,
        			'description': descgr,
        			'location': locgr,
        			'private': privategr,
        			'showcreator': showcreatr
      			},
      			cache: false,
      			dataType: 'json',
      			success: function(data) {
        			if (data.mensaje == 'ok') {
          				document.location.href = 'groups.html';
        			}
        			if(data.mensaje == 'e2'){
          				errormod(Language.errormatchgroup);
        			}
      			},
      			error: function(XMLHttpRequest, textStatus, errorThrown) {
        			console.error(textStatus + ' ' + XMLHttpRequest.status);
        			errormod(Language.errorpetitionm2s);
      			}
    		})
  		}else{
    		errormod(Language.erroremptygroup);
  		}
	})
}