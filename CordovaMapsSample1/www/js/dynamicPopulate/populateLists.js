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
    alert("sunt in popualte List : " + result);
    var ul = document.getElementById("listTripTitles");
    for(var i = 0; i < result.rows.length; i++)
    {
        var listItemTitle = document.createElement("li");
        var linkTitle = document.createElement("a");
        linkTitle.href = "#list";
        linkTitle.innerHTML = result.rows.item(i).title;
        linkTitle.id = result.rows.item(i).id;
        linkTitle.onclick = function(){ selectQueryDBTripTitle( linkTitle.id),
                    selectQueryDBStory( linkTitle.id); return false};
        //linkTitle.onclick = populateListStories(linkTitle.id);
       // listItemTitle.onclick = populateListStories; // populateListStories(linkTitle.id);
        
        listItemTitle.appendChild(linkTitle);
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
}


function populateListStories(result)
{
    alert("populateListStories : " + result);
}