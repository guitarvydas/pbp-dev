(defun dict-fresh () nil)

(defun dict-lookup (d key-string)
  (let ((key (intern (string-upcase key-string) "KEYWORD")))
    (let ((pair (assoc key obj)))
      (if pair
          (cdr pair)
        nil))))

(defun set-dict-lookup (d key-string v)
  (let ((key (intern (string-upcase key-string) "KEYWORD")))
    (let ((pair (assoc key d)))
      (if pair
          (setf (cdr pair) v)
        nil))))

(defsetf dict-lookup set-lookup)

(defun dict-in? (d key-string)
  (let ((key (intern (string-upcase key-string) "KEYWORD")))
    (let ((pair (assoc key d)))
      (if pair t nil))))
