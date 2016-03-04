$(document).ready(function(){
    $(document).on('click', '#clck', function() { // catch the form's submit event
                var request = $.ajax({url: '',
                    data: JSON.stringify({action : 'click'}),
                    type: 'post',                 
                    async: 'true',
			contentType: 'application/json',
                    dataType: 'json',
			beforeSend: function() {
                        // This callback function will trigger before data is sent
                        $.mobile.loading('show', {theme:"a", text:"Please wait...", textonly:true, textVisible: true}); // This will show ajax spinner
                    },
                    complete: function() {
                        // This callback function will trigger on data sent/received complete
                        $.mobile.loading('hide'); // This will hide ajax spinner
                    },
                    success: function (result) {
                        if(result.message) {
				console.log('success!');
                            $("#trial").html(result.message);                    
                        } else {
                            console.log('failure');
				alert(':P!');
                        }
                    },
                    error: function (request,error) {
                        // This callback function will trigger on unsuccessful action              
                        alert('Network error has occurred please try again!');
                    }
                });
		/*request.done(function(result){
			$("#trial").html(result.message)
		});*/                 
        //return false; // cancel original event to prevent form submitting
    });
}); 