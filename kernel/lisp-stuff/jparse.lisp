;(load "~/quicklisp/setup.lisp")
(ql:quickload :uiop)
(ql:quickload :cl-json)
(proclaim '(optimize (debug 3) (safety 3) (speed 0)))

(defun jparse (filename)
  (let ((s (uiop:read-file-string filename)))
    (let ((cl-json:*json-identifier-name-to-lisp* 'identity)) ;; preserves case
      (with-input-from-string (strm s)
        (cl-json:decode-json strm)))))

(defun json2dict (filename)
  (let ((j (jparse filename)))
    (make-dict nil j)))


(defun make-dict (dict x)
  (assert (or (not (null dict)) (not (null x))))
  (cond 

    ;; done
    ((null x) dict)

    ;; bottom
    ((atom x) x)

    ;; key/value pair - put it in dict
    ((kv? x)
      (let ((v (make-dict dict (val x))))
        (setf (gethash (key x) dict) v)
	dict))

    ;; begin new dict
    ((kv? (car x))
      (let ((new-dict (make-hash-table :test 'equal)))
        (mapc #'(lambda (y)
                  (make-dict new-dict y))
          x)
        new-dict))

    ;; list of dicts (json array)
    ((not (kv? (car x)))
      ;; list of kvs (json array)
      (mapcar #'(lambda (y)
                  (make-dict nil y))
        x))))

(defun key (kv)
  (symbol-name (car kv)))

(defun val (kv)
  (cdr kv))

(defun kv? (x)
  (and (listp x)
       (atom (car x))))

(defun jtest ()
  (json2dict "~/Documents/projects-icloud/larson-icloud/scanner.drawio.json"))
