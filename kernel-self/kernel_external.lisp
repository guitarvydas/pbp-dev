(defun handle_external (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 1|#
  (let ((s (slot-value  eh 'arg)))
    (declare (ignorable s))                                 #|line 2|#
    (let (( firstc (nth  1  s)))
      (declare (ignorable  firstc))                         #|line 3|#
      (cond
        (( equal    firstc  "$")                            #|line 4|#
          (funcall (quote shell_out_handler)   eh  (subseq  (subseq  (subseq  s 1) 1) 1)  mev  #|line 5|#)
          )
        (( equal    firstc  "?")                            #|line 6|#
          (funcall (quote probe_handler)   eh  (subseq  s 1)  mev  #|line 7|#)
          )
        (t                                                  #|line 8|#
          #|  just a string, send it out  |#                #|line 9|#
          (funcall (quote send)   eh  ""  (subseq  s 1)  mev  #|line 10|#) #|line 11|#
          ))))                                              #|line 12|#
  )
(defun probe_handler (&optional  eh  tag  mev)
  (declare (ignorable  eh  tag  mev))                       #|line 14|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 15|#
    (live_update  "Info"  (concatenate 'string  "  @"  (concatenate 'string (format nil "~a"  ticktime)  (concatenate 'string  "  "  (concatenate 'string  "probe "  (concatenate 'string (slot-value  eh 'name)  (concatenate 'string  ": " (format nil "~a"  s)))))))) #|line 23|#) #|line 24|#
  )
(defun shell_out_handler (&optional  eh  cmd  mev)
  (declare (ignorable  eh  cmd  mev))                       #|line 26|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 27|#
    (let (( ret  nil))
      (declare (ignorable  ret))                            #|line 28|#
      (let (( rc  nil))
        (declare (ignorable  rc))                           #|line 29|#
        (let (( stdout  nil))
          (declare (ignorable  stdout))                     #|line 30|#
          (let (( stderr  nil))
            (declare (ignorable  stderr))                   #|line 31|#
            (let (( command  cmd))
              (declare (ignorable  command))                #|line 32|#
              (let (( pbpRoot (uiop:getenv "PBP")           #|line 33|#))
                (declare (ignorable  pbpRoot))
                (cond
                  ((not (equal   pbpRoot  ""))              #|line 34|#
                    (setf  command (substitute  "_/"  (concatenate 'string  pbpRoot  "/")  command) #|line 37|#) #|line 38|#
                    ))
                (multiple-value-setq (stdout stderr rc) (uiop::run-program (concatenate 'string  command " "  s) :output :string :error :string)) #|line 39|#
                (cond
                  (( equal    rc  0)                        #|line 40|#
                    (funcall (quote send)   eh  ""  (concatenate 'string  stdout  stderr)  mev  #|line 41|#)
                    )
                  (t                                        #|line 42|#
                    (funcall (quote send)   eh  "✗"  (concatenate 'string  stdout  stderr)  mev  #|line 43|#) #|line 44|#
                    )))))))))                               #|line 45|#
  )
