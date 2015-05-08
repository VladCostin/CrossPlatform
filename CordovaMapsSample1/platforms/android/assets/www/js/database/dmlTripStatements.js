/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function createTrip()
{
    dbShell.transaction(insertDBTrip, errorCB);

}

function insertAllStories(tx, idTrip){

    $( ".day-story .story_data" ).each(function( index ) {

        var $story = $(this);
        story_title = $story.find(".story_title").text();
        story_desc = $story.find(".story_desc").text();
        story_date = $story.find(".story_date").text();
        rating = $story.find("input.story_rating").val();
        rating = (rating=='')? 0 : rating;
        lat = $story.find("input.story_lat").val();
        lng = $story.find("input.story_lng").val();
        var sql;
        if(lat !== 'null')
             sql = 'INSERT INTO STORY (title,description, date,lat, lng, Rate, idTrip) VALUES ("'+story_title+'","'+story_desc+'","'+story_date+'",'+lat+','+lng+','+rating+','+idTrip+')';
        else
             sql = 'INSERT INTO STORY (title,description, date, Rate, idTrip) VALUES ("'+story_title+'","'+story_desc+'","'+story_date+'",'+rating+','+idTrip+')';

        /*
        var sql = 'INSERT INTO STORY (title,description, date,lat, lng, Rate, idTrip) VALUES ("'+story_title+'","'+story_desc+'","'+story_date+'",'+lat+','+lng+','+rating+','+idTrip+')';
        //var sql = 'INSERT INTO STORY (title,description, date, rate, idTrip) VALUES (?,?,?,?,?)';
        */

        tx.executeSql(sql,[], 
            function(tx, result){
                $story.find("img").each(function() {
                    img_path = $(this).attr("src");
                    insertImagesToStory(tx,img_path,result.insertId);
                });
                tx.executeSql('SELECT * FROM Story', [], renderListStoriesDemo,errorCBSelect);
       
            }
        , errorCB);
        
   });
    //clean fields from New Trip Page
    clear();
}

function successInsertionStory2(tx)
{
    tx.executeSql('SELECT * FROM Story', [], renderListStoriesDemo,errorCBSelect);
}
function successInsertionImages(tx)
{
    console.log("Successfully inserted images!");
}
function insertImagesToStory(tx, img_path,storyId){
    sql = 'INSERT INTO Images (img_path, idStory) VALUES ("'+img_path+'",'+storyId+')';

    tx.executeSql(sql, [], successInsertionImages,errorCB);

}
function insertDBTrip(tx)
{
    trip_title=$("#trip-title").val();
    trip_desc= $("#trip_description").val(); 
    
    
    var sql = 'INSERT INTO TRIP (title,description) VALUES (?,?)';
    tx.executeSql(
            sql,[trip_title,trip_desc],
            function(tx, result){
                insertAllStories(tx, result.insertId);
                selectQueryDBTrip(tx);
            },
            errorCB
        );
   
    
     
}
function clear(){
    $("#trip-title").val("");
    $("#trip_description").val("");
    //remove stories
    $(".day-story").children().remove();

}
/*
 * function called when the user presses delete trip, after accesing a trip
 */
function deleteTrip()
{
  
    var indexTrip = window.localStorage.getItem("id_trip_shown");
     
    deleteStories("idTrip",indexTrip);
     
    dbShell.transaction(
        function(tx)
        {
            tx.executeSql('DELETE FROM TRIP WHERE id = ?', [indexTrip], selectQueryDBAllTrips, errorCB);
            
        },
        errorCB
    );
    

}

/*
 * selects all the trips from database when the page is being loaded for the first time
 * @returns {undefined}
 */
function selectQueryDBAllTrips()
{
    dbShell.transaction(
        function(tx)
        {
              tx.executeSql('SELECT * FROM TRIP order by id desc', [],
              renderListTrip,errorCBSelect);
        },
        errorCB
    );
}


function selectQueryDBTrip(tx)
{
    tx.executeSql('SELECT * FROM TRIP order by id desc', [],renderListTrip,errorCBSelect);
    
}

/*
 * popualtes the list of stories associated with an indexTrip
 */
function selectQueryDBTripTitle(indexTrip)
{
  
    dbShell.transaction(
        function(tx)
        {
              tx.executeSql('SELECT * FROM TRIP where id =?', [indexTrip],
              renderTripDetail,errorCBSelect);
        },
        errorCB
    );

}

function errorCB(tx)
{
  console.log("Error processing DB : " + tx.code);
}

function errorCBSelect(tx)
{
    console.log("Error processing DB Select: " + tx.code);
}

function renderTripDetail(tx,result)
{
    populateTripDetailsPage(result);
}


function renderListTrip(tx, result)
{      
    populateListMainPage(result);
}