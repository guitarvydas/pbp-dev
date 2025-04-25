
#|  this needs to be rewritten to use the low_level "shell_out“ component, this can be done solely as a diagram without using python code here |# #|line 1|#
(defun shell_out_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 2|#
  (let ((name_with_id (funcall (quote gensymbol)   "shell_out"  #|line 3|#)))
    (declare (ignorable name_with_id))
    (let ((cmd (split-sequence '(#\space)  template_data)   #|line 4|#))
      (declare (ignorable cmd))
      (return-from shell_out_instantiate (funcall (quote make_leaf)   name_with_id  owner  cmd  #'shell_out_handler  #|line 5|#)))) #|line 6|#
  )
(defun shell_out_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 8|#
  (let ((cmd (slot-value  eh 'instance_data)))
    (declare (ignorable cmd))                               #|line 9|#
    (let ((s (slot-value (slot-value  msg 'datum) 'v)))
      (declare (ignorable s))                               #|line 10|#
      (let (( ret  nil))
        (declare (ignorable  ret))                          #|line 11|#
        (let (( rc  nil))
          (declare (ignorable  rc))                         #|line 12|#
          (let (( stdout  nil))
            (declare (ignorable  stdout))                   #|line 13|#
            (let (( stderr  nil))
              (declare (ignorable  stderr))                 #|line 14|#
              (multiple-value-setq (stdout stderr rc) (uiop::run-program (concatenate 'string  cmd " "  s) :output :string :error :string)) #|line 15|#
              (cond
                (( equal    rc  0)                          #|line 16|#
                  (funcall (quote send)   eh  ""  (concatenate 'string  stdout  stderr)  msg  #|line 17|#)
                  )
                (t                                          #|line 18|#
                  (funcall (quote send)   eh  "✗"  (concatenate 'string  stdout  stderr)  msg  #|line 19|#) #|line 20|#
                  ))))))))                                  #|line 21|#
  )
(defun generate_shell_components (&optional  reg  container_list)
  (declare (ignorable  reg  container_list))                #|line 23|#
  #|  [ |#                                                  #|line 24|#
  #|      {;file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, |# #|line 25|#
  #|      {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []} |# #|line 26|#
  #|  ] |#                                                  #|line 27|#
  (cond
    ((not (equal   nil  container_list))                    #|line 28|#
      (loop for diagram in  container_list
        do
          (progn
            diagram                                         #|line 29|#
            #|  loop through every component in the diagram and look for names that start with “$“ or “'“  |# #|line 30|#
            #|  {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, |# #|line 31|#
            (loop for child_descriptor in (gethash  "children"  diagram)
              do
                (progn
                  child_descriptor                          #|line 32|#
                  (cond
                    ((funcall (quote first_char_is)  (gethash  "name"  child_descriptor)  "$" ) #|line 33|#
                      (let ((name (gethash  "name"  child_descriptor)))
                        (declare (ignorable name))          #|line 34|#
                        (let ((cmd (funcall (slot-value  (subseq  name 1) 'strip) )))
                          (declare (ignorable cmd))         #|line 35|#
                          (let ((generated_leaf (funcall (quote mkTemplate)   name  cmd  #'shell_out_instantiate  #|line 36|#)))
                            (declare (ignorable generated_leaf))
                            (funcall (quote register_component)   reg  generated_leaf  #|line 37|#))))
                      )
                    ((funcall (quote first_char_is)  (gethash  "name"  child_descriptor)  "'" ) #|line 38|#
                      (let ((name (gethash  "name"  child_descriptor)))
                        (declare (ignorable name))          #|line 39|#
                        (let ((s  (subseq  name 1)          #|line 40|#))
                          (declare (ignorable s))
                          (let ((generated_leaf (funcall (quote mkTemplate)   name  s  #'string_constant_instantiate  #|line 41|#)))
                            (declare (ignorable generated_leaf))
                            (funcall (quote register_component_allow_overwriting)   reg  generated_leaf  #|line 42|#)))) #|line 43|#
                      ))                                    #|line 44|#
                  ))                                        #|line 45|#
            ))                                              #|line 46|#
      ))
  (return-from generate_shell_components  reg)              #|line 47|# #|line 48|#
  )
(defun first_char (&optional  s)
  (declare (ignorable  s))                                  #|line 50|#
  (return-from first_char  (string (char  s 0))             #|line 51|#) #|line 52|#
  )
(defun first_char_is (&optional  s  c)
  (declare (ignorable  s  c))                               #|line 54|#
  (return-from first_char_is ( equal    c (funcall (quote first_char)   s  #|line 55|#))) #|line 56|#
  )                                                         #|line 58|# #|  TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here |# #|line 59|# #|  I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped |# #|line 60|# #|line 61|#