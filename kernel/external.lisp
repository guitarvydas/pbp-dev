
(defun external_instantiate (&optional  reg  owner  name  container  arg)
  (declare (ignorable  reg  owner  name  container  arg))   #|line 1|#
  (let ((name_with_id (funcall (quote gensymbol)   "external"  #|line 2|#)))
    (declare (ignorable name_with_id))
    (return-from external_instantiate (funcall (quote make_leaf)   name_with_id  owner  container  arg  #'external_handler  #|line 3|#))) #|line 4|#
  )
(defun external_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 6|#
  (funcall (quote handle_external)  (slot-value  eh 'arg)  eh  msg  #|line 7|#) #|line 8|#
  )
(defun generate_external_components (&optional  reg  container_list)
  (declare (ignorable  reg  container_list))                #|line 10|#
  (cond
    ((not (equal   nil  container_list))                    #|line 11|#
      (loop for diagram in  container_list
        do
          (progn
            diagram                                         #|line 12|#
            #|  loop through every component in the diagram and look for names that start with ":“  |# #|line 13|#
            (loop for child_descriptor in (gethash  "children"  diagram)
              do
                (progn
                  child_descriptor                          #|line 14|#
                  (cond
                    ((funcall (quote first_char_is)  (gethash  "name"  child_descriptor)  ":" ) #|line 15|#
                      (let ((template_name  ":"))
                        (declare (ignorable template_name)) #|line 16|#
                        (let ((arg (gethash  "name"  child_descriptor)))
                          (declare (ignorable arg))         #|line 17|#
                          (let ((generated_leaf (funcall (quote mkTemplate)   template_name  child_descriptor  arg  #'external_instantiate  #|line 18|#)))
                            (declare (ignorable generated_leaf))
                            (funcall (quote register_component)   reg  generated_leaf  #|line 19|#)))) #|line 20|#
                      ))                                    #|line 21|#
                  ))                                        #|line 22|#
            ))                                              #|line 23|#
      ))
  (return-from generate_external_components  reg)           #|line 24|# #|line 25|#
  )
(defun first_char (&optional  s)
  (declare (ignorable  s))                                  #|line 27|#
  (return-from first_char  (string (char  s 0))             #|line 28|#) #|line 29|#
  )
(defun first_char_is (&optional  s  c)
  (declare (ignorable  s  c))                               #|line 31|#
  (return-from first_char_is ( equal    c (funcall (quote first_char)   s  #|line 32|#))) #|line 33|#
  )                                                         #|line 35|#