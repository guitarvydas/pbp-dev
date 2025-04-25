

(defun reverser_install (&optional  reg)
  (declare (ignorable  reg))                                #|line 1|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Reverser"  nil  #'reverser_instantiator )  #|line 2|#) #|line 3|#
  )
(defparameter  reverser_state  "J")                         #|line 5|# #|line 6|#
(defun reverser_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 7|# #|line 8|#
  (cond
    (( equal    reverser_state  "K")                        #|line 9|#
      (cond
        (( equal   (slot-value  msg 'port)  "J")            #|line 10|#
          (funcall (quote send_bang)   eh  ""  msg          #|line 11|#)
          (setf  reverser_state  "J")                       #|line 12|#
          )
        (t                                                  #|line 13|#
          #| pass |#                                        #|line 14|# #|line 15|#
          ))
      )
    (( equal    reverser_state  "J")                        #|line 16|#
      (cond
        (( equal   (slot-value  msg 'port)  "K")            #|line 17|#
          (funcall (quote send_bang)   eh  ""  msg          #|line 18|#)
          (setf  reverser_state  "K")                       #|line 19|#
          )
        (t                                                  #|line 20|#
          #| pass |#                                        #|line 21|# #|line 22|#
          ))                                                #|line 23|#
      ))                                                    #|line 24|#
  )
(defun reverser_instantiator (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 26|#
  (let ((name_with_id (funcall (quote gensymbol)   "Reverser"  #|line 27|#)))
    (declare (ignorable name_with_id))
    (return-from reverser_instantiator (funcall (quote make_leaf)   name_with_id  owner  nil  #'reverser_handler  #|line 28|#))) #|line 29|#
  )





