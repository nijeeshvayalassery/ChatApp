$('#SignIn').on('click',function(){
        DoLogin() 
    })
$( "#Email,#Name" ).keypress(function( event ) {
        if ( event.which == 13 ) {
            DoLogin() 
    }
    });
function DoLogin() {
		 $.ajax({
            type: "POST",
            url:"http://localhost:4000/login",
            data:{email:$('#Email').val(),name:$('#Name').val()},
            success: function (data) {
		window.location.href="/";
            },
            error:function( jqXHR,textStatus,errorThrown){
		alert("Err")
            }
        });
}