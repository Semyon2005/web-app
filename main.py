import sqlite3

connection = sqlite3.connect('my_database.db')

cursor = connection.cursor()
cursor.execute('PRAGMA foreign_keys = ON')
query = ''''''
while True:
    st = input()
    if st != '':
        query += st + ' '
    else:
        break
cursor.execute(query)
for i in cursor.fetchall():
    print(i)
connection.commit()
connection.close()