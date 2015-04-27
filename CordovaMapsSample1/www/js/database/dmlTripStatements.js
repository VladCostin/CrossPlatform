/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function createTrip()
{
    alert("the button for creating a trip has been pushed");
   dbShell.transaction(insertDBTrip, errorCB);
}

function insertDBTrip(tx)
{
   var title=document.getElementById("trip-title").value;
   var description = document.getElementById("trip_description").value; 
    
   //  alert("isnertDBTrip valorile sunt ---" + title + "---" + description + "----");
    
   var sql = 'INSERT INTO TRIP (title,description) VALUES (?,?)';
   tx.executeSql(sql,[title,description],  selectQueryDBTrip, errorCB);
   
 //  tx.executeSql(sql,[title,description], successInsertionTrip, errorCB);
}

/*
 * function called when the user presses delete trip, after accesing a trip
 */
function deleteTrip()
{
  
    var indexTrip = window.localStorage.getItem("id_trip_shown");
    // alert("the trip index is ----" + indexTrip+ "---");
     
    dbShell.transaction(
        function(tx)
        {
            tx.executeSql('DELETE FROM TRIP WHERE id = ?', [indexTrip], selectQueryDBAllTrips, errorCB);
            
        },
        errorCB
    );
    /*
     * I still have to delete the stories associated with a trip
     */
    
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
    alert("Error processing DB : " + tx.code);
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