#!/bin/sh
# autorunser.sh

sleep 30
cd /
cd /home/pi/Desktop
sudo python rel.py
sleep 5
sudo python name.py 10.0.0.2:8080
cd /
