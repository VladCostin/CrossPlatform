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
    
   alert("isnertDBTrip valorile sunt ---" + title + "---" + description + "----");
    
   var sql = 'INSERT INTO TRIP (title,description) VALUES (?,?)';
   tx.executeSql(sql,[title,description],  selectQueryDBTrip, errorCB);
   
 //  tx.executeSql(sql,[title,description], successInsertionTrip, errorCB);
}

function deleteTrip(tx)
{
  //  tx.executeSql('DELETE FROM TRIP WHERE id = ?', [comboid], successDelete, errorCB);
}



function selectQueryDBTrip(tx)
{
    alert("am inserat ceva");
    
    tx.executeSql('SELECT * FROM TRIP', [],renderListTrip,errorCBSelect);
    
}

/*
 * popualtes the list of stories associated with an indexTrip
 */
function selectQueryDBTripTitle(indexTrip)
{
    alert("selectQueryDBTripTitle CACAT  : " + indexTrip);
  //  tx.executeSql('SELECT * FROM Story', [], renderListStories,errorCBSelect);
  
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
    alert("renderTripDetail : " );
    populateTripDetailsPage(result);
}


function renderListTrip(tx, result)
{      alert("renderListTrip : " );
   /* 
    var htmlString = '';
    for(var i = 0; i < result.rows.length; i++)
    {
        htmlString += result.rows.item(i).id + " " + result.rows.item(i).title;
    }
    alert("renderList : " +  htmlString);
    
   
   //alert("  renderList   ");
   */
    populateListMainPage(result);
}