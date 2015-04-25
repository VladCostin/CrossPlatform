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
    tx.executeSql('DROP TABLE IF EXISTS TRIP');
    tx.executeSql('DROP TABLE IF EXISTS STORY');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS TRIP(id integer primary key autoincrement,title TEXT,description TEXT)');
  //  tx.executeSql('CREATE TABLE IF NOT EXISTS STORY(id integer primary key autoincrement,title TEXT,description TEXT,date TEXT,Rate integer, idTrip NOT NULL,  FOREIGN KEY (idTrip) REFERENCES TRIP (id))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS STORY(id integer primary key autoincrement,title TEXT,description TEXT,date TEXT,rate integer, idTrip) ');
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
