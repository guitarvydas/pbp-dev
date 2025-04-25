
                                                            #|line 1|# #|line 2|# #|line 3|#
(defclass Component_Registry ()                             #|line 4|#
  (
    (templates :accessor templates :initarg :templates :initform  (dict-fresh))  #|line 5|#)) #|line 6|#

                                                            #|line 7|#
(defclass Template ()                                       #|line 8|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 9|#
    (template_data :accessor template_data :initarg :template_data :initform  nil)  #|line 10|#
    (instantiator :accessor instantiator :initarg :instantiator :initform  nil)  #|line 11|#)) #|line 12|#

                                                            #|line 13|#
(defun mkTemplate (&optional  name  template_data  instantiator)
  (declare (ignorable  name  template_data  instantiator))  #|line 14|#
  (let (( templ  (make-instance 'Template)                  #|line 15|#))
    (declare (ignorable  templ))
    (setf (slot-value  templ 'name)  name)                  #|line 16|#
    (setf (slot-value  templ 'template_data)  template_data) #|line 17|#
    (setf (slot-value  templ 'instantiator)  instantiator)  #|line 18|#
    (return-from mkTemplate  templ)                         #|line 19|#) #|line 20|#
  )
(defun read_and_convert_json_file (&optional  pathname  filename)
  (declare (ignorable  pathname  filename))                 #|line 22|#

  ;; read json from a named file and convert it into internal form (a list of Container alists)
  (with-open-file (f (format nil "~a/~a.lisp" pathname filename) :direction :input)
    (deep-expand (read f)))
                                                            #|line 23|# #|line 24|#
  )
(defun json2internal (&optional  pathname  container_xml)
  (declare (ignorable  pathname  container_xml))            #|line 26|#
  (let ((fname  container_xml                               #|line 27|#))
    (declare (ignorable fname))
    (let ((routings (funcall (quote read_and_convert_json_file)   pathname  fname  #|line 28|#)))
      (declare (ignorable routings))
      (return-from json2internal  routings)                 #|line 29|#)) #|line 30|#
  )
(defun delete_decls (&optional  d)
  (declare (ignorable  d))                                  #|line 32|#
  #| pass |#                                                #|line 33|# #|line 34|#
  )
(defun make_component_registry (&optional )
  (declare (ignorable ))                                    #|line 36|#
  (return-from make_component_registry  (make-instance 'Component_Registry) #|line 37|#) #|line 38|#
  )
(defun register_component (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component (funcall (quote abstracted_register_component)   reg  template  nil )) #|line 40|#
  )
(defun register_component_allow_overwriting (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component_allow_overwriting (funcall (quote abstracted_register_component)   reg  template  t )) #|line 41|#
  )
(defun abstracted_register_component (&optional  reg  template  ok_to_overwrite)
  (declare (ignorable  reg  template  ok_to_overwrite))     #|line 43|#
  (let ((name (funcall (quote mangle_name)  (slot-value  template 'name)  #|line 44|#)))
    (declare (ignorable name))
    (cond
      (( and  ( dict-in?  ( and  (not (equal   reg  nil))  name) (slot-value  reg 'templates)) (not  ok_to_overwrite)) #|line 45|#
        (funcall (quote load_error)   (concatenate 'string  "Component /"  (concatenate 'string (slot-value  template 'name)  "/ already declared"))  #|line 46|#)
        (return-from abstracted_register_component  reg)    #|line 47|#
        )
      (t                                                    #|line 48|#
        (setf (gethash name (slot-value  reg 'templates))  template) #|line 49|#
        (return-from abstracted_register_component  reg)    #|line 50|# #|line 51|#
        )))                                                 #|line 52|#
  )
(defun get_component_instance (&optional  reg  full_name  owner)
  (declare (ignorable  reg  full_name  owner))              #|line 54|#
  (let ((template_name (funcall (quote mangle_name)   full_name  #|line 55|#)))
    (declare (ignorable template_name))
    (cond
      (( dict-in?   template_name (slot-value  reg 'templates)) #|line 56|#
        (let ((template (gethash template_name (slot-value  reg 'templates))))
          (declare (ignorable template))                    #|line 57|#
          (cond
            (( equal    template  nil)                      #|line 58|#
              (funcall (quote load_error)   (concatenate 'string  "Registry Error (A): Can;t find component /"  (concatenate 'string  template_name  "/"))  #|line 59|#)
              (return-from get_component_instance  nil)     #|line 60|#
              )
            (t                                              #|line 61|#
              (let ((owner_name  ""))
                (declare (ignorable owner_name))            #|line 62|#
                (let ((instance_name  template_name))
                  (declare (ignorable instance_name))       #|line 63|#
                  (cond
                    ((not (equal   nil  owner))             #|line 64|#
                      (setf  owner_name (slot-value  owner 'name)) #|line 65|#
                      (setf  instance_name  (concatenate 'string  owner_name  (concatenate 'string  "."  template_name)) #|line 66|#)
                      )
                    (t                                      #|line 67|#
                      (setf  instance_name  template_name)  #|line 68|# #|line 69|#
                      ))
                  (let ((instance (funcall (slot-value  template 'instantiator)   reg  owner  instance_name (slot-value  template 'template_data)  #|line 70|#)))
                    (declare (ignorable instance))
                    (return-from get_component_instance  instance) #|line 71|#))) #|line 72|#
              )))
        )
      (t                                                    #|line 73|#
        (funcall (quote load_error)   (concatenate 'string  "Registry Error (B): Can't find component /"  (concatenate 'string  template_name  "/"))  #|line 74|#)
        (return-from get_component_instance  nil)           #|line 75|# #|line 76|#
        )))                                                 #|line 77|#
  )
(defun dump_registry (&optional  reg)
  (declare (ignorable  reg))                                #|line 79|#
  (funcall (quote nl) )                                     #|line 80|#
  (format *standard-output* "~a~%"  "*** PALETTE ***")      #|line 81|#
  (loop for c in (slot-value  reg 'templates)
    do
      (progn
        c                                                   #|line 82|#
        (funcall (quote print)  (slot-value  c 'name) )     #|line 83|#
        ))
  (format *standard-output* "~a~%"  "***************")      #|line 84|#
  (funcall (quote nl) )                                     #|line 85|# #|line 86|#
  )
(defun print_stats (&optional  reg)
  (declare (ignorable  reg))                                #|line 88|#
  (format *standard-output* "~a~%"  (concatenate 'string  "registry statistics: " (slot-value  reg 'stats))) #|line 89|# #|line 90|#
  )
(defun mangle_name (&optional  s)
  (declare (ignorable  s))                                  #|line 92|#
  #|  trim name to remove code from Container component names _ deferred until later (or never) |# #|line 93|#
  (return-from mangle_name  s)                              #|line 94|# #|line 95|#
  )
(defun generate_shell_components (&optional  reg  container_list)
  (declare (ignorable  reg  container_list))                #|line 97|#
  #|  [ |#                                                  #|line 98|#
  #|      {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, |# #|line 99|#
  #|      {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []} |# #|line 100|#
  #|  ] |#                                                  #|line 101|#
  (cond
    ((not (equal   nil  container_list))                    #|line 102|#
      (loop for diagram in  container_list
        do
          (progn
            diagram                                         #|line 103|#
            #|  loop through every component in the diagram and look for names that start with “$“ or “'“  |# #|line 104|#
            #|  {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, |# #|line 105|#
            (loop for child_descriptor in (gethash  "children"  diagram)
              do
                (progn
                  child_descriptor                          #|line 106|#
                  (cond
                    ((funcall (quote first_char_is)  (gethash  "name"  child_descriptor)  "$" ) #|line 107|#
                      (let ((name (gethash  "name"  child_descriptor)))
                        (declare (ignorable name))          #|line 108|#
                        (let ((cmd (funcall (slot-value  (subseq  name 1) 'strip) )))
                          (declare (ignorable cmd))         #|line 109|#
                          (let ((generated_leaf (funcall (quote mkTemplate)   name  cmd  #'shell_out_instantiate  #|line 110|#)))
                            (declare (ignorable generated_leaf))
                            (funcall (quote register_component)   reg  generated_leaf  #|line 111|#))))
                      )
                    ((funcall (quote first_char_is)  (gethash  "name"  child_descriptor)  "'" ) #|line 112|#
                      (let ((name (gethash  "name"  child_descriptor)))
                        (declare (ignorable name))          #|line 113|#
                        (let ((s  (subseq  name 1)          #|line 114|#))
                          (declare (ignorable s))
                          (let ((generated_leaf (funcall (quote mkTemplate)   name  s  #'string_constant_instantiate  #|line 115|#)))
                            (declare (ignorable generated_leaf))
                            (funcall (quote register_component_allow_overwriting)   reg  generated_leaf  #|line 116|#)))) #|line 117|#
                      ))                                    #|line 118|#
                  ))                                        #|line 119|#
            ))                                              #|line 120|#
      ))
  (return-from generate_shell_components  reg)              #|line 121|# #|line 122|#
  )
(defun first_char (&optional  s)
  (declare (ignorable  s))                                  #|line 124|#
  (return-from first_char  (char  s 0)                      #|line 125|#) #|line 126|#
  )
(defun first_char_is (&optional  s  c)
  (declare (ignorable  s  c))                               #|line 128|#
  (return-from first_char_is ( equal    c (funcall (quote first_char)   s  #|line 129|#))) #|line 130|#
  )                                                         #|line 132|# #|  TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here |# #|line 133|# #|  I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped |# #|line 134|# #|line 135|# #|line 136|# #|  Data for an asyncronous component _ effectively, a function with input |# #|line 137|# #|  and output queues of messages. |# #|line 138|# #|  |# #|line 139|# #|  Components can either be a user_supplied function (“lea“), or a “container“ |# #|line 140|# #|  that routes messages to child components according to a list of connections |# #|line 141|# #|  that serve as a message routing table. |# #|line 142|# #|  |# #|line 143|# #|  Child components themselves can be leaves or other containers. |# #|line 144|# #|  |# #|line 145|# #|  `handler` invokes the code that is attached to this component. |# #|line 146|# #|  |# #|line 147|# #|  `instance_data` is a pointer to instance data that the `leaf_handler` |# #|line 148|# #|  function may want whenever it is invoked again. |# #|line 149|# #|  |# #|line 150|# #|line 151|# #|  Eh_States :: enum { idle, active } |# #|line 152|#
(defclass Eh ()                                             #|line 153|#
  (
    (name :accessor name :initarg :name :initform  "")      #|line 154|#
    (inq :accessor inq :initarg :inq :initform  (make-instance 'Queue) #|line 155|#)
    (outq :accessor outq :initarg :outq :initform  (make-instance 'Queue) #|line 156|#)
    (owner :accessor owner :initarg :owner :initform  nil)  #|line 157|#
    (children :accessor children :initarg :children :initform  nil)  #|line 158|#
    (visit_ordering :accessor visit_ordering :initarg :visit_ordering :initform  (make-instance 'Queue) #|line 159|#)
    (connections :accessor connections :initarg :connections :initform  nil)  #|line 160|#
    (routings :accessor routings :initarg :routings :initform  (make-instance 'Queue) #|line 161|#)
    (handler :accessor handler :initarg :handler :initform  nil)  #|line 162|#
    (finject :accessor finject :initarg :finject :initform  nil)  #|line 163|#
    (instance_data :accessor instance_data :initarg :instance_data :initform  nil)  #|line 164|#
    (state :accessor state :initarg :state :initform  "idle")  #|line 165|# #|  bootstrap debugging |# #|line 166|#
    (kind :accessor kind :initarg :kind :initform  nil)  #|  enum { container, leaf, } |# #|line 167|#)) #|line 168|#

                                                            #|line 169|# #|  Creates a component that acts as a container. It is the same as a `Eh` instance |# #|line 170|# #|  whose handler function is `container_handler`. |# #|line 171|#
(defun make_container (&optional  name  owner)
  (declare (ignorable  name  owner))                        #|line 172|#
  (let (( eh  (make-instance 'Eh)                           #|line 173|#))
    (declare (ignorable  eh))
    (setf (slot-value  eh 'name)  name)                     #|line 174|#
    (setf (slot-value  eh 'owner)  owner)                   #|line 175|#
    (setf (slot-value  eh 'handler)  #'container_handler)   #|line 176|#
    (setf (slot-value  eh 'finject)  #'container_injector)  #|line 177|#
    (setf (slot-value  eh 'state)  "idle")                  #|line 178|#
    (setf (slot-value  eh 'kind)  "container")              #|line 179|#
    (return-from make_container  eh)                        #|line 180|#) #|line 181|#
  ) #|  Creates a new leaf component out of a handler function, and a data parameter |# #|line 183|# #|  that will be passed back to your handler when called. |# #|line 184|# #|line 185|#
(defun make_leaf (&optional  name  owner  instance_data  handler)
  (declare (ignorable  name  owner  instance_data  handler)) #|line 186|#
  (let (( eh  (make-instance 'Eh)                           #|line 187|#))
    (declare (ignorable  eh))
    (setf (slot-value  eh 'name)  (concatenate 'string (slot-value  owner 'name)  (concatenate 'string  "."  name)) #|line 188|#)
    (setf (slot-value  eh 'owner)  owner)                   #|line 189|#
    (setf (slot-value  eh 'handler)  handler)               #|line 190|#
    (setf (slot-value  eh 'instance_data)  instance_data)   #|line 191|#
    (setf (slot-value  eh 'state)  "idle")                  #|line 192|#
    (setf (slot-value  eh 'kind)  "leaf")                   #|line 193|#
    (return-from make_leaf  eh)                             #|line 194|#) #|line 195|#
  ) #|  Sends a message on the given `port` with `data`, placing it on the output |# #|line 197|# #|  of the given component. |# #|line 198|# #|line 199|#
(defun send (&optional  eh  port  datum  causingMessage)
  (declare (ignorable  eh  port  datum  causingMessage))    #|line 200|#
  (let ((msg (funcall (quote make_message)   port  datum    #|line 201|#)))
    (declare (ignorable msg))
    (funcall (quote put_output)   eh  msg                   #|line 202|#)) #|line 203|#
  )
(defun send_string (&optional  eh  port  s  causingMessage)
  (declare (ignorable  eh  port  s  causingMessage))        #|line 205|#
  (let ((datum (funcall (quote new_datum_string)   s        #|line 206|#)))
    (declare (ignorable datum))
    (let ((msg (funcall (quote make_message)   port  datum  #|line 207|#)))
      (declare (ignorable msg))
      (funcall (quote put_output)   eh  msg                 #|line 208|#))) #|line 209|#
  )
(defun forward (&optional  eh  port  msg)
  (declare (ignorable  eh  port  msg))                      #|line 211|#
  (let ((fwdmsg (funcall (quote make_message)   port (slot-value  msg 'datum)  #|line 212|#)))
    (declare (ignorable fwdmsg))
    (funcall (quote put_output)   eh  fwdmsg                #|line 213|#)) #|line 214|#
  )
(defun inject (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 216|#
  (funcall (slot-value  eh 'finject)   eh  msg              #|line 217|#) #|line 218|#
  ) #|  Returns a list of all output messages on a container. |# #|line 220|# #|  For testing / debugging purposes. |# #|line 221|# #|line 222|#
(defun output_list (&optional  eh)
  (declare (ignorable  eh))                                 #|line 223|#
  (return-from output_list (slot-value  eh 'outq))          #|line 224|# #|line 225|#
  ) #|  Utility for printing an array of messages. |#       #|line 227|#
(defun print_output_list (&optional  eh)
  (declare (ignorable  eh))                                 #|line 228|#
  (format *standard-output* "~a~%"  "{")                    #|line 229|#
  (loop for m in (queue2list (slot-value  eh 'outq))
    do
      (progn
        m                                                   #|line 230|#
        (format *standard-output* "~a~%" (funcall (quote format_message)   m )) #|line 231|# #|line 232|#
        ))
  (format *standard-output* "~a~%"  "}")                    #|line 233|# #|line 234|#
  )
(defun spaces (&optional  n)
  (declare (ignorable  n))                                  #|line 236|#
  (let (( s  ""))
    (declare (ignorable  s))                                #|line 237|#
    (loop for i in (loop for n from 0 below  n by 1 collect n)
      do
        (progn
          i                                                 #|line 238|#
          (setf  s (+  s  " "))                             #|line 239|#
          ))
    (return-from spaces  s)                                 #|line 240|#) #|line 241|#
  )
(defun set_active (&optional  eh)
  (declare (ignorable  eh))                                 #|line 243|#
  (setf (slot-value  eh 'state)  "active")                  #|line 244|# #|line 245|#
  )
(defun set_idle (&optional  eh)
  (declare (ignorable  eh))                                 #|line 247|#
  (setf (slot-value  eh 'state)  "idle")                    #|line 248|# #|line 249|#
  ) #|  Utility for printing a specific output message. |#  #|line 251|# #|line 252|#
(defun fetch_first_output (&optional  eh  port)
  (declare (ignorable  eh  port))                           #|line 253|#
  (loop for msg in (queue2list (slot-value  eh 'outq))
    do
      (progn
        msg                                                 #|line 254|#
        (cond
          (( equal   (slot-value  msg 'port)  port)         #|line 255|#
            (return-from fetch_first_output (slot-value  msg 'datum))
            ))                                              #|line 256|#
        ))
  (return-from fetch_first_output  nil)                     #|line 257|# #|line 258|#
  )
(defun print_specific_output (&optional  eh  port)
  (declare (ignorable  eh  port))                           #|line 260|#
  #|  port ∷ “” |#                                          #|line 261|#
  (let (( datum (funcall (quote fetch_first_output)   eh  port  #|line 262|#)))
    (declare (ignorable  datum))
    (format *standard-output* "~a~%" (slot-value  datum 'v)) #|line 263|#) #|line 264|#
  )
(defun print_specific_output_to_stderr (&optional  eh  port)
  (declare (ignorable  eh  port))                           #|line 265|#
  #|  port ∷ “” |#                                          #|line 266|#
  (let (( datum (funcall (quote fetch_first_output)   eh  port  #|line 267|#)))
    (declare (ignorable  datum))
    #|  I don't remember why I found it useful to print to stderr during bootstrapping, so I've left it in... |# #|line 268|#
    (format *error-output* "~a~%" (slot-value  datum 'v))   #|line 269|#) #|line 270|#
  )
(defun put_output (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 272|#
  (enqueue (slot-value  eh 'outq)  msg)                     #|line 273|# #|line 274|#
  )
(defparameter  root_project  "")                            #|line 276|#
(defparameter  root_0D  "")                                 #|line 277|# #|line 278|#
(defun set_environment (&optional  rproject  r0D)
  (declare (ignorable  rproject  r0D))                      #|line 279|# #|line 280|# #|line 281|#
  (setf  root_project  rproject)                            #|line 282|#
  (setf  root_0D  r0D)                                      #|line 283|# #|line 284|#
  )
(defun probeA_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 286|#
  (let ((name_with_id (funcall (quote gensymbol)   "?A"     #|line 287|#)))
    (declare (ignorable name_with_id))
    (return-from probeA_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'probe_handler  #|line 288|#))) #|line 289|#
  )
(defun probeB_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 291|#
  (let ((name_with_id (funcall (quote gensymbol)   "?B"     #|line 292|#)))
    (declare (ignorable name_with_id))
    (return-from probeB_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'probe_handler  #|line 293|#))) #|line 294|#
  )
(defun probeC_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 296|#
  (let ((name_with_id (funcall (quote gensymbol)   "?C"     #|line 297|#)))
    (declare (ignorable name_with_id))
    (return-from probeC_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'probe_handler  #|line 298|#))) #|line 299|#
  )
(defun probe_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 301|#
  (let ((s (slot-value (slot-value  msg 'datum) 'v)))
    (declare (ignorable s))                                 #|line 302|#
    (format *error-output* "~a~%"  (concatenate 'string  "... probe "  (concatenate 'string (slot-value  eh 'name)  (concatenate 'string  ": "  s)))) #|line 303|#) #|line 304|#
  )
(defun trash_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 306|#
  (let ((name_with_id (funcall (quote gensymbol)   "trash"  #|line 307|#)))
    (declare (ignorable name_with_id))
    (return-from trash_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'trash_handler  #|line 308|#))) #|line 309|#
  )
(defun trash_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 311|#
  #|  to appease dumped_on_floor checker |#                 #|line 312|#
  #| pass |#                                                #|line 313|# #|line 314|#
  )
(defclass TwoMessages ()                                    #|line 315|#
  (
    (firstmsg :accessor firstmsg :initarg :firstmsg :initform  nil)  #|line 316|#
    (secondmsg :accessor secondmsg :initarg :secondmsg :initform  nil)  #|line 317|#)) #|line 318|#

                                                            #|line 319|# #|  Deracer_States :: enum { idle, waitingForFirstmsg, waitingForSecondmsg } |# #|line 320|#
(defclass Deracer_Instance_Data ()                          #|line 321|#
  (
    (state :accessor state :initarg :state :initform  nil)  #|line 322|#
    (buffer :accessor buffer :initarg :buffer :initform  nil)  #|line 323|#)) #|line 324|#

                                                            #|line 325|#
(defun reclaim_Buffers_from_heap (&optional  inst)
  (declare (ignorable  inst))                               #|line 326|#
  #| pass |#                                                #|line 327|# #|line 328|#
  )
(defun deracer_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 330|#
  (let ((name_with_id (funcall (quote gensymbol)   "deracer"  #|line 331|#)))
    (declare (ignorable name_with_id))
    (let (( inst  (make-instance 'Deracer_Instance_Data)    #|line 332|#))
      (declare (ignorable  inst))
      (setf (slot-value  inst 'state)  "idle")              #|line 333|#
      (setf (slot-value  inst 'buffer)  (make-instance 'TwoMessages) #|line 334|#)
      (let ((eh (funcall (quote make_leaf)   name_with_id  owner  inst  #'deracer_handler  #|line 335|#)))
        (declare (ignorable eh))
        (return-from deracer_instantiate  eh)               #|line 336|#))) #|line 337|#
  )
(defun send_firstmsg_then_secondmsg (&optional  eh  inst)
  (declare (ignorable  eh  inst))                           #|line 339|#
  (funcall (quote forward)   eh  "1" (slot-value (slot-value  inst 'buffer) 'firstmsg)  #|line 340|#)
  (funcall (quote forward)   eh  "2" (slot-value (slot-value  inst 'buffer) 'secondmsg)  #|line 341|#)
  (funcall (quote reclaim_Buffers_from_heap)   inst         #|line 342|#) #|line 343|#
  )
(defun deracer_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 345|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 346|#
    (cond
      (( equal   (slot-value  inst 'state)  "idle")         #|line 347|#
        (cond
          (( equal    "1" (slot-value  msg 'port))          #|line 348|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmsg)  msg) #|line 349|#
            (setf (slot-value  inst 'state)  "waitingForSecondmsg") #|line 350|#
            )
          (( equal    "2" (slot-value  msg 'port))          #|line 351|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmsg)  msg) #|line 352|#
            (setf (slot-value  inst 'state)  "waitingForFirstmsg") #|line 353|#
            )
          (t                                                #|line 354|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad msg.port (case A) for deracer " (slot-value  msg 'port))  #|line 355|#) #|line 356|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForFirstmsg") #|line 357|#
        (cond
          (( equal    "1" (slot-value  msg 'port))          #|line 358|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmsg)  msg) #|line 359|#
            (funcall (quote send_firstmsg_then_secondmsg)   eh  inst  #|line 360|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 361|#
            )
          (t                                                #|line 362|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad msg.port (case B) for deracer " (slot-value  msg 'port))  #|line 363|#) #|line 364|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForSecondmsg") #|line 365|#
        (cond
          (( equal    "2" (slot-value  msg 'port))          #|line 366|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmsg)  msg) #|line 367|#
            (funcall (quote send_firstmsg_then_secondmsg)   eh  inst  #|line 368|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 369|#
            )
          (t                                                #|line 370|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad msg.port (case C) for deracer " (slot-value  msg 'port))  #|line 371|#) #|line 372|#
            ))
        )
      (t                                                    #|line 373|#
        (funcall (quote runtime_error)   "bad state for deracer {eh.state}"  #|line 374|#) #|line 375|#
        )))                                                 #|line 376|#
  )
(defun low_level_read_text_file_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 378|#
  (let ((name_with_id (funcall (quote gensymbol)   "Low Level Read Text File"  #|line 379|#)))
    (declare (ignorable name_with_id))
    (return-from low_level_read_text_file_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'low_level_read_text_file_handler  #|line 380|#))) #|line 381|#
  )
(defun low_level_read_text_file_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 383|#
  (let ((fname (slot-value (slot-value  msg 'datum) 'v)))
    (declare (ignorable fname))                             #|line 384|#

    ;; read text from a named file fname, send the text out on port "" else send error info on port "✗"
    ;; given eh and msg if needed
    (handler-bind ((error #'(lambda (condition) (send_string eh "✗" (format nil "~&~A~&" condition)))))
      (with-open-file (stream fname)
        (let ((contents (make-string (file-length stream))))
          (read-sequence contents stream)
          (send_string eh "" contents))))
                                                            #|line 385|#) #|line 386|#
  )
(defun ensure_string_datum_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 388|#
  (let ((name_with_id (funcall (quote gensymbol)   "Ensure String Datum"  #|line 389|#)))
    (declare (ignorable name_with_id))
    (return-from ensure_string_datum_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'ensure_string_datum_handler  #|line 390|#))) #|line 391|#
  )
(defun ensure_string_datum_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 393|#
  (cond
    (( equal    "string" (funcall (slot-value (slot-value  msg 'datum) 'kind) )) #|line 394|#
      (funcall (quote forward)   eh  ""  msg                #|line 395|#)
      )
    (t                                                      #|line 396|#
      (let ((emsg  (concatenate 'string  "*** ensure: type error (expected a string datum) but got " (slot-value  msg 'datum)) #|line 397|#))
        (declare (ignorable emsg))
        (funcall (quote send_string)   eh  "✗"  emsg  msg   #|line 398|#)) #|line 399|#
      ))                                                    #|line 400|#
  )
(defclass Syncfilewrite_Data ()                             #|line 402|#
  (
    (filename :accessor filename :initarg :filename :initform  "")  #|line 403|#)) #|line 404|#

                                                            #|line 405|# #|  temp copy for bootstrap, sends “done“ (error during bootstrap if not wired) |# #|line 406|#
(defun syncfilewrite_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 407|#
  (let ((name_with_id (funcall (quote gensymbol)   "syncfilewrite"  #|line 408|#)))
    (declare (ignorable name_with_id))
    (let ((inst  (make-instance 'Syncfilewrite_Data)        #|line 409|#))
      (declare (ignorable inst))
      (return-from syncfilewrite_instantiate (funcall (quote make_leaf)   name_with_id  owner  inst  #'syncfilewrite_handler  #|line 410|#)))) #|line 411|#
  )
(defun syncfilewrite_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 413|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 414|#
    (cond
      (( equal    "filename" (slot-value  msg 'port))       #|line 415|#
        (setf (slot-value  inst 'filename) (slot-value (slot-value  msg 'datum) 'v)) #|line 416|#
        )
      (( equal    "input" (slot-value  msg 'port))          #|line 417|#
        (let ((contents (slot-value (slot-value  msg 'datum) 'v)))
          (declare (ignorable contents))                    #|line 418|#
          (let (( f (funcall (quote open)  (slot-value  inst 'filename)  "w"  #|line 419|#)))
            (declare (ignorable  f))
            (cond
              ((not (equal   f  nil))                       #|line 420|#
                (funcall (slot-value  f 'write)  (slot-value (slot-value  msg 'datum) 'v)  #|line 421|#)
                (funcall (slot-value  f 'close) )           #|line 422|#
                (funcall (quote send)   eh  "done" (funcall (quote new_datum_bang) )  msg  #|line 423|#)
                )
              (t                                            #|line 424|#
                (funcall (quote send_string)   eh  "✗"  (concatenate 'string  "open error on file " (slot-value  inst 'filename))  msg  #|line 425|#) #|line 426|#
                ))))                                        #|line 427|#
        )))                                                 #|line 428|#
  )
(defclass StringConcat_Instance_Data ()                     #|line 430|#
  (
    (buffer1 :accessor buffer1 :initarg :buffer1 :initform  nil)  #|line 431|#
    (buffer2 :accessor buffer2 :initarg :buffer2 :initform  nil)  #|line 432|#
    (scount :accessor scount :initarg :scount :initform  0)  #|line 433|#)) #|line 434|#

                                                            #|line 435|#
(defun stringconcat_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 436|#
  (let ((name_with_id (funcall (quote gensymbol)   "stringconcat"  #|line 437|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringConcat_Instance_Data) #|line 438|#))
      (declare (ignorable instp))
      (return-from stringconcat_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'stringconcat_handler  #|line 439|#)))) #|line 440|#
  )
(defun stringconcat_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 442|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 443|#
    (cond
      (( equal    "1" (slot-value  msg 'port))              #|line 444|#
        (setf (slot-value  inst 'buffer1) (funcall (quote clone_string)  (slot-value (slot-value  msg 'datum) 'v)  #|line 445|#))
        (setf (slot-value  inst 'scount) (+ (slot-value  inst 'scount)  1)) #|line 446|#
        (funcall (quote maybe_stringconcat)   eh  inst  msg  #|line 447|#)
        )
      (( equal    "2" (slot-value  msg 'port))              #|line 448|#
        (setf (slot-value  inst 'buffer2) (funcall (quote clone_string)  (slot-value (slot-value  msg 'datum) 'v)  #|line 449|#))
        (setf (slot-value  inst 'scount) (+ (slot-value  inst 'scount)  1)) #|line 450|#
        (funcall (quote maybe_stringconcat)   eh  inst  msg  #|line 451|#)
        )
      (t                                                    #|line 452|#
        (funcall (quote runtime_error)   (concatenate 'string  "bad msg.port for stringconcat: " (slot-value  msg 'port))  #|line 453|#) #|line 454|#
        )))                                                 #|line 455|#
  )
(defun maybe_stringconcat (&optional  eh  inst  msg)
  (declare (ignorable  eh  inst  msg))                      #|line 457|#
  (cond
    (( >=  (slot-value  inst 'scount)  2)                   #|line 458|#
      (cond
        (( and  ( equal    0 (length (slot-value  inst 'buffer1))) ( equal    0 (length (slot-value  inst 'buffer2)))) #|line 459|#
          (funcall (quote runtime_error)   "something is wrong in stringconcat, both strings are 0 length"  #|line 460|#)
          )
        (t                                                  #|line 461|#
          (let (( concatenated_string  ""))
            (declare (ignorable  concatenated_string))      #|line 462|#
            (cond
              (( equal    0 (length (slot-value  inst 'buffer1))) #|line 463|#
                (setf  concatenated_string (slot-value  inst 'buffer2)) #|line 464|#
                )
              (( equal    0 (length (slot-value  inst 'buffer2))) #|line 465|#
                (setf  concatenated_string (slot-value  inst 'buffer1)) #|line 466|#
                )
              (t                                            #|line 467|#
                (setf  concatenated_string (+ (slot-value  inst 'buffer1) (slot-value  inst 'buffer2))) #|line 468|# #|line 469|#
                ))
            (funcall (quote send_string)   eh  ""  concatenated_string  msg  #|line 470|#)
            (setf (slot-value  inst 'buffer1)  nil)         #|line 471|#
            (setf (slot-value  inst 'buffer2)  nil)         #|line 472|#
            (setf (slot-value  inst 'scount)  0)            #|line 473|#) #|line 474|#
          ))                                                #|line 475|#
      ))                                                    #|line 476|#
  ) #|  |#                                                  #|line 478|# #|line 479|# #|  this needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here |# #|line 480|#
(defun shell_out_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 481|#
  (let ((name_with_id (funcall (quote gensymbol)   "shell_out"  #|line 482|#)))
    (declare (ignorable name_with_id))
    (let ((cmd (split-sequence '(#\space)  template_data)   #|line 483|#))
      (declare (ignorable cmd))
      (return-from shell_out_instantiate (funcall (quote make_leaf)   name_with_id  owner  cmd  #'shell_out_handler  #|line 484|#)))) #|line 485|#
  )
(defun shell_out_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 487|#
  (let ((cmd (slot-value  eh 'instance_data)))
    (declare (ignorable cmd))                               #|line 488|#
    (let ((s (slot-value (slot-value  msg 'datum) 'v)))
      (declare (ignorable s))                               #|line 489|#
      (let (( ret  nil))
        (declare (ignorable  ret))                          #|line 490|#
        (let (( rc  nil))
          (declare (ignorable  rc))                         #|line 491|#
          (let (( stdout  nil))
            (declare (ignorable  stdout))                   #|line 492|#
            (let (( stderr  nil))
              (declare (ignorable  stderr))                 #|line 493|#
              (multiple-value-setq (stdout stderr rc) (uiop::run-program (concatenate 'string  cmd " "  s) :output :string :error :string)) #|line 494|#
              (cond
                ((not (equal   rc  0))                      #|line 495|#
                  (funcall (quote send_string)   eh  "✗"  stderr  msg  #|line 496|#)
                  )
                (t                                          #|line 497|#
                  (funcall (quote send_string)   eh  ""  stdout  msg  #|line 498|#) #|line 499|#
                  ))))))))                                  #|line 500|#
  )
(defun string_constant_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 502|# #|line 503|# #|line 504|#
  (let ((name_with_id (funcall (quote gensymbol)   "strconst"  #|line 505|#)))
    (declare (ignorable name_with_id))
    (let (( s  template_data))
      (declare (ignorable  s))                              #|line 506|#
      (cond
        ((not (equal   root_project  ""))                   #|line 507|#
          (setf  s (substitute  "_00_"  root_project  s)    #|line 508|#) #|line 509|#
          ))
      (cond
        ((not (equal   root_0D  ""))                        #|line 510|#
          (setf  s (substitute  "_0D_"  root_0D  s)         #|line 511|#) #|line 512|#
          ))
      (return-from string_constant_instantiate (funcall (quote make_leaf)   name_with_id  owner  s  #'string_constant_handler  #|line 513|#)))) #|line 514|#
  )
(defun string_constant_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 516|#
  (let ((s (slot-value  eh 'instance_data)))
    (declare (ignorable s))                                 #|line 517|#
    (funcall (quote send_string)   eh  ""  s  msg           #|line 518|#)) #|line 519|#
  )
(defun string_make_persistent (&optional  s)
  (declare (ignorable  s))                                  #|line 521|#
  #|  this is here for non_GC languages like Odin, it is a no_op for GC languages like Python |# #|line 522|#
  (return-from string_make_persistent  s)                   #|line 523|# #|line 524|#
  )
(defun string_clone (&optional  s)
  (declare (ignorable  s))                                  #|line 526|#
  (return-from string_clone  s)                             #|line 527|# #|line 528|#
  ) #|  usage: app ${_00_} ${_0D_} arg main diagram_filename1 diagram_filename2 ... |# #|line 530|# #|  where ${_00_} is the root directory for the project |# #|line 531|# #|  where ${_0D_} is the root directory for 0D (e.g. 0D/odin or 0D/python) |# #|line 532|# #|line 533|#
(defun initialize_component_palette (&optional  root_project  root_0D  diagram_source_files)
  (declare (ignorable  root_project  root_0D  diagram_source_files)) #|line 534|#
  (let (( reg (funcall (quote make_component_registry) )))
    (declare (ignorable  reg))                              #|line 535|#
    (loop for diagram_source in  diagram_source_files
      do
        (progn
          diagram_source                                    #|line 536|#
          (let ((all_containers_within_single_file (funcall (quote json2internal)   root_project  diagram_source  #|line 537|#)))
            (declare (ignorable all_containers_within_single_file))
            (setf  reg (funcall (quote generate_shell_components)   reg  all_containers_within_single_file  #|line 538|#))
            (loop for container in  all_containers_within_single_file
              do
                (progn
                  container                                 #|line 539|#
                  (funcall (quote register_component)   reg (funcall (quote mkTemplate)  (gethash  "name"  container)  #|  template_data= |# container  #|  instantiator= |# #'container_instantiator )  #|line 540|#) #|line 541|#
                  )))                                       #|line 542|#
          ))
    (funcall (quote initialize_stock_components)   reg      #|line 543|#)
    (return-from initialize_component_palette  reg)         #|line 544|#) #|line 545|#
  )
(defun print_error_maybe (&optional  main_container)
  (declare (ignorable  main_container))                     #|line 547|#
  (let ((error_port  "✗"))
    (declare (ignorable error_port))                        #|line 548|#
    (let ((err (funcall (quote fetch_first_output)   main_container  error_port  #|line 549|#)))
      (declare (ignorable err))
      (cond
        (( and  (not (equal   err  nil)) ( <   0 (length (funcall (quote trimws)  (slot-value  err 'v) )))) #|line 550|#
          (format *standard-output* "~a~%"  "___ !!! ERRORS !!! ___") #|line 551|#
          (funcall (quote print_specific_output)   main_container  error_port  #|line 552|#) #|line 553|#
          ))))                                              #|line 554|#
  ) #|  debugging helpers |#                                #|line 556|# #|line 557|#
(defun nl (&optional )
  (declare (ignorable ))                                    #|line 558|#
  (format *standard-output* "~a~%"  "")                     #|line 559|# #|line 560|#
  )
(defun dump_outputs (&optional  main_container)
  (declare (ignorable  main_container))                     #|line 562|#
  (funcall (quote nl) )                                     #|line 563|#
  (format *standard-output* "~a~%"  "___ Outputs ___")      #|line 564|#
  (funcall (quote print_output_list)   main_container       #|line 565|#) #|line 566|#
  )
(defun trimws (&optional  s)
  (declare (ignorable  s))                                  #|line 568|#
  #|  remove whitespace from front and back of string |#    #|line 569|#
  (return-from trimws (funcall (slot-value  s 'strip) ))    #|line 570|# #|line 571|#
  )
(defun clone_string (&optional  s)
  (declare (ignorable  s))                                  #|line 573|#
  (return-from clone_string  s                              #|line 574|# #|line 575|#) #|line 576|#
  )
(defparameter  load_errors  nil)                            #|line 577|#
(defparameter  runtime_errors  nil)                         #|line 578|# #|line 579|#
(defun load_error (&optional  s)
  (declare (ignorable  s))                                  #|line 580|# #|line 581|#
  (format *standard-output* "~a~%"  s)                      #|line 582|#
  (format *standard-output* "
  ")                                                        #|line 583|#
  (setf  load_errors  t)                                    #|line 584|# #|line 585|#
  )
(defun runtime_error (&optional  s)
  (declare (ignorable  s))                                  #|line 587|# #|line 588|#
  (format *standard-output* "~a~%"  s)                      #|line 589|#
  (setf  runtime_errors  t)                                 #|line 590|# #|line 591|#
  )
(defun fakepipename_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 593|#
  (let ((instance_name (funcall (quote gensymbol)   "fakepipe"  #|line 594|#)))
    (declare (ignorable instance_name))
    (return-from fakepipename_instantiate (funcall (quote make_leaf)   instance_name  owner  nil  #'fakepipename_handler  #|line 595|#))) #|line 596|#
  )
(defparameter  rand  0)                                     #|line 598|# #|line 599|#
(defun fakepipename_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 600|# #|line 601|#
  (setf  rand (+  rand  1))
  #|  not very random, but good enough _ 'rand' must be unique within a single run |# #|line 602|#
  (funcall (quote send_string)   eh  ""  (concatenate 'string  "/tmp/fakepipe"  rand)  msg  #|line 603|#) #|line 604|#
  )                                                         #|line 606|#
(defclass Switch1star_Instance_Data ()                      #|line 607|#
  (
    (state :accessor state :initarg :state :initform  "1")  #|line 608|#)) #|line 609|#

                                                            #|line 610|#
(defun switch1star_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 611|#
  (let ((name_with_id (funcall (quote gensymbol)   "switch1*"  #|line 612|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'Switch1star_Instance_Data) #|line 613|#))
      (declare (ignorable instp))
      (return-from switch1star_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'switch1star_handler  #|line 614|#)))) #|line 615|#
  )
(defun switch1star_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 617|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 618|#
    (let ((whichOutput (slot-value  inst 'state)))
      (declare (ignorable whichOutput))                     #|line 619|#
      (cond
        (( equal    "" (slot-value  msg 'port))             #|line 620|#
          (cond
            (( equal    "1"  whichOutput)                   #|line 621|#
              (funcall (quote forward)   eh  "1"  msg       #|line 622|#)
              (setf (slot-value  inst 'state)  "*")         #|line 623|#
              )
            (( equal    "*"  whichOutput)                   #|line 624|#
              (funcall (quote forward)   eh  "*"  msg       #|line 625|#)
              )
            (t                                              #|line 626|#
              (funcall (quote send)   eh  "✗"  "internal error bad state in switch1*"  msg  #|line 627|#) #|line 628|#
              ))
          )
        (( equal    "reset" (slot-value  msg 'port))        #|line 629|#
          (setf (slot-value  inst 'state)  "1")             #|line 630|#
          )
        (t                                                  #|line 631|#
          (funcall (quote send)   eh  "✗"  "internal error bad message for switch1*"  msg  #|line 632|#) #|line 633|#
          ))))                                              #|line 634|#
  )
(defclass Latch_Instance_Data ()                            #|line 636|#
  (
    (datum :accessor datum :initarg :datum :initform  nil)  #|line 637|#)) #|line 638|#

                                                            #|line 639|#
(defun latch_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 640|#
  (let ((name_with_id (funcall (quote gensymbol)   "latch"  #|line 641|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'Latch_Instance_Data)      #|line 642|#))
      (declare (ignorable instp))
      (return-from latch_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'latch_handler  #|line 643|#)))) #|line 644|#
  )
(defun latch_handler (&optional  eh  msg)
  (declare (ignorable  eh  msg))                            #|line 646|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 647|#
    (cond
      (( equal    "" (slot-value  msg 'port))               #|line 648|#
        (setf (slot-value  inst 'datum) (slot-value  msg 'datum)) #|line 649|#
        )
      (( equal    "release" (slot-value  msg 'port))        #|line 650|#
        (let (( d (slot-value  inst 'datum)))
          (declare (ignorable  d))                          #|line 651|#
          (funcall (quote send)   eh  ""  d  msg            #|line 652|#)
          (setf (slot-value  inst 'datum)  nil)             #|line 653|#)
        )
      (t                                                    #|line 654|#
        (funcall (quote send)   eh  "✗"  "internal error bad message for latch"  msg  #|line 655|#) #|line 656|#
        )))                                                 #|line 657|#
  ) #|  all of the the built_in leaves are listed here |#   #|line 659|# #|  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project |# #|line 660|# #|line 661|#
(defun initialize_stock_components (&optional  reg)
  (declare (ignorable  reg))                                #|line 662|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1then2"  nil  #'deracer_instantiate )  #|line 663|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?A"  nil  #'probeA_instantiate )  #|line 664|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?B"  nil  #'probeB_instantiate )  #|line 665|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?C"  nil  #'probeC_instantiate )  #|line 666|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "trash"  nil  #'trash_instantiate )  #|line 667|#) #|line 668|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Low Level Read Text File"  nil  #'low_level_read_text_file_instantiate )  #|line 669|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Ensure String Datum"  nil  #'ensure_string_datum_instantiate )  #|line 670|#) #|line 671|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "syncfilewrite"  nil  #'syncfilewrite_instantiate )  #|line 672|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "stringconcat"  nil  #'stringconcat_instantiate )  #|line 673|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "switch1*"  nil  #'switch1star_instantiate )  #|line 674|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "latch"  nil  #'latch_instantiate )  #|line 675|#)
  #|  for fakepipe |#                                       #|line 676|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "fakepipename"  nil  #'fakepipename_instantiate )  #|line 677|#) #|line 678|#
  )
(defun argv (&optional )
  (declare (ignorable ))                                    #|line 680|#
  (return-from argv
    (get-main-args)
                                                            #|line 681|#) #|line 682|#
  )
(defun initialize (&optional )
  (declare (ignorable ))                                    #|line 684|#
  (let ((root_of_project  (nth  1 (argv))                   #|line 685|#))
    (declare (ignorable root_of_project))
    (let ((root_of_0D  (nth  2 (argv))                      #|line 686|#))
      (declare (ignorable root_of_0D))
      (let ((arg  (nth  3 (argv))                           #|line 687|#))
        (declare (ignorable arg))
        (let ((main_container_name  (nth  4 (argv))         #|line 688|#))
          (declare (ignorable main_container_name))
          (let ((diagram_names  (nthcdr  5 (argv))          #|line 689|#))
            (declare (ignorable diagram_names))
            (let ((palette (funcall (quote initialize_component_palette)   root_of_project  root_of_0D  diagram_names  #|line 690|#)))
              (declare (ignorable palette))
              (return-from initialize (values  palette (list   root_of_project  root_of_0D  main_container_name  diagram_names  arg ))) #|line 691|#)))))) #|line 692|#
  )
(defun start (&optional  palette  env)
  (declare (ignorable  palette  env))
  (funcall (quote start_helper)   palette  env  nil )       #|line 694|#
  )
(defun start_show_all (&optional  palette  env)
  (declare (ignorable  palette  env))
  (funcall (quote start_helper)   palette  env  t )         #|line 695|#
  )
(defun start_helper (&optional  palette  env  show_all_outputs)
  (declare (ignorable  palette  env  show_all_outputs))     #|line 696|#
  (let ((root_of_project (nth  0  env)))
    (declare (ignorable root_of_project))                   #|line 697|#
    (let ((root_of_0D (nth  1  env)))
      (declare (ignorable root_of_0D))                      #|line 698|#
      (let ((main_container_name (nth  2  env)))
        (declare (ignorable main_container_name))           #|line 699|#
        (let ((diagram_names (nth  3  env)))
          (declare (ignorable diagram_names))               #|line 700|#
          (let ((arg (nth  4  env)))
            (declare (ignorable arg))                       #|line 701|#
            (funcall (quote set_environment)   root_of_project  root_of_0D  #|line 702|#)
            #|  get entrypoint container |#                 #|line 703|#
            (let (( main_container (funcall (quote get_component_instance)   palette  main_container_name  nil  #|line 704|#)))
              (declare (ignorable  main_container))
              (cond
                (( equal    nil  main_container)            #|line 705|#
                  (funcall (quote load_error)   (concatenate 'string  "Couldn't find container with page name /"  (concatenate 'string  main_container_name  (concatenate 'string  "/ in files "  (concatenate 'string (format nil "~a"  diagram_names)  " (check tab names, or disable compression?)"))))  #|line 709|#) #|line 710|#
                  ))
              (cond
                ((not  load_errors)                         #|line 711|#
                  (let (( marg (funcall (quote new_datum_string)   arg  #|line 712|#)))
                    (declare (ignorable  marg))
                    (let (( msg (funcall (quote make_message)   ""  marg  #|line 713|#)))
                      (declare (ignorable  msg))
                      (funcall (quote inject)   main_container  msg  #|line 714|#)
                      (cond
                        ( show_all_outputs                  #|line 715|#
                          (funcall (quote dump_outputs)   main_container  #|line 716|#)
                          )
                        (t                                  #|line 717|#
                          (funcall (quote print_error_maybe)   main_container  #|line 718|#)
                          (let ((outp (funcall (quote fetch_first_output)   main_container  ""  #|line 719|#)))
                            (declare (ignorable outp))
                            (cond
                              (( equal    nil  outp)        #|line 720|#
                                (format *standard-output* "~a~%"  "«««no outputs»»»)") #|line 721|#
                                )
                              (t                            #|line 722|#
                                (funcall (quote print_specific_output)   main_container  ""  #|line 723|#) #|line 724|#
                                )))                         #|line 725|#
                          ))
                      (cond
                        ( show_all_outputs                  #|line 726|#
                          (format *standard-output* "~a~%"  "--- done ---") #|line 727|# #|line 728|#
                          ))))                              #|line 729|#
                  ))))))))                                  #|line 730|#
  )                                                         #|line 732|# #|  utility functions  |# #|line 733|#
(defun send_int (&optional  eh  port  i  causing_message)
  (declare (ignorable  eh  port  i  causing_message))       #|line 734|#
  (let ((datum (funcall (quote new_datum_string)  (format nil "~a"  i)  #|line 735|#)))
    (declare (ignorable datum))
    (funcall (quote send)   eh  port  datum  causing_message  #|line 736|#)) #|line 737|#
  )
(defun send_bang (&optional  eh  port  causing_message)
  (declare (ignorable  eh  port  causing_message))          #|line 739|#
  (let ((datum (funcall (quote new_datum_bang) )))
    (declare (ignorable datum))                             #|line 740|#
    (funcall (quote send)   eh  port  datum  causing_message  #|line 741|#)) #|line 742|#
  )





