import sys
import os
import cv2, cv2.cv as cv, time
import numpy as np
import string
import csv
import json
import logging

face_cascade = cv2.CascadeClassifier('haarcascade.xml')

def getPath(base='./FaceImg'):
        BASE_PATH=base
        count = 0
        for dirname, dirnames, filenames in os.walk(BASE_PATH):
        #count = 0
                for subdirname in dirnames:
                        subject_path = os.path.join(dirname, subdirname)
                        count = count + 1
        print count
        count = count+1
        os.mkdir(BASE_PATH+'/s'+str(count))
        path=os.path.abspath(BASE_PATH+'/s'+str(count))
	return path

def createCSV(base='./FaceImg'):
	BASE_PATH=base
    	SEPARATOR=";"

    	label = 0
    
    	csvfile = open(BASE_PATH+'/csvFile.csv','w')
    	cwriter = csv.writer(csvfile)

    	for dirname, dirnames, filenames in os.walk(BASE_PATH):
        #count = 0
        	for subdirname in dirnames:
            		subject_path = os.path.join(dirname, subdirname)

            		for filename in os.listdir(subject_path):
                		abs_path = "%s/%s" % (subject_path, filename)
                		cwriter.writerow(["%s%s%d" % (abs_path, SEPARATOR, label)])

                 	label = label + 1

def getLabel(path = './FaceImg'):
	csfile= open(path+'/csvFile.csv','r')
	creader = csv.reader(csfile)
	row = []
	for rows in creader:
		row.append(rows[0])
	[path,label]=string.splitfields(row[len(row)-1],';')
	#print path+' '+label
	return label

def get_xy(rects):
    for x1, y1, x2, y2 in rects:
        xy = [x1,x2,y1,y2]
        return xy

def detect(img, cascade=face_cascade):
    img = cv2.equalizeHist(img)
    rects = cascade.detectMultiScale(img,minSize=(200, 200),flags=1,scaleFactor=1.2)
    if len(rects) == 0:
        return []
    rects[:, 2:] += rects[:, :2]
    return rects

def correct_gamma(img, correction):
    img = img/255.0
    img = cv2.pow(img, correction)
    return np.uint8(img*255)

def process_image(imag):  
    gr = correct_gamma(imag, 0.3) 
    gr = cv2.equalizeHist(gr)
    return gr

def saveFace(img,path):
    #image = open('image.jpg','wb')
    #image.write(img.decode('base64'))
    #image.close()
    img_color = img #cv2.imread('image.jpg')
    h,w = img_color.shape[:2]
    ratio = w/float(h)
    img_color = cv2.resize(img_color, (int(ratio*720),720))     #frame from camera
    img_gray = cv2.cvtColor(img_color, cv.CV_RGB2GRAY)
    #img_gray = cv2.equalizeHist(img_gray)

    faces = detect(img_gray)
    for rect in faces:
        xy1=get_xy(faces)
        if xy1 :
            fac = 20
            const = 6
            const2 = const/2
            cropi=img_gray[xy1[2]+fac+const:xy1[3]-fac , xy1[0]+fac+const2:xy1[1]-fac-const2]
            cropp = cv2.resize(cropi, (100,100))
            cropp = process_image(cropp)
                #cropp = cv2.equalizeHist(cropp)
            #cv2.imshow("cropped",np.asarray(cropp))
                

            fname = '00'
            ext='.jpg'
            fn =[]

            for files in os.listdir(path):
                [fname , ext1] = string.splitfields(files,'.')
                fn.append(int(fname))
            if fn:
                fname = max(fn)
            else:
                fname=0
            fname = str(int(fname)+1)


            cv2.imwrite(path+'/'+str(fname)+ext,cropp)

def recognize(img,recog):
	img_gray = cv2.cvtColor(img, cv.CV_RGB2GRAY)
	h,w = img_gray.shape[:2]
	ratio = w/float(h)
	img_gray = cv2.resize(img_gray, (int(ratio*720),720))
	#img_gray = cv2.equalizeHist(img_gray)
	faces = detect(img_gray)
	for rect in faces:
		xy1=get_xy(faces)
            #print count
		if xy1 :
			fac=20
			const = 6
			const2 = const/2
			cropi=img_gray[xy1[2]+fac+const:xy1[3]-fac , xy1[0]+fac+const2:xy1[1]-fac-const2]
			#cropi = cv2.imread('./testPics/10.jpg',0)
			cropp = cv2.resize(cropi, (100,100))
			cropp = process_image(cropp)

			#cv2.imshow("Imag",cropp)
               #prediclab = 1

                #predicdis = 0

			[prediclab, predicdis] = recog.predict(cropp)#recog.predict(cropp)
			return [prediclab, predicdis]
			#print 'Predicted Label : '+str(prediclab)+'\nPredicted Distance : '+str(predicdis)+'\n'

def getRecog(path = './FaceImg/'):
	recognizer = cv2.createLBPHFaceRecognizer(neighbors=10,radius=3,threshold=61)
	recognizer.load(path+'LBPH.xml')
	return recognizer

def trainRecog(path='./FaceImg/'):
	images = []
	labels =[]
	csvfile = open(path+'csvFile.csv','r')
	csvreader = csv.reader(csvfile)
	for row in csvreader:
		[path,label]=string.splitfields(row[0],';')
		images.append(cv2.imread(path,0))
		labels.append(label)

	recognizer = cv2.createLBPHFaceRecognizer(neighbors=10,radius=3,threshold=61)
	label = np.int32(labels)
	recognizer.train(images , label)
	return recognizer

if __name__ == "__main__":
	#path = getPath('./FaceImg')
	#image =cv2.imread('imageFromPhone.jpg')
	#saveFace(image,path)
	recog = trainRecog()
	'''recog = getRecog()'''
	img = cv2.imread('imageFromPhone.jpg')
	[lab,dis]=recognize(img,recog)
	print str(lab) + " " + str(dis)
	print getLabel()
