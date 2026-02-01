(defclass Queue ()
  ((contents :accessor contents :initform nil)))

(defmethod enqueue ((self Queue) v)
  (setf (contents self) (append (contents self) (list v))))

(defmethod dequeue ((self Queue))
  (pop (contents self)))
    
(defmethod empty ((self Queue))
  (null (contents self)))

