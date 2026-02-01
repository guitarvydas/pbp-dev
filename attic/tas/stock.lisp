
(defun probeA_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 1|#
  (let ((name_with_id (funcall (quote gensymbol)   "?A"     #|line 2|#)))
    (declare (ignorable name_with_id))
    (return-from probeA_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'probe_handler  #|line 3|#))) #|line 4|#
  )
(defun probeB_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 6|#
  (let ((name_with_id (funcall (quote gensymbol)   "?B"     #|line 7|#)))
    (declare (ignorable name_with_id))
    (return-from probeB_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'probe_handler  #|line 8|#))) #|line 9|#
  )
(defun probeC_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 11|#
  (let ((name_with_id (funcall (quote gensymbol)   "?C"     #|line 12|#)))
    (declare (ignorable name_with_id))
    (return-from probeC_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'probe_handler  #|line 13|#))) #|line 14|#
  )
(defun probe_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 16|# #|line 17|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 18|#
    (live_update  "Info"  (concatenate 'string  "  @"  (concatenate 'string (format nil "~a"  ticktime)  (concatenate 'string  "  "  (concatenate 'string  "probe "  (concatenate 'string (slot-value  eh 'name)  (concatenate 'string  ": " (format nil "~a"  s)))))))) #|line 25|#) #|line 26|#
  )
(defun trash_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 28|#
  (let ((name_with_id (funcall (quote gensymbol)   "trash"  #|line 29|#)))
    (declare (ignorable name_with_id))
    (return-from trash_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'trash_handler  #|line 30|#))) #|line 31|#
  )
(defun trash_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 33|#
  #|  to appease dumped_on_floor checker |#                 #|line 34|#
  #| pass |#                                                #|line 35|# #|line 36|#
  )
(defclass TwoMevents ()                                     #|line 37|#
  (
    (firstmev :accessor firstmev :initarg :firstmev :initform  nil)  #|line 38|#
    (secondmev :accessor secondmev :initarg :secondmev :initform  nil)  #|line 39|#)) #|line 40|#

                                                            #|line 41|# #|  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } |# #|line 42|#
(defclass Deracer_Instance_Data ()                          #|line 43|#
  (
    (state :accessor state :initarg :state :initform  nil)  #|line 44|#
    (buffer :accessor buffer :initarg :buffer :initform  nil)  #|line 45|#)) #|line 46|#

                                                            #|line 47|#
(defun reclaim_Buffers_from_heap (&optional  inst)
  (declare (ignorable  inst))                               #|line 48|#
  #| pass |#                                                #|line 49|# #|line 50|#
  )
(defun deracer_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 52|#
  (let ((name_with_id (funcall (quote gensymbol)   "deracer"  #|line 53|#)))
    (declare (ignorable name_with_id))
    (let (( inst  (make-instance 'Deracer_Instance_Data)    #|line 54|#))
      (declare (ignorable  inst))
      (setf (slot-value  inst 'state)  "idle")              #|line 55|#
      (setf (slot-value  inst 'buffer)  (make-instance 'TwoMevents) #|line 56|#)
      (let ((eh (funcall (quote make_leaf)   name_with_id  owner  inst  #'deracer_handler  #|line 57|#)))
        (declare (ignorable eh))
        (return-from deracer_instantiate  eh)               #|line 58|#))) #|line 59|#
  )
(defun send_firstmev_then_secondmev (&optional  eh  inst)
  (declare (ignorable  eh  inst))                           #|line 61|#
  (funcall (quote forward)   eh  "1" (slot-value (slot-value  inst 'buffer) 'firstmev)  #|line 62|#)
  (funcall (quote forward)   eh  "2" (slot-value (slot-value  inst 'buffer) 'secondmev)  #|line 63|#)
  (funcall (quote reclaim_Buffers_from_heap)   inst         #|line 64|#) #|line 65|#
  )
(defun deracer_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 67|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 68|#
    (cond
      (( equal   (slot-value  inst 'state)  "idle")         #|line 69|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 70|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 71|#
            (setf (slot-value  inst 'state)  "waitingForSecondmev") #|line 72|#
            )
          (( equal    "2" (slot-value  mev 'port))          #|line 73|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 74|#
            (setf (slot-value  inst 'state)  "waitingForFirstmev") #|line 75|#
            )
          (t                                                #|line 76|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case A) for deracer " (slot-value  mev 'port))  #|line 77|#) #|line 78|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForFirstmev") #|line 79|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 80|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 81|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 82|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 83|#
            )
          (t                                                #|line 84|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case B) for deracer " (slot-value  mev 'port))  #|line 85|#) #|line 86|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForSecondmev") #|line 87|#
        (cond
          (( equal    "2" (slot-value  mev 'port))          #|line 88|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 89|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 90|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 91|#
            )
          (t                                                #|line 92|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case C) for deracer " (slot-value  mev 'port))  #|line 93|#) #|line 94|#
            ))
        )
      (t                                                    #|line 95|#
        (funcall (quote runtime_error)   "bad state for deracer {eh.state}"  #|line 96|#) #|line 97|#
        )))                                                 #|line 98|#
  )
(defun low_level_read_text_file_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 100|#
  (let ((name_with_id (funcall (quote gensymbol)   "Low Level Read Text File"  #|line 101|#)))
    (declare (ignorable name_with_id))
    (return-from low_level_read_text_file_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'low_level_read_text_file_handler  #|line 102|#))) #|line 103|#
  )
(defun low_level_read_text_file_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 105|#
  (let ((fname (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable fname))                             #|line 106|#

    ;; read text from a named file fname, send the text out on port "" else send error info on port "✗"
    ;; given eh and mev if needed
    (handler-bind ((error #'(lambda (condition) (send_string eh "✗" (format nil "~&~A~&" condition)))))
      (with-open-file (stream fname)
        (let ((contents (make-string (file-length stream))))
          (read-sequence contents stream)
          (send_string eh "" contents))))
                                                            #|line 107|#) #|line 108|#
  )
(defun ensure_string_datum_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 110|#
  (let ((name_with_id (funcall (quote gensymbol)   "Ensure String Datum"  #|line 111|#)))
    (declare (ignorable name_with_id))
    (return-from ensure_string_datum_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  #'ensure_string_datum_handler  #|line 112|#))) #|line 113|#
  )
(defun ensure_string_datum_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 115|#
  (cond
    (( equal    "string" (funcall (slot-value (slot-value  mev 'datum) 'kind) )) #|line 116|#
      (funcall (quote forward)   eh  ""  mev                #|line 117|#)
      )
    (t                                                      #|line 118|#
      (let ((emev  (concatenate 'string  "*** ensure: type error (expected a string datum) but got " (slot-value  mev 'datum)) #|line 119|#))
        (declare (ignorable emev))
        (funcall (quote send)   eh  "✗"  emev  mev          #|line 120|#)) #|line 121|#
      ))                                                    #|line 122|#
  )
(defclass Syncfilewrite_Data ()                             #|line 124|#
  (
    (filename :accessor filename :initarg :filename :initform  "")  #|line 125|#)) #|line 126|#

                                                            #|line 127|# #|  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) |# #|line 128|#
(defun syncfilewrite_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 129|#
  (let ((name_with_id (funcall (quote gensymbol)   "syncfilewrite"  #|line 130|#)))
    (declare (ignorable name_with_id))
    (let ((inst  (make-instance 'Syncfilewrite_Data)        #|line 131|#))
      (declare (ignorable inst))
      (return-from syncfilewrite_instantiate (funcall (quote make_leaf)   name_with_id  owner  inst  #'syncfilewrite_handler  #|line 132|#)))) #|line 133|#
  )
(defun syncfilewrite_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 135|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 136|#
    (cond
      (( equal    "filename" (slot-value  mev 'port))       #|line 137|#
        (setf (slot-value  inst 'filename) (slot-value (slot-value  mev 'datum) 'v)) #|line 138|#
        )
      (( equal    "input" (slot-value  mev 'port))          #|line 139|#
        (let ((contents (slot-value (slot-value  mev 'datum) 'v)))
          (declare (ignorable contents))                    #|line 140|#
          (let (( f (funcall (quote open)  (slot-value  inst 'filename)  "w"  #|line 141|#)))
            (declare (ignorable  f))
            (cond
              ((not (equal   f  nil))                       #|line 142|#
                (funcall (slot-value  f 'write)  (slot-value (slot-value  mev 'datum) 'v)  #|line 143|#)
                (funcall (slot-value  f 'close) )           #|line 144|#
                (funcall (quote send)   eh  "done" (funcall (quote new_datum_bang) )  mev  #|line 145|#)
                )
              (t                                            #|line 146|#
                (funcall (quote send)   eh  "✗"  (concatenate 'string  "open error on file " (slot-value  inst 'filename))  mev  #|line 147|#) #|line 148|#
                ))))                                        #|line 149|#
        )))                                                 #|line 150|#
  )
(defclass StringConcat_Instance_Data ()                     #|line 152|#
  (
    (buffer1 :accessor buffer1 :initarg :buffer1 :initform  nil)  #|line 153|#
    (buffer2 :accessor buffer2 :initarg :buffer2 :initform  nil)  #|line 154|#)) #|line 155|#

                                                            #|line 156|#
(defun stringconcat_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 157|#
  (let ((name_with_id (funcall (quote gensymbol)   "stringconcat"  #|line 158|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringConcat_Instance_Data) #|line 159|#))
      (declare (ignorable instp))
      (return-from stringconcat_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'stringconcat_handler  #|line 160|#)))) #|line 161|#
  )
(defun stringconcat_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 163|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 164|#
    (cond
      (( equal    "1" (slot-value  mev 'port))              #|line 165|#
        (setf (slot-value  inst 'buffer1) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 166|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 167|#)
        )
      (( equal    "2" (slot-value  mev 'port))              #|line 168|#
        (setf (slot-value  inst 'buffer2) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 169|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 170|#)
        )
      (( equal    "reset" (slot-value  mev 'port))          #|line 171|#
        (setf (slot-value  inst 'buffer1)  nil)             #|line 172|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 173|#
        )
      (t                                                    #|line 174|#
        (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port for stringconcat: " (slot-value  mev 'port))  #|line 175|#) #|line 176|#
        )))                                                 #|line 177|#
  )
(defun maybe_stringconcat (&optional  eh  inst  mev)
  (declare (ignorable  eh  inst  mev))                      #|line 179|#
  (cond
    (( and  (not (equal  (slot-value  inst 'buffer1)  nil)) (not (equal  (slot-value  inst 'buffer2)  nil))) #|line 180|#
      (let (( concatenated_string  ""))
        (declare (ignorable  concatenated_string))          #|line 181|#
        (cond
          (( equal    0 (length (slot-value  inst 'buffer1))) #|line 182|#
            (setf  concatenated_string (slot-value  inst 'buffer2)) #|line 183|#
            )
          (( equal    0 (length (slot-value  inst 'buffer2))) #|line 184|#
            (setf  concatenated_string (slot-value  inst 'buffer1)) #|line 185|#
            )
          (t                                                #|line 186|#
            (setf  concatenated_string (+ (slot-value  inst 'buffer1) (slot-value  inst 'buffer2))) #|line 187|# #|line 188|#
            ))
        (funcall (quote send)   eh  ""  concatenated_string  mev  #|line 189|#)
        (setf (slot-value  inst 'buffer1)  nil)             #|line 190|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 191|#) #|line 192|#
      ))                                                    #|line 193|#
  ) #|  |#                                                  #|line 195|# #|line 196|#
(defun string_constant_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 197|# #|line 198|#
  (let ((name_with_id (funcall (quote gensymbol)   "strconst"  #|line 199|#)))
    (declare (ignorable name_with_id))
    (let (( s  template_data))
      (declare (ignorable  s))                              #|line 200|#
      (cond
        ((not (equal   projectRoot  ""))                    #|line 201|#
          (setf  s (substitute  "_00_"  projectRoot  s)     #|line 202|#) #|line 203|#
          ))
      (return-from string_constant_instantiate (funcall (quote make_leaf)   name_with_id  owner  s  #'string_constant_handler  #|line 204|#)))) #|line 205|#
  )
(defun string_constant_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 207|#
  (let ((s (slot-value  eh 'instance_data)))
    (declare (ignorable s))                                 #|line 208|#
    (funcall (quote send)   eh  ""  s  mev                  #|line 209|#)) #|line 210|#
  )
(defun fakepipename_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 212|#
  (let ((instance_name (funcall (quote gensymbol)   "fakepipe"  #|line 213|#)))
    (declare (ignorable instance_name))
    (return-from fakepipename_instantiate (funcall (quote make_leaf)   instance_name  owner  nil  #'fakepipename_handler  #|line 214|#))) #|line 215|#
  )
(defparameter  rand  0)                                     #|line 217|# #|line 218|#
(defun fakepipename_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 219|# #|line 220|#
  (setf  rand (+  rand  1))
  #|  not very random, but good enough _ ;rand' must be unique within a single run |# #|line 221|#
  (funcall (quote send)   eh  ""  (concatenate 'string  "/tmp/fakepipe"  rand)  mev  #|line 222|#) #|line 223|#
  )                                                         #|line 225|#
(defclass Switch1star_Instance_Data ()                      #|line 226|#
  (
    (state :accessor state :initarg :state :initform  "1")  #|line 227|#)) #|line 228|#

                                                            #|line 229|#
(defun switch1star_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 230|#
  (let ((name_with_id (funcall (quote gensymbol)   "switch1*"  #|line 231|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'Switch1star_Instance_Data) #|line 232|#))
      (declare (ignorable instp))
      (return-from switch1star_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'switch1star_handler  #|line 233|#)))) #|line 234|#
  )
(defun switch1star_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 236|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 237|#
    (let ((whichOutput (slot-value  inst 'state)))
      (declare (ignorable whichOutput))                     #|line 238|#
      (cond
        (( equal    "" (slot-value  mev 'port))             #|line 239|#
          (cond
            (( equal    "1"  whichOutput)                   #|line 240|#
              (funcall (quote forward)   eh  "1"  mev       #|line 241|#)
              (setf (slot-value  inst 'state)  "*")         #|line 242|#
              )
            (( equal    "*"  whichOutput)                   #|line 243|#
              (funcall (quote forward)   eh  "*"  mev       #|line 244|#)
              )
            (t                                              #|line 245|#
              (funcall (quote send)   eh  "✗"  "internal error bad state in switch1*"  mev  #|line 246|#) #|line 247|#
              ))
          )
        (( equal    "reset" (slot-value  mev 'port))        #|line 248|#
          (setf (slot-value  inst 'state)  "1")             #|line 249|#
          )
        (t                                                  #|line 250|#
          (funcall (quote send)   eh  "✗"  "internal error bad mevent for switch1*"  mev  #|line 251|#) #|line 252|#
          ))))                                              #|line 253|#
  )
(defclass StringAccumulator ()                              #|line 255|#
  (
    (s :accessor s :initarg :s :initform  "")               #|line 256|#)) #|line 257|#

                                                            #|line 258|#
(defun strcatstar_instantiate (&optional  reg  owner  name  template_data)
  (declare (ignorable  reg  owner  name  template_data))    #|line 259|#
  (let ((name_with_id (funcall (quote gensymbol)   "String Concat *"  #|line 260|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringAccumulator)        #|line 261|#))
      (declare (ignorable instp))
      (return-from strcatstar_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'strcatstar_handler  #|line 262|#)))) #|line 263|#
  )
(defun strcatstar_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 265|#
  (let (( accum (slot-value  eh 'instance_data)))
    (declare (ignorable  accum))                            #|line 266|#
    (cond
      (( equal    "" (slot-value  mev 'port))               #|line 267|#
        (setf (slot-value  accum 's)  (concatenate 'string (slot-value  accum 's) (slot-value (slot-value  mev 'datum) 'v)) #|line 268|#)
        )
      (( equal    "fini" (slot-value  mev 'port))           #|line 269|#
        (funcall (quote send)   eh  "" (slot-value  accum 's)  mev  #|line 270|#)
        )
      (t                                                    #|line 271|#
        (funcall (quote send)   eh  "✗"  "internal error bad mevent for String Concat *"  mev  #|line 272|#) #|line 273|#
        )))                                                 #|line 274|#
  ) #|  all of the the built_in leaves are listed here |#   #|line 276|# #|  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project |# #|line 277|# #|line 278|#
(defun initialize_stock_components (&optional  reg)
  (declare (ignorable  reg))                                #|line 279|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1then2"  nil  #'deracer_instantiate )  #|line 280|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?A"  nil  #'probeA_instantiate )  #|line 281|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?B"  nil  #'probeB_instantiate )  #|line 282|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "?C"  nil  #'probeC_instantiate )  #|line 283|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "trash"  nil  #'trash_instantiate )  #|line 284|#) #|line 285|# #|line 286|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Read Text File"  nil  #'low_level_read_text_file_instantiate )  #|line 287|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Ensure String Datum"  nil  #'ensure_string_datum_instantiate )  #|line 288|#) #|line 289|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "syncfilewrite"  nil  #'syncfilewrite_instantiate )  #|line 290|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "stringconcat"  nil  #'stringconcat_instantiate )  #|line 291|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "switch1*"  nil  #'switch1star_instantiate )  #|line 292|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "String Concat *"  nil  #'strcatstar_instantiate )  #|line 293|#)
  #|  for fakepipe |#                                       #|line 294|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "fakepipename"  nil  #'fakepipename_instantiate )  #|line 295|#) #|line 296|#
  )