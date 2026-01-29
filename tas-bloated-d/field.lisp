(defun field (obj key) 
  (let ((pair (assoc key obj :test 'equal)))
      (if pair (cdr pair) nil)))

(defun (setf field) (v obj key)
  (let ((pair (assoc key obj :test 'equal)))
      (if pair
          (setf (cdr pair) v)
        (error (format nil "error in setf field, key %s not found" key)))))


;; test
(defun Component_Registry (&optional )
  (list
    (cons "templates"  nil)))

(defun test ()
  (let ((reg (Component_Registry)))
    (format *standard-output*  "initial value of reg ~s~%" reg)
    (setf (field reg "templates") (cons '(a . 2) (field reg "templates")))
    (format *standard-output*  "second value of reg ~s~%" reg)
    (setf (field reg "templates") (cons '(b . 3) (field reg "templates")))
    (format *standard-output*  "third value of reg ~s~%" reg)))

  
