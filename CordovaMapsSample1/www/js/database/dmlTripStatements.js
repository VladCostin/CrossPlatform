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
    $( ".day-story .ui-collapsible" ).each(function( index ) {
          //console.log( index + ": " + $( this ).text() );
        story_title = $(this).find(".story_title").text();
        story_desc = $(this).find(".story_desc").text();
        story_date = $(this).find(".story_date").text();
        rating = $(this).find(".story_rating").text();
        
        var sql = 'INSERT INTO STORY (title,description, date, rate, idTrip) VALUES (?,?,?,?,?)';
        tx.executeSql(sql,[story_title,story_desc,story_date,rating, idTrip], successInsertionStory, errorCB);
        
        $(this).find("img").each(function() {
            img_path = $(this).attr("src");
            insertImagesToStory(img_path,storyId);
        });

   });
}
function insertImagesToStory(img_path,storyId){
    console.log("storyId="+storyId+" img_src="+img_path);
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
   
    
    //clean fields from New Trip Page
    clear(); 
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
    // alert("the trip index is ----" + indexTrip+ "---");
     
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
  //  alert("am inserat ceva");
    tx.executeSql('SELECT * FROM TRIP order by id desc', [],renderListTrip,errorCBSelect);
    
}

/*
 * popualtes the list of stories associated with an indexTrip
 */
function selectQueryDBTripTitle(indexTrip)
{
    // alert("selectQueryDBTripTitle CACAT  : " + indexTrip);
  
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
    alert("Error processing DB Select: " + tx.code);
}

function renderTripDetail(tx,result)
{
   // alert("renderTripDetail : " );
    populateTripDetailsPage(result);
}


function renderListTrip(tx, result)
{      
   // alert("renderListTrip : " );
    populateListMainPage(result);
}