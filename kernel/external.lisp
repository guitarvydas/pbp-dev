(defun external_instantiate (&optional  reg  owner  name  arg)
  (declare (ignorable  reg  owner  name  arg))              #|line 1|#
  (let ((name_with_id (funcall (quote gensymbol)   name     #|line 2|#)))
    (declare (ignorable name_with_id))
    (return-from external_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  arg  #'handle_external  #|line 3|#))) #|line 4|#
  )
(defun generate_external_components (&optional  reg  container_list)
  (declare (ignorable  reg  container_list))                #|line 6|#
  #|  nothing to do here, anymore - get_component_instance doesn;t need a template for ":..." Parts  |# #|line 7|#
  (return-from generate_external_components  reg)           #|line 8|# #|line 9|#
  )
