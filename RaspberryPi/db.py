import sqlite3

def Connect():
	conn = sqlite3.connect('HAS')
	return conn;

def getUsers(conn):
	unames=[]
	cursor = conn.execute("select UNAME from USERS;")
	for row in cursor:
		unames.append(row[0])
	return unames

def checkFace(conn,faceid):
	cursor = conn.execute("select UNAME,PSWD from USERS where FACEID=?;",(faceid,))
	uname = ''
	pswd = ''
	flag = False
	for row in cursor:
		if row[0] == '':
			flag = False
			break;
		else:
			flag = True
			uname = row[0]
			pswd = row[1]
	return [flag,uname,pswd]

def checkUser(conn,uname,pswd):
	cursor = conn.execute("select UNAME,PSWD from USERS where UNAME=?;",(uname,))
	flag = False
	for row in cursor:
		if row[1]==pswd:
			flag=True
		else:
			flag=False
	return flag

def insertUser(conn,uname,pswd,name,faceid):
	
	cursor = conn.execute("SELECT max(ID) FROM USERS;")
	id = -1
	for row in cursor:
		id=row[0]
	if(id):
		id=id+1
	else:
		id=1
	print "ID "+str(id)
	if(faceid == ''):
		conn.execute("insert into USERS values(?,?,?,?,NULL);",(id,uname,pswd,name))
	else:
		conn.execute("insert into USERS values(?,?,?,?,?);",(id,uname,pswd,name,faceid))
	
def deleteUser(conn,id):
	query="delete from USERS where ID="+str(id)
	conn.execute(query)
def getFace(conn):
	id=-1
	cursor = conn.execute("select max(FACEID) from USERS;")
	for row in cursor:
		id=row[0]
	return id

def clearTab(conn):
	conn.execute('delete from USERS;')
	conn.execute('vacuum;')

def closeConnect(con):
	con.close()

if __name__ == "__main__":
	conn = Connect() 
	'''conn.execute(CREATE TABLE USERS
	(ID INT PRIMARY KEY     NOT NULL,
	UNAME           TEXT    NOT NULL,
	PSWD            TEXT     NOT NULL,
	NAME        TEXT NOT NULL,
	FACEID         INT);)

	conn.execute('drop table COMPANY;')'''
	#insertUser(conn,'dakshaau','kb905474','Daksh Gupta','')
	
	#for i in range(2,4) :
		#deleteUser(conn,i)
		#conn.commit()
	
	#insertUser(conn,'kaushal','kb905474','Kaushal Singh',0)
	
	#conn.commit()

	clearTab(conn)
	conn.commit()

	cursor= conn.execute('select UNAME,FACEID from USERS;')
	for row in cursor:
		print row[0]+' '+str(row[1])
	

	unames = getUsers(conn)

	for uname in unames:
		print uname

	[status, uname,pswd] = checkFace(conn,1)
	print str(status)+" "+uname+" "+pswd
	if status:
		print "User : "+uname
	else:
		print "Invalid"

	print getUsers(conn)
	conn.close()
	
