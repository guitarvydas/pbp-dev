(defun get-main-args ()
  (append (or 
            #+CLISP *args*
            #+SBCL *posix-argv*  
            #+LISPWORKS system:*line-arguments-list*
            #+CMU extensions:*command-line-words*
            nil) 
    '("/Users/paultarvydas/projects/rt" "." "pt was here" "main" "scanner.drawio.json")))
  
(defun larson ()
  (multiple-value-bind (palette env)
    (initialize)
    (delay_install palette)
    (count_install palette)
    (reverser_install palette)
    (decode_install palette)
    (monitor_install palette)
    
    (start palette env)))
