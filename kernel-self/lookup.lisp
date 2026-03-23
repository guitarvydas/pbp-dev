(defun lookup (key-string obj)
  (let ((key (intern (string-upcase key-string) "KEYWORD")))
    (let ((pair (assoc key obj)))
      (if pair
          (cdr pair)
        nil))))
