import json
import web
import serial
import cv2, cv2.cv as cv
import numpy as np
import os, csv, string
import db, sqlite3
import logging
import fileH

ser = serial.Serial('/dev/ttyACM0',38400)

render = web.template.render('template/')
        
urls = (
    '/', 'hello'
)
app = web.application(urls, globals())



class hello:
	users=[]

	def checkUser(self,uname):
		flag = False
		for name in self.users:
			if name == uname:
				flag = True
				break
			else:
				flag = False
		return flag
        
	def POST(self):
			
		rel1 = False
		rel3 = False
		web.header('Content-Type','application/json')
		dat = web.data()
		input = json.loads(dat)
		act = input['action']
		print "data: "+act 
		if act == 'Relay 1 on' :
			ser.write('1')
			rel1 = True
			rv = {'status' : 'True', 'message' : 'Relay 1 is ON!'}
			return json.dumps(rv)
		elif act == 'Relay 1 off' :
			ser.write('!')
			rel1 = False
			rv = {'status':'True', 'message': 'Relay 1 is OFF!'}
			return json.dumps(rv)
		elif act == 'Relay 2 on' :
			ser.write('2')
			#rel2 = True
			rv = {'status':'True', 'message':'Relay 2 is ON!'}
			return json.dumps(rv)
		
		elif act == 'Relay 3 on' :
			ser.write('3')
			rel3 = True
			rv = {'status': 'True', 'message' : 'Relay 3 is ON!' }
			return json.dumps(rv)
		elif act == 'Relay 3 off' :
			ser.write('#')
			rel3 = False
			rv = {'status' : 'True', 'message' : 'Relay 3 is OFF!'}
			return json.dumps(rv)

		elif act == 'CHECK' :
			ser.write('5')
			sta = ser.readline()
			stat = int(sta,2)
			if stat == 0 :
				rel1=False;
				#rel2=False;
				rel3=False;
			elif stat == 1 :
                                rel1=False;
                                #rel2=False;
                                rel3=True;
			elif stat == 2 :
                                rel1=True;
                                #rel2=True;
                                rel3=False;
			elif stat == 3 :
                                rel1=True;
                                #rel2=True;
                                rel3=True;
			'''elif stat == 4 :
                                rel1=True;
                                rel2=False;
                                rel3=False;
			elif stat == 5 :
                                rel1=True;
                                rel2=False;
                                rel3=True;
			elif stat == 6 :
                                rel1=True;
                                rel2=True;
                                rel3=False;
			elif stat == 7 :
                                rel1=True;
                                rel2=True;
                                rel3=True;'''

			rv = {'status':'True', 'message' : stat}
			return json.dumps(rv)
		
		elif act == 'loginF':
			idata = input['data']
			image = open('imageFromPhone.jpg','wb')
			image.write(idata.decode('base64'))
			image.close()
			
			image = cv2.imread('imageFromPhone.jpg')
			recog = fileH.trainRecog()
			[label , dist] = fileH.recognize(image,recog)
			rv = {}

			if label == -1:
				rv = {'status': 'False'}
			else:
				conn = db.Connect()
				[status,uname,pswd] = db.checkFace(conn,label)
				conn.close()
				rv = {'status':str(status),'uname':uname,'pswd':pswd}
			#rv = {'status':'True', 'message' : 'label : '+str(label)+'\ndist : '+str(dist)}
			return json.dumps(rv)
		
		elif act == 'login':
			uname = input['username']
			pswd = input['password']
			
			conn = db.Connect()
			if db.checkUser(conn,uname,pswd):
				print "User Exists!"
				flag = True
				for names in self.users:
					if names == uname :
						flag = False
						break
					else:
						flag = True
				if flag :
					self.users.append(uname)
				rv={'stat':'True'}
				conn.close()
				return json.dumps(rv)
			else:
				rv={'stat':'False'}
				conn.close()
                                return json.dumps(rv)

		elif act == 'logout':
			uname = input['username']
			flag = False
			for name in self.users:
				if name == uname:
					self.users.remove(name)
					flag = True
					break
				else:
					flag = False
			rv={'stat':'abc'}
			ser.write('4')
			if flag:
				rv={'stat':'True'}
			else:
				rv={'stat':'False'}
			return json.dumps(rv)

		elif act == 'getUsers':
			conn = db.Connect()
			usernames = db.getUsers(conn)
			conn.close()
			rv={'users':usernames}
			return json.dumps(rv)	

		elif act == 'register':
			flag = input['pic']
			uname = input['uname']
			pswd = input['pswd']
			name = input['name']
			#logging.warning(str(flag)+' '+uname+' '+pswd+' '+name)
			if flag == 'False':
				#logging.warning('Entered False')
				try:
					#logging.warning('Entered Try')
					conn = db.Connect()
					db.insertUser(conn,uname,pswd,name,'')
					conn.commit()
					conn.close()
					rv={'stat':'True'}
					return json.dumps(rv)
				except:
					#logging.warning('Entered Except')
					rv={'stat':'False'}
					return json.dumps(rv)
			elif flag == 'True':
				im1 = input['img1']
                        	im2 = input['img2']
				im3 = input['img3']
				im4 = input['img4']
				path = fileH.getPath()
				im = open('image.jpg','wb')
				im.write(im1.decode('base64'))
				im.close()
				img = cv2.imread('image.jpg')
				fileH.saveFace(img,path)
				im = open('image.jpg','wb')
				im.write(im2.decode('base64'))
				im.close()
				img = cv2.imread('image.jpg')
				fileH.saveFace(img,path)
				im = open('image.jpg','wb')
				im.write(im3.decode('base64'))
				im.close()
				img = cv2.imread('image.jpg')
				fileH.saveFace(img,path)
				im = open('image.jpg','wb')
				im.write(im4.decode('base64'))
				im.close()
				img = cv2.imread('image.jpg')
				fileH.saveFace(img,path)
				fileH.createCSV()
				face = fileH.getLabel()
				logging.warning('label '+str(face))
				con = db.Connect()
				db.insertUser(con,uname,pswd,name,face)
				con.commit()
				con.close()
				#fileH.trainRecog()
				rv={'stat':'True'}
				return json.dumps(rv)

		else :
			rv={'message':'Invalid Request'}
			return json.dumps(rv)

if __name__ == "__main__":
    app.run()
