#!/usr/bin/env python
import roslib; roslib.load_manifest('rospy_integration')
import rospy
from std_msgs.msg import String

def publisher():
    pub = rospy.Publisher('rospy_integration_publish', String)
    rospy.init_node('rospy_publisher')
    str = 'message published by rospy'
    pub.publish(String(str))
    rospy.sleep(1.0)
    rospy.signal_shutdown('Test complete')

if __name__ == '__main__':
    try:
        publisher()
    except rospy.ROSInterruptException:
        pass
