#!/usr/bin/env python
import roslib; roslib.load_manifest('rospy_integration')
import rospy
import os
import json
from std_msgs.msg import String

def callback(data):
    try:
        currentFilePath = os.path.abspath(__file__)
        currentDirectory = os.path.dirname(currentFilePath)
        outputFilePath = os.path.join(currentDirectory, os.pardir, 'rospy_subscriber_output.json')

        f = open(outputFilePath, 'w')
        jsonValue = json.dumps({ 'data': data.data })
        f.write(jsonValue)

        rospy.signal_shutdown('Test complete')
    except:
        rospy.signal_shutdown('Test finished with error')

def subscriber():
    rospy.init_node('rospy_subscriber', anonymous=True)
    rospy.Subscriber('rospy_integration_subscribe', String, callback)
    rospy.spin()

if __name__ == '__main__':
    subscriber()

