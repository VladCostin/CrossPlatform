/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 var locationManager =
{
    
    curr_loc: function()
    {
       alert("location");
        var geolocationOptions = 
                { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
        
        navigator.geolocation.getCurrentPosition(this.geolocationSuccess, 
                                         this.geolocationError, 
                                         geolocationOptions);
        
    }
    ,
    geolocationSuccess: function(pos)
    {
        alert("the function has succesfully retrieved the data 2: " +
            pos.coords.latitude + " " + pos.coords.longitude);
    
        var myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        console.log(myLocation);
        map.setCenter(myLocation);
        mymarker.setPosition(myLocation);
    }
    ,
    geolocationError: function(error)
    {
        alert("the function has finished with an error : " + error.message);
    }
    
    
};




