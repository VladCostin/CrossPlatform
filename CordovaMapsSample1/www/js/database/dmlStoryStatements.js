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
   //if trip was created before
   
    if (prevPage == "list"){
        var idTrip =  window.localStorage.getItem("id_trip_shown"); 
        rating = $("#rating_simple").val();
        window.localStorage.setItem("rating", rating);
        dbShell.transaction(insertDBStory, errorCB);
    } //if trip wasnt created
    else if(prevPage == "new"){
        addStoryInTrip();
    } else if(prevPage == "details"){
           dbShell.transaction(updateStory, errorCB);  
    }
}
function updateStory(tx){
    
    alert("intra in updateStory");
    
    date = $("#story-date").val();
    title = $("#story_title").val();
    if(title != '' ){
        desc = $("#story_desc").val();
        rating =  $("#rating_simple").val();
        storyId = window.localStorage.getItem("selected_story");
        sql = "DELETE FROM images WHERE idStory="+storyId;
        tx.executeSql(sql,[], successDeleted ,  errorCB );
        
        
        var loadMap = document.getElementById('mapsDiv').innerHTML;
        // alert("loadMap : " + loadMap);
      
        if(loadMap !==  '')
        {
          //  alert("a selectat o locatie ----" + loadMap + "----");
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            
            alert("Position : " + lat + " " + lng);
            "UPDATE story \n\
               SET  title='"+title+"',\n\
                    description='"+desc+"',\n\
                    date='"+date+',\n\
                    lat =' + lat+', \n\
                    lng =' + lng+' \n\
                    WHERE id='+storyId;
        }
        else
        {
            sql = "UPDATE story \n\
               SET  title='"+title+"',\n\
                    description='"+desc+"',\n\
                    date='"+date+"'\n\
               WHERE id="+storyId;
             alert("nu a selectat nicio locatie");

        }
        tx.executeSql(sql,[], 
        function(tx, result){
            alert("Successfully Updated!");
            tripShown =  window.localStorage.getItem("id_trip_shown");
            selectStoriesByDate(date, tripShown);
            $.mobile.changePage("#details");
            
        },  errorCB );
        
        /*
        //remove images and add again

        
        $(".story-photos img").each(function(){
            src = $(this).attr("src");
            console.log(src);
            sql = "INSERT INTO Images (img_path,idStory) VALUES('"+src+"',"+idStory+")";
            tx.executeSql(sql,[], successUpdated ,  errorCB );
        });
        
        sql = "UPDATE story \n\
               SET  title='"+title+"',\n\
                    description='"+desc+"',\n\
                    date='"+date+"'\n\
               WHERE id="+storyId;
        tx.executeSql(sql,[], 
        function(tx, result){
            alert("Successfully Updated!");
            tripShown =  window.localStorage.getItem("id_trip_shown");
            selectStoriesByDate(date, tripShown);
            $.mobile.changePage("#details");
            
        },  errorCB );
        */
    }
}
function successUpdated(){
    console.log("Successfully updated!");
}
function successDeleted(){
    console.log("Successfully deleted!");
}
//Adding a story on the page"Create Trip" but not on the db
function addStoryInTrip(){
             
        //data
        title = $("#story_title").val();
        if(title != ''){
            date = $("#story-date").val();
            desc  = $("#story_desc").val();

            //get images
            images= '';
            $(".story-photos  img").each(function() {
                images += $(this).prop('outerHTML');
            });
            images = (images != null) ? images : '';
            //loc = {lat,lng};
            //rating
            
            rateNum = $("#rating_simple").val();
            rating = '<input type="hidden" class="story_rating" value="'+rateNum+'">';
            for (i=1; i<=rateNum; i++){
                rating += '<span class="heart"></span>';
            }

            //adding story to day
            //adding html
            nextId++;
            var str =    ' <div class="story-btn">'+
                               '     <a  href="#story" class="btn-delete-story" ></a>'+
                              // '     <a  href="#" class="btn-edit-story" ></a>'+
                               ' </div>'+
                               ' <div data-role="collapsible" class="story_data" id="set'+nextId+'" data-collapsed="true">'+
                               '    <h3 class="story_title">'+title+'</h3>'+
                               '     <p class="story_date">'+date+'</p>'+
                               '     <p class="story_desc">'+desc+'</p>'+ images  +      
                               '     <div class="rating">'+   rating        +                   
                               '     </div>'+
                               ' </div>';
            $("#set").append( str ).trigger('create');

            //clear fields
            clearStoryFields();
        } else {
            alert('Please fill title!');
        }

}

/*
 * gets the data from the fields and inserts it in database a new record
 */
function insertDBStory(tx)
{

    
    var story_date = document.getElementById("story-date").value;
    var story_title = document.getElementById("story_title").value;
    if(story_title != '' ){
        var story_desc = document.getElementById("story_desc").value;
        var rating =  window.localStorage.getItem("rating", rating);
        var idTrip =  window.localStorage.getItem("id_trip_shown"); 
        
        //var loadMap = document.getElementById('mapsDiv').innerHTML;
        // alert("loadMap : ---" + loadMap + "--- ");
        //var sql;
        if(getMapVisibility() ===  true)
        {
          //  alert("a selectat o locatie ----" + loadMap + "----");
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            
            alert("Position : " + lat + " " + lng);
            
            sql = 'INSERT INTO STORY (title,description, date,LAT,LNG, Rate, idTrip) VALUES \n\
                    ("'+story_title+'","'+story_desc+'","'+story_date+'",'+ lat + ',' + lng + ',' +rating+','+idTrip+')';
        }
        else
        {
             alert("nu a selectat nicio locatie");
             sql = 'INSERT INTO STORY (title,description, date, Rate, idTrip) VALUES \n\
                    ("'+story_title+'","'+story_desc+'","'+story_date+'",'+rating+','+idTrip+')';
        }
        
        tx.executeSql(
            sql,[], 
            function(tx, result){
                $(".story-photos").find("img").each(function() {
                    img_path = $(this).attr("src");
                    insertImagesToStory(tx,img_path,result.insertId);
                });
               alert("A Story is successfully added!");
               clearStoryFields();

            }, 
            errorCB
        );
        
       
    } else{
        alert('Please fill title!');
    }    
}


/*
 * popualtes the list of stories associated with an indexTrip
 */
function selectQueryDateStory(indexTrip)
{
    sql =  "SELECT distinct(date)             \n\
            FROM STORY                           \n\
            WHERE idTrip = "+indexTrip+"     \n\
            ORDER BY date";

    dbShell.transaction(
        function(tx)
        {   
            tx.executeSql(sql, [],renderListStories,errorCBSelect);
        },
        errorCB
    );
  
}
function selectStoriesByDate(date, indexTrip){
    sql1 =  "SELECT *                          \n\
            FROM STORY                           \n\
            WHERE idTrip = "+indexTrip+"        \n\
            AND date = '"+date+"'                ";
    sql2 =  "SELECT i.*                          \n\
            FROM STORY  s                       \n\
            INNER JOIN Images   i               \n\
            ON i.idStory = s.id                 \n\
            WHERE idTrip = "+indexTrip+"        \n\
            AND s.date = '"+date+"'                ";
    dbShell.transaction(
        function(tx)
        {   
            //renderStoriesDetails 
            tx.executeSql(sql1, [], 
            function(tx, result1)
            {   
                
                tx.executeSql( sql2, [],
                function(tx, result2)
                {   var result =[];

                    for (i=0; i< result1.rows.length ; i++){
                        var images = [];
                        obj = result1.rows.item(i);
                       
                        if(result2.rows.length > 0){
                            for (j=0; j< result2.rows.length ; j++){
                               if(result1.rows.item(i).id === result2.rows.item(j).idStory){
                                   images.push( result2.rows.item(j).img_path);
                               }
                           }


                            obj.img=images;
                            result.push(obj);

                        } else {
                             obj.img=[];
                             result.push(obj);
                        }

                    }
                    renderStoriesDetails(tx, result);
                   
                
                   
                }, errorCB);

            }   
        ,errorCBSelect);
        },
        errorCB
    );
}
function selectStoryById(){
    

    
    idStory =   window.localStorage.getItem("selected_story"); 
    alert("story selected is" + idStory);
    
    //sql =  "SELECT * FROM STORY   WHERE id = " + idStory;      
     //sql =  "SELECT * FROM images";   
    /*
    sql =  "SELECT i.img_path            \n\
            FROM images i                     \n\
            ON i.idStory = s.id               \n\
            WHERE s.id = " + idStory;
    
    */
   
    sql =  "SELECT s.*,i.img_path            \n\
            FROM STORY  s                     \n\
            LEFT JOIN images  i              \n\
            ON i.idStory = s.id               \n\
            WHERE s.id = " + idStory;
    
    dbShell.transaction(
        function(tx)
        {   
            tx.executeSql(sql, [], renderEditStory, errorCBSELECTEDIT);
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
            { alert("Story Succesfully deleted!");
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

function errorCBSELECTEDIT(tx)
{
    alert("errorCBSELECTEDIT Error processing DB : " + tx.code);
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
     //   htmlString += result.rows.item(i).id + " " + result.rows.item(i).title+ " " + result.rows.item(i).description + " " + result.rows.item(i).date + " " + result.rows.item(i).rate;
          htmlString += result.rows.item(0).id_img + " " + result.rows.item(0).idStory + " " + result.rows.item(0).img_path + " ";
    }
    alert(htmlString);
}

function renderListStories(tx, result)
{    populateListStoriesData(result);
}
function renderStoriesDetails(tx, result){
    populateStoriesDetails(result);
}

function renderEditStory(tx, result){
  
//    alert("number results " + result.rows.length);
  //   alert("data : " + result.rows.item(0).id + " " + result.rows.item(0).idStory + " " + result.rows.item(0).img_path); 
   // alert("data : " + result.rows.item(0).title + " " + result.rows.item(0).description + " " + result.rows.item(0).date);
    populateStoryData(result);
}