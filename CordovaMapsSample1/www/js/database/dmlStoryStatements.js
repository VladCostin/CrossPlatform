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
    var idTrip =  window.localStorage.getItem("id_trip_shown"); 
    
    var sql = 'INSERT INTO STORY (title,description, date, rate, idTrip) VALUES (?,?,?,?,?)';
    tx.executeSql(sql,[story_title,story_desc,story_date,rating, idTrip], successInsertionStory, errorCB);
}

function successInsertionStory(tx)
{
   // alert("am inserat ceva");
    tx.executeSql('SELECT * FROM Story', [], renderListStoriesDemo,errorCBSelect);
}

/*
 * popualtes the list of stories associated with an indexTrip
 */
function selectQueryDateStory(indexTrip)
{
   //  alert("selectQueryDBStory");
     alert("intra in selectQueryDBStory : " + indexTrip);
  
  
  
    dbShell.transaction(
        function(tx)
        {
            tx.executeSql("SELECT distinct(date) as a FROM Story \n\
            where idTrip = ? \n\
            ORDER BY date", [indexTrip], renderListStories,errorCBSelect);
            //  tx.executeSql("SELECT distinct(strftime('%d.%m.%Y', date)) as a FROM Story ORDER BY date", [], renderListStories,errorCBSelect);
        },
        errorCB
    );
    
}

/*
 * deletes the stories associated to one day 
 */
function deleteDay()
{
    var date = window.localStorage.getItem("day_current_shown");
    alert("the day to be deleted is : " + date);
    deleteStories('date',date);
}


/*
 * deletes all the stories that fulfill the condition : key = value
 * for example : id = 3, or date = 2005-12-03
 */
function deleteStories(key,val)
{
    var state = 'DELETE FROM STORY WHERE ' + key + ' = ? ';
    var indexTrip = window.localStorage.getItem("id_trip_shown");
    
    dbShell.transaction(
        function(tx)
        {
            tx.executeSql( state, [val],
            function()
            {
                if(key !== 'idTrip')
                    selectQueryDateStory(indexTrip);
            }, errorCB);
            
        },
        errorCB
    );
}


function errorCB(tx)
{
    alert("Error processing DB : " + tx.code);
}

function errorCBSelect(tx)
{
    alert("Error processing DB Select: " + tx.code);
}

function renderListStoriesDemo(tx, result)
{   
    var htmlString = '';
    for(var i = 0; i < result.rows.length; i++)
    {
        htmlString += result.rows.item(i).id + " " + result.rows.item(i).title+ " " + result.rows.item(i).description + " " + result.rows.item(i).date + " " + result.rows.item(i).rate;
    }
}

function renderListStories(tx, result)
{ 
    //  alert("intra in renderListStories");
    populateListStoriesData(result);

}