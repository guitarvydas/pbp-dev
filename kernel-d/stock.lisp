#|line 1|#
(defun trash_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 2|#
  (let ((name_with_id (funcall (quote gensymbol)   "trash"  #|line 3|#)))
    (declare (ignorable name_with_id))
    (return-from trash_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'trash_handler  nil  #|line 4|#))) #|line 5|#
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
(defun deracer_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 26|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 27|#
    (setf (slot-value  inst 'state)  "idle")                #|line 28|#
    (setf (slot-value  inst 'buffer)  (make-instance 'TwoMevents) #|line 29|#)) #|line 30|#
  )
(defun deracer_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 32|#
  (let ((name_with_id (funcall (quote gensymbol)   "deracer"  #|line 33|#)))
    (declare (ignorable name_with_id))
    (let (( inst  (make-instance 'Deracer_Instance_Data)    #|line 34|#))
      (declare (ignorable  inst))
      (setf (slot-value  inst 'state)  "idle")              #|line 35|#
      (setf (slot-value  inst 'buffer)  (make-instance 'TwoMevents) #|line 36|#)
      (let ((eh (funcall (quote make_leaf)   name_with_id  owner  inst  ""  #'deracer_handler  #'deracer_reset_handler  #|line 37|#)))
        (declare (ignorable eh))
        (return-from deracer_instantiate  eh)               #|line 38|#))) #|line 39|#
  )
(defun send_firstmev_then_secondmev (&optional  eh  inst)
  (declare (ignorable  eh  inst))                           #|line 41|#
  (funcall (quote forward)   eh  "1" (slot-value (slot-value  inst 'buffer) 'firstmev)  #|line 42|#)
  (funcall (quote forward)   eh  "2" (slot-value (slot-value  inst 'buffer) 'secondmev)  #|line 43|#)
  (funcall (quote reclaim_Buffers_from_heap)   inst         #|line 44|#) #|line 45|#
  )
(defun deracer_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 47|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 48|#
    (cond
      (( equal   (slot-value  inst 'state)  "idle")         #|line 49|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 50|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 51|#
            (setf (slot-value  inst 'state)  "waitingForSecondmev") #|line 52|#
            )
          (( equal    "2" (slot-value  mev 'port))          #|line 53|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 54|#
            (setf (slot-value  inst 'state)  "waitingForFirstmev") #|line 55|#
            )
          (t                                                #|line 56|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case A) for deracer " (slot-value  mev 'port))  #|line 57|#) #|line 58|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForFirstmev") #|line 59|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 60|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 61|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 62|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 63|#
            )
          (t                                                #|line 64|#
            (funcall (quote runtime_error)   (concatenate 'string  "deracer: waiting for 1 but got ["  (concatenate 'string (slot-value  mev 'port)  "] (case B)"))  #|line 65|#) #|line 66|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForSecondmev") #|line 67|#
        (cond
          (( equal    "2" (slot-value  mev 'port))          #|line 68|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 69|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 70|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 71|#
            )
          (t                                                #|line 72|#
            (funcall (quote runtime_error)   (concatenate 'string  "deracer: waiting for 2 but got ["  (concatenate 'string (slot-value  mev 'port)  "] (case C)"))  #|line 73|#) #|line 74|#
            ))
        )
      (t                                                    #|line 75|#
        (funcall (quote runtime_error)   "bad state for deracer {eh.state}"  #|line 76|#) #|line 77|#
        )))                                                 #|line 78|#
  )
(defun low_level_read_text_file_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 80|#
  (let ((name_with_id (funcall (quote gensymbol)   "Low Level Read Text File"  #|line 81|#)))
    (declare (ignorable name_with_id))
    (return-from low_level_read_text_file_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'low_level_read_text_file_handler  nil  #|line 82|#))) #|line 83|#
  )
(defun low_level_read_text_file_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 85|#
  (let ((fname (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable fname))                             #|line 86|#

    ;; read text from a named file fname, send the text out on port "" else send error info on port "✗"
    ;; given eh and mev if needed
    (handler-bind ((error #'(lambda (condition) (send_string eh "✗" (format nil "~&~A~&" condition)))))
      (with-open-file (stream fname)
        (let ((contents (make-string (file-length stream))))
          (read-sequence contents stream)
          (send_string eh "" contents))))
                                                            #|line 87|#) #|line 88|#
  )
(defun ensure_string_datum_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 90|#
  (let ((name_with_id (funcall (quote gensymbol)   "Ensure String Datum"  #|line 91|#)))
    (declare (ignorable name_with_id))
    (return-from ensure_string_datum_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'ensure_string_datum_handler  nil  #|line 92|#))) #|line 93|#
  )
(defun ensure_string_datum_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 95|#
  (cond
    (( equal    "string" (funcall (slot-value (slot-value  mev 'datum) 'kind) )) #|line 96|#
      (funcall (quote forward)   eh  ""  mev                #|line 97|#)
      )
    (t                                                      #|line 98|#
      (let ((emev  (concatenate 'string  "*** ensure: type error (expected a string datum) but got " (slot-value  mev 'datum)) #|line 99|#))
        (declare (ignorable emev))
        (funcall (quote send)   eh  "✗"  emev  mev          #|line 100|#)) #|line 101|#
      ))                                                    #|line 102|#
  )
(defclass Syncfilewrite_Data ()                             #|line 104|#
  (
    (filename :accessor filename :initarg :filename :initform  "")  #|line 105|#)) #|line 106|#

                                                            #|line 107|#
(defun syncfilewrite_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 108|#
  (setf (slot-value  eh 'instance_data)  (make-instance 'Syncfilewrite_Data) #|line 109|#) #|line 110|#
  ) #|  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) |# #|line 112|#
(defun syncfilewrite_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 113|#
  (let ((name_with_id (funcall (quote gensymbol)   "syncfilewrite"  #|line 114|#)))
    (declare (ignorable name_with_id))
    (let ((inst  (make-instance 'Syncfilewrite_Data)        #|line 115|#))
      (declare (ignorable inst))
      (return-from syncfilewrite_instantiate (funcall (quote make_leaf)   name_with_id  owner  inst  ""  #'syncfilewrite_handler  #'syncfilewrite_reset_handler  #|line 116|#)))) #|line 117|#
  )
(defun syncfilewrite_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 119|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 120|#
    (cond
      (( equal    "filename" (slot-value  mev 'port))       #|line 121|#
        (setf (slot-value  inst 'filename) (slot-value (slot-value  mev 'datum) 'v)) #|line 122|#
        )
      (( equal    "input" (slot-value  mev 'port))          #|line 123|#
        (let ((contents (slot-value (slot-value  mev 'datum) 'v)))
          (declare (ignorable contents))                    #|line 124|#
          (let (( f (funcall (quote open)  (slot-value  inst 'filename)  "w"  #|line 125|#)))
            (declare (ignorable  f))
            (cond
              ((not (equal   f  nil))                       #|line 126|#
                (funcall (slot-value  f 'write)  (slot-value (slot-value  mev 'datum) 'v)  #|line 127|#)
                (funcall (slot-value  f 'close) )           #|line 128|#
                (funcall (quote send)   eh  "done" (funcall (quote new_datum_bang) )  mev  #|line 129|#)
                )
              (t                                            #|line 130|#
                (funcall (quote send)   eh  "✗"  (concatenate 'string  "open error on file " (slot-value  inst 'filename))  mev  #|line 131|#) #|line 132|#
                ))))                                        #|line 133|#
        )))                                                 #|line 134|#
  )
(defclass StringConcat_Instance_Data ()                     #|line 136|#
  (
    (buffer1 :accessor buffer1 :initarg :buffer1 :initform  nil)  #|line 137|#
    (buffer2 :accessor buffer2 :initarg :buffer2 :initform  nil)  #|line 138|#)) #|line 139|#

                                                            #|line 140|#
(defun strinconcat_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 141|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 142|#
    (setf (slot-value  inst 'buffer1)  nil)                 #|line 143|#
    (setf (slot-value  inst 'buffer2)  nil)                 #|line 144|#) #|line 145|#
  )
(defun stringconcat_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 147|#
  (let ((name_with_id (funcall (quote gensymbol)   "stringconcat"  #|line 148|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringConcat_Instance_Data) #|line 149|#))
      (declare (ignorable instp))
      (return-from stringconcat_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'stringconcat_handler  #'stringconcat_reset_handler  #|line 150|#)))) #|line 151|#
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
(defun string_constant_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 187|# #|line 188|#
  (let ((name_with_id (funcall (quote gensymbol)   "strconst"  #|line 189|#)))
    (declare (ignorable name_with_id))
    (let (( s  template_data))
      (declare (ignorable  s))                              #|line 190|#
      (cond
        ((not (equal   projectRoot  ""))                    #|line 191|#
          (setf  s (substitute  "_00_"  projectRoot  s)     #|line 192|#) #|line 193|#
          ))
      (return-from string_constant_instantiate (funcall (quote make_leaf)   name_with_id  owner  s  ""  #'string_constant_handler  nil  #|line 194|#)))) #|line 195|#
  )
(defun string_constant_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 197|#
  (let ((s (slot-value  eh 'instance_data)))
    (declare (ignorable s))                                 #|line 198|#
    (funcall (quote send)   eh  ""  s  mev                  #|line 199|#)) #|line 200|#
  )
(defun fakepipename_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 202|#
  (let ((instance_name (funcall (quote gensymbol)   "fakepipe"  #|line 203|#)))
    (declare (ignorable instance_name))
    (return-from fakepipename_instantiate (funcall (quote make_leaf)   instance_name  owner  nil  ""  #'fakepipename_handler  nil  #|line 204|#))) #|line 205|#
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
(defun switch1star_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 220|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 221|#
    (setf  inst  (make-instance 'Switch1star_Instance_Data) #|line 222|#)) #|line 223|#
  )
(defun switch1star_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 225|#
  (let ((name_with_id (funcall (quote gensymbol)   "switch1*"  #|line 226|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'Switch1star_Instance_Data) #|line 227|#))
      (declare (ignorable instp))
      (return-from switch1star_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'switch1star_handler  #'switch1star_reset_handler  #|line 228|#)))) #|line 229|#
  )
(defun switch1star_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 231|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 232|#
    (let ((whichOutput (slot-value  inst 'state)))
      (declare (ignorable whichOutput))                     #|line 233|#
      (cond
        (( equal    "" (slot-value  mev 'port))             #|line 234|#
          (cond
            (( equal    "1"  whichOutput)                   #|line 235|#
              (funcall (quote forward)   eh  "1"  mev       #|line 236|#)
              (setf (slot-value  inst 'state)  "*")         #|line 237|#
              )
            (( equal    "*"  whichOutput)                   #|line 238|#
              (funcall (quote forward)   eh  "*"  mev       #|line 239|#)
              )
            (t                                              #|line 240|#
              (funcall (quote send)   eh  "✗"  "internal error bad state in switch1*"  mev  #|line 241|#) #|line 242|#
              ))
          )
        (( equal    "reset" (slot-value  mev 'port))        #|line 243|#
          (setf (slot-value  inst 'state)  "1")             #|line 244|#
          )
        (t                                                  #|line 245|#
          (funcall (quote send)   eh  "✗"  "internal error bad mevent for switch1*"  mev  #|line 246|#) #|line 247|#
          ))))                                              #|line 248|#
  )
(defclass StringAccumulator ()                              #|line 250|#
  (
    (s :accessor s :initarg :s :initform  "")               #|line 251|#)) #|line 252|#

                                                            #|line 253|#
(defun strcatstar_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 254|#
  (setf (slot-value  eh 'instance_data)  (make-instance 'StringAccumulator) #|line 255|#) #|line 256|#
  )
(defun strcatstar_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 258|#
  (let ((name_with_id (funcall (quote gensymbol)   "String Concat *"  #|line 259|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringAccumulator)        #|line 260|#))
      (declare (ignorable instp))
      (return-from strcatstar_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'strcatstar_handler  #'strcatstar_reset_handler  #|line 261|#)))) #|line 262|#
  )
(defun strcatstar_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 264|#
  (let (( accum (slot-value  eh 'instance_data)))
    (declare (ignorable  accum))                            #|line 265|#
    (cond
      (( equal    "" (slot-value  mev 'port))               #|line 266|#
        (setf (slot-value  accum 's)  (concatenate 'string (slot-value  accum 's) (slot-value (slot-value  mev 'datum) 'v)) #|line 267|#)
        )
      (( equal    "fini" (slot-value  mev 'port))           #|line 268|#
        (funcall (quote send)   eh  "" (slot-value  accum 's)  mev  #|line 269|#)
        )
      (t                                                    #|line 270|#
        (funcall (quote send)   eh  "✗"  "internal error bad mevent for String Concat *"  mev  #|line 271|#) #|line 272|#
        )))                                                 #|line 273|#
  )
(defclass BlockOnErrorState ()                              #|line 275|#
  (
    (hasError :accessor hasError :initarg :hasError :initform  "no")  #|line 276|#)) #|line 277|#

                                                            #|line 278|#
(defun blockOnError_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 279|#
  (setf (slot-value  eh 'instance_data)  (make-instance 'BlockOnErrorState) #|line 280|#) #|line 281|#
  )
(defun blockOnError_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 283|#
  (let ((name_with_id (funcall (quote gensymbol)   "blockOnError"  #|line 284|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'BlockOnErrorState)        #|line 285|#))
      (declare (ignorable instp))
      (return-from blockOnError_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'blockOnError_handler  #'blockOnError_reset_handler  #|line 286|#)))) #|line 287|#
  )
(defun blockOnError_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 289|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 290|#
    (cond
      (( equal    "" (slot-value  mev 'port))               #|line 291|#
        (cond
          (( equal   (slot-value  inst 'hasError)  "no")    #|line 292|#
            (funcall (quote send)   eh  "" (slot-value (slot-value  mev 'datum) 'v)  mev  #|line 293|#) #|line 294|#
            ))
        )
      (( equal    "✗" (slot-value  mev 'port))              #|line 295|#
        (setf (slot-value  inst 'hasError)  "yes")          #|line 296|#
        )
      (( equal    "reset" (slot-value  mev 'port))          #|line 297|#
        (setf (slot-value  inst 'hasError)  "no")           #|line 298|# #|line 299|#
        )))                                                 #|line 300|#
  )
(defun stop_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 302|#
  (let ((name_with_id (funcall (quote gensymbol)   "blockOnError"  #|line 303|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'BlockOnErrorState)        #|line 304|#))
      (declare (ignorable instp))
      (return-from stop_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  #'blockOnError_handler  nil  #|line 305|#)))) #|line 306|#
  )
(defun stop_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 308|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 309|#
    (let (( parent (slot-value  inst 'owner)))
      (declare (ignorable  parent))                         #|line 310|#
      (funcall (slot-value  parent 'stop) )                 #|line 311|#
      (funcall (quote forward)   eh  ""  mev                #|line 312|#))) #|line 313|#
  ) #|  all of the the built_in leaves are listed here |#   #|line 315|# #|  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project |# #|line 316|# #|line 317|#
(defun initialize_stock_components (&optional  reg)
  (declare (ignorable  reg))                                #|line 318|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1then2"  nil  #'deracer_instantiate )  #|line 319|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1→2"  nil  #'deracer_instantiate )  #|line 320|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "trash"  nil  #'trash_instantiate )  #|line 321|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "🗑️"  nil  #'trash_instantiate )  #|line 322|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "🚫"  nil  #'stop_instantiate )  #|line 323|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "blockOnError"  nil  #'blockOnError_instantiate )  #|line 324|#) #|line 325|# #|line 326|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Read Text File"  nil  #'low_level_read_text_file_instantiate )  #|line 327|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Ensure String Datum"  nil  #'ensure_string_datum_instantiate )  #|line 328|#) #|line 329|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "syncfilewrite"  nil  #'syncfilewrite_instantiate )  #|line 330|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "String Concat"  nil  #'stringconcat_instantiate )  #|line 331|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "switch1*"  nil  #'switch1star_instantiate )  #|line 332|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "String Concat *"  nil  #'strcatstar_instantiate )  #|line 333|#)
  #|  for fakepipe |#                                       #|line 334|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "fakepipename"  nil  #'fakepipename_instantiate )  #|line 335|#) #|line 336|#
  )
