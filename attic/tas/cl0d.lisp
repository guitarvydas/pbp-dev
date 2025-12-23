

(defun subscripted_digit ( n)
  (cond 
    (( <=  ( and  ( >=   n  0)  n)  29)
        (return-from subscripted_digit (nth  n  digits)))))




