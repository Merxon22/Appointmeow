import mysql.connector
from mysql.connector.errors import IntegrityError

#db = mysql.connector.connect(host="freedb.tech", user="freedbtech_PeterYuan", passwd="81704002_oahnauY", database="freedbtech_Appointmeow")
db = mysql.connector.connect(host="localhost", user="appointmeow", passwd="Appointmeow_2021", database="Appointmeow")

cursor = db.cursor()

createUserTable = """
    CREATE TABLE user(
        userID INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
        email VARCHAR(80) NOT NULL UNIQUE,
        password VARCHAR(32) NOT NULL,
        identity VARCHAR(16) NOT NULL,
        loginKey VARCHAR(80)
    )
"""

def CreateUser(email, password, identity):
    cmd = """INSERT INTO user (email, password, identity) VALUES(%s, %s, %s)"""
    try:
        cursor.execute(cmd, (email, password, identity))
        db.commit()
    except IntegrityError:
        print("User email already exists")
        return "Email already exists"
    else:
        print("Successfully created user '" + email + "' in 'user' table.")
        return True

def UserPassword(email):
    cmd = """SELECT password FROM user WHERE email = %s"""
    cursor.execute(cmd, (email,))
    result = cursor.fetchall()
    if cursor.rowcount > 0:
        print("Successfully fetched user '" + str(email) + "'s password.")
        return str(result[0][0])
    else:
        print("User '" + email + "' does not exist.")
        return ""

def UpdatePassword(email, password):
    cmd = """UPDATE user SET password = %s WHERE email = %s"""
    cursor.execute(cmd, (password, email))
    db.commit()
    print("Successfully updated user '" + str(email) + "'s password.")

def AllUsers():
    """Returns a list of users"""
    cmd = """SELECT * FROM user"""
    cursor.execute(cmd)
    results = cursor.fetchall()
    return results

def RemoveUser(email):
    cmd = """DELETE FROM user WHERE email = %s"""
    cursor.execute(cmd, (email,))
    db.commit()
    print("Successfully removed user '" +str(email) + "' from table 'user'.")

def UpdateLoginKey(key, email):
    cmd = """UPDATE user SET loginKey = %s WHERE email = %s"""
    cursor.execute(cmd, (key, email))
    db.commit()
    print("Successfully updated user '" + email + "'s login key to '" + key + "'")

def EraseLoginKey(key):
    cmd = """UPDATE user SET loginKey = '' WHERE loginKey = %s"""
    cursor.execute(cmd, (key, ))
    db.commit()
    print("Successfully erased login key '" + key + "'")

def EmailByKey(loginKey):
    """Returns empty string if login key does not exist, return email if login key exists"""
    cmd = """SELECT email FROM user WHERE loginKey = %s"""
    cursor.execute(cmd, (loginKey, ))
    result = cursor.fetchall()
    if cursor.rowcount > 0:
        email = result[0][0]
        print("Successfully fethced user '" + email + "' with login key")
        return email
    else:
        print("User with this login key does not exist")
        return ""

def UsersWithName(userName):
    cmd = """SELECT email FROM user WHERE email LIKE %s"""
    cursor.execute(cmd, ("%" + userName + "%", ))
    results = cursor.fetchall()
    message = []
    for result in results:
        message.append(result[0])
    print(len(message))
    return message


#======================Followins are command scripts===============================

print("=================All existing users====================")
results = AllUsers()
for result in results:
    print(result)
print("=======================================================")
