

(defparameter  count_counter  0)                            #|line 1|#
(defparameter  count_direction  1)                          #|line 2|# #|line 3|#
(defun count_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 4|# #|line 5|#
  (cond
    (( equal   (slot-value  msg 'port)  "adv")              #|line 6|#
      (setf  count_counter (+  count_counter  count_direction)) #|line 7|#
      (funcall (quote send_int)   eh  ""  count_counter  msg  #|line 8|#)
      )
    (( equal   (slot-value  msg 'port)  "rev")              #|line 9|#
      (setf  count_direction (-  count_direction)           #|line 10|#) #|line 11|#
      ))                                                    #|line 12|#
  )
(defun count_instantiator (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 14|#
  (let ((name_with_id (funcall (quote gensymbol)   "Count"  #|line 15|#)))
    (declare (ignorable name_with_id))
    (return-from count_instantiator (funcall (quote make_leaf)   name_with_id  owner  nil  #'count_handler  #|line 16|#))) #|line 17|#
  )
(defun count_install (&optional  reg)
  (declare (ignorable  reg))                                #|line 19|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Count"  nil  #'count_instantiator )  #|line 20|#) #|line 21|#
  )





