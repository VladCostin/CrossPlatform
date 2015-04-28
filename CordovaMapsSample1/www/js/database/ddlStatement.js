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
    
    
    
  //    loadMainPage();
}
function createDB(tx)
{
  //  tx.executeSql('DROP TABLE IF EXISTS TRIP');
  //  tx.executeSql('DROP TABLE IF EXISTS STORY');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS TRIP(id integer primary key autoincrement,title TEXT,description TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS STORY(id integer primary key autoincrement,title TEXT,description TEXT,date TEXT,Rate integer, idTrip NOT NULL,  FOREIGN KEY (idTrip) REFERENCES TRIP (id))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Images(id_img integer primary key autoincrement,img_path TEXT, idStory NOT NULL,  FOREIGN KEY (idStory) REFERENCES STORY (id))');

    //tx.executeSql('CREATE TABLE IF NOT EXISTS TRIP(id_trip integer primary key autoincrement,trip_title TEXT,trip_desc TEXT)');
    //tx.executeSql('CREATE TABLE IF NOT EXISTS STORY(id_story integer primary key autoincrement,story_title TEXT,story_desc TEXT,story_date TEXT,story_rate integer, idTrip NOT NULL,  FOREIGN KEY (idTrip) REFERENCES TRIP (id))');
    //  tx.executeSql('CREATE TABLE IF NOT EXISTS STORY(id integer primary key autoincrement,title TEXT,description TEXT,date TEXT,rate integer, idTrip) ');

    selectQueryDBAllTrips();
}

function errorCB(tx)
{
    alert("Error processing DB : " + tx.code);
}

function successDB(tx)
{
    alert("YEAAAH");
}
