

(defun delay_install (&optional  reg)
  (declare (ignorable  reg))                                #|line 1|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Delay"  nil  #'delay_instantiator )  #|line 2|#) #|line 3|#
  )
(defclass Delay_Info ()                                     #|line 5|#
  (
    (counter :accessor counter :initarg :counter :initform  0)  #|line 6|#
    (saved_message :accessor saved_message :initarg :saved_message :initform  nil)  #|line 7|#)) #|line 8|#

                                                            #|line 9|#
(defun delay_instantiator (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 10|#
  (let ((name_with_id (funcall (quote gensymbol)   "delay"  #|line 11|#)))
    (declare (ignorable name_with_id))
    (let ((info  (make-instance 'Delay_Info)                #|line 12|#))
      (declare (ignorable info))
      (return-from delay_instantiator (funcall (quote make_leaf)   name_with_id  owner  info  #'delay_handler  #|line 13|#)))) #|line 14|#
  )
(defparameter  DELAYDELAY  5000)                            #|line 16|# #|line 17|#
(defun first_time (&optional  m)
  (declare (ignorable  m))                                  #|line 18|#
  (return-from first_time (not (funcall (quote is_tick)   m  #|line 19|#))) #|line 20|#
  )
(defun delay_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 22|#
  (let ((info (slot-value  eh 'instance_data)))
    (declare (ignorable info))                              #|line 23|#
    (cond
      ((funcall (quote first_time)   msg )                  #|line 24|#
        (setf (slot-value  info 'saved_message)  msg)       #|line 25|#
        (funcall (quote set_active)   eh )
        #|  tell engine to keep running this component with ;ticks'  |# #|line 26|# #|line 27|#
        ))                                                  #|line 28|#
    (let ((count (slot-value  info 'counter)))
      (declare (ignorable count))                           #|line 29|#
      (let (( next (+  count  1)))
        (declare (ignorable  next))                         #|line 30|#
        (cond
          (( >=  (slot-value  info 'counter)  DELAYDELAY)   #|line 31|#
            (funcall (quote set_idle)   eh )
            #|  tell engine that we're finally done  |#     #|line 32|#
            (funcall (quote forward)   eh  "" (slot-value  info 'saved_message)  #|line 33|#)
            (setf  next  0)                                 #|line 34|# #|line 35|#
            ))
        (setf (slot-value  info 'counter)  next)            #|line 36|#))) #|line 37|#
  )





