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
    //  alert("sunt in popualte List : " + result);
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
    // alert("id-ul este : " + result.rows.item(0).id);

    window.localStorage.setItem("id_trip_shown", result.rows.item(0).id);
}

/*
 * creates the list of days
 * the value a ( result.rows.item(i).a) represents the data the story was added
 */
function populateListStoriesData(result)
{
     //alert("populateListStories : ---");
     console.log("here");
   console.log(result);
       
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
//TODO IMAGES, RATING
function populateStoriesDetails(result){
    //delete first
    $("#stories_details_day").children().remove();
     
    $(".details-headline").text(result.rows.item(0).date);
    day_num = parseInt(window.localStorage.getItem("day_num_selected"))+1;
   
    $("#story-details-header").text("Day "+day_num);
    
    console.log(result);
    for (var i = 0; i < result.rows.length; i++)
    {   images='';
        rating='';
            console.log(result.rows.item(i));

        var story = '  <div class="story">'+
                '    <div class="edit-story" data-id="'+result.rows.item(i).id+'">'+
                '         <a  href="#" class="btn-edit-story-view" > '+
                '         </a>'+
                '         <a  href="#" class="btn-delete-story-view" >'+
                '         </a>'+
                '        <div class="seperator"></div>'+
                '    </div>'+
                '    <div class="story-title"><h2>'+result.rows.item(i).title+'</h2></div>'+
                '    <div class="story-details"><p>'+result.rows.item(i).description+'</p>'+images +                   
                '        <div class="map"></div> '+
                '        <div class="rating">'+rating+
                '        </div>'+
                '    </div>'+
                '</div>';
          $("#stories_details_day").append( story ).trigger('create');
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