import serial
ser=serial.Serial('/dev/ttyACM0',38400)
ser.write('1')
