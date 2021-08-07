from eventDb import UserEventsBetweenTime
import mysql.connector

#db = mysql.connector.connect(host="freedb.tech", user="freedbtech_PeterYuan", passwd="81704002_oahnauY", database="freedbtech_Appointmeow")
db = mysql.connector.connect(host="localhost", user="appointmeow", passwd="Appointmeow_2021", database="Appointmeow")

cursor = db.cursor()

createAppointmentTable = """
    CREATE TABLE appointment(
        appointmentID INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
        title VARCHAR(80) NOT NULL,
        description VARCHAR(200),
        startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userEmail1 VARCHAR(80) NOT NULL,
        userEmail2 VARCHAR(80) NOT NULL,
        FOREIGN KEY (userEmail1) REFERENCES user(email),
        FOREIGN KEY (userEmail2) REFERENCES user(email)
    )
"""

def CreateAppointment(title, description, startTime, endTime, userEmail1, userEmail2):
    cmd = """INSERT INTO appointment (title, description, startTime, endTime, userEmail1, userEmail2) VALUES (%s, %s, %s, %s ,%s, %s)"""
    #verify user free time
    events = UserEventsBetweenTime(userEmail1, startTime, endTime)
    if len(events) >= 1:
        print("User '" + userEmail1 + "' already has existing events between time block '" + startTime + "' and '" + endTime + "'")
        return False
    events = UserEventsBetweenTime(userEmail2, startTime, endTime)
    if len(events) >= 1:
        print("User '" + userEmail2 + "' already has existing events between time block '" + startTime + "' and '" + endTime + "'")
        return False
    #Finish verifying
    cursor.execute(cmd, (title, description, startTime, endTime, userEmail1, userEmail2))
    db.commit()
    print("Successfully created appointment")
    return "Successfully created appointment"

def UserAppointmentsBetweenDate(userEmail, startDate, endDate):
    return UserAppointmentsBetweenTime(userEmail, startDate + " 00:00:00", endDate + " 23:59:59")

def UserAppointmentsBetweenTime(userEmail, startTime, endTime):
    cmd = """
        SELECT appointment.appointmentID, appointment.title, appointment.description, appointment.startTime, appointment.endTime, appointment.userEmail1, appointment.userEmail2
        FROM appointment
        JOIN user ON (appointment.userEmail1 = user.email) OR (appointment.userEmail2 = user.email)
        WHERE user.email = %s AND ((appointment.startTime BETWEEN %s AND %s) OR (appointment.endTime BETWEEN %s AND %s))
    """
    cursor.execute(cmd, (userEmail, startTime, endTime, startTime, endTime))
    results = cursor.fetchall()
    return results

def AllAppointments():
    cmd = """SELECT * FROM appointment"""
    cursor.execute(cmd)
    results = cursor.fetchall()
    return results

def RemoveAppointment(appointmentID):
    cmd = """DELETE FROM appointment WHERE appointmentID = %s"""
    cursor.execute(cmd, (appointmentID, ))
    db.commit()
    print("Successfully remove appointment")


#======================Followins are command scripts===============================


print("=============================All appointments================================")
appointments = AllAppointments()
for appointment in appointments:
    print(appointment)
print("=============================================================================")
