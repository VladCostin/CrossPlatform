
function submitForm()
{
    dbShell.transaction(insertDB, errorCB);
}

function insertDB(tx)
{
    
    var sql = 'INSERT INTO DEMO (title,image,description) VALUES (?,?,?)';
    tx.executeSql(sql,["hamsterTitle","hamsterPicture","hasmterDescription"], selectQueryDB, errorCB);
   
}

function selectQueryDB(tx)
{
    alert("am inserat ceva");
    tx.executeSql('SELECT * FROM DEMO', [], renderList,errorCBSelect);
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
        htmlString +='<li>' + result.rows.item(i).title+'</li>';
    }
      document.getElementById("idP").innerHTML = htmlString;
  //  $('listview').html(htmlString);
  //  $('listview').listview('refresh');
}