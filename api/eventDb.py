import mysql.connector
import datetime
from operator import __xor__

#db = mysql.connector.connect(host="freedb.tech", user="freedbtech_PeterYuan", passwd="81704002_oahnauY", database="freedbtech_Appointmeow")
db = mysql.connector.connect(host="localhost", user="appointmeow", passwd="Appointmeow_2021", database="Appointmeow")

cursor = db.cursor()

createEventTable="""
    CREATE TABLE event(
        eventID INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
        title VARCHAR(80) NOT NULL,
        description VARCHAR(200),
        startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userEmail VARCHAR(80) NOT NULL,
        FOREIGN KEY (userEmail) REFERENCES user(email)
    )
"""

def DateTimeToDate(timeValue):
    """Extracts the date from a string-formatted dateTime variable and return it in string format 'YYYY-MM-DD'"""
    return timeValue.strftime("%Y") + "-" + timeValue.strftime("%m") + "-" + timeValue.strftime("%d")
def DateTimeToTime(timeValue):
    """Extracts the time from a string-formatted dateTime variable and return it in string format 'HH:MM:SS'"""
    return timeValue.strftime("%H") + ":" + timeValue.strftime("%M") + ":" + timeValue.strftime("%S")

def CreateEvent(title, description, startTime, endTime, userEmail):
    cmd = """INSERT INTO event (title, description, startTime, endTime, userEmail) VALUES (%s, %s, %s, %s, %s)"""
    #Verify the time slot
    events = UserEventsBetweenTime(userEmail, startTime, endTime)
    #alter the event list to allow time blocks such as 4:00~6:00 and 6:00~8:00
    conflictingEvents = []
    for i in range(len(events)):
        event = events[i]
        # print(event[3])
        # print(datetime.datetime.strptime(endTime, "%Y-%m-%d %H:%M"))
        # print(event[4])
        # print(datetime.datetime.strptime(startTime, "%Y-%m-%d %H:%M"))
        if not __xor__(event[3] == datetime.datetime.strptime(endTime, "%Y-%m-%d %H:%M"), event[4] == datetime.datetime.strptime(startTime, "%Y-%m-%d %H:%M")):
            print("edge detected")
            conflictingEvents.append(event)
    #check if the event is contained in another event
    events = UserEvents(userEmail)
    for event in events:
        if event[3] < datetime.datetime.strptime(startTime, "%Y-%m-%d %H:%M") and datetime.datetime.strptime(endTime, "%Y-%m-%d %H:%M") < event[4]:
            print("contained")
            conflictingEvents.append(event)
    #check if the time is avaliable (avaliable if len(conflictingEvents) == 0)
    if len(conflictingEvents) >= 1:
        print("User '" + userEmail + "' already has existing events between time block '" + startTime + "' and '" + endTime + "'")
        return False
    cursor.execute(cmd, (title, description, startTime, endTime, userEmail))
    db.commit()
    print("Successfully created event")
    return "Successfully created event"

def UserEvents(userEmail):
    cmd = """SELECT * FROM event WHERE userEmail = %s"""
    cursor.execute(cmd, (userEmail,))
    results = cursor.fetchall()
    return results

def EventsOnDay(date):
    cmd = """SELECT * FROM event WHERE startTime BETWEEN %s AND %s"""
    cursor.execute(cmd, (date + " 00:00:00", date + " 23:59:59"))
    results = cursor.fetchall()
    return results

def UserEventsBetweenDate(userEmail, startDate, endDate):
    return UserEventsBetweenTime(userEmail, startDate + " 00:00:00", endDate + " 23:59:59")

def UserEventsBetweenTime(userEmail, startTime, endTime):
    cmd = """
        SELECT event.eventID, event.title, event.description, event.startTime, event.endTime, event.userEmail
        FROM event
        JOIN user ON event.userEmail = user.email
        WHERE user.email = %s AND ((event.startTime BETWEEN %s AND %s) OR (event.endTime BETWEEN %s AND %s))
        ORDER BY event.startTime ASC;
    """
    cursor.execute(cmd, (userEmail, startTime, endTime, startTime, endTime))
    results = cursor.fetchall()
    return results

def RemoveEvent(eventID):
    """Removes an event with eventID"""
    #find the date of the event
    cmd = """SELECT startTime FROM event WHERE eventID = %s"""
    cursor.execute(cmd, (eventID, ))
    dates = cursor.fetchall()
    date = dates[0][0]
    cmd = """DELETE FROM event WHERE eventID = %s"""
    cursor.execute(cmd, (eventID,))
    db.commit()
    print("Successfully removed event")
    return date

def AllEvents():
    """Returns a list of events"""
    cmd = """SELECT * FROM event"""
    cursor.execute(cmd)
    results = cursor.fetchall()
    return results


#======================Followins are command scripts===============================

#CreateEvent("Test 3", "Desc 3", "2021-06-23 12:30", "2021-06-23 13:00", "pyuan@whittleschool.org")
#RemoveEvent(16)

print("==============All existing events==================")
results = AllEvents()
for result in results:
    print(result)
print("===================================================")
