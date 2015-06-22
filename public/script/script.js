// if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    //var connection = new WebSocket('ws://192.168.0.141:4000');
    socket = io.connect("http://localhost:4000");
    //connection.UserName="NV"
    /*connection.onopen = function () {
        // connection is opened and ready to use
    };
    
    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
    };*/
    socket.on('message', function(msg) {
       alert(JSON.stringify(msg))
    });
    /*connection.onmessage = function (message) {
        //var json=message.data
        //alert(JSON.stringify(message))
        try {
           var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
        
        //document.getElementById('chat').innerHTML=message.data
        //document.getElementsByClassName("chatArea")[0].appendChild()
        //$(".chatArea").html('<div class="chatdiv"><span class="chattext">'+message.data+'</span></div>');
        if (json.Type == 'NewUser') {
            //req.body.name
            $("#Clist .panel-body").append('<div class="CPerson"><span uemail="'+json.Email+'">'+json.UserName+'</span></div>')
        } else if(json.Type == 'Logout'){
            var email=json.UserEmail;
            $("[uemail="+email+"]").remove();
        }else{
            $(".chatArea").append('<div class="chatdiv"><span class="chattext">'+json.Message+'</span></div>');
        }
        // try to decode json (I assume that each message from server is json)
    };*/
  /*  document.getElementById('btn').addEventListener('click',function(){
        var Txt = document.getElementById('inp').value
        // alert('Sending');
        connection.send(Txt);
    })*/
  
    $("#btn").on('click',function(){
        /*connection.send($("#inp").val());
        $("#inp").val('')*/
    })
    $( "#inp" ).keypress(function( event ) {
        if ( event.which == 13 ) {
           /*connection.send($("#inp").val());
            $("#inp").val('')*/
          
            socket.emit('message', 
                        {
                          "inferSrcUser": true,
                          "source": "",
                          "message":  $("#inp").val(''),
                          "target": 'All'
                        });
            $('input#msg').val("");
    }
    });
    $('#logout').on('click',function(){
        $.ajax({
            type:"GET",
            url:"http://localhost:4000/logout",
            success: function (data) {
                window.location.href="/";
            },
            error:function( jqXHR,textStatus,errorThrown){
		alert("Err")
            }
        })
    })
   /* myEl.addEventListener('click', function() {
    var Txt = document.getElementById('inp').value
  // alert('Sending');
   connection.send(Txt);
    }, false);*/