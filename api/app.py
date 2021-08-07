import datetime
from flask import Flask, request, json, redirect, url_for
import userDb, eventDb
import random, string

app = Flask(__name__)

@app.route("/register/createuser", methods=["POST"])
def CreateUser():
    data = json.loads(request.data)
    print(data["identity"])
    message = userDb.CreateUser(data["username"] + "@whittleschool.org", data["password"], data["identity"])
    return {"message": message}

@app.route("/login/verify", methods=["POST"])
def VerifyLogin():
    print("Verifying login")
    data = json.loads(request.data)
    email = data["username"] + "@whittleschool.org"
    pw = userDb.UserPassword(email)
    verified = (pw == data["password"] and pw != "")
    loginKey = ""
    if verified:
        loginKey = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))
        userDb.UpdateLoginKey(loginKey, email)
    return {
        "message": verified,
        "loginKey": loginKey
    }

def DateTimeToDate(timeValue):
    """Extract date from a dateTime variable and return ot in string format 'YYYY-MM-DD'"""
    return timeValue.strftime("%Y") + "-" + timeValue.strftime("%m") + "-" + timeValue.strftime("%d")

@app.route("/home/events/<loginKey>", methods = ["POST"])
def GetEvents(loginKey):
    data = json.loads(request.data)
    today = data["date"]
    print("Searching from: " + today)
    today = today.split("-")
    today = datetime.datetime(int(today[0]), int(today[1]), int(today[2]))
    weekDay = int(data["weekday"])
    searchDate = today + datetime.timedelta(days = (0-weekDay))
    print(data)
    if "friendEmail" in data:
        print("Viewing others' home page")
        email = data["friendEmail"]
    else:
        print("Viewing my home page")
        email = userDb.EmailByKey(loginKey)
        if email == "":
            return {"message": False}
    return UserEventsInThisWeek(email, searchDate)

def UserEventsInThisWeek(email, searchDate):
    """returns a dictionary of events in this week"""
    weekDayName = ("sun", "mon", "tue", "wed", "thu", "fri", "sat")
    message = { "message": True }   #the message (as a dictionary) that will be passed to React
    for day in range(7):
        results = eventDb.UserEventsBetweenDate(email, DateTimeToDate(searchDate), DateTimeToDate(searchDate))   #all the events in this day
        eventList = []  #the event list of this specific day
        for i in range(len(results)):
            result = results[i]
            dict = {
                "key": result[0],
                "eventName": result[1],
                "detail": result[2],
                "startTime": result[3],
                "endTime": result[4],
                "email": result[5]
            }   #make every event into a dictionary
            eventList.append(dict)  #append the event (as a dictionary) to the event list of this day
        searchDate += datetime.timedelta(days = 1)
        message[weekDayName[day]] = eventList
    print("Events returned")
    return message

@app.route("/home/createevent", methods = ["POST"])
def CreateEvent():
    data = json.loads(request.data)
    loginKey = data["loginKey"]
    email = userDb.EmailByKey(data["loginKey"])
    if email == "":
        print("false")
        return {"message": "false"}
    else:
        message = eventDb.CreateEvent(data["eventName"], data["detail"], data["beginDate"] + " " + data["beginTime"], data["endDate"] + " " + data["endTime"], email)
        if message != False:
            # today = datetime.datetime.today().strftime('%Y-%m-%d')
            # today = today.split("-")
            # today = datetime.datetime(int(today[0]), int(today[1]), int(today[2]))
            # weekDay = (datetime.datetime.today().weekday() + 1) % 7
            # searchDate = today + datetime.timedelta(days = (0-weekDay))
            # email = userDb.EmailByKey(loginKey)
            # events = UserEventsInThisWeek(email, searchDate)
            # print(events)
            # return events
            print("success")
            #return redirect(url_for('GetEvents')+"?lk="+loginKey)
            return {"message": "success"}
        else:
            print("error")
            return {"message": "error"}

@app.route("/logout/<loginKey>", methods = ["POST"])
def ConfirmLogout(loginKey):
    data = json.loads(request.data)
    if data["logOut"] == True:
        userDb.EraseLoginKey(loginKey)

@app.route("/searchuser", methods = ['POST'])
def SearchUser():
    data = json.loads(request.data)
    searchEmail = data["friendName"]
    result = userDb.UsersWithName(searchEmail)
    print(result)
    print(type(result))
    return {"message": result}

@app.route("/eventdelete", methods=["POST"])
def DeleteEvent():
    print("delete event")
    data = json.loads(request.data)
    email = userDb.EmailByKey(data["loginKey"])
    if email == "":
        return {"message": False}
    else:
        date = eventDb.RemoveEvent(data["deleteTarget"])
        weekDay = (date.weekday() + 1) % 7
        searchDate = date + datetime.timedelta(days = (0-weekDay))
        events = UserEventsInThisWeek(email, searchDate)
        print(events)
        return events


# @app.route("/home/<string: email>", methods=["GET"])
# def HomePage():

if __name__ == "__main__":
    app.run(debug=False)