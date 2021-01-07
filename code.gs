var token = "<Telegram BOT Token ID>"; 
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "<Published Web Url of your google web app. You will get this url once you publish your google script.>";

function setWebhook() //Setting your webhook. You will need someone to listen to the messages sent from Telegram.
{
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
}

function sendMessage(chat_id, text)  // This is for BOT to reply back to the messages sent to it.
{
  var url = telegramUrl + "/sendMessage?chat_id=" + chat_id + "&text="+ text;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText()); 
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var chat_id = contents.message.from.id; 
  var text = contents.message.text;
  var date = contents.message.date;
  var celldata = "";
  var columnno = 3;
  var rowno = 0;
  var checkforsplit = "";
  var amount = "";
  var flag = 0;
  var type = "";
  var category = "";
  var amount = "";
  var username = contents.message.from.first_name + contents.message.from.last_name;
  //sendMessage(chat_id,username); //Use this to check your username so that only you can access the BOT and no one else can.
  if(username=="<Telegram User Name1>" || username=="<Telegram User Name2>") //Use the users for which you want to enable the BOT. Generally, this should be family members. You can add more family members by simply using the OR function.
  {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Budget"); // Select the sheet where we would be entering the data.
  if(text=="/start" || text=="help" || text=="Help")
  {
    var content = "Welcome to Budget BOT. You can add an expense, income or check your balance.";
    sendMessage(chat_id,content);
    content = "Please use the following format for recording expenses: Expense-Bus-500 or Expense Bus 500";
    sendMessage(chat_id,content);
    content = "Please use the following format for recording income: Income-Salary-50000 or Income Salary 50000";
    sendMessage(chat_id,content);
    content = "Please use the following format for checking balance: Balance";
    sendMessage(chat_id,content);
    content = "Please use the following format for checking total income details: Income";
    sendMessage(chat_id,content);
    content = "Please use the following format for checking total expense details: Expenses";
    sendMessage(chat_id,content);
    content = "This is a very simple Bot to note down your daily expenses. There isn't much validation checks for spelling. This is work in progress. Anyone can replicate the BOT, but only you will have access to your data and no one else";
    sendMessage(chat_id,content);
  }
  else if(text=="Balance" || text=="balance")
  {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Total"); // Select the sheet from where we will retrieve the data.
    var Balance = sheet.getRange(3,2).getValue();
    if(Balance==0)
    {
      content = "Oops! Your account is empty!! Try to save better next time";
      sendMessage(chat_id,content);
    }
    else if(Balance<0)
    {
      content = "This is so not good! Pls don't spend more than you earn! You are in negative balance of: " + Balance;
      sendMessage(chat_id,content);
    }
    else
    {
      content = "Your current balance is: " + Balance;
      sendMessage(chat_id,content);
    }
  }
  else if(text=="Income" || text=="income")
  {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Total");
    var Income = sheet.getRange(1,2).getValue();
    if(Income==0)
    {
      content = "Oops! You haven't made any entry for income!";
      sendMessage(chat_id,content);
    }
    else
    {
      content = "Your total income is: " + Income;
      sendMessage(chat_id,content);
    }
  }
  else if(text=="Expenses" || text=="expenses" || text=="Expense"  || text=="expense")
  {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Total");
    var Expense = sheet.getRange(2,2).getValue();
    if(Expense==0)
    {
      content = "Great going! You haven't spent any money till now!";
      sendMessage(chat_id,content);
    }
    else
    {
      content = "Your total expenses are: " + Expense;
      sendMessage(chat_id,content);
    }
  }
  else
  {
    for(var j=0; j<text.length; j++)
    {
      checkforsplit = text[j];
      if(checkforsplit=="-" || checkforsplit==" ")
        flag++;
    }
    checkforsplit = "";
    if(flag==2)
    {
      sheet.getRange(sheet.getLastRow() + 1,1).setValue(date);
      sheet.getRange(sheet.getLastRow(),2).setValue(username);
      for(var i=0; i<text.length; i++)
      {
        checkforsplit = text[i];
        if(checkforsplit=="-" || checkforsplit==" ")
        {
          sheet.getRange(sheet.getLastRow(),columnno).setValue(celldata);
          if(columnno==3)
            type=celldata;
          if(columnno==4)
            category=celldata;
          ++columnno;
          celldata = "";
        }
        else
          celldata = celldata + checkforsplit;
      }
      amount = celldata;
      sheet.getRange(sheet.getLastRow(),columnno).setValue(celldata);
      var reply = "The following entry was made: "+ type + "  "+ category + "  "+ amount;
      sendMessage(chat_id,reply);
    }
    else
    {
      var reply = "Format is wrong. Kindly use the correct format. You can also type help";
      sendMessage(chat_id,reply);
    }
  }
  }
  else
  {
    var reply = "You are not authorise for this application.";
    sendMessage(chat_id,reply);
  }
 }
