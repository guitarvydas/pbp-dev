#|  (This used to be called `external` due to historical reasons). This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way.  |# #|line 1|# #|line 2|#
(defun jit_instantiate (&optional  reg  owner  name  arg)
  (declare (ignorable  reg  owner  name  arg))              #|line 3|#
  (let ((name_with_id (funcall (quote gensymbol)   name     #|line 4|#)))
    (declare (ignorable name_with_id))
    (let (( inst (funcall (quote make_leaf)   name_with_id  owner  nil  arg  #'handle_jit  nil  #|line 5|#)))
      (declare (ignorable  inst))
      (let (( firstc (nth  1  name)))
        (declare (ignorable  firstc))                       #|line 6|#
        (cond
          ((not (equal   firstc  "$"))                      #|line 7|#
            #|  probes get to go to the front of the line  |# #|line 8|#
            (setf (slot-value  inst 'special)  t)           #|line 9|# #|line 10|#
            ))
        (return-from jit_instantiate  inst)                 #|line 11|#))) #|line 12|#
  )
(defun handle_jit (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 14|#
  (let ((s (slot-value  eh 'arg)))
    (declare (ignorable s))                                 #|line 15|#
    (let (( firstc (nth  1  s)))
      (declare (ignorable  firstc))                         #|line 16|#
      (cond
        (( equal    firstc  "$")                            #|line 17|#
          (funcall (quote shell_out_handler)   eh  (subseq  (subseq  (subseq  s 1) 1) 1)  mev  #|line 18|#)
          )
        (( equal    firstc  "?")                            #|line 19|#
          (funcall (quote probe_handler)   eh  (subseq  s 1)  mev  #|line 20|#)
          )
        (t                                                  #|line 21|#
          #|  just a string, send it out  |#                #|line 22|#
          (funcall (quote send)   eh  ""  (subseq  s 1)  mev  #|line 23|#) #|line 24|#
          ))))                                              #|line 25|#
  )
(defun probe_handler (&optional  eh  tag  mev)
  (declare (ignorable  eh  tag  mev))                       #|line 27|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 28|#
    (live_update  "Info"  (concatenate 'string  "  @"  (concatenate 'string (format nil "~a"  ticktime)  (concatenate 'string  "  "  (concatenate 'string  "probe "  (concatenate 'string (slot-value  eh 'name)  (concatenate 'string  ": " (format nil "~a"  s)))))))) #|line 36|#) #|line 37|#
  )
(defun shell_out_handler (&optional  eh  cmd  mev)
  (declare (ignorable  eh  cmd  mev))                       #|line 39|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 40|#
    (let (( ret  nil))
      (declare (ignorable  ret))                            #|line 41|#
      (let (( rc  nil))
        (declare (ignorable  rc))                           #|line 42|#
        (let (( stdout  nil))
          (declare (ignorable  stdout))                     #|line 43|#
          (let (( stderr  nil))
            (declare (ignorable  stderr))                   #|line 44|#
            (let (( command  cmd))
              (declare (ignorable  command))                #|line 45|#
              (let (( pbpRoot (uiop:getenv "PBP")           #|line 46|#))
                (declare (ignorable  pbpRoot))
                (cond
                  ((not (equal   pbpRoot  ""))              #|line 47|#
                    (setf  command (substitute  "_/"  (concatenate 'string  pbpRoot  "/")  command) #|line 50|#) #|line 51|#
                    ))
                (cond
                  ( nil                                     #|line 52|#
                    (format *error-output* "~a~%"  (concatenate 'string  "- --- shell-out: "  command)) #|line 53|#
                    (format *error-output* "
                    ")                                      #|line 54|# #|line 55|#
                    ))
                (multiple-value-setq (stdout stderr rc) (uiop::run-program (concatenate 'string  command " "  s) :output :string :error :string)) #|line 56|#
                (cond
                  (( equal    rc  0)                        #|line 57|#
                    (funcall (quote send)   eh  ""  (concatenate 'string  stdout  stderr)  mev  #|line 58|#)
                    )
                  (t                                        #|line 59|#
                    (funcall (quote send)   eh  "✗"  (concatenate 'string  stdout  stderr)  mev  #|line 60|#) #|line 61|#
                    )))))))))                               #|line 62|#
  )
