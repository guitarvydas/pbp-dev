(defun is-pair? (x)
  (and
    (listp x)
    (symbolp (car x))))

(defun is-json-object? (x)
  (and
    (listp x)
    (not (atom (cdr x)))
    (= 1 (length x))
    (is-pair? x)))

(defun is-json-array? (x)
  (and
    (listp x)
    (listp (car x))))

(defun rewrite-pair (pair)
  (let ((k (if (symbolp (car pair)) 
               (symbol-name (car pair))
             (car pair))))
    (let ((x (cdr pair)))
      (let ((v (if (or (is-json-object? x) (is-json-array? x))
                   (rewrite-json x)
                 x)))
        (cons k v)))))
                         
(defun rewrite-json (x)
  (cond 
    ((is-pair? x) (rewrite-pair x))
    ((is-json-object? x) (mapcar #'rewrite-json x))
    ((is-json-array? x) (mapcar #'rewrite-json x))))    


(defun test0 ()
  (rewrite-json '(:dir . 77)))

(defun test1 ()
  (rewrite-json '(:DIR . ((a . 88)))))

(defun test2 ()
  (rewrite-json '(:DIR . ((a . 123) (b . 456) (c . 789)))))

;(defun test3 () "NIY")

(defun test4 ()
  (rewrite-json '((:FILE . "scanner.drawio") (:NAME . "main") (:CHILDREN ((:NAME . "Delay") (:ID . 4)) ((:NAME . "Larson") (:ID . 7))) (:CONNECTIONS ((:DIR . 0) (:SOURCE (:NAME . "") (:ID . 0)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Larson") (:ID . 7)) (:TARGET--PORT . "tick")) ((:DIR . 1) (:SOURCE (:NAME . "Delay") (:ID . 4)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Larson") (:ID . 7)) (:TARGET--PORT . "tick")) ((:DIR . 1) (:SOURCE (:NAME . "Larson") (:ID . 7)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Delay") (:ID . 4)) (:TARGET--PORT . ""))))))

(defun test5 ()
  (rewrite-json '(((:FILE . "scanner.drawio") (:NAME . "main") (:CHILDREN ((:NAME . "Delay") (:ID . 4)) ((:NAME . "Larson") (:ID . 7))) (:CONNECTIONS ((:DIR . 0) (:SOURCE (:NAME . "") (:ID . 0)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Larson") (:ID . 7)) (:TARGET--PORT . "tick")) ((:DIR . 1) (:SOURCE (:NAME . "Delay") (:ID . 4)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Larson") (:ID . 7)) (:TARGET--PORT . "tick")) ((:DIR . 1) (:SOURCE (:NAME . "Larson") (:ID . 7)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Delay") (:ID . 4)) (:TARGET--PORT . "")))) ((:FILE . "scanner.drawio") (:NAME . "Larson") (:CHILDREN ((:NAME . "Count") (:ID . 4)) ((:NAME . "Reverser") (:ID . 8)) ((:NAME . "Decode") (:ID . 13)) ((:NAME . "@") (:ID . 26)) ((:NAME . "@") (:ID . 28)) ((:NAME . "@") (:ID . 29)) ((:NAME . "@") (:ID . 32)) ((:NAME . "@") (:ID . 34)) ((:NAME . "@") (:ID . 36)) ((:NAME . "@") (:ID . 38)) ((:NAME . "@") (:ID . 40)) ((:NAME . "@") (:ID . 42)) ((:NAME . "@") (:ID . 44))) (:CONNECTIONS ((:DIR . 0) (:SOURCE (:NAME . "") (:ID . 0)) (:SOURCE--PORT . "tick") (:TARGET (:NAME . "Count") (:ID . 4)) (:TARGET--PORT . "adv")) ((:DIR . 1) (:SOURCE (:NAME . "Count") (:ID . 4)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Decode") (:ID . 13)) (:TARGET--PORT . "N")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "7") (:TARGET (:NAME . "@") (:ID . 34)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "8") (:TARGET (:NAME . "@") (:ID . 32)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "9") (:TARGET (:NAME . "@") (:ID . 29)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "9") (:TARGET (:NAME . "Reverser") (:ID . 8)) (:TARGET--PORT . "K")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "0") (:TARGET (:NAME . "Reverser") (:ID . 8)) (:TARGET--PORT . "J")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "5") (:TARGET (:NAME . "@") (:ID . 38)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Reverser") (:ID . 8)) (:SOURCE--PORT . "") (:TARGET (:NAME . "Count") (:ID . 4)) (:TARGET--PORT . "rev")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "0") (:TARGET (:NAME . "@") (:ID . 40)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "1") (:TARGET (:NAME . "@") (:ID . 44)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "2") (:TARGET (:NAME . "@") (:ID . 42)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "3") (:TARGET (:NAME . "@") (:ID . 28)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "4") (:TARGET (:NAME . "@") (:ID . 26)) (:TARGET--PORT . "")) ((:DIR . 1) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "6") (:TARGET (:NAME . "@") (:ID . 36)) (:TARGET--PORT . "")) ((:DIR . 2) (:SOURCE (:NAME . "Decode") (:ID . 13)) (:SOURCE--PORT . "done") (:TARGET (:NAME . "") (:ID . 0)) (:TARGET--PORT . "")))))))
