/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 var locationMap =
{
   /*
   *  initializes the elements of google maps:
   *  the map, the position of the user
   *  where is the marker shown
   *  the search bar
   */
   initMap: function () {
        console.log('draw a basic map');
        map  = new google.maps.Map(document.getElementById('mapsDiv'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(48.33521, 14.32389),
            zoom: 15
        });
    
        mymarker = new google.maps.Marker({
            clickable: false,
            icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22,22),
            new google.maps.Point(0,18),
            new google.maps.Point(11,11)),
            shadow: null,
            zIndex: 999,
            map: map
        });
       
        marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            title: 'Click to zoom',
            draggable:true

        });
        
        // Create the search box and link it to the UI element.
        var input =(
            document.getElementById('pac-input'));
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        searchBox = new google.maps.places.SearchBox((input));
        
        google.maps.event.addListener(marker, 'click',this.showData);
        google.maps.event.addListener(map, 'click', this.setMarker);
        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', this.searchPlace);
        
          
        
   },
   /*
    * if the user clicks the map, the marker is positioned there
    * and the map is centered so the marker will be in center
    */
   setMarker: function(e)
   {
       alert("intra aici : " + e.latLng);
       map.panTo(e.latLng);
       marker.setPosition(e.latLng);
   }
   ,
   showData: function(e)
   {
       alert("I pressed the marker, should something happen now");
   }
   ,
   searchPlace: function()
   {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
                    return;
        }

        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

                    // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });  
            map.panTo(place.geometry.location);
        }

   }
    
};