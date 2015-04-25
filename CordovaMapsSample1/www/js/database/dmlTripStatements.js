/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function createTrip()
{
    alert("the button for creating a trip has been pushed");
   dbShell.transaction(insertDB, errorCB);
}

function insertDB(tx)
{
   var title=document.getElementById("trip-title").value;
   var description = document.getElementById("trip_description").value; 
    
   alert("valorile sunt ---" + title + "---" + description + "----");
    
   var sql = 'INSERT INTO TRIP (title,description) VALUES (?,?)';
   tx.executeSql(sql,[title,description], successInsertion, errorCB);
   
   
}

function successInsertion(tx)
{
    alert("am inserat ceva");
    tx.executeSql('SELECT * FROM TRIP', [], renderList,errorCBSelect);
}


function selectQueryDB(tx)
{
    alert("am inserat ceva");
    tx.executeSql('SELECT * FROM TRIP', [], renderList,errorCBSelect);
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
        htmlString += result.rows.item(i).id + " " + result.rows.item(i).title;
    }
    alert(htmlString);
  //    document.getElementById("idP").innerHTML = htmlString;
  //  $('listview').html(htmlString);
  //  $('listview').listview('refresh');
}