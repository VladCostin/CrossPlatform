/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var dbShell;

function createDatabase()
{
    
    dbShell = window.openDatabase
    ("Database Sample", "1.0", "Cordova Sample", 2 * 1024 * 1024);
    dbShell.transaction(createDB, errorCB, successDB);
    
    
}
function createDB(tx)
{
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO(id integer primary key autoincrement,title,description)');
    
}

function errorCB(tx)
{
    alert("Error processing DB : " + tx.code);
}

function successDB(tx)
{
    alert("YEAAAH");
    

  //  alert("am inserat ceva");
    
    //    tx.executeSql("select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'DEMO' ", [], renderList,errorCB);

}
