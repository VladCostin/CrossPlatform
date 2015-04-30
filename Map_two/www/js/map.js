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

        var searchBox = new google.maps.places.SearchBox((input));

        google.maps.event.addListener(map, 'click', this.setMarker);
        
        
          
        
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
    
};