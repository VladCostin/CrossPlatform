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
        
    date = $("#story-date").val();
    title = $("#story_title").val();
    if(title != '' ){
        desc = $("#story_desc").val();
        rating =  $("#rating_simple").val();
        storyId = window.localStorage.getItem("selected_story");

        if(getMapVisibility() ===  true) {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
                        
            updateSql = "UPDATE story SET title = '" + title + 
                          "', description = '"+ desc + 
                          "' , date = '" + date + 
                          "' , lat = " + lat + 
                          " , lng = " + lng + 
                          ", Rate ="+ rating +
                    "  WHERE id="+storyId; 
        } else {
            updateSql = "UPDATE story \n\
                SET  title='"+title+"',\n\
                    description='"+desc+"',\n\
                    date='"+date+"',\n\
                    Rate ="+rating+" \n\
                WHERE id="+storyId;
        }
        //remove images and add again

        deleteSql = "DELETE FROM images WHERE idStory="+storyId;
        tx.executeSql(deleteSql,[], successDeleted ,  errorCB );
        
        $(".story-photos img").each(function(){
            src = $(this).attr("src");
            console.log(src);
            insertSql = "INSERT INTO Images (img_path,idStory) VALUES('"+src+"',"+idStory+")";
            tx.executeSql(insertSql,[], successUpdated ,  errorCB );
        });
        tx.executeSql(updateSql,[], 
        function(tx, result){
            alert("Successfully Updated!");
            tripShown =  window.localStorage.getItem("id_trip_shown");
            selectStoriesByDate(date, tripShown);
            $.mobile.changePage("#details");
            
        },  errorCB );
        clearStoryFields();
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
            //lat = $("#lat").val();
            //lng = $("#lng").val();

            if( getMapVisibility() === true)
            {   addMap();
                lat = marker.getPosition().lat();
                lng = marker.getPosition().lng();
            }
            else
            {
                lat = null;
                lng = null;
            }


            //get images
            images= '';
            $(".story-photos  img").each(function() {
                images += $(this).prop('outerHTML');
                
            });
            images = (images != null) ? images : '';
            

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
                               '     <a  href="#" class="btn-delete-story" ></a>'+
                              // '     <a  href="#" class="btn-edit-story" ></a>'+
                               ' </div>'+
                               ' <div data-role="collapsible" class="story_data" id="set'+nextId+'" data-collapsed="true">'+
                               '    <h3 class="story_title">'+title+'</h3>'+
                               '     <p class="story_date">'+date+'</p>'+
                               '     <p class="story_desc">'+desc+'</p>'+ 
                               '     <div class="rating">'+ rating + '</div>'+
                                     images  +      
                               '     <input type="hidden" class="story_lat" value="'+lat+'">'+
                               '     <input type="hidden" class="story_lng" value="'+lng+'">'+                           
                               ' </div>';
            $("#set").append( str ).trigger('create');
      
            //clear fields
            clearStoryFields();
            alert('Story '+title+' was added to trip.');
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
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
                       
            sql = 'INSERT INTO STORY (title,description, date,LAT,LNG, Rate, idTrip) VALUES \n\
                    ("'+story_title+'","'+story_desc+'","'+story_date+'",'+ lat + ',' + lng + ',' +rating+','+idTrip+')';
        }
        else
        {
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
            Left JOIN Images   i               \n\
            ON i.idStory = s.id                 \n\
            WHERE idTrip = "+indexTrip+"        \n\
            AND s.date = '"+date+"'                ";
           
    dbShell.transaction(
        function(tx)
        {    
          // selectImages(tx);
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
function selectImages(tx){
    tx.executeSql("SELECT * FROM  Images" , [],
    function(tx, result4)
            {  for (i=0; i< result4.rows.length ; i++){
                    console.log(result4.rows.item(i)) ;
                }
            } 
            ,errorCB);
}


function selectStoriesByTrip(indexTrip)
{
  
    sql =  "SELECT i.*  ,  s.*  \n\
            FROM STORY  s                                  \n\
            Left JOIN Images   i                           \n\
            ON i.idStory = s.id                            \n\
            WHERE s.idTrip = "+indexTrip+"                 \n\ ";
  
     console.log(sql);
    dbShell.transaction(
        function(tx)
        { 
            tx.executeSql(sql, [],shareStories,errorCBSelect);
        },
        errorCB
    );
    
}

function selectStoryById(){

    idStory =   window.localStorage.getItem("selected_story"); 
    
    sql =  "SELECT s.*,i.img_path            \n\
            FROM STORY  s                    \n\
            LEFT JOIN images  i              \n\
            ON i.idStory = s.id              \n\
            WHERE s.id = " + idStory;
    
    dbShell.transaction(
        function(tx)
        {   
            tx.executeSql(sql, [], renderEditStory, errorCBSELECTEDIT);
        },
        errorCB
    );  
    
}

function selectStoriesLocation(id, date)
{
  //  alert("selectStoriesLocation " + id);

  
    sql =  "SELECT lat, lng                          \n\
            FROM STORY                           \n\
            WHERE idTrip = " + id +"        \n\
            AND date = '"+date+"' " ;
     
    dbShell.transaction(
        function(tx)
        { //  alert(valueId);
            tx.executeSql(sql, [],renderStoriesLocations,errorCBSelect);
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
    console.log("Error processing DB : " + tx.code);
}

function errorCBSELECTEDIT(tx)
{
    console.log("errorCBSELECTEDIT Error processing DB : " + tx.code);
}

function errorCBSelect(tx)
{
    console.log("Error processing DB Select: " + tx.code);
}

function renderListStoriesDemo(tx, result)
{   
    var htmlString = '';
    for(var i = 0; i < result.rows.length; i++)
    {
     //   htmlString += result.rows.item(i).id + " " + result.rows.item(i).title+ " " + result.rows.item(i).description + " " + result.rows.item(i).date + " " + result.rows.item(i).rate;
          htmlString += result.rows.item(0).id_img + " " + result.rows.item(0).idStory + " " + result.rows.item(0).img_path + " ";
    }
}

function renderListStories(tx, result)
{    populateListStoriesData(result);
}
function renderStoriesDetails(tx, result){
    populateStoriesDetails(result);
}

function renderEditStory(tx, result){
    populateStoryData(result);
}
function shareStories(tx, result){
    console.log(result.rows);
    subject = $("#header").text();
    title = "";
    images = [];
    addedStory =[];
    for (var i = 0; i < result.rows.length; i++)
    {   
        if($.inArray(result.rows.item(i).idStory, addedStory) == -1){
            addedStory.push(result.rows.item(i).idStory);
            title += (i+1)+". "+result.rows.item(i).title +"\n" + result.rows.item(i).description +" \n";
        }
       // images = ['https://www.google.nl/images/srpr/logo4w.png','www/image.gif'];
       // var imageUri = result.rows.item(i).img_path;
       // if(imageUri != null){  
           // if (imageUri.substring(0,21)=="content://com.android") {
           //     photo_split=imageUri.split("%3A");
            //    imageUri="content://media/external/images/media/"+photo_split[1];
           // }
            //alert(imageUri);
            //imageUri = imageUri.replace("%", "%25");

        //    images.push(imageUri);
       // }
        
    }
    img=["file:///storage/sdcard0/DCIM/Camera/IMG_20150515_155250.jpg","file:///storage/sdcard0/DCIM/Camera/IMG_20150515_162109.jpg"];
        //alert(img);

    window.plugins.socialsharing.share(title, subject, img, null);

}

function renderStoriesLocations(tx,result)
{
    /*
    var htmlString = '';
    for(var i = 0; i < result.rows.length; i++)
    {
     //   htmlString += result.rows.item(i).id + " " + result.rows.item(i).title+ " " + result.rows.item(i).description + " " + result.rows.item(i).date + " " + result.rows.item(i).rate;
          htmlString +=  result.rows.item(i).LAT + " " + result.rows.item(i).LNG + ", ";
    }
    alert("renderStoriesLocations" + htmlString);
    */
    //alert("renderStoriesLocations : " + result.rows.length);
   locationMap.showAllPlaces(result);
}