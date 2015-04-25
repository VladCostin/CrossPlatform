/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var rating;

/*
 * method called when the user wants to add a story
 * it gets the rating and stores it in the local storage, so it won;tg et lost
 * in the insertDbStory metho
 */
function createStory()
{
   
   rating = $("#rating_simple").val();
   window.localStorage.setItem("rating", rating);
   dbShell.transaction(insertDBStory, errorCB);
   
}

/*
 * gets the data from the fields and inserts it in database a new record
 */
function insertDBStory(tx)
{
   //   alert("insertDBStory : " + window.localStorage.getItem("rating"));
  //  alert(rating);
    
     var story_date = document.getElementById("story-date").value;
    var story_title = document.getElementById("story_title").value;
    var story_desc = document.getElementById("story_desc").value;
    var rating =  window.localStorage.getItem("rating", rating);
  
    
    var sql = 'INSERT INTO STORY (title,description, date, rate) VALUES (?,?,?,?)';
    tx.executeSql(sql,[story_title,story_desc,story_date,rating], successInsertion, errorCB);
}

function successInsertion(tx)
{
    alert("am inserat ceva");
    tx.executeSql('SELECT * FROM Story', [], renderList,errorCBSelect);
}


function selectQueryDB(tx)
{
    alert("am inserat ceva");
    tx.executeSql('SELECT * FROM Story', [], renderList,errorCBSelect);
}

function errorCB(tx)
{
    alert("Error processing DB : " + tx.code);
}

function errorCBSelect(tx)
{
    alert("Error processing DB Select: " + tx.code);
}

function renderList(tx, result)
{   
    var htmlString = '';
    for(var i = 0; i < result.rows.length; i++)
    {
        htmlString += result.rows.item(i).id + " " + result.rows.item(i).title+ " " + result.rows.item(i).description + " " + result.rows.item(i).date + " " + result.rows.item(i).rate;
    }
    alert(htmlString);
  //    document.getElementById("idP").innerHTML = htmlString;
  //  $('listview').html(htmlString);
  //  $('listview').listview('refresh');
}