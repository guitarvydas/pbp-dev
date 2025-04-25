
(load "~/quicklisp/setup.lisp")
(proclaim '(optimize (debug 3) (safety 3) (speed 0)))

(defun dict (lis)
;; make a dict, given a list of pairs
(let ((ht (make-hash-table :test 'equal)))
(mapc #'(lambda (pair)
(let ((name (car pair))
(v (deep-expand (cdr pair))))
(setf (gethash name ht) v)))
lis)
ht))

(defun jarray (lis)
;; convert a JSON array into a lisp list (straight-forward, almost nothing to do)
(mapcar #'deep-expand lis))


(defun deep-expand (x)
(cond
((null x) nil)
((listp x) (cond
((eq 'dict (car x)) (dict (cdr x)))
((eq 'jarray (car x)) (jarray (cdr x)))
(t (error "unknown list in deep-expand"))))
(t x)))


(defun dict-fresh () (make-hash-table :test 'equal))

(defun dict-in? (name table)
(when (and table name)
(multiple-value-bind (dont-care found)
(gethash name table)
dont-care ;; quell warnings that dont-care is unused
found)))

(defun key-mangle (s) s)


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

(defclass Queue ()
((contents :accessor contents :initform nil)))

(defmethod enqueue ((self Queue) v)
(setf (contents self) (append (contents self) (list v))))

(defmethod dequeue ((self Queue))
(pop (contents self)))

(defmethod empty? ((self Queue))
(null (contents self)))

(defmethod queue2list ((self Queue))
(contents self))
                                                            #|line 1|# #|line 2|#
(defparameter  counter  0)                                  #|line 3|# #|line 4|#
(defparameter  digits (list                                 #|line 5|#  "₀"  "₁"  "₂"  "₃"  "₄"  "₅"  "₆"  "₇"  "₈"  "₉"  "₁₀"  "₁₁"  "₁₂"  "₁₃"  "₁₄"  "₁₅"  "₁₆"  "₁₇"  "₁₈"  "₁₉"  "₂₀"  "₂₁"  "₂₂"  "₂₃"  "₂₄"  "₂₅"  "₂₆"  "₂₇"  "₂₈"  "₂₉" )) #|line 11|# #|line 12|# #|line 13|#
(defun gensymbol (&optional  s)
  (declare (ignorable  s))                                  #|line 14|# #|line 15|#
  (let ((name_with_id  (concatenate 'string  s (funcall (quote subscripted_digit)   counter )) #|line 16|#))
    (declare (ignorable name_with_id))
    (setf  counter (+  counter  1))                         #|line 17|#
    (return-from gensymbol  name_with_id)                   #|line 18|#) #|line 19|#
  )
(defun subscripted_digit (&optional  n)
  (declare (ignorable  n))                                  #|line 21|# #|line 22|#
  (cond
    (( and  ( >=   n  0) ( <=   n  29))                     #|line 23|#
      (return-from subscripted_digit (nth  n  digits))      #|line 24|#
      )
    (t                                                      #|line 25|#
      (return-from subscripted_digit  (concatenate 'string  "₊"  n) #|line 26|#) #|line 27|#
      ))                                                    #|line 28|#
  )
(defclass Datum ()                                          #|line 30|#
  (
    (v :accessor v :initarg :v :initform  nil)              #|line 31|#
    (clone :accessor clone :initarg :clone :initform  nil)  #|line 32|#
    (reclaim :accessor reclaim :initarg :reclaim :initform  nil)  #|line 33|#
    (other :accessor other :initarg :other :initform  nil)  #|  reserved for use on per-project basis  |# #|line 34|#)) #|line 35|#

                                                            #|line 36|#
(defun new_datum_string (&optional  s)
  (declare (ignorable  s))                                  #|line 37|#
  (let ((d  (make-instance 'Datum)                          #|line 38|#))
    (declare (ignorable d))
    (setf (slot-value  d 'v)  s)                            #|line 39|#
    (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote clone_datum_string)   d  #|line 40|#)))
    (setf (slot-value  d 'reclaim)  #'(lambda (&optional )(funcall (quote reclaim_datum_string)   d  #|line 41|#)))
    (return-from new_datum_string  d)                       #|line 42|#) #|line 43|#
  )
(defun clone_datum_string (&optional  d)
  (declare (ignorable  d))                                  #|line 45|#
  (let ((newd (funcall (quote new_datum_string)  (slot-value  d 'v)  #|line 46|#)))
    (declare (ignorable newd))
    (return-from clone_datum_string  newd)                  #|line 47|#) #|line 48|#
  )
(defun reclaim_datum_string (&optional  src)
  (declare (ignorable  src))                                #|line 50|#
  #| pass |#                                                #|line 51|# #|line 52|#
  )
(defun new_datum_bang (&optional )
  (declare (ignorable ))                                    #|line 54|#
  (let ((p  (make-instance 'Datum)                          #|line 55|#))
    (declare (ignorable p))
    (setf (slot-value  p 'v)  "")                           #|line 56|#
    (setf (slot-value  p 'clone)  #'(lambda (&optional )(funcall (quote clone_datum_bang)   p  #|line 57|#)))
    (setf (slot-value  p 'reclaim)  #'(lambda (&optional )(funcall (quote reclaim_datum_bang)   p  #|line 58|#)))
    (return-from new_datum_bang  p)                         #|line 59|#) #|line 60|#
  )
(defun clone_datum_bang (&optional  d)
  (declare (ignorable  d))                                  #|line 62|#
  (return-from clone_datum_bang (funcall (quote new_datum_bang) )) #|line 63|# #|line 64|#
  )
(defun reclaim_datum_bang (&optional  d)
  (declare (ignorable  d))                                  #|line 66|#
  #| pass |#                                                #|line 67|# #|line 68|#
  ) #|  Message passed to a leaf component. |#              #|line 70|# #|  |# #|line 71|# #|  `port` refers to the name of the incoming or outgoing port of this component. |# #|line 72|# #|  `datum` is the data attached to this message. |# #|line 73|#
(defclass Message ()                                        #|line 74|#
  (
    (port :accessor port :initarg :port :initform  nil)     #|line 75|#
    (datum :accessor datum :initarg :datum :initform  nil)  #|line 76|#)) #|line 77|#

                                                            #|line 78|#
(defun clone_port (&optional  s)
  (declare (ignorable  s))                                  #|line 79|#
  (return-from clone_port (funcall (quote clone_string)   s  #|line 80|#)) #|line 81|#
  ) #|  Utility for making a `Message`. Used to safely “seed“ messages |# #|line 83|# #|  entering the very top of a network. |# #|line 84|#
(defun make_message (&optional  port  datum)
  (declare (ignorable  port  datum))                        #|line 85|#
  (let ((p (funcall (quote clone_string)   port             #|line 86|#)))
    (declare (ignorable p))
    (let (( m  (make-instance 'Message)                     #|line 87|#))
      (declare (ignorable  m))
      (setf (slot-value  m 'port)  p)                       #|line 88|#
      (setf (slot-value  m 'datum) (funcall (slot-value  datum 'clone) )) #|line 89|#
      (return-from make_message  m)                         #|line 90|#)) #|line 91|#
  ) #|  Clones a message. Primarily used internally for “fanning out“ a message to multiple destinations. |# #|line 93|#
(defun message_clone (&optional  msg)
  (declare (ignorable  msg))                                #|line 94|#
  (let (( m  (make-instance 'Message)                       #|line 95|#))
    (declare (ignorable  m))
    (setf (slot-value  m 'port) (funcall (quote clone_port)  (slot-value  msg 'port)  #|line 96|#))
    (setf (slot-value  m 'datum) (funcall (slot-value (slot-value  msg 'datum) 'clone) )) #|line 97|#
    (return-from message_clone  m)                          #|line 98|#) #|line 99|#
  ) #|  Frees a message. |#                                 #|line 101|#
(defun destroy_message (&optional  msg)
  (declare (ignorable  msg))                                #|line 102|#
  #|  during debug, dont destroy any message, since we want to trace messages, thus, we need to persist ancestor messages |# #|line 103|#
  #| pass |#                                                #|line 104|# #|line 105|#
  )
(defun destroy_datum (&optional  msg)
  (declare (ignorable  msg))                                #|line 107|#
  #| pass |#                                                #|line 108|# #|line 109|#
  )
(defun destroy_port (&optional  msg)
  (declare (ignorable  msg))                                #|line 111|#
  #| pass |#                                                #|line 112|# #|line 113|#
  ) #|  |#                                                  #|line 115|#
(defun format_message (&optional  m)
  (declare (ignorable  m))                                  #|line 116|#
  (cond
    (( equal    m  nil)                                     #|line 117|#
      (return-from format_message  (concatenate 'string  "‹"  (concatenate 'string (slot-value  m 'port)  (concatenate 'string  "›:‹"  (concatenate 'string  "ϕ"  "›,")))) #|line 118|#)
      )
    (t                                                      #|line 119|#
      (return-from format_message  (concatenate 'string  "‹"  (concatenate 'string (slot-value  m 'port)  (concatenate 'string  "›:‹"  (concatenate 'string (slot-value (slot-value  m 'datum) 'v)  "›,")))) #|line 120|#) #|line 121|#
      ))                                                    #|line 122|#
  )
(defparameter  enumDown  0)
(defparameter  enumAcross  1)
(defparameter  enumUp  2)
(defparameter  enumThrough  3)                              #|line 128|#
(defun create_down_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 129|#
  #|  JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''}, |# #|line 130|#
  (let (( connector  (make-instance 'Connector)             #|line 131|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "down")       #|line 132|#
    (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  container 'name)  container (gethash  "source_port"  proto_conn)  #|line 133|#))
    (let ((target_proto (gethash  "target"  proto_conn)))
      (declare (ignorable target_proto))                    #|line 134|#
      (let ((id_proto (gethash  "id"  target_proto)))
        (declare (ignorable id_proto))                      #|line 135|#
        (let ((target_component (gethash id_proto  children_by_id)))
          (declare (ignorable target_component))            #|line 136|#
          (cond
            (( equal    target_component  nil)              #|line 137|#
              (funcall (quote load_error)   (concatenate 'string  "internal error: .Down connection target internal error " (gethash  "name" (gethash  "target"  proto_conn))) ) #|line 138|#
              )
            (t                                              #|line 139|#
              (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  target_component 'name)  target_component (gethash  "target_port"  proto_conn) (slot-value  target_component 'inq)  #|line 140|#)) #|line 141|#
              ))
          (return-from create_down_connector  connector)    #|line 142|#)))) #|line 143|#
  )
(defun create_across_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 145|#
  (let (( connector  (make-instance 'Connector)             #|line 146|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "across")     #|line 147|#
    (let ((source_component (gethash (gethash  "id" (gethash  "source"  proto_conn))  children_by_id)))
      (declare (ignorable source_component))                #|line 148|#
      (let ((target_component (gethash (gethash  "id" (gethash  "target"  proto_conn))  children_by_id)))
        (declare (ignorable target_component))              #|line 149|#
        (cond
          (( equal    source_component  nil)                #|line 150|#
            (funcall (quote load_error)   (concatenate 'string  "internal error: .Across connection source not ok " (gethash  "name" (gethash  "source"  proto_conn)))  #|line 151|#)
            )
          (t                                                #|line 152|#
            (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  source_component 'name)  source_component (gethash  "source_port"  proto_conn)  #|line 153|#))
            (cond
              (( equal    target_component  nil)            #|line 154|#
                (funcall (quote load_error)   (concatenate 'string  "internal error: .Across connection target not ok " (gethash  "name" (gethash  "target"  proto_conn)))  #|line 155|#)
                )
              (t                                            #|line 156|#
                (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  target_component 'name)  target_component (gethash  "target_port"  proto_conn) (slot-value  target_component 'inq)  #|line 157|#)) #|line 158|#
                ))                                          #|line 159|#
            ))
        (return-from create_across_connector  connector)    #|line 160|#))) #|line 161|#
  )
(defun create_up_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 163|#
  (let (( connector  (make-instance 'Connector)             #|line 164|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "up")         #|line 165|#
    (let ((source_component (gethash (gethash  "id" (gethash  "source"  proto_conn))  children_by_id)))
      (declare (ignorable source_component))                #|line 166|#
      (cond
        (( equal    source_component  nil)                  #|line 167|#
          (funcall (quote load_error)   (concatenate 'string  "internal error: .Up connection source not ok " (gethash  "name" (gethash  "source"  proto_conn))) ) #|line 168|#
          )
        (t                                                  #|line 169|#
          (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  source_component 'name)  source_component (gethash  "source_port"  proto_conn)  #|line 170|#))
          (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  container 'name)  container (gethash  "target_port"  proto_conn) (slot-value  container 'outq)  #|line 171|#)) #|line 172|#
          ))
      (return-from create_up_connector  connector)          #|line 173|#)) #|line 174|#
  )
(defun create_through_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 176|#
  (let (( connector  (make-instance 'Connector)             #|line 177|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "through")    #|line 178|#
    (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  container 'name)  container (gethash  "source_port"  proto_conn)  #|line 179|#))
    (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  container 'name)  container (gethash  "target_port"  proto_conn) (slot-value  container 'outq)  #|line 180|#))
    (return-from create_through_connector  connector)       #|line 181|#) #|line 182|#
  )                                                         #|line 184|#
(defun container_instantiator (&optional  reg  owner  container_name  desc)
  (declare (ignorable  reg  owner  container_name  desc))   #|line 185|# #|line 186|#
  (let ((container (funcall (quote make_container)   container_name  owner  #|line 187|#)))
    (declare (ignorable container))
    (let ((children  nil))
      (declare (ignorable children))                        #|line 188|#
      (let ((children_by_id  (dict-fresh)))
        (declare (ignorable children_by_id))
        #|  not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here |# #|line 189|#
        #|  collect children |#                             #|line 190|#
        (loop for child_desc in (gethash  "children"  desc)
          do
            (progn
              child_desc                                    #|line 191|#
              (let ((child_instance (funcall (quote get_component_instance)   reg (gethash  "name"  child_desc)  container  #|line 192|#)))
                (declare (ignorable child_instance))
                (setf  children (append  children (list  child_instance))) #|line 193|#
                (let ((id (gethash  "id"  child_desc)))
                  (declare (ignorable id))                  #|line 194|#
                  (setf (gethash id  children_by_id)  child_instance) #|line 195|# #|line 196|#)) #|line 197|#
              ))
        (setf (slot-value  container 'children)  children)  #|line 198|# #|line 199|#
        (let ((connectors  nil))
          (declare (ignorable connectors))                  #|line 200|#
          (loop for proto_conn in (gethash  "connections"  desc)
            do
              (progn
                proto_conn                                  #|line 201|#
                (let (( connector  (make-instance 'Connector) #|line 202|#))
                  (declare (ignorable  connector))
                  (cond
                    (( equal   (gethash  "dir"  proto_conn)  enumDown) #|line 203|#
                      (setf  connectors (append  connectors (list (funcall (quote create_down_connector)   container  proto_conn  connectors  children_by_id )))) #|line 204|#
                      )
                    (( equal   (gethash  "dir"  proto_conn)  enumAcross) #|line 205|#
                      (setf  connectors (append  connectors (list (funcall (quote create_across_connector)   container  proto_conn  connectors  children_by_id )))) #|line 206|#
                      )
                    (( equal   (gethash  "dir"  proto_conn)  enumUp) #|line 207|#
                      (setf  connectors (append  connectors (list (funcall (quote create_up_connector)   container  proto_conn  connectors  children_by_id )))) #|line 208|#
                      )
                    (( equal   (gethash  "dir"  proto_conn)  enumThrough) #|line 209|#
                      (setf  connectors (append  connectors (list (funcall (quote create_through_connector)   container  proto_conn  connectors  children_by_id )))) #|line 210|# #|line 211|#
                      )))                                   #|line 212|#
                ))
          (setf (slot-value  container 'connections)  connectors) #|line 213|#
          (return-from container_instantiator  container)   #|line 214|#)))) #|line 215|#
  ) #|  The default handler for container components. |#    #|line 217|#
(defun container_handler (&optional  container  message)
  (declare (ignorable  container  message))                 #|line 218|#
  (funcall (quote route)   container  #|  from=  |# container  message )
  #|  references to 'self' are replaced by the container during instantiation |# #|line 219|#
  (loop while (funcall (quote any_child_ready)   container )
    do
      (progn                                                #|line 220|#
        (funcall (quote step_children)   container  message ) #|line 221|#
        ))                                                  #|line 222|#
  ) #|  Frees the given container and associated data. |#   #|line 224|#
(defun destroy_container (&optional  eh)
  (declare (ignorable  eh))                                 #|line 225|#
  #| pass |#                                                #|line 226|# #|line 227|#
  ) #|  Routing connection for a container component. The `direction` field has |# #|line 229|# #|  no affect on the default message routing system _ it is there for debugging |# #|line 230|# #|  purposes, or for reading by other tools. |# #|line 231|# #|line 232|#
(defclass Connector ()                                      #|line 233|#
  (
    (direction :accessor direction :initarg :direction :initform  nil)  #|  down, across, up, through |# #|line 234|#
    (sender :accessor sender :initarg :sender :initform  nil)  #|line 235|#
    (receiver :accessor receiver :initarg :receiver :initform  nil)  #|line 236|#)) #|line 237|#

                                                            #|line 238|# #|  `Sender` is used to “pattern match“ which `Receiver` a message should go to, |# #|line 239|# #|  based on component ID (pointer) and port name. |# #|line 240|# #|line 241|#
(defclass Sender ()                                         #|line 242|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 243|#
    (component :accessor component :initarg :component :initform  nil)  #|line 244|#
    (port :accessor port :initarg :port :initform  nil)     #|line 245|#)) #|line 246|#

                                                            #|line 247|# #|line 248|# #|line 249|# #|  `Receiver` is a handle to a destination queue, and a `port` name to assign |# #|line 250|# #|  to incoming messages to this queue. |# #|line 251|# #|line 252|#
(defclass Receiver ()                                       #|line 253|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 254|#
    (queue :accessor queue :initarg :queue :initform  nil)  #|line 255|#
    (port :accessor port :initarg :port :initform  nil)     #|line 256|#
    (component :accessor component :initarg :component :initform  nil)  #|line 257|#)) #|line 258|#

                                                            #|line 259|#
(defun mkSender (&optional  name  component  port)
  (declare (ignorable  name  component  port))              #|line 260|#
  (let (( s  (make-instance 'Sender)                        #|line 261|#))
    (declare (ignorable  s))
    (setf (slot-value  s 'name)  name)                      #|line 262|#
    (setf (slot-value  s 'component)  component)            #|line 263|#
    (setf (slot-value  s 'port)  port)                      #|line 264|#
    (return-from mkSender  s)                               #|line 265|#) #|line 266|#
  )
(defun mkReceiver (&optional  name  component  port  q)
  (declare (ignorable  name  component  port  q))           #|line 268|#
  (let (( r  (make-instance 'Receiver)                      #|line 269|#))
    (declare (ignorable  r))
    (setf (slot-value  r 'name)  name)                      #|line 270|#
    (setf (slot-value  r 'component)  component)            #|line 271|#
    (setf (slot-value  r 'port)  port)                      #|line 272|#
    #|  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. |# #|line 273|#
    (setf (slot-value  r 'queue)  q)                        #|line 274|#
    (return-from mkReceiver  r)                             #|line 275|#) #|line 276|#
  ) #|  Checks if two senders match, by pointer equality and port name matching. |# #|line 278|#
(defun sender_eq (&optional  s1  s2)
  (declare (ignorable  s1  s2))                             #|line 279|#
  (let ((same_components ( equal   (slot-value  s1 'component) (slot-value  s2 'component))))
    (declare (ignorable same_components))                   #|line 280|#
    (let ((same_ports ( equal   (slot-value  s1 'port) (slot-value  s2 'port))))
      (declare (ignorable same_ports))                      #|line 281|#
      (return-from sender_eq ( and   same_components  same_ports)) #|line 282|#)) #|line 283|#
  ) #|  Delivers the given message to the receiver of this connector. |# #|line 285|# #|line 286|#
(defun deposit (&optional  parent  conn  message)
  (declare (ignorable  parent  conn  message))              #|line 287|#
  (let ((new_message (funcall (quote make_message)  (slot-value (slot-value  conn 'receiver) 'port) (slot-value  message 'datum)  #|line 288|#)))
    (declare (ignorable new_message))
    (funcall (quote push_message)   parent (slot-value (slot-value  conn 'receiver) 'component) (slot-value (slot-value  conn 'receiver) 'queue)  new_message  #|line 289|#)) #|line 290|#
  )
(defun force_tick (&optional  parent  eh)
  (declare (ignorable  parent  eh))                         #|line 292|#
  (let ((tick_msg (funcall (quote make_message)   "." (funcall (quote new_datum_bang) )  #|line 293|#)))
    (declare (ignorable tick_msg))
    (funcall (quote push_message)   parent  eh (slot-value  eh 'inq)  tick_msg  #|line 294|#)
    (return-from force_tick  tick_msg)                      #|line 295|#) #|line 296|#
  )
(defun push_message (&optional  parent  receiver  inq  m)
  (declare (ignorable  parent  receiver  inq  m))           #|line 298|#
  (enqueue  inq  m)                                         #|line 299|#
  (enqueue (slot-value  parent 'visit_ordering)  receiver)  #|line 300|# #|line 301|#
  )
(defun is_self (&optional  child  container)
  (declare (ignorable  child  container))                   #|line 303|#
  #|  in an earlier version “self“ was denoted as ϕ |#      #|line 304|#
  (return-from is_self ( equal    child  container))        #|line 305|# #|line 306|#
  )
(defun step_child (&optional  child  msg)
  (declare (ignorable  child  msg))                         #|line 308|#
  (let ((before_state (slot-value  child 'state)))
    (declare (ignorable before_state))                      #|line 309|#
    (funcall (slot-value  child 'handler)   child  msg      #|line 310|#)
    (let ((after_state (slot-value  child 'state)))
      (declare (ignorable after_state))                     #|line 311|#
      (return-from step_child (values ( and  ( equal    before_state  "idle") (not (equal   after_state  "idle")))  #|line 312|#( and  (not (equal   before_state  "idle")) (not (equal   after_state  "idle")))  #|line 313|#( and  (not (equal   before_state  "idle")) ( equal    after_state  "idle")))) #|line 314|#)) #|line 315|#
  )
(defun step_children (&optional  container  causingMessage)
  (declare (ignorable  container  causingMessage))          #|line 317|#
  (setf (slot-value  container 'state)  "idle")             #|line 318|#
  (loop for child in (queue2list (slot-value  container 'visit_ordering))
    do
      (progn
        child                                               #|line 319|#
        #|  child = container represents self, skip it |#   #|line 320|#
        (cond
          ((not (funcall (quote is_self)   child  container )) #|line 321|#
            (cond
              ((not (empty? (slot-value  child 'inq)))      #|line 322|#
                (let ((msg (dequeue (slot-value  child 'inq)) #|line 323|#))
                  (declare (ignorable msg))
                  (let (( began_long_run  nil))
                    (declare (ignorable  began_long_run))   #|line 324|#
                    (let (( continued_long_run  nil))
                      (declare (ignorable  continued_long_run)) #|line 325|#
                      (let (( ended_long_run  nil))
                        (declare (ignorable  ended_long_run)) #|line 326|#
                        (multiple-value-setq ( began_long_run  continued_long_run  ended_long_run) (funcall (quote step_child)   child  msg  #|line 327|#))
                        (cond
                          ( began_long_run                  #|line 328|#
                            #| pass |#                      #|line 329|#
                            )
                          ( continued_long_run              #|line 330|#
                            #| pass |#                      #|line 331|#
                            )
                          ( ended_long_run                  #|line 332|#
                            #| pass |#                      #|line 333|# #|line 334|#
                            ))
                        (funcall (quote destroy_message)   msg  #|line 335|#)))))
                )
              (t                                            #|line 336|#
                (cond
                  ((not (equal  (slot-value  child 'state)  "idle")) #|line 337|#
                    (let ((msg (funcall (quote force_tick)   container  child  #|line 338|#)))
                      (declare (ignorable msg))
                      (funcall (slot-value  child 'handler)   child  msg  #|line 339|#)
                      (funcall (quote destroy_message)   msg  #|line 340|#)) #|line 341|#
                    ))                                      #|line 342|#
                ))                                          #|line 343|#
            (cond
              (( equal   (slot-value  child 'state)  "active") #|line 344|#
                #|  if child remains active, then the container must remain active and must propagate “ticks“ to child |# #|line 345|#
                (setf (slot-value  container 'state)  "active") #|line 346|# #|line 347|#
                ))                                          #|line 348|#
            (loop while (not (empty? (slot-value  child 'outq)))
              do
                (progn                                      #|line 349|#
                  (let ((msg (dequeue (slot-value  child 'outq)) #|line 350|#))
                    (declare (ignorable msg))
                    (funcall (quote route)   container  child  msg  #|line 351|#)
                    (funcall (quote destroy_message)   msg  #|line 352|#)) #|line 353|#
                  ))                                        #|line 354|#
            ))                                              #|line 355|#
        ))                                                  #|line 356|#
  )
(defun attempt_tick (&optional  parent  eh)
  (declare (ignorable  parent  eh))                         #|line 358|#
  (cond
    ((not (equal  (slot-value  eh 'state)  "idle"))         #|line 359|#
      (funcall (quote force_tick)   parent  eh              #|line 360|#) #|line 361|#
      ))                                                    #|line 362|#
  )
(defun is_tick (&optional  msg)
  (declare (ignorable  msg))                                #|line 364|#
  (return-from is_tick ( equal    "." (slot-value  msg 'port))
    #|  assume that any message that is sent to port "." is a tick  |# #|line 365|#) #|line 366|#
  ) #|  Routes a single message to all matching destinations, according to |# #|line 368|# #|  the container's connection network. |# #|line 369|# #|line 370|#
(defun route (&optional  container  from_component  message)
  (declare (ignorable  container  from_component  message)) #|line 371|#
  (let (( was_sent  nil))
    (declare (ignorable  was_sent))
    #|  for checking that output went somewhere (at least during bootstrap) |# #|line 372|#
    (let (( fromname  ""))
      (declare (ignorable  fromname))                       #|line 373|#
      (cond
        ((funcall (quote is_tick)   message )               #|line 374|#
          (loop for child in (slot-value  container 'children)
            do
              (progn
                child                                       #|line 375|#
                (funcall (quote attempt_tick)   container  child ) #|line 376|#
                ))
          (setf  was_sent  t)                               #|line 377|#
          )
        (t                                                  #|line 378|#
          (cond
            ((not (funcall (quote is_self)   from_component  container )) #|line 379|#
              (setf  fromname (slot-value  from_component 'name)) #|line 380|# #|line 381|#
              ))
          (let ((from_sender (funcall (quote mkSender)   fromname  from_component (slot-value  message 'port)  #|line 382|#)))
            (declare (ignorable from_sender))               #|line 383|#
            (loop for connector in (slot-value  container 'connections)
              do
                (progn
                  connector                                 #|line 384|#
                  (cond
                    ((funcall (quote sender_eq)   from_sender (slot-value  connector 'sender) ) #|line 385|#
                      (funcall (quote deposit)   container  connector  message  #|line 386|#)
                      (setf  was_sent  t)                   #|line 387|# #|line 388|#
                      ))                                    #|line 389|#
                  )))                                       #|line 390|#
          ))
      (cond
        ((not  was_sent)                                    #|line 391|#
          (funcall (quote print)   "\n\n*** Error: ***"     #|line 392|#)
          (funcall (quote print)   "***"                    #|line 393|#)
          (funcall (quote print)   (concatenate 'string (slot-value  container 'name)  (concatenate 'string  ": message '"  (concatenate 'string (slot-value  message 'port)  (concatenate 'string  "' from "  (concatenate 'string  fromname  " dropped on floor...")))))  #|line 394|#)
          (funcall (quote print)   "***"                    #|line 395|#)
          (break)                                           #|line 396|# #|line 397|#
          ))))                                              #|line 398|#
  )
(defun any_child_ready (&optional  container)
  (declare (ignorable  container))                          #|line 400|#
  (loop for child in (slot-value  container 'children)
    do
      (progn
        child                                               #|line 401|#
        (cond
          ((funcall (quote child_is_ready)   child )        #|line 402|#
            (return-from any_child_ready  t)                #|line 403|# #|line 404|#
            ))                                              #|line 405|#
        ))
  (return-from any_child_ready  nil)                        #|line 406|# #|line 407|#
  )
(defun child_is_ready (&optional  eh)
  (declare (ignorable  eh))                                 #|line 409|#
  (return-from child_is_ready ( or  ( or  ( or  (not (empty? (slot-value  eh 'outq))) (not (empty? (slot-value  eh 'inq)))) (not (equal  (slot-value  eh 'state)  "idle"))) (funcall (quote any_child_ready)   eh ))) #|line 410|# #|line 411|#
  )
(defun append_routing_descriptor (&optional  container  desc)
  (declare (ignorable  container  desc))                    #|line 413|#
  (enqueue (slot-value  container 'routings)  desc)         #|line 414|# #|line 415|#
  )
(defun container_injector (&optional  container  message)
  (declare (ignorable  container  message))                 #|line 417|#
  (funcall (quote container_handler)   container  message   #|line 418|#) #|line 419|#
  )





