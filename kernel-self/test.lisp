
#|line 1|#
(defun trash_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 2|#
  (let ((name_with_id (funcall (quote gensymbol)   "trash"  #|line 3|#)))
    (declare (ignorable name_with_id))
    (return-from trash_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'trash_handler  #|line 4|#))) #|line 5|#
  )
(defun trash_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 7|#
  #|  to appease dumped_on_floor checker |#                 #|line 8|#
  #| pass |#                                                #|line 9|# #|line 10|#
  )