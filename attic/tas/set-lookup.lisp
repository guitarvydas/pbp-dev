(defun set-lookup (key-string obj v)
  (let ((key (intern (string-upcase key-string) "KEYWORD")))
    (let ((pair (assoc key obj)))
      (if pair
          (setf (cdr pair) v)
        nil))))
(defsetf lookup set-lookup)
