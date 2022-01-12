  function handleKeyDown( event ){
    if ( event.keyCode === 13 ){
      
      // Handle MAP command
      if ( this.value.trim().indexOf("map:") === 0 ){
        
        let country = this.value.split( "map:")[1].trim();
  
        $.ajax({
          url: "https://restcountries.eu/rest/v2/name/" + country,
          success: function( data ){
            console.log( data );
            
  
            $(".chat-left")
              .clone( true )
              .removeClass( "chat-left" )
              .val("Map of " + country + " coming up!")
              .attr("disabled",true)
              .prependTo("#chat-wrapper")
              .show('slow');    
  
            
            $("<div id='map' class='col-12 my-4'></div>")
              .prependTo( $("#chat-wrapper") );
              openMap({ lon: data[0].latlng[1], lat: data[0].latlng[0] });
          }
        });
        
      } else {
  
        $(".chat-right")
          .clone( true )
          .removeClass( "chat-right" )
          .val( this.value )
          .attr("disabled",true)
          .prependTo("#chat-wrapper")
          .show('fast');    
  
      }
  
      $("#interface").val(" ");
  
    }
    
  }
  
  // Show our Chat Interface:
  $("#chat-container").slideToggle("slow");
  
  // Listen on the user's input:
  $("#interface").on("keydown", handleKeyDown );
  
  // Close the Chat Interface:
  $(".close-button").click(function(){
  
    $("#chat-container").fadeOut();
  
  });
  
  // MAP
  function openMap( options ){
    if ( options.zoom === undefined ){
      options.zoom = 4;
    }
    if ( options.target === undefined ){
      options.target = "map";
    }
    let map = new ol.Map({
      target: options.target,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([ options.lon, options.lat ]),
        zoom: options.zoom
      })
    });
  }
  $(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#profile-img").click(function() {
	$("#status-options").toggleClass("active");
});

$(".expand-button").click(function() {
  $("#profile").toggleClass("expanded");
	$("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function() {
	$("#profile-img").removeClass();
	$("#status-online").removeClass("active");
	$("#status-away").removeClass("active");
	$("#status-busy").removeClass("active");
	$("#status-offline").removeClass("active");
	$(this).addClass("active");
	
	if($("#status-online").hasClass("active")) {
		$("#profile-img").addClass("online");
	} else if ($("#status-away").hasClass("active")) {
		$("#profile-img").addClass("away");
	} else if ($("#status-busy").hasClass("active")) {
		$("#profile-img").addClass("busy");
	} else if ($("#status-offline").hasClass("active")) {
		$("#profile-img").addClass("offline");
	} else {
		$("#profile-img").removeClass();
	};
	
	$("#status-options").removeClass("active");
});

function newMessage() {
	message = $(".message-input input").val();
	if($.trim(message) == '') {
		return false;
	}
	$('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
	$('.message-input input').val(null);
	$('.contact.active .preview').html('<span>You: </span>' + message);
	$(".messages").animate({ scrollTop: $(document).height() }, "fast");
};

$('.submit').click(function() {
  newMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});
//# sourceURL=chat-screen.js