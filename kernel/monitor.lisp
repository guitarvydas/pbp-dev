

(defun monitor_install (&optional  reg)
  (declare (ignorable  reg))                                #|line 1|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "@"  nil  #'monitor_instantiator )  #|line 2|#) #|line 3|#
  )
(defun monitor_instantiator (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 5|#
  (let ((name_with_id (funcall (quote gensymbol)   "@"      #|line 6|#)))
    (declare (ignorable name_with_id))
    (return-from monitor_instantiator (funcall (quote make_leaf)   name_with_id  owner  nil  #'monitor_handler  #|line 7|#))) #|line 8|#
  )
(defun monitor_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 10|#
  (let (( s (slot-value (slot-value  msg 'datum) 'v)))
    (declare (ignorable  s))                                #|line 11|#
    (let (( i (parse-integer  s)                            #|line 12|#))
      (declare (ignorable  i))
      (loop while ( >   i  0)
        do
          (progn                                            #|line 13|#
            (setf  s  (concatenate 'string  " "  s)         #|line 14|#)
            (setf  i (-  i  1))                             #|line 15|# #|line 16|#
            ))
      (format *standard-output* "~a~%"  s)                  #|line 17|#)) #|line 18|#
  )





