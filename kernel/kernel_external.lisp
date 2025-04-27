
(defun handle_external (&optional  s  eh  mev)
  (declare (ignorable  s  eh  mev))                         #|line 1|#
  ( equal    firstc (nth  1  s))                            #|line 2|#
  (cond
    (( equal    firstc  "$")                                #|line 3|#
      (funcall (quote shell_out_handler)   eh  (subseq  (subseq  s 1) 1)  mev  #|line 4|#)
      )
    (( equal    firstc  "?")                                #|line 5|#
      (funcall (quote probe_handler)   eh  (subseq  s 1)  mev  #|line 6|#)
      )
    (t                                                      #|line 7|#
      #|  just a string, send it out  |#                    #|line 8|#
      (funcall (quote send)   eh  ""  (subseq  (subseq  s 1) 1)  msg  #|line 9|#) #|line 10|#
      ))                                                    #|line 11|#
  )
(defun probe_handler (&optional  eh  s  mev)
  (declare (ignorable  eh  s  mev))                         #|line 13|#
  (live_update  "Info"  (concatenate 'string  "  @"  (concatenate 'string (format nil "~a"  ticktime)  (concatenate 'string  "  "  (concatenate 'string  "probe "  (concatenate 'string  ": " (format nil "~a"  s))))))) #|line 19|# #|line 20|#
  )
(defun shell_out_handler (&optional  eh  cmd  msg)
  (declare (ignorable  eh  cmd  msg))                       #|line 22|#
  (let ((s (slot-value (slot-value  msg 'datum) 'v)))
    (declare (ignorable s))                                 #|line 23|#
    (let (( ret  nil))
      (declare (ignorable  ret))                            #|line 24|#
      (let (( rc  nil))
        (declare (ignorable  rc))                           #|line 25|#
        (let (( stdout  nil))
          (declare (ignorable  stdout))                     #|line 26|#
          (let (( stderr  nil))
            (declare (ignorable  stderr))                   #|line 27|#
            (multiple-value-setq (stdout stderr rc) (uiop::run-program (concatenate 'string  cmd " "  s) :output :string :error :string)) #|line 28|#
            (cond
              (( equal    rc  0)                            #|line 29|#
                (funcall (quote send)   eh  ""  (concatenate 'string  stdout  stderr)  msg  #|line 30|#)
                )
              (t                                            #|line 31|#
                (funcall (quote send)   eh  "✗"  (concatenate 'string  stdout  stderr)  msg  #|line 32|#) #|line 33|#
                )))))))                                     #|line 34|#
  )