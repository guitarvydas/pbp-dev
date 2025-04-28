
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
          (funcall (quote send)   eh  ""  (subseq  (subseq  s 1) 1)  mev  #|line 10|#) #|line 11|#
          ))))                                              #|line 12|#
  )
(defun probe_handler (&optional  eh  s  mev)
  (declare (ignorable  eh  s  mev))                         #|line 14|#
  (live_update  "Info"  (concatenate 'string  "  @"  (concatenate 'string (format nil "~a"  ticktime)  (concatenate 'string  "  "  (concatenate 'string  "probe "  (concatenate 'string  ": " (format nil "~a"  s))))))) #|line 20|# #|line 21|#
  )
(defun shell_out_handler (&optional  eh  cmd  mev)
  (declare (ignorable  eh  cmd  mev))                       #|line 23|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 24|#
    (let (( ret  nil))
      (declare (ignorable  ret))                            #|line 25|#
      (let (( rc  nil))
        (declare (ignorable  rc))                           #|line 26|#
        (let (( stdout  nil))
          (declare (ignorable  stdout))                     #|line 27|#
          (let (( stderr  nil))
            (declare (ignorable  stderr))                   #|line 28|#
            (multiple-value-setq (stdout stderr rc) (uiop::run-program (concatenate 'string  cmd " "  s) :output :string :error :string)) #|line 29|#
            (cond
              (( equal    rc  0)                            #|line 30|#
                (funcall (quote send)   eh  ""  (concatenate 'string  stdout  stderr)  mev  #|line 31|#)
                )
              (t                                            #|line 32|#
                (funcall (quote send)   eh  "✗"  (concatenate 'string  stdout  stderr)  mev  #|line 33|#) #|line 34|#
                )))))))                                     #|line 35|#
  )