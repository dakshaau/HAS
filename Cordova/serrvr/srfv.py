from bottle import Bottle, run, static_file, view, route, post, request, response
from json import dumps

@route('/static/:path#.+#', name='static')
def static(path):
    return static_file(path, root='static')

@route('/')
@view('index')
def index():
    return dict()

@post('/')
def do_action():
	rel1=False
	rel2=False
	rel3=False

	print request.json['action']
	act = request.json['action']
	if act == "Relay 1 on" :
		rel1=True
		rv={"status" : "True", "message" : "Relay 1 is ON!"}
		response.content_type = 'application/json'
		return dumps(rv)
	elif act == "Relay 1 off" :
		rel1=False
		rv={"status" : "True", "message" : "Relay 1 is OFF!"}
		response.content_type = 'application/json'
		return dumps(rv)
	elif act == "Relay 2 on" :
		rel2=True
		rv={"status" : "True", "message" : "Relay 2 is ON!"}
		response.content_type = 'application/json'
		return dumps(rv)
	elif act == "Relay 2 off" :
		rel2=False
		rv={"status" : "True", "message" : "Relay 2 is OFF!"}
		response.content_type = 'application/json'
		return dumps(rv)
	elif act == "Relay 3 on" :
		rel3=True
		rv={"status" : "True", "message" : "Relay 3 is ON!"}
		response.content_type = 'application/json'
		return dumps(rv)
	elif act == "Relay 3 off" :
		rel3=False
		rv={"status" : "True", "message" : "Relay 3 is OFF!"}
		response.content_type = 'application/json'
		return dumps(rv)
	elif act == 'CHECK' :
		stri = "000"
		if !rel1 && !rel2 && !rel3 :
			stri = "000"
		elif !rel1 && !rel2 && rel3 :
			stri = "001"
		elif !rel1 && rel2 && !rel3 :
			stri = "010"
		elif !rel1 && rel2 && rel3 :
			stri = "011"	
		elif rel1 && !rel2 && !rel3 :
			stri = "100"
		elif rel1 && !rel2 && rel3 :
			stri = "101"
		elif rel1 && rel2 && !rel3 :
			stri = "110"
		elif rel1 && rel2 && rel3 :
			stri = "111"

		sta = int(stri, 2)
		if stat == 0 :
       		rel1=False;
            rel2=False;
            rel3=False;
       	elif stat == 1 :
            rel1=False;
            rel2=False;
            rel3=True;
        elif stat == 2 :
            rel1=False;
            rel2=True;
            rel3=False;
        elif stat == 3 :
            rel1=False;
            rel2=True;
            rel3=True;
        elif stat == 4 :
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
            rel3=True;

        rv = {'status':'True', 'message' : stat}
        response.content_type = 'application/json'
		return dumps(rv)
		
	else :
		print "Unable to check"
		

run(host='192.168.137.1', port=8080)