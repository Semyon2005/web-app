import sqlite3
import json
connection = sqlite3.connect('C:\\Users\\semen\\PycharmProjects\\web-app\\back-end\\my_database.db')

cursor = connection.cursor()
cursor.execute('PRAGMA foreign_keys = ON')

# with open('SQL-FOR-DB.txt', 'r', encoding='utf-8') as file:
#     sql_script = file.read()
#
# cursor.executescript(sql_script)
query = ''''''
while True:
    st = input()
    if st != '':
        query += st + ' '
    else:
        break
cursor.execute(query)
data = json.dumps(cursor.fetchall(), ensure_ascii=False)
print(type(data))
connection.commit()
connection.close()