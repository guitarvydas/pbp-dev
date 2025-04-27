
(defun external_instantiate (&optional  reg  owner  name  container  arg)
  (declare (ignorable  reg  owner  name  container  arg))   #|line 1|#
  (let ((name_with_id (funcall (quote gensymbol)   "external"  #|line 2|#)))
    (declare (ignorable name_with_id))
    (return-from external_instantiate (funcall (quote make_leaf)   name_with_id  owner  container  arg  #'external_handler  #|line 3|#))) #|line 4|#
  )
(defun external_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 6|#
  (let (( handler (dispatch_lookup (slot-value  eh 'name)  eh) #|line 7|#))
    (declare (ignorable  handler))
    (cond
      (( equal    nil  handler)                             #|line 8|#
        #|  just a string with no further meaning - send it out as a string  |# #|line 9|#
        (funcall (quote send)   eh  "" (slot-value  eh 'arg)  msg  #|line 10|#)
        )
      (t                                                    #|line 11|#
        #|  handler implemented on a per-project basis  |#  #|line 12|#
        ( handler  eh,  msg)                                #|line 13|# #|line 14|#
        )))                                                 #|line 15|#
  )
(defun generate_external_components (&optional  reg  container_list)
  (declare (ignorable  reg  container_list))                #|line 17|#
  (cond
    ((not (equal   nil  container_list))                    #|line 18|#
      (loop for diagram in  container_list
        do
          (progn
            diagram                                         #|line 19|#
            #|  loop through every component in the diagram and look for names that start with ":“  |# #|line 20|#
            (loop for child_descriptor in (gethash  "children"  diagram)
              do
                (progn
                  child_descriptor                          #|line 21|#
                  (cond
                    ((funcall (quote first_char_is)  (gethash  "name"  child_descriptor)  ":" ) #|line 22|#
                      (let ((name (funcall (quote gensymbol)  (mangle_name (gethash  "name"  child_descriptor))  #|line 23|#)))
                        (declare (ignorable name))
                        (let ((arg (gethash  "name"  child_descriptor)))
                          (declare (ignorable arg))         #|line 24|#
                          (let ((generated_leaf (funcall (quote mkTemplate)   name  child_descriptor  arg  #'external_instantiate  #|line 25|#)))
                            (declare (ignorable generated_leaf))
                            (funcall (quote register_component)   reg  generated_leaf  #|line 26|#)))) #|line 27|#
                      ))                                    #|line 28|#
                  ))                                        #|line 29|#
            ))                                              #|line 30|#
      ))
  (return-from generate_external_components  reg)           #|line 31|# #|line 32|#
  )
(defun first_char (&optional  s)
  (declare (ignorable  s))                                  #|line 34|#
  (return-from first_char  (string (char  s 0))             #|line 35|#) #|line 36|#
  )
(defun first_char_is (&optional  s  c)
  (declare (ignorable  s  c))                               #|line 38|#
  (return-from first_char_is ( equal    c (funcall (quote first_char)   s  #|line 39|#))) #|line 40|#
  )                                                         #|line 42|#