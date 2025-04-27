
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
(defclass TwoMevents ()                                     #|line 11|#
  (
    (firstmev :accessor firstmev :initarg :firstmev :initform  nil)  #|line 12|#
    (secondmev :accessor secondmev :initarg :secondmev :initform  nil)  #|line 13|#)) #|line 14|#

                                                            #|line 15|# #|  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } |# #|line 16|#
(defclass Deracer_Instance_Data ()                          #|line 17|#
  (
    (state :accessor state :initarg :state :initform  nil)  #|line 18|#
    (buffer :accessor buffer :initarg :buffer :initform  nil)  #|line 19|#)) #|line 20|#

                                                            #|line 21|#
(defun reclaim_Buffers_from_heap (&optional  inst)
  (declare (ignorable  inst))                               #|line 22|#
  #| pass |#                                                #|line 23|# #|line 24|#
  )
(defun deracer_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 26|#
  (let ((name_with_id (funcall (quote gensymbol)   "deracer"  #|line 27|#)))
    (declare (ignorable name_with_id))
    (let (( inst  (make-instance 'Deracer_Instance_Data)    #|line 28|#))
      (declare (ignorable  inst))
      (setf (slot-value  inst 'state)  "idle")              #|line 29|#
      (setf (slot-value  inst 'buffer)  (make-instance 'TwoMevents) #|line 30|#)
      (let ((eh (funcall (quote make_leaf)   name_with_id  owner  inst  ""  #'deracer_handler  #|line 31|#)))
        (declare (ignorable eh))
        (return-from deracer_instantiate  eh)               #|line 32|#))) #|line 33|#
  )
(defun send_firstmev_then_secondmev (&optional  eh  inst)
  (declare (ignorable  eh  inst))                           #|line 35|#
  (funcall (quote forward)   eh  "1" (slot-value (slot-value  inst 'buffer) 'firstmev)  #|line 36|#)
  (funcall (quote forward)   eh  "2" (slot-value (slot-value  inst 'buffer) 'secondmev)  #|line 37|#)
  (funcall (quote reclaim_Buffers_from_heap)   inst         #|line 38|#) #|line 39|#
  )
(defun deracer_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 41|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 42|#
    (cond
      (( equal   (slot-value  inst 'state)  "idle")         #|line 43|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 44|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 45|#
            (setf (slot-value  inst 'state)  "waitingForSecondmev") #|line 46|#
            )
          (( equal    "2" (slot-value  mev 'port))          #|line 47|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 48|#
            (setf (slot-value  inst 'state)  "waitingForFirstmev") #|line 49|#
            )
          (t                                                #|line 50|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case A) for deracer " (slot-value  mev 'port))  #|line 51|#) #|line 52|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForFirstmev") #|line 53|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 54|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 55|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 56|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 57|#
            )
          (t                                                #|line 58|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case B) for deracer " (slot-value  mev 'port))  #|line 59|#) #|line 60|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForSecondmev") #|line 61|#
        (cond
          (( equal    "2" (slot-value  mev 'port))          #|line 62|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 63|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 64|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 65|#
            )
          (t                                                #|line 66|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case C) for deracer " (slot-value  mev 'port))  #|line 67|#) #|line 68|#
            ))
        )
      (t                                                    #|line 69|#
        (funcall (quote runtime_error)   "bad state for deracer {eh.state}"  #|line 70|#) #|line 71|#
        )))                                                 #|line 72|#
  )
(defun low_level_read_text_file_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 74|#
  (let ((name_with_id (funcall (quote gensymbol)   "Low Level Read Text File"  #|line 75|#)))
    (declare (ignorable name_with_id))
    (return-from low_level_read_text_file_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'low_level_read_text_file_handler  #|line 76|#))) #|line 77|#
  )
(defun low_level_read_text_file_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 79|#
  (let ((fname (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable fname))                             #|line 80|#

    ;; read text from a named file fname, send the text out on port "" else send error info on port "✗"
    ;; given eh and mev if needed
    (handler-bind ((error #'(lambda (condition) (send_string eh "✗" (format nil "~&~A~&" condition)))))
      (with-open-file (stream fname)
        (let ((contents (make-string (file-length stream))))
          (read-sequence contents stream)
          (send_string eh "" contents))))
                                                            #|line 81|#) #|line 82|#
  )
(defun ensure_string_datum_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 84|#
  (let ((name_with_id (funcall (quote gensymbol)   "Ensure String Datum"  #|line 85|#)))
    (declare (ignorable name_with_id))
    (return-from ensure_string_datum_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'ensure_string_datum_handler  #|line 86|#))) #|line 87|#
  )
(defun ensure_string_datum_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 89|#
  (cond
    (( equal    "string" (funcall (slot-value (slot-value  mev 'datum) 'kind) )) #|line 90|#
      (funcall (quote forward)   eh  ""  mev                #|line 91|#)
      )
    (t                                                      #|line 92|#
      (let ((emev  (concatenate 'string  "*** ensure: type error (expected a string datum) but got " (slot-value  mev 'datum)) #|line 93|#))
        (declare (ignorable emev))
        (funcall (quote send)   eh  "✗"  emev  mev          #|line 94|#)) #|line 95|#
      ))                                                    #|line 96|#
  )
(defclass Syncfilewrite_Data ()                             #|line 98|#
  (
    (filename :accessor filename :initarg :filename :initform  "")  #|line 99|#)) #|line 100|#

                                                            #|line 101|# #|  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) |# #|line 102|#
(defun syncfilewrite_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 103|#
  (let ((name_with_id (funcall (quote gensymbol)   "syncfilewrite"  #|line 104|#)))
    (declare (ignorable name_with_id))
    (let ((inst  (make-instance 'Syncfilewrite_Data)        #|line 105|#))
      (declare (ignorable inst))
      (return-from syncfilewrite_instantiate (funcall (quote make_leaf)   name_with_id  owner  inst  ""  #'syncfilewrite_handler  #|line 106|#)))) #|line 107|#
  )
(defun syncfilewrite_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 109|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 110|#
    (cond
      (( equal    "filename" (slot-value  mev 'port))       #|line 111|#
        (setf (slot-value  inst 'filename) (slot-value (slot-value  mev 'datum) 'v)) #|line 112|#
        )
      (( equal    "input" (slot-value  mev 'port))          #|line 113|#
        (let ((contents (slot-value (slot-value  mev 'datum) 'v)))
          (declare (ignorable contents))                    #|line 114|#
          (let (( f (funcall (quote open)  (slot-value  inst 'filename)  "w"  #|line 115|#)))
            (declare (ignorable  f))
            (cond
              ((not (equal   f  nil))                       #|line 116|#
                (funcall (slot-value  f 'write)  (slot-value (slot-value  mev 'datum) 'v)  #|line 117|#)
                (funcall (slot-value  f 'close) )           #|line 118|#
                (funcall (quote send)   eh  "done" (funcall (quote new_datum_bang) )  mev  #|line 119|#)
                )
              (t                                            #|line 120|#
                (funcall (quote send)   eh  "✗"  (concatenate 'string  "open error on file " (slot-value  inst 'filename))  mev  #|line 121|#) #|line 122|#
                ))))                                        #|line 123|#
        )))                                                 #|line 124|#
  )
(defclass StringConcat_Instance_Data ()                     #|line 126|#
  (
    (buffer1 :accessor buffer1 :initarg :buffer1 :initform  nil)  #|line 127|#
    (buffer2 :accessor buffer2 :initarg :buffer2 :initform  nil)  #|line 128|#)) #|line 129|#

                                                            #|line 130|#
(defun stringconcat_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 131|#
  (let ((name_with_id (funcall (quote gensymbol)   "stringconcat"  #|line 132|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringConcat_Instance_Data) #|line 133|#))
      (declare (ignorable instp))
      (return-from stringconcat_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'stringconcat_handler  #|line 134|#)))) #|line 135|#
  )
(defun stringconcat_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 137|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 138|#
    (cond
      (( equal    "1" (slot-value  mev 'port))              #|line 139|#
        (setf (slot-value  inst 'buffer1) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 140|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 141|#)
        )
      (( equal    "2" (slot-value  mev 'port))              #|line 142|#
        (setf (slot-value  inst 'buffer2) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 143|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 144|#)
        )
      (( equal    "reset" (slot-value  mev 'port))          #|line 145|#
        (setf (slot-value  inst 'buffer1)  nil)             #|line 146|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 147|#
        )
      (t                                                    #|line 148|#
        (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port for stringconcat: " (slot-value  mev 'port))  #|line 149|#) #|line 150|#
        )))                                                 #|line 151|#
  )
(defun maybe_stringconcat (&optional  eh  inst  mev)
  (declare (ignorable  eh  inst  mev))                      #|line 153|#
  (cond
    (( and  (not (equal  (slot-value  inst 'buffer1)  nil)) (not (equal  (slot-value  inst 'buffer2)  nil))) #|line 154|#
      (let (( concatenated_string  ""))
        (declare (ignorable  concatenated_string))          #|line 155|#
        (cond
          (( equal    0 (length (slot-value  inst 'buffer1))) #|line 156|#
            (setf  concatenated_string (slot-value  inst 'buffer2)) #|line 157|#
            )
          (( equal    0 (length (slot-value  inst 'buffer2))) #|line 158|#
            (setf  concatenated_string (slot-value  inst 'buffer1)) #|line 159|#
            )
          (t                                                #|line 160|#
            (setf  concatenated_string (+ (slot-value  inst 'buffer1) (slot-value  inst 'buffer2))) #|line 161|# #|line 162|#
            ))
        (funcall (quote send)   eh  ""  concatenated_string  mev  #|line 163|#)
        (setf (slot-value  inst 'buffer1)  nil)             #|line 164|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 165|#) #|line 166|#
      ))                                                    #|line 167|#
  ) #|  |#                                                  #|line 169|# #|line 170|#
(defun string_constant_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 171|# #|line 172|#
  (let ((name_with_id (funcall (quote gensymbol)   "strconst"  #|line 173|#)))
    (declare (ignorable name_with_id))
    (let (( s  template_data))
      (declare (ignorable  s))                              #|line 174|#
      (cond
        ((not (equal   projectRoot  ""))                    #|line 175|#
          (setf  s (substitute  "_00_"  projectRoot  s)     #|line 176|#) #|line 177|#
          ))
      (return-from string_constant_instantiate (funcall (quote make_leaf)   name_with_id  owner  s  ""  #'string_constant_handler  #|line 178|#)))) #|line 179|#
  )
(defun string_constant_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 181|#
  (let ((s (slot-value  eh 'instance_data)))
    (declare (ignorable s))                                 #|line 182|#
    (funcall (quote send)   eh  ""  s  mev                  #|line 183|#)) #|line 184|#
  )
(defun fakepipename_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 186|#
  (let ((instance_name (funcall (quote gensymbol)   "fakepipe"  #|line 187|#)))
    (declare (ignorable instance_name))
    (return-from fakepipename_instantiate (funcall (quote make_leaf)   instance_name  owner  nil  ""  #'fakepipename_handler  #|line 188|#))) #|line 189|#
  )
(defparameter  rand  0)                                     #|line 191|# #|line 192|#
(defun fakepipename_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 193|# #|line 194|#
  (setf  rand (+  rand  1))
  #|  not very random, but good enough _ ;rand' must be unique within a single run |# #|line 195|#
  (funcall (quote send)   eh  ""  (concatenate 'string  "/tmp/fakepipe"  rand)  mev  #|line 196|#) #|line 197|#
  )                                                         #|line 199|#
(defclass Switch1star_Instance_Data ()                      #|line 200|#
  (
    (state :accessor state :initarg :state :initform  "1")  #|line 201|#)) #|line 202|#

                                                            #|line 203|#
(defun switch1star_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 204|#
  (let ((name_with_id (funcall (quote gensymbol)   "switch1*"  #|line 205|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'Switch1star_Instance_Data) #|line 206|#))
      (declare (ignorable instp))
      (return-from switch1star_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'switch1star_handler  #|line 207|#)))) #|line 208|#
  )
(defun switch1star_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 210|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 211|#
    (let ((whichOutput (slot-value  inst 'state)))
      (declare (ignorable whichOutput))                     #|line 212|#
      (cond
        (( equal    "" (slot-value  mev 'port))             #|line 213|#
          (cond
            (( equal    "1"  whichOutput)                   #|line 214|#
              (funcall (quote forward)   eh  "1"  mev       #|line 215|#)
              (setf (slot-value  inst 'state)  "*")         #|line 216|#
              )
            (( equal    "*"  whichOutput)                   #|line 217|#
              (funcall (quote forward)   eh  "*"  mev       #|line 218|#)
              )
            (t                                              #|line 219|#
              (funcall (quote send)   eh  "✗"  "internal error bad state in switch1*"  mev  #|line 220|#) #|line 221|#
              ))
          )
        (( equal    "reset" (slot-value  mev 'port))        #|line 222|#
          (setf (slot-value  inst 'state)  "1")             #|line 223|#
          )
        (t                                                  #|line 224|#
          (funcall (quote send)   eh  "✗"  "internal error bad mevent for switch1*"  mev  #|line 225|#) #|line 226|#
          ))))                                              #|line 227|#
  )
(defclass StringAccumulator ()                              #|line 229|#
  (
    (s :accessor s :initarg :s :initform  "")               #|line 230|#)) #|line 231|#

                                                            #|line 232|#
(defun strcatstar_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 233|#
  (let ((name_with_id (funcall (quote gensymbol)   "String Concat *"  #|line 234|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringAccumulator)        #|line 235|#))
      (declare (ignorable instp))
      (return-from strcatstar_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'strcatstar_handler  #|line 236|#)))) #|line 237|#
  )
(defun strcatstar_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 239|#
  (let (( accum (slot-value  eh 'instance_data)))
    (declare (ignorable  accum))                            #|line 240|#
    (cond
      (( equal    "" (slot-value  mev 'port))               #|line 241|#
        (setf (slot-value  accum 's)  (concatenate 'string (slot-value  accum 's) (slot-value (slot-value  mev 'datum) 'v)) #|line 242|#)
        )
      (( equal    "fini" (slot-value  mev 'port))           #|line 243|#
        (funcall (quote send)   eh  "" (slot-value  accum 's)  mev  #|line 244|#)
        )
      (t                                                    #|line 245|#
        (funcall (quote send)   eh  "✗"  "internal error bad mevent for String Concat *"  mev  #|line 246|#) #|line 247|#
        )))                                                 #|line 248|#
  ) #|  all of the the built_in leaves are listed here |#   #|line 250|# #|  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project |# #|line 251|# #|line 252|#
(defun initialize_stock_components (&optional  reg)
  (declare (ignorable  reg))                                #|line 253|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1then2"  nil  ""  #'deracer_instantiate )  #|line 254|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?"  nil  ""  #'probe_instantiate )  #|line 255|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "trash"  nil  ""  #'trash_instantiate )  #|line 256|#) #|line 257|# #|line 258|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Read Text File"  nil  ""  #'low_level_read_text_file_instantiate )  #|line 259|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Ensure String Datum"  nil  ""  #'ensure_string_datum_instantiate )  #|line 260|#) #|line 261|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "syncfilewrite"  nil  ""  #'syncfilewrite_instantiate )  #|line 262|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "stringconcat"  nil  ""  #'stringconcat_instantiate )  #|line 263|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "switch1*"  nil  ""  #'switch1star_instantiate )  #|line 264|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "String Concat *"  nil  ""  #'strcatstar_instantiate )  #|line 265|#)
  #|  for fakepipe |#                                       #|line 266|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "fakepipename"  nil  ""  #'fakepipename_instantiate )  #|line 267|#) #|line 268|#
  )