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
    var i=0;
    
    
    
    while (ul.childNodes.length > 2){
        ul.removeChild(ul.lastChild);
    }
    
    var linkTitle = [];
    
    for(var i = 0; i < result.rows.length; i++)
    {
        var listItemTitle = document.createElement("li");
        linkTitle[i] = document.createElement("a");
        linkTitle[i].href = "#list";
        linkTitle[i].innerHTML = result.rows.item(i).title;
        linkTitle[i].id = result.rows.item(i).id;
       cacat(linkTitle[i]);

       
        listItemTitle.appendChild(linkTitle[i]);
        ul.appendChild(listItemTitle);
        
       // htmlString += result.rows.item(i).id + " " + result.rows.item(i).title;
    }
    
}


function populateTripDetailsPage(result)
{
   // var listItemTitle = document.createElement("li");
    var header = document.getElementById("header");
    if(result.rows.length > 1)
        header.innerHTML = "Error, multiple values have been returdned";
    else
        if(result.rows.length == 0)
            header.innerHTML = "Error, no values returned";
        else
            header.innerHTML = result.rows.item(0).title;
    
    alert("id-ul este : " + result.rows.item(0).id);
    
    window.localStorage.setItem("id_trip_shown", result.rows.item(0).id);
}


function populateListStories(result)
{
 //   alert("populateListStories : ");
    var ul = document.getElementById("listDays");
    for(var i = 0; i < result.rows.length; i++)
    {
        var listItemTitle = document.createElement("li");
        var linkTitle = document.createElement("a");
        linkTitle.href = "#details";
        linkTitle.innerHTML = result.rows.item(i).a;
        linkTitle.rel="external";
        
        listItemTitle.appendChild(linkTitle);
        ul.appendChild(listItemTitle);
    }

}
function cacat(li)
{
    li.addEventListener('click', function(){
            selectQueryDBTripTitle( li.id);
            selectQueryDBStory( li.id);
     }, false);
}