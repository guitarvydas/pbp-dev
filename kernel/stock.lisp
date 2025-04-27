
(defun probe_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 1|#
  (let ((name_with_id (funcall (quote gensymbol)   "?A"     #|line 2|#)))
    (declare (ignorable name_with_id))
    (return-from probe_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'probe_handler  #|line 3|#))) #|line 4|#
  )
(defun probe_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 6|# #|line 7|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 8|#
    (live_update  "Info"  (concatenate 'string  "  @"  (concatenate 'string (format nil "~a"  ticktime)  (concatenate 'string  "  "  (concatenate 'string  "probe "  (concatenate 'string (slot-value  eh 'arg)  (concatenate 'string  ": " (format nil "~a"  s)))))))) #|line 15|#) #|line 16|#
  )
(defun trash_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 18|#
  (let ((name_with_id (funcall (quote gensymbol)   "trash"  #|line 19|#)))
    (declare (ignorable name_with_id))
    (return-from trash_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'trash_handler  #|line 20|#))) #|line 21|#
  )
(defun trash_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 23|#
  #|  to appease dumped_on_floor checker |#                 #|line 24|#
  #| pass |#                                                #|line 25|# #|line 26|#
  )
(defclass TwoMevents ()                                     #|line 27|#
  (
    (firstmev :accessor firstmev :initarg :firstmev :initform  nil)  #|line 28|#
    (secondmev :accessor secondmev :initarg :secondmev :initform  nil)  #|line 29|#)) #|line 30|#

                                                            #|line 31|# #|  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } |# #|line 32|#
(defclass Deracer_Instance_Data ()                          #|line 33|#
  (
    (state :accessor state :initarg :state :initform  nil)  #|line 34|#
    (buffer :accessor buffer :initarg :buffer :initform  nil)  #|line 35|#)) #|line 36|#

                                                            #|line 37|#
(defun reclaim_Buffers_from_heap (&optional  inst)
  (declare (ignorable  inst))                               #|line 38|#
  #| pass |#                                                #|line 39|# #|line 40|#
  )
(defun deracer_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 42|#
  (let ((name_with_id (funcall (quote gensymbol)   "deracer"  #|line 43|#)))
    (declare (ignorable name_with_id))
    (let (( inst  (make-instance 'Deracer_Instance_Data)    #|line 44|#))
      (declare (ignorable  inst))
      (setf (slot-value  inst 'state)  "idle")              #|line 45|#
      (setf (slot-value  inst 'buffer)  (make-instance 'TwoMevents) #|line 46|#)
      (let ((eh (funcall (quote make_leaf)   name_with_id  owner  inst  #'deracer_handler  #|line 47|#)))
        (declare (ignorable eh))
        (return-from deracer_instantiate  eh)               #|line 48|#))) #|line 49|#
  )
(defun send_firstmev_then_secondmev (&optional  eh  inst)
  (declare (ignorable  eh  inst))                           #|line 51|#
  (funcall (quote forward)   eh  "1" (slot-value (slot-value  inst 'buffer) 'firstmev)  #|line 52|#)
  (funcall (quote forward)   eh  "2" (slot-value (slot-value  inst 'buffer) 'secondmev)  #|line 53|#)
  (funcall (quote reclaim_Buffers_from_heap)   inst         #|line 54|#) #|line 55|#
  )
(defun deracer_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 57|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 58|#
    (cond
      (( equal   (slot-value  inst 'state)  "idle")         #|line 59|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 60|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 61|#
            (setf (slot-value  inst 'state)  "waitingForSecondmev") #|line 62|#
            )
          (( equal    "2" (slot-value  mev 'port))          #|line 63|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 64|#
            (setf (slot-value  inst 'state)  "waitingForFirstmev") #|line 65|#
            )
          (t                                                #|line 66|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case A) for deracer " (slot-value  mev 'port))  #|line 67|#) #|line 68|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForFirstmev") #|line 69|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 70|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 71|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 72|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 73|#
            )
          (t                                                #|line 74|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case B) for deracer " (slot-value  mev 'port))  #|line 75|#) #|line 76|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForSecondmev") #|line 77|#
        (cond
          (( equal    "2" (slot-value  mev 'port))          #|line 78|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 79|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 80|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 81|#
            )
          (t                                                #|line 82|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case C) for deracer " (slot-value  mev 'port))  #|line 83|#) #|line 84|#
            ))
        )
      (t                                                    #|line 85|#
        (funcall (quote runtime_error)   "bad state for deracer {eh.state}"  #|line 86|#) #|line 87|#
        )))                                                 #|line 88|#
  )
(defun low_level_read_text_file_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 90|#
  (let ((name_with_id (funcall (quote gensymbol)   "Low Level Read Text File"  #|line 91|#)))
    (declare (ignorable name_with_id))
    (return-from low_level_read_text_file_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'low_level_read_text_file_handler  #|line 92|#))) #|line 93|#
  )
(defun low_level_read_text_file_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 95|#
  (let ((fname (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable fname))                             #|line 96|#

    ;; read text from a named file fname, send the text out on port "" else send error info on port "✗"
    ;; given eh and mev if needed
    (handler-bind ((error #'(lambda (condition) (send_string eh "✗" (format nil "~&~A~&" condition)))))
      (with-open-file (stream fname)
        (let ((contents (make-string (file-length stream))))
          (read-sequence contents stream)
          (send_string eh "" contents))))
                                                            #|line 97|#) #|line 98|#
  )
(defun ensure_string_datum_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 100|#
  (let ((name_with_id (funcall (quote gensymbol)   "Ensure String Datum"  #|line 101|#)))
    (declare (ignorable name_with_id))
    (return-from ensure_string_datum_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'ensure_string_datum_handler  #|line 102|#))) #|line 103|#
  )
(defun ensure_string_datum_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 105|#
  (cond
    (( equal    "string" (funcall (slot-value (slot-value  mev 'datum) 'kind) )) #|line 106|#
      (funcall (quote forward)   eh  ""  mev                #|line 107|#)
      )
    (t                                                      #|line 108|#
      (let ((emev  (concatenate 'string  "*** ensure: type error (expected a string datum) but got " (slot-value  mev 'datum)) #|line 109|#))
        (declare (ignorable emev))
        (funcall (quote send)   eh  "✗"  emev  mev          #|line 110|#)) #|line 111|#
      ))                                                    #|line 112|#
  )
(defclass Syncfilewrite_Data ()                             #|line 114|#
  (
    (filename :accessor filename :initarg :filename :initform  "")  #|line 115|#)) #|line 116|#

                                                            #|line 117|# #|  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) |# #|line 118|#
(defun syncfilewrite_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 119|#
  (let ((name_with_id (funcall (quote gensymbol)   "syncfilewrite"  #|line 120|#)))
    (declare (ignorable name_with_id))
    (let ((inst  (make-instance 'Syncfilewrite_Data)        #|line 121|#))
      (declare (ignorable inst))
      (return-from syncfilewrite_instantiate (funcall (quote make_leaf)   name_with_id  owner  inst  #'syncfilewrite_handler  #|line 122|#)))) #|line 123|#
  )
(defun syncfilewrite_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 125|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 126|#
    (cond
      (( equal    "filename" (slot-value  mev 'port))       #|line 127|#
        (setf (slot-value  inst 'filename) (slot-value (slot-value  mev 'datum) 'v)) #|line 128|#
        )
      (( equal    "input" (slot-value  mev 'port))          #|line 129|#
        (let ((contents (slot-value (slot-value  mev 'datum) 'v)))
          (declare (ignorable contents))                    #|line 130|#
          (let (( f (funcall (quote open)  (slot-value  inst 'filename)  "w"  #|line 131|#)))
            (declare (ignorable  f))
            (cond
              ((not (equal   f  nil))                       #|line 132|#
                (funcall (slot-value  f 'write)  (slot-value (slot-value  mev 'datum) 'v)  #|line 133|#)
                (funcall (slot-value  f 'close) )           #|line 134|#
                (funcall (quote send)   eh  "done" (funcall (quote new_datum_bang) )  mev  #|line 135|#)
                )
              (t                                            #|line 136|#
                (funcall (quote send)   eh  "✗"  (concatenate 'string  "open error on file " (slot-value  inst 'filename))  mev  #|line 137|#) #|line 138|#
                ))))                                        #|line 139|#
        )))                                                 #|line 140|#
  )
(defclass StringConcat_Instance_Data ()                     #|line 142|#
  (
    (buffer1 :accessor buffer1 :initarg :buffer1 :initform  nil)  #|line 143|#
    (buffer2 :accessor buffer2 :initarg :buffer2 :initform  nil)  #|line 144|#)) #|line 145|#

                                                            #|line 146|#
(defun stringconcat_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 147|#
  (let ((name_with_id (funcall (quote gensymbol)   "stringconcat"  #|line 148|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringConcat_Instance_Data) #|line 149|#))
      (declare (ignorable instp))
      (return-from stringconcat_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'stringconcat_handler  #|line 150|#)))) #|line 151|#
  )
(defun stringconcat_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 153|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 154|#
    (cond
      (( equal    "1" (slot-value  mev 'port))              #|line 155|#
        (setf (slot-value  inst 'buffer1) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 156|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 157|#)
        )
      (( equal    "2" (slot-value  mev 'port))              #|line 158|#
        (setf (slot-value  inst 'buffer2) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 159|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 160|#)
        )
      (( equal    "reset" (slot-value  mev 'port))          #|line 161|#
        (setf (slot-value  inst 'buffer1)  nil)             #|line 162|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 163|#
        )
      (t                                                    #|line 164|#
        (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port for stringconcat: " (slot-value  mev 'port))  #|line 165|#) #|line 166|#
        )))                                                 #|line 167|#
  )
(defun maybe_stringconcat (&optional  eh  inst  mev)
  (declare (ignorable  eh  inst  mev))                      #|line 169|#
  (cond
    (( and  (not (equal  (slot-value  inst 'buffer1)  nil)) (not (equal  (slot-value  inst 'buffer2)  nil))) #|line 170|#
      (let (( concatenated_string  ""))
        (declare (ignorable  concatenated_string))          #|line 171|#
        (cond
          (( equal    0 (length (slot-value  inst 'buffer1))) #|line 172|#
            (setf  concatenated_string (slot-value  inst 'buffer2)) #|line 173|#
            )
          (( equal    0 (length (slot-value  inst 'buffer2))) #|line 174|#
            (setf  concatenated_string (slot-value  inst 'buffer1)) #|line 175|#
            )
          (t                                                #|line 176|#
            (setf  concatenated_string (+ (slot-value  inst 'buffer1) (slot-value  inst 'buffer2))) #|line 177|# #|line 178|#
            ))
        (funcall (quote send)   eh  ""  concatenated_string  mev  #|line 179|#)
        (setf (slot-value  inst 'buffer1)  nil)             #|line 180|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 181|#) #|line 182|#
      ))                                                    #|line 183|#
  ) #|  |#                                                  #|line 185|# #|line 186|#
(defun string_constant_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 187|# #|line 188|#
  (let ((name_with_id (funcall (quote gensymbol)   "strconst"  #|line 189|#)))
    (declare (ignorable name_with_id))
    (let (( s  template_data))
      (declare (ignorable  s))                              #|line 190|#
      (cond
        ((not (equal   projectRoot  ""))                    #|line 191|#
          (setf  s (substitute  "_00_"  projectRoot  s)     #|line 192|#) #|line 193|#
          ))
      (return-from string_constant_instantiate (funcall (quote make_leaf)   name_with_id  owner  s  #'string_constant_handler  #|line 194|#)))) #|line 195|#
  )
(defun string_constant_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 197|#
  (let ((s (slot-value  eh 'instance_data)))
    (declare (ignorable s))                                 #|line 198|#
    (funcall (quote send)   eh  ""  s  mev                  #|line 199|#)) #|line 200|#
  )
(defun fakepipename_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 202|#
  (let ((instance_name (funcall (quote gensymbol)   "fakepipe"  #|line 203|#)))
    (declare (ignorable instance_name))
    (return-from fakepipename_instantiate (funcall (quote make_leaf)   instance_name  owner  nil  #'fakepipename_handler  #|line 204|#))) #|line 205|#
  )
(defparameter  rand  0)                                     #|line 207|# #|line 208|#
(defun fakepipename_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 209|# #|line 210|#
  (setf  rand (+  rand  1))
  #|  not very random, but good enough _ ;rand' must be unique within a single run |# #|line 211|#
  (funcall (quote send)   eh  ""  (concatenate 'string  "/tmp/fakepipe"  rand)  mev  #|line 212|#) #|line 213|#
  )                                                         #|line 215|#
(defclass Switch1star_Instance_Data ()                      #|line 216|#
  (
    (state :accessor state :initarg :state :initform  "1")  #|line 217|#)) #|line 218|#

                                                            #|line 219|#
(defun switch1star_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 220|#
  (let ((name_with_id (funcall (quote gensymbol)   "switch1*"  #|line 221|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'Switch1star_Instance_Data) #|line 222|#))
      (declare (ignorable instp))
      (return-from switch1star_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'switch1star_handler  #|line 223|#)))) #|line 224|#
  )
(defun switch1star_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 226|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 227|#
    (let ((whichOutput (slot-value  inst 'state)))
      (declare (ignorable whichOutput))                     #|line 228|#
      (cond
        (( equal    "" (slot-value  mev 'port))             #|line 229|#
          (cond
            (( equal    "1"  whichOutput)                   #|line 230|#
              (funcall (quote forward)   eh  "1"  mev       #|line 231|#)
              (setf (slot-value  inst 'state)  "*")         #|line 232|#
              )
            (( equal    "*"  whichOutput)                   #|line 233|#
              (funcall (quote forward)   eh  "*"  mev       #|line 234|#)
              )
            (t                                              #|line 235|#
              (funcall (quote send)   eh  "✗"  "internal error bad state in switch1*"  mev  #|line 236|#) #|line 237|#
              ))
          )
        (( equal    "reset" (slot-value  mev 'port))        #|line 238|#
          (setf (slot-value  inst 'state)  "1")             #|line 239|#
          )
        (t                                                  #|line 240|#
          (funcall (quote send)   eh  "✗"  "internal error bad mevent for switch1*"  mev  #|line 241|#) #|line 242|#
          ))))                                              #|line 243|#
  )
(defclass StringAccumulator ()                              #|line 245|#
  (
    (s :accessor s :initarg :s :initform  "")               #|line 246|#)) #|line 247|#

                                                            #|line 248|#
(defun strcatstar_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 249|#
  (let ((name_with_id (funcall (quote gensymbol)   "String Concat *"  #|line 250|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringAccumulator)        #|line 251|#))
      (declare (ignorable instp))
      (return-from strcatstar_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'strcatstar_handler  #|line 252|#)))) #|line 253|#
  )
(defun strcatstar_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 255|#
  (let (( accum (slot-value  eh 'instance_data)))
    (declare (ignorable  accum))                            #|line 256|#
    (cond
      (( equal    "" (slot-value  mev 'port))               #|line 257|#
        (setf (slot-value  accum 's)  (concatenate 'string (slot-value  accum 's) (slot-value (slot-value  mev 'datum) 'v)) #|line 258|#)
        )
      (( equal    "fini" (slot-value  mev 'port))           #|line 259|#
        (funcall (quote send)   eh  "" (slot-value  accum 's)  mev  #|line 260|#)
        )
      (t                                                    #|line 261|#
        (funcall (quote send)   eh  "✗"  "internal error bad mevent for String Concat *"  mev  #|line 262|#) #|line 263|#
        )))                                                 #|line 264|#
  ) #|  all of the the built_in leaves are listed here |#   #|line 266|# #|  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project |# #|line 267|# #|line 268|#
(defun initialize_stock_components (&optional  reg)
  (declare (ignorable  reg))                                #|line 269|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1then2"  nil  #'deracer_instantiate )  #|line 270|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?"  nil  #'probe_instantiate )  #|line 271|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "trash"  nil  #'trash_instantiate )  #|line 272|#) #|line 273|# #|line 274|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Read Text File"  nil  #'low_level_read_text_file_instantiate )  #|line 275|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Ensure String Datum"  nil  #'ensure_string_datum_instantiate )  #|line 276|#) #|line 277|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "syncfilewrite"  nil  #'syncfilewrite_instantiate )  #|line 278|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "stringconcat"  nil  #'stringconcat_instantiate )  #|line 279|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "switch1*"  nil  #'switch1star_instantiate )  #|line 280|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "String Concat *"  nil #'strcatstar_instantiate )  #|line 281|#)
  #|  for fakepipe |#                                       #|line 282|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "fakepipename"  nil  #'fakepipename_instantiate )  #|line 283|#) #|line 284|#
  )