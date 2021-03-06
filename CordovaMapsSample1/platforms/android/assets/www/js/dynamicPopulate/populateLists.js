/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * populates the main apge with data retrieved dynamically
 */
function populateListMainPage(result)
{
    var ul = document.getElementById("listTripTitles");
    var i = 0;
    /*
     * deletes ll the children so there will be no duplicates
     * in future: create another method and check in Ul children the node 
     * that has the value to be deleted
     */
    
    while (ul.childNodes.length > 2) {
        ul.removeChild(ul.lastChild);
    }

    var linkTitle = [];

    for (var i = 0; i < result.rows.length; i++)
    {
        var listItemTitle = document.createElement("li");
        linkTitle[i] = document.createElement("a");
        linkTitle[i].href = "#list";
        linkTitle[i].innerHTML = result.rows.item(i).title;
        linkTitle[i].id = result.rows.item(i).id;
        setClickEventToTrip(linkTitle[i]);


        listItemTitle.appendChild(linkTitle[i]);
        ul.appendChild(listItemTitle);
    }
    
    //update listview
    $( "#listTripTitles" ).listview( "refresh" );

}

/*
 * 
 * specifies the title of the trip as the header of the page
 * @param {type} result : represents the entrance in trip table associated with 
 * the id of the trip selected from the main page
 */
function populateTripDetailsPage(result)
{
    // var listItemTitle = document.createElement("li");
    $("h1#header").text(result.rows.item(0).title);
    $("#general-text").text(result.rows.item(0).description);
   /* var header = document.getElementById("header");
    if (result.rows.length > 1)
        header.innerHTML = "Error, multiple values have been returdned";
    else
    if (result.rows.length == 0)
        header.innerHTML = "Error, no values returned";
    else
        header.innerHTML = result.rows.item(0).title;
    */

    window.localStorage.setItem("id_trip_shown", result.rows.item(0).id);
}

/*
 * creates the list of days
 * the value a ( result.rows.item(i).a) represents the data the story was added
 */
function populateListStoriesData(result)
{
       
    var ul = document.getElementById("listDays");
    /*
     * deletes ll the children so there will be no duplicates
     * in future: create another method and check in Ul children the node 
     * that has the value to be deleted
     */
    while (ul.childNodes.length > 1) {
        ul.removeChild(ul.lastChild);
    }

    for (var i = 0; i < result.rows.length; i++)
    {           

        var listItemTitle = document.createElement("li");
        var linkStoriesFromDate = document.createElement("a");
        linkStoriesFromDate.href = "#details";
        linkStoriesFromDate.innerHTML = "Day "+(i+1)+" "+result.rows.item(i).date;
        linkStoriesFromDate.rel = "external";
        var att1 = document.createAttribute("data-date");       // Create a "class" attribute
        att1.value = result.rows.item(i).date;                       
        linkStoriesFromDate.setAttributeNode(att1); 
        
        var att3 = document.createAttribute("data-day_num");       // Create a "class" attribute
        att3.value =  i ;                     
        linkStoriesFromDate.setAttributeNode(att3); 
        
        setClickEventDataStory(linkStoriesFromDate);
        listItemTitle.appendChild(linkStoriesFromDate);
        ul.appendChild(listItemTitle);
    }
     //update listview
    $( "#listDays" ).listview( "refresh" );

}   

function getStoriesFromOneDay(date,indexTrip)
{   
    selectStoriesByDate(date, indexTrip); 
    
}
function populateStoriesDetails(result){

    //alert("afiseaza datele zilei selectate " + result[0].date);
    if(result.length>0){
        //delete first
        $("#stories_details_day").children().remove();

        $(".details-headline").text(result[0].date);
        day_num = parseInt(window.localStorage.getItem("day_num_selected"))+1;
        window.localStorage.setItem("date-selected",result[0].date);


        $("#story-details-header").text("Day "+day_num);
        for (var i = 0; i < result.length; i++)
        {   
           
            images='';
            img = result[i].img;
            if(img.length>0 ){
                for (j=0; j<img.length; j++){
                    images += '<img src="'+img[j]+'" alt="">';
                }
            }
            rateNum = result[i].Rate;
            rating = '<input type="hidden" class="story_rating" value="'+rateNum+'">';
            if(rateNum !=0  && rateNum !='' ){
                for (j=1; j<= rateNum; j++){
                    rating += '<span class="heart"></span>';
                }
            }
            var story = '  <div class="story">'+
                    '    <div class="edit-story" data-id="'+result[i].id+'">'+
                    '         <a  href="#story" class="btn-edit-story-view" > '+
                    '         </a>'+
                    '         <a  href="#" class="btn-delete-story-view" >'+
                    '         </a>'+
                    '        <div class="seperator"></div>'+
                    '    </div>'+
                    '    <div class="story-title"><h2>'+result[i].title+'</h2></div>'+
                    '    <div class="story-details"><p>'+result[i].description+'</p>'+images +                   
                    '        <div class="map"></div> '+
                    '        <div class="rating">'+rating+
                    '        </div>'+
                    '    </div>'+
                    '</div>';
              $("#stories_details_day").append( story ).trigger('create');
        }
    }
}
function setClickEventDataStory(date)
{  
    date.addEventListener('click', function () {
        tripShown =  window.localStorage.getItem("id_trip_shown");
        getStoriesFromOneDay(date.getAttribute("data-date"),tripShown);
        window.localStorage.setItem("day_num_selected", date.getAttribute("data-day_num") );
    }, false);
}

/*
 * specifies the click events when the user selects a trip
 * the methods receive the id of the trip
 * selectQueryDBTripTitle is used to retrieve data about the trip, like the title and id
 * selectQueryDBStory is sued to retrieve all the stories related to that trip
 */
function setClickEventToTrip(li)
{
    li.addEventListener('click', function () {
        selectQueryDBTripTitle(li.id);
        selectQueryDateStory(li.id);
    }, false);
}

function updateStoryList(){
    idTrip =  window.localStorage.getItem("id_trip_shown"); 
    selectQueryDateStory(idTrip);

}
function populateStoryData(result){ 
   // console.log(result.rows.item(0));
    date = result.rows.item(0).date;
    title = result.rows.item(0).title;
    desc = result.rows.item(0).description;
    rate = result.rows.item(0).Rate;
    lat  = result.rows.item(0).LAT;
    lng  = result.rows.item(0).LNG;
    
    if(lat !== null &&  (typeof lat !== 'undefined')){
        addMap();
        //console.log(lat);
        //console.log(lng);
        locationMap.setMarkerProperly(lat,lng);
    }
    
    $("#story-date").val(date);
    $("#story_title").val(title);
    $("#story_desc").val(desc);
    $("#rating_simple").val(rate);
    //refresh rating
   // $("#rating_simple").webwidget_rating_simple({
    //    refresh:rate,
    //    directory: 'css/images'
   // });
    img = '';
    if(result.rows.item(0).img_path != null){
        for(i=0; i < result.rows.length; i++){
            img += "<div class='image-wrap'>           \n\
                        <div class='deleteImg'></div>  \n\
                        <img src='"+result.rows.item(i).img_path+"' alt=''>\n\
                    </div>";
        }
    }
    $(".story-photos").append( img ).trigger('create');
  
}   

/*
 * adds a map when selecting the option to specify the location
 */
function addMap()
{
    
    //  alert(window.localStorage.getItem("initMap"));
      if(window.localStorage.getItem("initMap") == "null")
      {
            window.localStorage.setItem("initMap", "true");
            locationMap.initMap();
            locationManager.curr_loc();
      }

      setMapVisible();

}

/*
 * shows the map again, in case :
 * - the user wants to update a story that has a location associated
 * - the user selected : save location
 */
function setMapVisible()
{
    document.getElementById('mapsDiv').style.display = 'block';
    document.getElementById("pac-input").style.display = "block";
}
/*
 * sets the map to be invisible after inserting, canceling, pressing back button
 */
function setMapInvisible()
{
    document.getElementById('mapsDiv').style.display = 'none';
    document.getElementById("pac-input").style.display = "none";
    locationMap.resetMarkerPosition();
}
/*
 * 
 */
function getMapVisibility()
{
    if(  document.getElementById('mapsDiv').style.display === 'none')
        return false;
    else
        return true;
}

/*
 * clears the fields of the add story page and sets to none the div where the
 * map is shown
 * @returns {undefined}
 */
function clearStoryFields(){
    initDate();

    if(getMapVisibility() === true)
        setMapInvisible();

    $("#story_title").val('');
    $("#story_desc").val('');
    $("#rating_simple").val('0'); 
    $("#rating_simple").webwidget_rating_simple({
        refresh:"0",
        directory: 'css/images'

    });
  //  $("#mapsDiv").css("display","none");
    $(".story-photos").children().remove();
}
/*
 * initializes the date again, after selecting the story
 */
function initDate(){
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;       
    $("#story-date").attr("value", today);
}
/*
 * moves the map div from the create story to see all locations from one day
 */
function moveMapdiv()
{
  //  alert("start moving the map");
    x = $("#contentStory").find("#mapsDiv").remove();
    y = $("#contentStory").find("#pac-input").remove(); 
    $("#mapContainerDate").append(y);
    $("#mapContainerDate").append(x);
    addMap();
    
    var idTrip = window.localStorage.getItem("id_trip_shown");
    var date = window.localStorage.getItem("date-selected");
    selectStoriesLocation(idTrip, date);
   // alert( window.localStorage.getItem("date-selected"));
   // alert(window.localStorage.getItem("id_trip_shown"));
  //  alert("moved");
}
/*
 * removes the map from show all location from one day to create story
 */
function resetMapLocation()
{
    
    x = $("#mapContainerDate").find("#mapsDiv").remove();
    y = $("#mapContainerDate").find("#pac-input").remove();
    $("#contentStory").append(y);
    $("#contentStory").append(x);
    locationMap.clearMarkers();
  //  locationManager.curr_loc();
    setMapInvisible();
}