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
    var header = document.getElementById("header");
    if (result.rows.length > 1)
        header.innerHTML = "Error, multiple values have been returdned";
    else
    if (result.rows.length == 0)
        header.innerHTML = "Error, no values returned";
    else
        header.innerHTML = result.rows.item(0).title;

    // alert("id-ul este : " + result.rows.item(0).id);

    window.localStorage.setItem("id_trip_shown", result.rows.item(0).id);
}

/*
 * creates the list of days
 * the value a ( result.rows.item(i).a) represents the data the story was added
 */
function populateListStoriesData(result)
{
     alert("populateListStories : ---");

       
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
        linkStoriesFromDate.innerHTML = result.rows.item(i).a;
        linkStoriesFromDate.rel = "external";
        setClickEventDataStory(linkStoriesFromDate);
        listItemTitle.appendChild(linkStoriesFromDate);
        ul.appendChild(listItemTitle);
    }
    
}   

function populateStoriesFromOneDay(date)
{
    alert("Data aleasa este : " + date);
    window.localStorage.setItem("day_current_shown", date);   
}

function setClickEventDataStory(date)
{
   // alert(date.innerHTML);
    date.addEventListener('click', function () {
        populateStoriesFromOneDay(date.innerHTML)
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
        selectQueryDBStory(li.id);
    }, false);
}