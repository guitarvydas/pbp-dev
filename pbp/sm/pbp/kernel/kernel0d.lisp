(load "~/quicklisp/setup.lisp")
(proclaim '(optimize (debug 3) (safety 3) (speed 0)))
(ql:quickload :uiop)
(ql:quickload :cl-json)

(defun getwd (s)
#+lispworks (merge-pathnames s (get-working-directory))
#-lispworks s
)

(defun dict-fresh () (make-hash-table :test 'equal))

(defun dict-in? (name table)
(when (and table name)
(multiple-value-bind (dont-care found)
(gethash name table)
dont-care ;; quell warnings that dont-care is unused
found)))

(defun jparse (filename)
(let ((s (uiop:read-file-string filename)))
(internalize-lnet-from-JSON s)))

(defun internalize-lnet-from-JSON (s)
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

;;;;
;(load "~/quicklisp/setup.lisp")
(ql:quickload '(:websocket-driver-client :cl-json :uiop))

(defun live_update (key value)
(let* ((client (wsd:make-client "ws://localhost:8966"))
(json-data (json:encode-json-to-string
(list (cons key value)))))
(wsd:start-connection client)
(wsd:send client json-data)
(sleep 0.1)  ; Add small delay to ensure message is sent
(wsd:close-connection client)))


;;;;

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
(defparameter  counter  0)                                  #|line 3|#
(defparameter  ticktime  0)                                 #|line 4|# #|line 5|#
(defparameter  digits (list                                 #|line 6|#  "₀"  "₁"  "₂"  "₃"  "₄"  "₅"  "₆"  "₇"  "₈"  "₉"  "₁₀"  "₁₁"  "₁₂"  "₁₃"  "₁₄"  "₁₅"  "₁₆"  "₁₇"  "₁₈"  "₁₉"  "₂₀"  "₂₁"  "₂₂"  "₂₃"  "₂₄"  "₂₅"  "₂₆"  "₂₇"  "₂₈"  "₂₉" )) #|line 12|# #|line 13|# #|line 14|#
(defun gensymbol (&optional  s)
  (declare (ignorable  s))                                  #|line 15|# #|line 16|#
  (let ((name_with_id  (concatenate 'string  s (funcall (quote subscripted_digit)   counter )) #|line 17|#))
    (declare (ignorable name_with_id))
    (setf  counter (+  counter  1))                         #|line 18|#
    (return-from gensymbol  name_with_id)                   #|line 19|#) #|line 20|#
  )
(defun subscripted_digit (&optional  n)
  (declare (ignorable  n))                                  #|line 22|# #|line 23|#
  (cond
    (( and  ( >=   n  0) ( <=   n  29))                     #|line 24|#
      (return-from subscripted_digit (nth  n  digits))      #|line 25|#
      )
    (t                                                      #|line 26|#
      (return-from subscripted_digit  (concatenate 'string  "₊" (format nil "~a"  n)) #|line 27|#) #|line 28|#
      ))                                                    #|line 29|#
  )
(defclass Datum ()                                          #|line 31|#
  (
    (v :accessor v :initarg :v :initform  nil)              #|line 32|#
    (clone :accessor clone :initarg :clone :initform  nil)  #|line 33|#
    (reclaim :accessor reclaim :initarg :reclaim :initform  nil)  #|line 34|#
    (other :accessor other :initarg :other :initform  nil)  #|  reserved for use on per-project basis  |# #|line 35|#)) #|line 36|#

                                                            #|line 37|# #|line 38|# #|  Mevent passed to a leaf component. |# #|line 39|# #|  |# #|line 40|# #|  `port` refers to the name of the incoming or outgoing port of this component. |# #|line 41|# #|  `payload` is the data attached to this mevent. |# #|line 42|#
(defclass Mevent ()                                         #|line 43|#
  (
    (port :accessor port :initarg :port :initform  nil)     #|line 44|#
    (datum :accessor datum :initarg :datum :initform  nil)  #|line 45|#)) #|line 46|#

                                                            #|line 47|#
(defun clone_port (&optional  s)
  (declare (ignorable  s))                                  #|line 48|#
  (return-from clone_port (funcall (quote clone_string)   s  #|line 49|#)) #|line 50|#
  ) #|  Utility for making a `Mevent`. Used to safely "seed“ mevents |# #|line 52|# #|  entering the very top of a network. |# #|line 53|#
(defun make_mevent (&optional  port  datum)
  (declare (ignorable  port  datum))                        #|line 54|#
  (let ((p (funcall (quote clone_string)   port             #|line 55|#)))
    (declare (ignorable p))
    (let (( m  (make-instance 'Mevent)                      #|line 56|#))
      (declare (ignorable  m))
      (setf (slot-value  m 'port)  p)                       #|line 57|#
      (setf (slot-value  m 'datum) (funcall (slot-value  datum 'clone) )) #|line 58|#
      (return-from make_mevent  m)                          #|line 59|#)) #|line 60|#
  ) #|  Clones a mevent. Primarily used internally for “fanning out“ a mevent to multiple destinations. |# #|line 62|#
(defun mevent_clone (&optional  mev)
  (declare (ignorable  mev))                                #|line 63|#
  (let (( m  (make-instance 'Mevent)                        #|line 64|#))
    (declare (ignorable  m))
    (setf (slot-value  m 'port) (funcall (quote clone_port)  (slot-value  mev 'port)  #|line 65|#))
    (setf (slot-value  m 'datum) (funcall (slot-value (slot-value  mev 'datum) 'clone) )) #|line 66|#
    (return-from mevent_clone  m)                           #|line 67|#) #|line 68|#
  ) #|  Frees a mevent. |#                                  #|line 70|#
(defun destroy_mevent (&optional  mev)
  (declare (ignorable  mev))                                #|line 71|#
  #|  during debug, dont destroy any mevent, since we want to trace mevents, thus, we need to persist ancestor mevents |# #|line 72|#
  #| pass |#                                                #|line 73|# #|line 74|#
  )
(defun destroy_datum (&optional  mev)
  (declare (ignorable  mev))                                #|line 76|#
  #| pass |#                                                #|line 77|# #|line 78|#
  )
(defun destroy_port (&optional  mev)
  (declare (ignorable  mev))                                #|line 80|#
  #| pass |#                                                #|line 81|# #|line 82|#
  ) #|  |#                                                  #|line 84|#
(defun format_mevent (&optional  m)
  (declare (ignorable  m))                                  #|line 85|#
  (cond
    (( equal    m  nil)                                     #|line 86|#
      (return-from format_mevent  "{}")                     #|line 87|#
      )
    (t                                                      #|line 88|#
      (return-from format_mevent  (concatenate 'string  "{%5C”"  (concatenate 'string (slot-value  m 'port)  (concatenate 'string  "%5C”:%5C”"  (concatenate 'string (slot-value (slot-value  m 'datum) 'v)  "%5C”}")))) #|line 89|#) #|line 90|#
      ))                                                    #|line 91|#
  )
(defun format_mevent_raw (&optional  m)
  (declare (ignorable  m))                                  #|line 92|#
  (cond
    (( equal    m  nil)                                     #|line 93|#
      (return-from format_mevent_raw  "")                   #|line 94|#
      )
    (t                                                      #|line 95|#
      (return-from format_mevent_raw (slot-value (slot-value  m 'datum) 'v)) #|line 96|# #|line 97|#
      ))                                                    #|line 98|#
  )
(defparameter  enumDown  0)
(defparameter  enumAcross  1)
(defparameter  enumUp  2)
(defparameter  enumThrough  3)                              #|line 104|#
(defun create_down_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 105|#
  #|  JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''}, |# #|line 106|#
  (let (( connector  (make-instance 'Connector)             #|line 107|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "down")       #|line 108|#
    (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  container 'name)  container (gethash  "source_port"  proto_conn)  #|line 109|#))
    (let ((target_proto (gethash  "target"  proto_conn)))
      (declare (ignorable target_proto))                    #|line 110|#
      (let ((id_proto (gethash  "id"  target_proto)))
        (declare (ignorable id_proto))                      #|line 111|#
        (let ((target_component (gethash id_proto  children_by_id)))
          (declare (ignorable target_component))            #|line 112|#
          (cond
            (( equal    target_component  nil)              #|line 113|#
              (funcall (quote load_error)   (concatenate 'string  "internal error: .Down connection target internal error " (gethash  "name" (gethash  "target"  proto_conn))) ) #|line 114|#
              )
            (t                                              #|line 115|#
              (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  target_component 'name)  target_component (gethash  "target_port"  proto_conn) (slot-value  target_component 'inq)  #|line 116|#)) #|line 117|#
              ))
          (return-from create_down_connector  connector)    #|line 118|#)))) #|line 119|#
  )
(defun create_across_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 121|#
  (let (( connector  (make-instance 'Connector)             #|line 122|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "across")     #|line 123|#
    (let ((source_component (gethash (gethash  "id" (gethash  "source"  proto_conn))  children_by_id)))
      (declare (ignorable source_component))                #|line 124|#
      (let ((target_component (gethash (gethash  "id" (gethash  "target"  proto_conn))  children_by_id)))
        (declare (ignorable target_component))              #|line 125|#
        (cond
          (( equal    source_component  nil)                #|line 126|#
            (funcall (quote load_error)   (concatenate 'string  "internal error: .Across connection source not ok " (gethash  "name" (gethash  "source"  proto_conn)))  #|line 127|#)
            )
          (t                                                #|line 128|#
            (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  source_component 'name)  source_component (gethash  "source_port"  proto_conn)  #|line 129|#))
            (cond
              (( equal    target_component  nil)            #|line 130|#
                (funcall (quote load_error)   (concatenate 'string  "internal error: .Across connection target not ok " (gethash  "name" (gethash  "target"  proto_conn)))  #|line 131|#)
                )
              (t                                            #|line 132|#
                (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  target_component 'name)  target_component (gethash  "target_port"  proto_conn) (slot-value  target_component 'inq)  #|line 133|#)) #|line 134|#
                ))                                          #|line 135|#
            ))
        (return-from create_across_connector  connector)    #|line 136|#))) #|line 137|#
  )
(defun create_up_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 139|#
  (let (( connector  (make-instance 'Connector)             #|line 140|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "up")         #|line 141|#
    (let ((source_component (gethash (gethash  "id" (gethash  "source"  proto_conn))  children_by_id)))
      (declare (ignorable source_component))                #|line 142|#
      (cond
        (( equal    source_component  nil)                  #|line 143|#
          (funcall (quote load_error)   (concatenate 'string  "internal error: .Up connection source not ok " (gethash  "name" (gethash  "source"  proto_conn))) ) #|line 144|#
          )
        (t                                                  #|line 145|#
          (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  source_component 'name)  source_component (gethash  "source_port"  proto_conn)  #|line 146|#))
          (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  container 'name)  container (gethash  "target_port"  proto_conn) (slot-value  container 'outq)  #|line 147|#)) #|line 148|#
          ))
      (return-from create_up_connector  connector)          #|line 149|#)) #|line 150|#
  )
(defun create_through_connector (&optional  container  proto_conn  connectors  children_by_id)
  (declare (ignorable  container  proto_conn  connectors  children_by_id)) #|line 152|#
  (let (( connector  (make-instance 'Connector)             #|line 153|#))
    (declare (ignorable  connector))
    (setf (slot-value  connector 'direction)  "through")    #|line 154|#
    (setf (slot-value  connector 'sender) (funcall (quote mkSender)  (slot-value  container 'name)  container (gethash  "source_port"  proto_conn)  #|line 155|#))
    (setf (slot-value  connector 'receiver) (funcall (quote mkReceiver)  (slot-value  container 'name)  container (gethash  "target_port"  proto_conn) (slot-value  container 'outq)  #|line 156|#))
    (return-from create_through_connector  connector)       #|line 157|#) #|line 158|#
  )                                                         #|line 160|#
(defun container_instantiator (&optional  reg  owner  container_name  desc  arg)
  (declare (ignorable  reg  owner  container_name  desc  arg)) #|line 161|# #|line 162|#
  (let ((container (funcall (quote make_container)   container_name  owner  #|line 163|#)))
    (declare (ignorable container))
    (let ((children  nil))
      (declare (ignorable children))                        #|line 164|#
      (let ((children_by_id  (dict-fresh)))
        (declare (ignorable children_by_id))
        #|  not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here |# #|line 165|#
        #|  collect children |#                             #|line 166|#
        (loop for child_desc in (gethash  "children"  desc)
          do
            (progn
              child_desc                                    #|line 167|#
              (let ((child_instance (funcall (quote get_component_instance)   reg (gethash  "name"  child_desc)  container  #|line 168|#)))
                (declare (ignorable child_instance))
                (setf  children (append  children (list  child_instance))) #|line 169|#
                (let ((id (gethash  "id"  child_desc)))
                  (declare (ignorable id))                  #|line 170|#
                  (setf (gethash id  children_by_id)  child_instance) #|line 171|# #|line 172|#)) #|line 173|#
              ))
        (setf (slot-value  container 'children)  children)  #|line 174|# #|line 175|#
        (let ((connectors  nil))
          (declare (ignorable connectors))                  #|line 176|#
          (loop for proto_conn in (gethash  "connections"  desc)
            do
              (progn
                proto_conn                                  #|line 177|#
                (let (( connector  (make-instance 'Connector) #|line 178|#))
                  (declare (ignorable  connector))
                  (cond
                    (( equal   (gethash  "dir"  proto_conn)  enumDown) #|line 179|#
                      (setf  connectors (append  connectors (list (funcall (quote create_down_connector)   container  proto_conn  connectors  children_by_id )))) #|line 180|#
                      )
                    (( equal   (gethash  "dir"  proto_conn)  enumAcross) #|line 181|#
                      (setf  connectors (append  connectors (list (funcall (quote create_across_connector)   container  proto_conn  connectors  children_by_id )))) #|line 182|#
                      )
                    (( equal   (gethash  "dir"  proto_conn)  enumUp) #|line 183|#
                      (setf  connectors (append  connectors (list (funcall (quote create_up_connector)   container  proto_conn  connectors  children_by_id )))) #|line 184|#
                      )
                    (( equal   (gethash  "dir"  proto_conn)  enumThrough) #|line 185|#
                      (setf  connectors (append  connectors (list (funcall (quote create_through_connector)   container  proto_conn  connectors  children_by_id )))) #|line 186|# #|line 187|#
                      )))                                   #|line 188|#
                ))
          (setf (slot-value  container 'connections)  connectors) #|line 189|#
          (return-from container_instantiator  container)   #|line 190|#)))) #|line 191|#
  ) #|  The default handler for container components. |#    #|line 193|#
(defun container_handler (&optional  container  mevent)
  (declare (ignorable  container  mevent))                  #|line 194|#
  (funcall (quote route)   container  #|  from=  |# container  mevent )
  #|  references to 'self' are replaced by the container during instantiation |# #|line 195|#
  (loop while (funcall (quote any_child_ready)   container )
    do
      (progn                                                #|line 196|#
        (funcall (quote step_children)   container  mevent ) #|line 197|#
        ))                                                  #|line 198|#
  ) #|  Stop all children. Reset to a known state. Hit the big red button.  |# #|line 200|#
(defun container_reset_children (&optional  container)
  (declare (ignorable  container))                          #|line 201|#
  (loop for child in (slot-value  container 'children)
    do
      (progn
        child                                               #|line 202|#
        (funcall (slot-value  child 'stop)   child          #|line 203|#) #|line 204|#
        ))

  (setf (slot-value  container 'visit_ordering) (make-instance 'Queue)) #|line 205|#

  (setf (slot-value  container 'routings) (make-instance 'Queue)) #|line 206|#

  (setf (slot-value  container 'inq) (make-instance 'Queue)) #|line 207|#

  (setf (slot-value  container 'outq) (make-instance 'Queue)) #|line 208|#
  (setf (slot-value  container 'state)  "idle")             #|line 209|# #|line 210|#
  ) #|  Frees the given container and associated data. |#   #|line 212|#
(defun destroy_container (&optional  eh)
  (declare (ignorable  eh))                                 #|line 213|#
  #| pass |#                                                #|line 214|# #|line 215|#
  )                                                         #|line 217|# #|  Routing connection for a container component. The `direction` field has |# #|line 218|# #|  no affect on the default mevent routing system _ it is there for debugging |# #|line 219|# #|  purposes, or for reading by other tools. |# #|line 220|# #|line 221|#
(defclass Connector ()                                      #|line 222|#
  (
    (direction :accessor direction :initarg :direction :initform  nil)  #|  down, across, up, through |# #|line 223|#
    (sender :accessor sender :initarg :sender :initform  nil)  #|line 224|#
    (receiver :accessor receiver :initarg :receiver :initform  nil)  #|line 225|#)) #|line 226|#

                                                            #|line 227|# #|  `Sender` is used to “pattern match“ which `Receiver` a mevent should go to, |# #|line 228|# #|  based on component ID (pointer) and port name. |# #|line 229|# #|line 230|#
(defclass Sender ()                                         #|line 231|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 232|#
    (component :accessor component :initarg :component :initform  nil)  #|line 233|#
    (port :accessor port :initarg :port :initform  nil)     #|line 234|#)) #|line 235|#

                                                            #|line 236|# #|line 237|# #|line 238|# #|  `Receiver` is a handle to a destination queue, and a `port` name to assign |# #|line 239|# #|  to incoming mevents to this queue. |# #|line 240|# #|line 241|#
(defclass Receiver ()                                       #|line 242|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 243|#
    (queue :accessor queue :initarg :queue :initform  nil)  #|line 244|#
    (port :accessor port :initarg :port :initform  nil)     #|line 245|#
    (component :accessor component :initarg :component :initform  nil)  #|line 246|#)) #|line 247|#

                                                            #|line 248|#
(defun mkSender (&optional  name  component  port)
  (declare (ignorable  name  component  port))              #|line 249|#
  (let (( s  (make-instance 'Sender)                        #|line 250|#))
    (declare (ignorable  s))
    (setf (slot-value  s 'name)  name)                      #|line 251|#
    (setf (slot-value  s 'component)  component)            #|line 252|#
    (setf (slot-value  s 'port)  port)                      #|line 253|#
    (return-from mkSender  s)                               #|line 254|#) #|line 255|#
  )
(defun mkReceiver (&optional  name  component  port  q)
  (declare (ignorable  name  component  port  q))           #|line 257|#
  (let (( r  (make-instance 'Receiver)                      #|line 258|#))
    (declare (ignorable  r))
    (setf (slot-value  r 'name)  name)                      #|line 259|#
    (setf (slot-value  r 'component)  component)            #|line 260|#
    (setf (slot-value  r 'port)  port)                      #|line 261|#
    #|  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. |# #|line 262|#
    (setf (slot-value  r 'queue)  q)                        #|line 263|#
    (return-from mkReceiver  r)                             #|line 264|#) #|line 265|#
  ) #|  Checks if two senders match, by pointer equality and port name matching. |# #|line 267|#
(defun sender_eq (&optional  s1  s2)
  (declare (ignorable  s1  s2))                             #|line 268|#
  (let ((same_components ( equal   (slot-value  s1 'component) (slot-value  s2 'component))))
    (declare (ignorable same_components))                   #|line 269|#
    (let ((same_ports ( equal   (slot-value  s1 'port) (slot-value  s2 'port))))
      (declare (ignorable same_ports))                      #|line 270|#
      (return-from sender_eq ( and   same_components  same_ports)) #|line 271|#)) #|line 272|#
  ) #|  Delivers the given mevent to the receiver of this connector. |# #|line 274|# #|line 275|#
(defun deposit (&optional  parent  conn  mevent)
  (declare (ignorable  parent  conn  mevent))               #|line 276|#
  (let ((new_mevent (funcall (quote make_mevent)  (slot-value (slot-value  conn 'receiver) 'port) (slot-value  mevent 'datum)  #|line 277|#)))
    (declare (ignorable new_mevent))
    (funcall (quote push_mevent)   parent (slot-value (slot-value  conn 'receiver) 'component) (slot-value (slot-value  conn 'receiver) 'queue)  new_mevent  #|line 278|#)) #|line 279|#
  )
(defun force_tick (&optional  parent  eh)
  (declare (ignorable  parent  eh))                         #|line 281|#
  (let ((tick_mev (funcall (quote make_mevent)   "." (funcall (quote new_datum_bang) )  #|line 282|#)))
    (declare (ignorable tick_mev))
    (funcall (quote push_mevent)   parent  eh (slot-value  eh 'inq)  tick_mev  #|line 283|#)
    (return-from force_tick  tick_mev)                      #|line 284|#) #|line 285|#
  )
(defun push_mevent (&optional  parent  receiver  inq  m)
  (declare (ignorable  parent  receiver  inq  m))           #|line 287|#
  (enqueue  inq  m)                                         #|line 288|#
  (enqueue (slot-value  parent 'visit_ordering)  receiver)  #|line 289|# #|line 290|#
  )
(defun is_self (&optional  child  container)
  (declare (ignorable  child  container))                   #|line 292|#
  #|  in an earlier version “self“ was denoted as ϕ |#      #|line 293|#
  (return-from is_self ( equal    child  container))        #|line 294|# #|line 295|#
  )
(defun step_child_once (&optional  child  mev)
  (declare (ignorable  child  mev))                         #|line 297|#
  (cond
    ( nil                                                   #|line 298|#
      (format *error-output* "~a~%"  (concatenate 'string  "-- stepping '"  (concatenate 'string (slot-value  child 'name)  "'"))) #|line 299|#
      (format *error-output* "
      ")                                                    #|line 300|# #|line 301|#
      ))
  (let ((before_state (slot-value  child 'state)))
    (declare (ignorable before_state))                      #|line 302|#
    (funcall (slot-value  child 'handler)   child  mev      #|line 303|#)
    (let ((after_state (slot-value  child 'state)))
      (declare (ignorable after_state))                     #|line 304|#
      (return-from step_child_once (values ( and  ( equal    before_state  "idle") (not (equal   after_state  "idle")))  #|line 305|#( and  (not (equal   before_state  "idle")) (not (equal   after_state  "idle")))  #|line 306|#( and  (not (equal   before_state  "idle")) ( equal    after_state  "idle")))) #|line 307|#)) #|line 308|#
  )
(defun step_children (&optional  container  causingMevent)
  (declare (ignorable  container  causingMevent))           #|line 310|#
  (setf (slot-value  container 'state)  "idle")             #|line 311|# #|line 312|#
  #|  phase 1 - loop through children and process inputs or children that not "idle"  |# #|line 313|#
  (loop for child in (queue2list (slot-value  container 'visit_ordering))
    do
      (progn
        child                                               #|line 314|#
        #|  child = container represents self, skip it |#   #|line 315|#
        (cond
          ((not (funcall (quote is_self)   child  container )) #|line 316|#
            (cond
              ((not (empty? (slot-value  child 'inq)))      #|line 317|#
                (let ((mev (dequeue (slot-value  child 'inq)) #|line 318|#))
                  (declare (ignorable mev))
                  (funcall (quote step_child_once)   child  mev  #|line 319|#) #|line 320|#
                  (funcall (quote destroy_mevent)   mev     #|line 321|#))
                )
              (t                                            #|line 322|#
                (cond
                  ((not (equal  (slot-value  child 'state)  "idle")) #|line 323|#
                    (let ((mev (funcall (quote force_tick)   container  child  #|line 324|#)))
                      (declare (ignorable mev))
                      (funcall (quote step_child_once)   child  mev  #|line 325|#)
                      (funcall (quote destroy_mevent)   mev  #|line 326|#)) #|line 327|#
                    ))                                      #|line 328|#
                ))                                          #|line 329|#
            ))                                              #|line 330|#
        ))

  (setf (slot-value  container 'visit_ordering) (make-instance 'Queue)) #|line 331|# #|line 332|#
  #|  phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections  |# #|line 333|#
  (loop for child in (slot-value  container 'children)
    do
      (progn
        child                                               #|line 334|#
        (cond
          (( equal   (slot-value  child 'state)  "active")  #|line 335|#
            #|  if child remains active, then the container must remain active and must propagate “ticks“ to child |# #|line 336|#
            (setf (slot-value  container 'state)  "active") #|line 337|# #|line 338|#
            ))                                              #|line 339|#
        (loop while (not (empty? (slot-value  child 'outq)))
          do
            (progn                                          #|line 340|#
              (let ((mev (dequeue (slot-value  child 'outq)) #|line 341|#))
                (declare (ignorable mev))
                (funcall (quote route)   container  child  mev  #|line 342|#)
                (funcall (quote destroy_mevent)   mev       #|line 343|#)) #|line 344|#
              ))                                            #|line 345|#
        ))                                                  #|line 346|#
  )
(defun attempt_tick (&optional  parent  eh)
  (declare (ignorable  parent  eh))                         #|line 348|#
  (cond
    ((not (equal  (slot-value  eh 'state)  "idle"))         #|line 349|#
      (funcall (quote force_tick)   parent  eh              #|line 350|#) #|line 351|#
      ))                                                    #|line 352|#
  )
(defun is_tick (&optional  mev)
  (declare (ignorable  mev))                                #|line 354|#
  (return-from is_tick ( equal    "." (slot-value  mev 'port))
    #|  assume that any mevent that is sent to port "." is a tick  |# #|line 355|#) #|line 356|#
  ) #|  Routes a single mevent to all matching destinations, according to |# #|line 358|# #|  the container's connection network. |# #|line 359|# #|line 360|#
(defun route (&optional  container  from_component  mevent)
  (declare (ignorable  container  from_component  mevent))  #|line 361|#
  (let (( was_sent  nil))
    (declare (ignorable  was_sent))
    #|  for checking that output went somewhere (at least during bootstrap) |# #|line 362|#
    (let (( fromname  ""))
      (declare (ignorable  fromname))                       #|line 363|# #|line 364|#
      (setf  ticktime (+  ticktime  1))                     #|line 365|#
      (cond
        ((funcall (quote is_tick)   mevent )                #|line 366|#
          (loop for child in (slot-value  container 'children)
            do
              (progn
                child                                       #|line 367|#
                (funcall (quote attempt_tick)   container  child ) #|line 368|#
                ))
          (setf  was_sent  t)                               #|line 369|#
          )
        (t                                                  #|line 370|#
          (cond
            ((not (funcall (quote is_self)   from_component  container )) #|line 371|#
              (setf  fromname (slot-value  from_component 'name)) #|line 372|# #|line 373|#
              ))
          (let ((from_sender (funcall (quote mkSender)   fromname  from_component (slot-value  mevent 'port)  #|line 374|#)))
            (declare (ignorable from_sender))               #|line 375|#
            (loop for connector in (slot-value  container 'connections)
              do
                (progn
                  connector                                 #|line 376|#
                  (cond
                    ((funcall (quote sender_eq)   from_sender (slot-value  connector 'sender) ) #|line 377|#
                      (funcall (quote deposit)   container  connector  mevent  #|line 378|#)
                      (setf  was_sent  t)                   #|line 379|# #|line 380|#
                      ))                                    #|line 381|#
                  )))                                       #|line 382|#
          ))
      (cond
        ((not  was_sent)                                    #|line 383|#
          (live_update  "internal error"  (concatenate 'string (slot-value  container 'name)  (concatenate 'string  ": mevent on port '"  (concatenate 'string (slot-value  mevent 'port)  (concatenate 'string  "' from "  (concatenate 'string  fromname  " dropped on floor...")))))) #|line 384|# #|line 385|#
          ))))                                              #|line 386|#
  )
(defun any_child_ready (&optional  container)
  (declare (ignorable  container))                          #|line 388|#
  (loop for child in (slot-value  container 'children)
    do
      (progn
        child                                               #|line 389|#
        (cond
          ((funcall (quote child_is_ready)   child )        #|line 390|#
            (return-from any_child_ready  t)                #|line 391|# #|line 392|#
            ))                                              #|line 393|#
        ))
  (return-from any_child_ready  nil)                        #|line 394|# #|line 395|#
  )
(defun child_is_ready (&optional  eh)
  (declare (ignorable  eh))                                 #|line 397|#
  (return-from child_is_ready ( or  ( or  ( or  (not (empty? (slot-value  eh 'outq))) (not (empty? (slot-value  eh 'inq)))) (not (equal  (slot-value  eh 'state)  "idle"))) (funcall (quote any_child_ready)   eh ))) #|line 398|# #|line 399|#
  )
(defun append_routing_descriptor (&optional  container  desc)
  (declare (ignorable  container  desc))                    #|line 401|#
  (enqueue (slot-value  container 'routings)  desc)         #|line 402|# #|line 403|#
  )
(defun injector (&optional  eh  mevent)
  (declare (ignorable  eh  mevent))                         #|line 405|#
  (funcall (slot-value  eh 'handler)   eh  mevent           #|line 406|#) #|line 407|#
  )                                                         #|line 409|# #|line 410|# #|line 411|#
(defclass Component_Registry ()                             #|line 412|#
  (
    (templates :accessor templates :initarg :templates :initform  (dict-fresh))  #|line 413|#)) #|line 414|#

                                                            #|line 415|#
(defclass Template ()                                       #|line 416|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 417|#
    (container :accessor container :initarg :container :initform  nil)  #|line 418|#
    (instantiator :accessor instantiator :initarg :instantiator :initform  nil)  #|line 419|#)) #|line 420|#

                                                            #|line 421|#
(defun mkTemplate (&optional  name  template_data  instantiator)
  (declare (ignorable  name  template_data  instantiator))  #|line 422|#
  (let (( templ  (make-instance 'Template)                  #|line 423|#))
    (declare (ignorable  templ))
    (setf (slot-value  templ 'name)  name)                  #|line 424|#
    (setf (slot-value  templ 'template_data)  template_data) #|line 425|#
    (setf (slot-value  templ 'instantiator)  instantiator)  #|line 426|#
    (return-from mkTemplate  templ)                         #|line 427|#) #|line 428|#
  )                                                         #|line 430|# #|  convert a little-network to internal form (an object data structure created by json parser) ...  |# #|line 431|# #|  the actual data structure depends on the json parser library used by the target language  |# #|line 432|# #|  the form of the data structure doesn't matter here, as long as we use lookup operators "@" in this .rt code  |# #|line 433|# #|line 434|# #|  ... by reading the little-net from an external file  |# #|line 435|#
(defun lnet2internal_from_file (&optional  container_xml)
  (declare (ignorable  container_xml))                      #|line 436|#
  (let ((pathname (uiop:getenv "PBPWD")                     #|line 437|#))
    (declare (ignorable pathname))
    (let ((filename  container_xml                          #|line 438|#))
      (declare (ignorable filename))

      ;; read json from a named file and convert it into internal form (a list of Container alists)
      (json2dict (merge-pathnames pathname filename))
                                                            #|line 439|#)) #|line 440|#
  ) #|  ... by reading the little-net from an embedded string (an aspect of creating t2t tool code)  |# #|line 442|#
(defun lnet2internal_from_string (&optional  lnet)
  (declare (ignorable  lnet))                               #|line 443|#

  (internalize-lnet-from-JSON *lnet*)
                                                            #|line 444|# #|line 445|#
  )
(defun delete_decls (&optional  d)
  (declare (ignorable  d))                                  #|line 447|#
  #| pass |#                                                #|line 448|# #|line 449|#
  )
(defun make_component_registry (&optional )
  (declare (ignorable ))                                    #|line 451|#
  (return-from make_component_registry  (make-instance 'Component_Registry) #|line 452|#) #|line 453|#
  )
(defun register_component (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component (funcall (quote abstracted_register_component)   reg  template  nil )) #|line 455|#
  )
(defun register_component_allow_overwriting (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component_allow_overwriting (funcall (quote abstracted_register_component)   reg  template  t )) #|line 456|#
  )
(defun abstracted_register_component (&optional  reg  template  ok_to_overwrite)
  (declare (ignorable  reg  template  ok_to_overwrite))     #|line 458|#
  (let ((name (funcall (quote mangle_name)  (slot-value  template 'name)  #|line 459|#)))
    (declare (ignorable name))
    (cond
      (( and  ( dict-in?  ( and  (not (equal   reg  nil))  name) (slot-value  reg 'templates)) (not  ok_to_overwrite)) #|line 460|#
        (funcall (quote load_error)   (concatenate 'string  "Component /"  (concatenate 'string (slot-value  template 'name)  "/ already declared"))  #|line 461|#)
        (return-from abstracted_register_component  reg)    #|line 462|#
        )
      (t                                                    #|line 463|#
        (setf (gethash name (slot-value  reg 'templates))  template) #|line 464|#
        (return-from abstracted_register_component  reg)    #|line 465|# #|line 466|#
        )))                                                 #|line 467|#
  )
(defun get_component_instance (&optional  reg  full_name  owner)
  (declare (ignorable  reg  full_name  owner))              #|line 469|#
  #|  If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it.  |# #|line 470|#
  #|  ":?<string>" is a probe part that is tagged with <string>  |# #|line 471|#
  #|  ":$ <command>" is a shell-out part that sends <command> to the operating system shell  |# #|line 472|#
  #|  ":<string>" else, it's just treated as a string part that produces <string> on its output  |# #|line 473|#
  (let ((template_name (funcall (quote mangle_name)   full_name  #|line 474|#)))
    (declare (ignorable template_name))
    (cond
      (( equal    ":"  (string (char  full_name 0)))        #|line 475|#
        (let ((instance_name (funcall (quote generate_instance_name)   owner  template_name  #|line 476|#)))
          (declare (ignorable instance_name))
          (let ((instance (funcall (quote external_instantiate)   reg  owner  instance_name  full_name  #|line 477|#)))
            (declare (ignorable instance))
            (return-from get_component_instance  instance)  #|line 478|#))
        )
      (t                                                    #|line 479|#
        (cond
          (( dict-in?   template_name (slot-value  reg 'templates)) #|line 480|#
            (let ((template (gethash template_name (slot-value  reg 'templates))))
              (declare (ignorable template))                #|line 481|#
              (cond
                (( equal    template  nil)                  #|line 482|#
                  (funcall (quote load_error)   (concatenate 'string  "Registry Error (A): Can't find component /"  (concatenate 'string  template_name  "/"))  #|line 483|#)
                  (return-from get_component_instance  nil) #|line 484|#
                  )
                (t                                          #|line 485|#
                  (let ((instance_name (funcall (quote generate_instance_name)   owner  template_name  #|line 486|#)))
                    (declare (ignorable instance_name))
                    (let ((instance (funcall (slot-value  template 'instantiator)   reg  owner  instance_name (slot-value  template 'template_data)  ""  #|line 487|#)))
                      (declare (ignorable instance))
                      (return-from get_component_instance  instance) #|line 488|#)) #|line 489|#
                  )))
            )
          (t                                                #|line 490|#
            (funcall (quote load_error)   (concatenate 'string  "Registry Error (B): Can't find component /"  (concatenate 'string  template_name  "/"))  #|line 491|#)
            (return-from get_component_instance  nil)       #|line 492|# #|line 493|#
            ))                                              #|line 494|#
        )))                                                 #|line 495|#
  )
(defun generate_instance_name (&optional  owner  template_name)
  (declare (ignorable  owner  template_name))               #|line 497|#
  (let ((owner_name  ""))
    (declare (ignorable owner_name))                        #|line 498|#
    (let ((instance_name  template_name))
      (declare (ignorable instance_name))                   #|line 499|#
      (cond
        ((not (equal   nil  owner))                         #|line 500|#
          (setf  owner_name (slot-value  owner 'name))      #|line 501|#
          (setf  instance_name  (concatenate 'string  owner_name  (concatenate 'string  "▹"  template_name)) #|line 502|#)
          )
        (t                                                  #|line 503|#
          (setf  instance_name  template_name)              #|line 504|# #|line 505|#
          ))
      (return-from generate_instance_name  instance_name)   #|line 506|#)) #|line 507|#
  )
(defun mangle_name (&optional  s)
  (declare (ignorable  s))                                  #|line 509|#
  #|  trim name to remove code from Container component names _ deferred until later (or never) |# #|line 510|#
  (return-from mangle_name  s)                              #|line 511|# #|line 512|#
  )                                                         #|line 514|# #|  Data for an asyncronous component _ effectively, a function with input |# #|line 515|# #|  and output queues of mevents. |# #|line 516|# #|  |# #|line 517|# #|  Components can either be a user_supplied function (“leaf“), or a “container“ |# #|line 518|# #|  that routes mevents to child components according to a list of connections |# #|line 519|# #|  that serve as a mevent routing table. |# #|line 520|# #|  |# #|line 521|# #|  Child components themselves can be leaves or other containers. |# #|line 522|# #|  |# #|line 523|# #|  `handler` invokes the code that is attached to this component. |# #|line 524|# #|  |# #|line 525|# #|  `instance_data` is a pointer to instance data that the `leaf_handler` |# #|line 526|# #|  function may want whenever it is invoked again. |# #|line 527|# #|line 528|# #|  TODO: what is .routings for? (is it a historical artefact that can be removed?)  |# #|line 529|# #|line 530|# #|  Eh_States :: enum { idle, active } |# #|line 531|#
(defclass Eh ()                                             #|line 532|#
  (
    (name :accessor name :initarg :name :initform  "")      #|line 533|#
    (inq :accessor inq :initarg :inq :initform  (make-instance 'Queue) #|line 534|#)
    (outq :accessor outq :initarg :outq :initform  (make-instance 'Queue) #|line 535|#)
    (owner :accessor owner :initarg :owner :initform  nil)  #|line 536|#
    (children :accessor children :initarg :children :initform  nil)  #|line 537|#
    (visit_ordering :accessor visit_ordering :initarg :visit_ordering :initform  (make-instance 'Queue) #|line 538|#)
    (connections :accessor connections :initarg :connections :initform  nil)  #|line 539|#
    (routings :accessor routings :initarg :routings :initform  (make-instance 'Queue) #|line 540|#)
    (handler :accessor handler :initarg :handler :initform  nil)  #|line 541|#
    (reset_instance_data :accessor reset_instance_data :initarg :reset_instance_data :initform  nil)  #|line 542|#
    (finject :accessor finject :initarg :finject :initform  nil)  #|line 543|#
    (stop :accessor stop :initarg :stop :initform  nil)     #|line 544|#
    (instance_data :accessor instance_data :initarg :instance_data :initform  nil)  #|line 545|# #|  arg needed for probe support  |# #|line 546|#
    (arg :accessor arg :initarg :arg :initform  "")         #|line 547|#
    (state :accessor state :initarg :state :initform  "idle")  #|line 548|# #|  bootstrap debugging |# #|line 549|#
    (kind :accessor kind :initarg :kind :initform  nil)  #|  enum { container, leaf, } |# #|line 550|#)) #|line 551|#

                                                            #|line 552|# #|  Creates a component that acts as a container. It is the same as a `Eh` instance |# #|line 553|# #|  whose handler function is `container_handler`. |# #|line 554|#
(defun make_container (&optional  name  owner)
  (declare (ignorable  name  owner))                        #|line 555|#
  (let (( eh  (make-instance 'Eh)                           #|line 556|#))
    (declare (ignorable  eh))
    (setf (slot-value  eh 'name)  name)                     #|line 557|#
    (setf (slot-value  eh 'owner)  owner)                   #|line 558|#
    (setf (slot-value  eh 'handler)  #'container_handler)   #|line 559|#
    (setf (slot-value  eh 'finject)  #'injector)            #|line 560|#
    (setf (slot-value  eh 'stop)  #'container_reset_children) #|line 561|#
    (setf (slot-value  eh 'state)  "idle")                  #|line 562|#
    (setf (slot-value  eh 'kind)  "container")              #|line 563|#
    (return-from make_container  eh)                        #|line 564|#) #|line 565|#
  ) #|  Creates a new leaf component out of a handler function, and a data parameter |# #|line 567|# #|  that will be passed back to your handler when called. |# #|line 568|# #|line 569|#
(defun make_leaf (&optional  name  owner  instance_data  arg  handler  reset_handler)
  (declare (ignorable  name  owner  instance_data  arg  handler  reset_handler)) #|line 570|#
  (let (( eh  (make-instance 'Eh)                           #|line 571|#))
    (declare (ignorable  eh))
    (let (( nm  ""))
      (declare (ignorable  nm))                             #|line 572|#
      (cond
        ((not (equal   nil  owner))                         #|line 573|#
          (setf  nm (slot-value  owner 'name))              #|line 574|# #|line 575|#
          ))
      (setf (slot-value  eh 'name)  (concatenate 'string  nm  (concatenate 'string  "▹"  name)) #|line 576|#)
      (setf (slot-value  eh 'owner)  owner)                 #|line 577|#
      (setf (slot-value  eh 'handler)  handler)             #|line 578|#
      (setf (slot-value  eh 'reset_handler)  reset_handler) #|line 579|#
      (setf (slot-value  eh 'finject)  #'injector)          #|line 580|#
      (setf (slot-value  eh 'stop)  #'leaf_reset)           #|line 581|#
      (setf (slot-value  eh 'instance_data)  instance_data) #|line 582|#
      (setf (slot-value  eh 'arg)  arg)                     #|line 583|#
      (setf (slot-value  eh 'state)  "idle")                #|line 584|#
      (setf (slot-value  eh 'kind)  "leaf")                 #|line 585|#
      (return-from make_leaf  eh)                           #|line 586|#)) #|line 587|#
  ) #|  Reset Leaf part to a known, idle state. Hit the big red button.  |# #|line 589|#
(defun leaf_reset (&optional  part)
  (declare (ignorable  part))                               #|line 590|#

  (setf (slot-value  part 'inq) (make-instance 'Queue))     #|line 591|#

  (setf (slot-value  part 'outq) (make-instance 'Queue))    #|line 592|#
  (cond
    ((not (equal  (slot-value  part 'reset_handler)  nil))  #|line 593|#
      (funcall (slot-value  part 'reset_handler)   part     #|line 594|#) #|line 595|#
      ))
  (setf (slot-value  part 'state)  "idle")                  #|line 596|# #|line 597|#
  ) #|  Sends a mevent on the given `port` with `data`, placing it on the output |# #|line 599|# #|  of the given component. |# #|line 600|# #|line 601|#
(defun send (&optional  eh  port  obj  causingMevent)
  (declare (ignorable  eh  port  obj  causingMevent))       #|line 602|#
  (let (( d  (make-instance 'Datum)                         #|line 603|#))
    (declare (ignorable  d))
    (setf (slot-value  d 'v)  obj)                          #|line 604|#
    (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 605|#)))
    (setf (slot-value  d 'reclaim)  nil)                    #|line 606|#
    (let ((mev (funcall (quote make_mevent)   port  d       #|line 607|#)))
      (declare (ignorable mev))
      (funcall (quote put_output)   eh  mev                 #|line 608|#))) #|line 609|#
  )
(defun forward (&optional  eh  port  mev)
  (declare (ignorable  eh  port  mev))                      #|line 611|#
  (let ((fwdmev (funcall (quote make_mevent)   port (slot-value  mev 'datum)  #|line 612|#)))
    (declare (ignorable fwdmev))
    (funcall (quote put_output)   eh  fwdmev                #|line 613|#)) #|line 614|#
  )
(defun inject_mevent (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 616|#
  (funcall (slot-value  eh 'finject)   eh  mev              #|line 617|#) #|line 618|#
  )
(defun set_active (&optional  eh)
  (declare (ignorable  eh))                                 #|line 620|#
  (setf (slot-value  eh 'state)  "active")                  #|line 621|# #|line 622|#
  )
(defun set_idle (&optional  eh)
  (declare (ignorable  eh))                                 #|line 624|#
  (setf (slot-value  eh 'state)  "idle")                    #|line 625|# #|line 626|#
  )
(defun put_output (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 628|#
  (enqueue (slot-value  eh 'outq)  mev)                     #|line 629|# #|line 630|#
  )
(defun obj_clone (&optional  obj)
  (declare (ignorable  obj))                                #|line 632|#
  (return-from obj_clone  obj)                              #|line 633|# #|line 634|#
  )
(defun initialize_component_palette_from_files (&optional  diagram_source_files)
  (declare (ignorable  diagram_source_files))               #|line 636|#
  (let (( reg (funcall (quote make_component_registry) )))
    (declare (ignorable  reg))                              #|line 637|#
    (loop for diagram_source in  diagram_source_files
      do
        (progn
          diagram_source                                    #|line 638|#
          (let ((all_containers_within_single_file (funcall (quote lnet2internal_from_file)   diagram_source  #|line 639|#)))
            (declare (ignorable all_containers_within_single_file))
            (loop for container in  all_containers_within_single_file
              do
                (progn
                  container                                 #|line 640|#
                  (funcall (quote register_component)   reg (funcall (quote mkTemplate)  (gethash  "name"  container)  #| container= |# container  #| instantiator= |# #'container_instantiator )  #|line 641|#) #|line 642|#
                  )))                                       #|line 643|#
          ))
    (funcall (quote initialize_stock_components)   reg      #|line 644|#)
    (return-from initialize_component_palette_from_files  reg) #|line 645|#) #|line 646|#
  )
(defun initialize_component_palette_from_string (&optional  lnet)
  (declare (ignorable  lnet))                               #|line 648|#
  (let (( reg (funcall (quote make_component_registry) )))
    (declare (ignorable  reg))                              #|line 649|#
    (let ((all_containers (funcall (quote lnet2internal_from_string)   lnet  #|line 650|#)))
      (declare (ignorable all_containers))
      (loop for container in  all_containers
        do
          (progn
            container                                       #|line 651|#
            (funcall (quote register_component)   reg (funcall (quote mkTemplate)  (gethash  "name"  container)  #| container= |# container  #| instantiator= |# #'container_instantiator )  #|line 652|#) #|line 653|#
            ))
      (funcall (quote initialize_stock_components)   reg    #|line 654|#)
      (return-from initialize_component_palette_from_string  reg) #|line 655|#)) #|line 656|#
  )                                                         #|line 658|#
(defun clone_string (&optional  s)
  (declare (ignorable  s))                                  #|line 659|#
  (return-from clone_string  s                              #|line 660|# #|line 661|#) #|line 662|#
  )
(defparameter  load_errors  nil)                            #|line 663|#
(defparameter  runtime_errors  nil)                         #|line 664|# #|line 665|#
(defun load_error (&optional  s)
  (declare (ignorable  s))                                  #|line 666|# #|line 667|#
  (format *error-output* "~a~%"  s)                         #|line 668|#
  (format *error-output* "
  ")                                                        #|line 669|#
  (setf  load_errors  t)                                    #|line 670|# #|line 671|#
  )
(defun runtime_error (&optional  s)
  (declare (ignorable  s))                                  #|line 673|# #|line 674|#
  (format *error-output* "~a~%"  s)                         #|line 675|#
  (break)                                                   #|line 676|#
  (setf  runtime_errors  t)                                 #|line 677|# #|line 678|#
  )                                                         #|line 680|#
(defun initialize_from_files (&optional  diagram_names)
  (declare (ignorable  diagram_names))                      #|line 681|#
  (let ((arg  nil))
    (declare (ignorable arg))                               #|line 682|#
    (let ((palette (funcall (quote initialize_component_palette_from_files)   diagram_names  #|line 683|#)))
      (declare (ignorable palette))
      (return-from initialize_from_files (values  palette (list   diagram_names  arg ))) #|line 684|#)) #|line 685|#
  )
(defun initialize_from_string (&optional )
  (declare (ignorable ))                                    #|line 687|#
  (let ((arg  nil))
    (declare (ignorable arg))                               #|line 688|#
    (let ((palette (funcall (quote initialize_component_palette_from_string) )))
      (declare (ignorable palette))                         #|line 689|#
      (return-from initialize_from_string (values  palette (list   nil  arg ))) #|line 690|#)) #|line 691|#
  )
(defun start (&optional  arg  part_name  palette  env)
  (declare (ignorable  arg  part_name  palette  env))       #|line 693|#
  (let ((part (funcall (quote start_bare)   part_name  palette  env  #|line 694|#)))
    (declare (ignorable part))
    (funcall (quote inject)   part  ""  arg                 #|line 695|#)
    (funcall (quote finalize)   part                        #|line 696|#)) #|line 697|#
  )
(defun start_bare (&optional  part_name  palette  env)
  (declare (ignorable  part_name  palette  env))            #|line 699|#
  (let ((diagram_names (nth  0  env)))
    (declare (ignorable diagram_names))                     #|line 700|#
    #|  get entrypoint container |#                         #|line 701|#
    (let (( part (funcall (quote get_component_instance)   palette  part_name  nil  #|line 702|#)))
      (declare (ignorable  part))
      (cond
        (( equal    nil  part)                              #|line 703|#
          (funcall (quote load_error)   (concatenate 'string  "Couldn't find container with page name /"  (concatenate 'string  part_name  (concatenate 'string  "/ in files "  (concatenate 'string (format nil "~a"  diagram_names)  " (check tab names, or disable compression?)"))))  #|line 707|#) #|line 708|#
          ))
      (return-from start_bare  part)                        #|line 709|#)) #|line 710|#
  )
(defun inject (&optional  part  port  payload)
  (declare (ignorable  part  port  payload))                #|line 712|#
  (cond
    ((not  load_errors)                                     #|line 713|#
      (let (( d  (make-instance 'Datum)                     #|line 714|#))
        (declare (ignorable  d))
        (setf (slot-value  d 'v)  payload)                  #|line 715|#
        (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 716|#)))
        (setf (slot-value  d 'reclaim)  nil)                #|line 717|#
        (let (( mev (funcall (quote make_mevent)   port  d  #|line 718|#)))
          (declare (ignorable  mev))
          (funcall (quote inject_mevent)   part  mev        #|line 719|#)))
      )
    (t                                                      #|line 720|#
      (break)                                               #|line 721|# #|line 722|#
      ))                                                    #|line 723|#
  )
(defun finalize (&optional  part)
  (declare (ignorable  part))                               #|line 725|#
  (queue-as-json-to-stdout (slot-value  part 'outq))        #|line 726|# #|line 727|#
  )
(defun new_datum_bang (&optional )
  (declare (ignorable ))                                    #|line 729|#
  (let (( d  (make-instance 'Datum)                         #|line 730|#))
    (declare (ignorable  d))
    (setf (slot-value  d 'v)  "!")                          #|line 731|#
    (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 732|#)))
    (setf (slot-value  d 'reclaim)  nil)                    #|line 733|#
    (return-from new_datum_bang  d                          #|line 734|# #|line 735|#))
  )
#|  This is called `external` due to historical reasons. This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way.  |# #|line 1|# #|line 2|#
(defun external_instantiate (&optional  reg  owner  name  arg)
  (declare (ignorable  reg  owner  name  arg))              #|line 3|#
  (let ((name_with_id (funcall (quote gensymbol)   name     #|line 4|#)))
    (declare (ignorable name_with_id))
    (return-from external_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  arg  #'handle_external  nil  #|line 5|#))) #|line 6|#
  )
#|line 1|#
(defun trash_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 2|#
  (let ((name_with_id (funcall (quote gensymbol)   "trash"  #|line 3|#)))
    (declare (ignorable name_with_id))
    (return-from trash_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'trash_handler  nil  #|line 4|#))) #|line 5|#
  )
(defun trash_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 7|#
  #|  to appease dumped_on_floor checker |#                 #|line 8|#
  #| pass |#                                                #|line 9|# #|line 10|#
  )
(defclass TwoMevents ()                                     #|line 11|#
  (
    (firstmev :accessor firstmev :initarg :firstmev :initform  nil)  #|line 12|#
    (secondmev :accessor secondmev :initarg :secondmev :initform  nil)  #|line 13|#)) #|line 14|#

                                                            #|line 15|# #|  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } |# #|line 16|#
(defclass Deracer_Instance_Data ()                          #|line 17|#
  (
    (state :accessor state :initarg :state :initform  nil)  #|line 18|#
    (buffer :accessor buffer :initarg :buffer :initform  nil)  #|line 19|#)) #|line 20|#

                                                            #|line 21|#
(defun reclaim_Buffers_from_heap (&optional  inst)
  (declare (ignorable  inst))                               #|line 22|#
  #| pass |#                                                #|line 23|# #|line 24|#
  )
(defun deracer_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 26|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 27|#
    (setf (slot-value  inst 'state)  "idle")                #|line 28|#
    (setf (slot-value  inst 'buffer)  (make-instance 'TwoMevents) #|line 29|#)) #|line 30|#
  )
(defun deracer_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 32|#
  (let ((name_with_id (funcall (quote gensymbol)   "deracer"  #|line 33|#)))
    (declare (ignorable name_with_id))
    (let (( inst  (make-instance 'Deracer_Instance_Data)    #|line 34|#))
      (declare (ignorable  inst))
      (setf (slot-value  inst 'state)  "idle")              #|line 35|#
      (setf (slot-value  inst 'buffer)  (make-instance 'TwoMevents) #|line 36|#)
      (let ((eh (funcall (quote make_leaf)   name_with_id  owner  inst  ""  #'deracer_handler  #'deracer_reset_handler  #|line 37|#)))
        (declare (ignorable eh))
        (return-from deracer_instantiate  eh)               #|line 38|#))) #|line 39|#
  )
(defun send_firstmev_then_secondmev (&optional  eh  inst)
  (declare (ignorable  eh  inst))                           #|line 41|#
  (funcall (quote forward)   eh  "1" (slot-value (slot-value  inst 'buffer) 'firstmev)  #|line 42|#)
  (funcall (quote forward)   eh  "2" (slot-value (slot-value  inst 'buffer) 'secondmev)  #|line 43|#)
  (funcall (quote reclaim_Buffers_from_heap)   inst         #|line 44|#) #|line 45|#
  )
(defun deracer_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 47|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 48|#
    (cond
      (( equal   (slot-value  inst 'state)  "idle")         #|line 49|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 50|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 51|#
            (setf (slot-value  inst 'state)  "waitingForSecondmev") #|line 52|#
            )
          (( equal    "2" (slot-value  mev 'port))          #|line 53|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 54|#
            (setf (slot-value  inst 'state)  "waitingForFirstmev") #|line 55|#
            )
          (t                                                #|line 56|#
            (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port (case A) for deracer " (slot-value  mev 'port))  #|line 57|#) #|line 58|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForFirstmev") #|line 59|#
        (cond
          (( equal    "1" (slot-value  mev 'port))          #|line 60|#
            (setf (slot-value (slot-value  inst 'buffer) 'firstmev)  mev) #|line 61|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 62|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 63|#
            )
          (t                                                #|line 64|#
            (funcall (quote runtime_error)   (concatenate 'string  "deracer: waiting for 1 but got ["  (concatenate 'string (slot-value  mev 'port)  "] (case B)"))  #|line 65|#) #|line 66|#
            ))
        )
      (( equal   (slot-value  inst 'state)  "waitingForSecondmev") #|line 67|#
        (cond
          (( equal    "2" (slot-value  mev 'port))          #|line 68|#
            (setf (slot-value (slot-value  inst 'buffer) 'secondmev)  mev) #|line 69|#
            (funcall (quote send_firstmev_then_secondmev)   eh  inst  #|line 70|#)
            (setf (slot-value  inst 'state)  "idle")        #|line 71|#
            )
          (t                                                #|line 72|#
            (funcall (quote runtime_error)   (concatenate 'string  "deracer: waiting for 2 but got ["  (concatenate 'string (slot-value  mev 'port)  "] (case C)"))  #|line 73|#) #|line 74|#
            ))
        )
      (t                                                    #|line 75|#
        (funcall (quote runtime_error)   "bad state for deracer {eh.state}"  #|line 76|#) #|line 77|#
        )))                                                 #|line 78|#
  )
(defun low_level_read_text_file_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 80|#
  (let ((name_with_id (funcall (quote gensymbol)   "Low Level Read Text File"  #|line 81|#)))
    (declare (ignorable name_with_id))
    (return-from low_level_read_text_file_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'low_level_read_text_file_handler  nil  #|line 82|#))) #|line 83|#
  )
(defun low_level_read_text_file_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 85|#
  (let ((fname (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable fname))                             #|line 86|#

    ;; read text from a named file fname, send the text out on port "" else send error info on port "✗"
    ;; given eh and mev if needed
    (handler-bind ((error #'(lambda (condition) (send_string eh "✗" (format nil "~&~A~&" condition)))))
      (with-open-file (stream fname)
        (let ((contents (make-string (file-length stream))))
          (read-sequence contents stream)
          (send_string eh "" contents))))
                                                            #|line 87|#) #|line 88|#
  )
(defun ensure_string_datum_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 90|#
  (let ((name_with_id (funcall (quote gensymbol)   "Ensure String Datum"  #|line 91|#)))
    (declare (ignorable name_with_id))
    (return-from ensure_string_datum_instantiate (funcall (quote make_leaf)   name_with_id  owner  nil  ""  #'ensure_string_datum_handler  nil  #|line 92|#))) #|line 93|#
  )
(defun ensure_string_datum_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 95|#
  (cond
    (( equal    "string" (funcall (slot-value (slot-value  mev 'datum) 'kind) )) #|line 96|#
      (funcall (quote forward)   eh  ""  mev                #|line 97|#)
      )
    (t                                                      #|line 98|#
      (let ((emev  (concatenate 'string  "*** ensure: type error (expected a string datum) but got " (slot-value  mev 'datum)) #|line 99|#))
        (declare (ignorable emev))
        (funcall (quote send)   eh  "✗"  emev  mev          #|line 100|#)) #|line 101|#
      ))                                                    #|line 102|#
  )
(defclass Syncfilewrite_Data ()                             #|line 104|#
  (
    (filename :accessor filename :initarg :filename :initform  "")  #|line 105|#)) #|line 106|#

                                                            #|line 107|#
(defun syncfilewrite_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 108|#
  (setf (slot-value  eh 'instance_data)  (make-instance 'Syncfilewrite_Data) #|line 109|#) #|line 110|#
  ) #|  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) |# #|line 112|#
(defun syncfilewrite_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 113|#
  (let ((name_with_id (funcall (quote gensymbol)   "syncfilewrite"  #|line 114|#)))
    (declare (ignorable name_with_id))
    (let ((inst  (make-instance 'Syncfilewrite_Data)        #|line 115|#))
      (declare (ignorable inst))
      (return-from syncfilewrite_instantiate (funcall (quote make_leaf)   name_with_id  owner  inst  ""  #'syncfilewrite_handler  #'syncfilewrite_reset_handler  #|line 116|#)))) #|line 117|#
  )
(defun syncfilewrite_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 119|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 120|#
    (cond
      (( equal    "filename" (slot-value  mev 'port))       #|line 121|#
        (setf (slot-value  inst 'filename) (slot-value (slot-value  mev 'datum) 'v)) #|line 122|#
        )
      (( equal    "input" (slot-value  mev 'port))          #|line 123|#
        (let ((contents (slot-value (slot-value  mev 'datum) 'v)))
          (declare (ignorable contents))                    #|line 124|#
          (let (( f (funcall (quote open)  (slot-value  inst 'filename)  "w"  #|line 125|#)))
            (declare (ignorable  f))
            (cond
              ((not (equal   f  nil))                       #|line 126|#
                (funcall (slot-value  f 'write)  (slot-value (slot-value  mev 'datum) 'v)  #|line 127|#)
                (funcall (slot-value  f 'close) )           #|line 128|#
                (funcall (quote send)   eh  "done" (funcall (quote new_datum_bang) )  mev  #|line 129|#)
                )
              (t                                            #|line 130|#
                (funcall (quote send)   eh  "✗"  (concatenate 'string  "open error on file " (slot-value  inst 'filename))  mev  #|line 131|#) #|line 132|#
                ))))                                        #|line 133|#
        )))                                                 #|line 134|#
  )
(defclass StringConcat_Instance_Data ()                     #|line 136|#
  (
    (buffer1 :accessor buffer1 :initarg :buffer1 :initform  nil)  #|line 137|#
    (buffer2 :accessor buffer2 :initarg :buffer2 :initform  nil)  #|line 138|#)) #|line 139|#

                                                            #|line 140|#
(defun strinconcat_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 141|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 142|#
    (setf (slot-value  inst 'buffer1)  nil)                 #|line 143|#
    (setf (slot-value  inst 'buffer2)  nil)                 #|line 144|#) #|line 145|#
  )
(defun stringconcat_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 147|#
  (let ((name_with_id (funcall (quote gensymbol)   "stringconcat"  #|line 148|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringConcat_Instance_Data) #|line 149|#))
      (declare (ignorable instp))
      (return-from stringconcat_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'stringconcat_handler  #'stringconcat_reset_handler  #|line 150|#)))) #|line 151|#
  )
(defun stringconcat_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 153|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 154|#
    (cond
      (( equal    "1" (slot-value  mev 'port))              #|line 155|#
        (setf (slot-value  inst 'buffer1) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 156|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 157|#)
        )
      (( equal    "2" (slot-value  mev 'port))              #|line 158|#
        (setf (slot-value  inst 'buffer2) (funcall (quote clone_string)  (slot-value (slot-value  mev 'datum) 'v)  #|line 159|#))
        (funcall (quote maybe_stringconcat)   eh  inst  mev  #|line 160|#)
        )
      (( equal    "reset" (slot-value  mev 'port))          #|line 161|#
        (setf (slot-value  inst 'buffer1)  nil)             #|line 162|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 163|#
        )
      (t                                                    #|line 164|#
        (funcall (quote runtime_error)   (concatenate 'string  "bad mev.port for stringconcat: " (slot-value  mev 'port))  #|line 165|#) #|line 166|#
        )))                                                 #|line 167|#
  )
(defun maybe_stringconcat (&optional  eh  inst  mev)
  (declare (ignorable  eh  inst  mev))                      #|line 169|#
  (cond
    (( and  (not (equal  (slot-value  inst 'buffer1)  nil)) (not (equal  (slot-value  inst 'buffer2)  nil))) #|line 170|#
      (let (( concatenated_string  ""))
        (declare (ignorable  concatenated_string))          #|line 171|#
        (cond
          (( equal    0 (length (slot-value  inst 'buffer1))) #|line 172|#
            (setf  concatenated_string (slot-value  inst 'buffer2)) #|line 173|#
            )
          (( equal    0 (length (slot-value  inst 'buffer2))) #|line 174|#
            (setf  concatenated_string (slot-value  inst 'buffer1)) #|line 175|#
            )
          (t                                                #|line 176|#
            (setf  concatenated_string (+ (slot-value  inst 'buffer1) (slot-value  inst 'buffer2))) #|line 177|# #|line 178|#
            ))
        (funcall (quote send)   eh  ""  concatenated_string  mev  #|line 179|#)
        (setf (slot-value  inst 'buffer1)  nil)             #|line 180|#
        (setf (slot-value  inst 'buffer2)  nil)             #|line 181|#) #|line 182|#
      ))                                                    #|line 183|#
  ) #|  |#                                                  #|line 185|# #|line 186|#
(defun string_constant_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 187|# #|line 188|#
  (let ((name_with_id (funcall (quote gensymbol)   "strconst"  #|line 189|#)))
    (declare (ignorable name_with_id))
    (let (( s  template_data))
      (declare (ignorable  s))                              #|line 190|#
      (cond
        ((not (equal   projectRoot  ""))                    #|line 191|#
          (setf  s (substitute  "_00_"  projectRoot  s)     #|line 192|#) #|line 193|#
          ))
      (return-from string_constant_instantiate (funcall (quote make_leaf)   name_with_id  owner  s  ""  #'string_constant_handler  nil  #|line 194|#)))) #|line 195|#
  )
(defun string_constant_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 197|#
  (let ((s (slot-value  eh 'instance_data)))
    (declare (ignorable s))                                 #|line 198|#
    (funcall (quote send)   eh  ""  s  mev                  #|line 199|#)) #|line 200|#
  )
(defun fakepipename_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 202|#
  (let ((instance_name (funcall (quote gensymbol)   "fakepipe"  #|line 203|#)))
    (declare (ignorable instance_name))
    (return-from fakepipename_instantiate (funcall (quote make_leaf)   instance_name  owner  nil  ""  #'fakepipename_handler  nil  #|line 204|#))) #|line 205|#
  )
(defparameter  rand  0)                                     #|line 207|# #|line 208|#
(defun fakepipename_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 209|# #|line 210|#
  (setf  rand (+  rand  1))
  #|  not very random, but good enough _ ;rand' must be unique within a single run |# #|line 211|#
  (funcall (quote send)   eh  ""  (concatenate 'string  "/tmp/fakepipe"  rand)  mev  #|line 212|#) #|line 213|#
  )                                                         #|line 215|#
(defclass Switch1star_Instance_Data ()                      #|line 216|#
  (
    (state :accessor state :initarg :state :initform  "1")  #|line 217|#)) #|line 218|#

                                                            #|line 219|#
(defun switch1star_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 220|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 221|#
    (setf  inst  (make-instance 'Switch1star_Instance_Data) #|line 222|#)) #|line 223|#
  )
(defun switch1star_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 225|#
  (let ((name_with_id (funcall (quote gensymbol)   "switch1*"  #|line 226|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'Switch1star_Instance_Data) #|line 227|#))
      (declare (ignorable instp))
      (return-from switch1star_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'switch1star_handler  #'switch1star_reset_handler  #|line 228|#)))) #|line 229|#
  )
(defun switch1star_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 231|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 232|#
    (let ((whichOutput (slot-value  inst 'state)))
      (declare (ignorable whichOutput))                     #|line 233|#
      (cond
        (( equal    "" (slot-value  mev 'port))             #|line 234|#
          (cond
            (( equal    "1"  whichOutput)                   #|line 235|#
              (funcall (quote forward)   eh  "1"  mev       #|line 236|#)
              (setf (slot-value  inst 'state)  "*")         #|line 237|#
              )
            (( equal    "*"  whichOutput)                   #|line 238|#
              (funcall (quote forward)   eh  "*"  mev       #|line 239|#)
              )
            (t                                              #|line 240|#
              (funcall (quote send)   eh  "✗"  "internal error bad state in switch1*"  mev  #|line 241|#) #|line 242|#
              ))
          )
        (( equal    "reset" (slot-value  mev 'port))        #|line 243|#
          (setf (slot-value  inst 'state)  "1")             #|line 244|#
          )
        (t                                                  #|line 245|#
          (funcall (quote send)   eh  "✗"  "internal error bad mevent for switch1*"  mev  #|line 246|#) #|line 247|#
          ))))                                              #|line 248|#
  )
(defclass StringAccumulator ()                              #|line 250|#
  (
    (s :accessor s :initarg :s :initform  "")               #|line 251|#)) #|line 252|#

                                                            #|line 253|#
(defun strcatstar_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 254|#
  (setf (slot-value  eh 'instance_data)  (make-instance 'StringAccumulator) #|line 255|#) #|line 256|#
  )
(defun strcatstar_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 258|#
  (let ((name_with_id (funcall (quote gensymbol)   "String Concat *"  #|line 259|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'StringAccumulator)        #|line 260|#))
      (declare (ignorable instp))
      (return-from strcatstar_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'strcatstar_handler  #'strcatstar_reset_handler  #|line 261|#)))) #|line 262|#
  )
(defun strcatstar_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 264|#
  (let (( accum (slot-value  eh 'instance_data)))
    (declare (ignorable  accum))                            #|line 265|#
    (cond
      (( equal    "" (slot-value  mev 'port))               #|line 266|#
        (setf (slot-value  accum 's)  (concatenate 'string (slot-value  accum 's) (slot-value (slot-value  mev 'datum) 'v)) #|line 267|#)
        )
      (( equal    "fini" (slot-value  mev 'port))           #|line 268|#
        (funcall (quote send)   eh  "" (slot-value  accum 's)  mev  #|line 269|#)
        )
      (t                                                    #|line 270|#
        (funcall (quote send)   eh  "✗"  "internal error bad mevent for String Concat *"  mev  #|line 271|#) #|line 272|#
        )))                                                 #|line 273|#
  )
(defclass BlockOnErrorState ()                              #|line 275|#
  (
    (hasError :accessor hasError :initarg :hasError :initform  "no")  #|line 276|#)) #|line 277|#

                                                            #|line 278|#
(defun blockOnError_reset_handler (&optional  eh)
  (declare (ignorable  eh))                                 #|line 279|#
  (setf (slot-value  eh 'instance_data)  (make-instance 'BlockOnErrorState) #|line 280|#) #|line 281|#
  )
(defun blockOnError_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 283|#
  (let ((name_with_id (funcall (quote gensymbol)   "blockOnError"  #|line 284|#)))
    (declare (ignorable name_with_id))
    (let ((instp  (make-instance 'BlockOnErrorState)        #|line 285|#))
      (declare (ignorable instp))
      (return-from blockOnError_instantiate (funcall (quote make_leaf)   name_with_id  owner  instp  ""  #'blockOnError_handler  #'blockOnError_reset_handler  #|line 286|#)))) #|line 287|#
  )
(defun blockOnError_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 289|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 290|#
    (cond
      (( equal    "" (slot-value  mev 'port))               #|line 291|#
        (cond
          (( equal   (slot-value  inst 'hasError)  "no")    #|line 292|#
            (funcall (quote send)   eh  "" (slot-value (slot-value  mev 'datum) 'v)  mev  #|line 293|#) #|line 294|#
            ))
        )
      (( equal    "✗" (slot-value  mev 'port))              #|line 295|#
        (setf (slot-value  inst 'hasError)  "yes")          #|line 296|#
        )
      (( equal    "reset" (slot-value  mev 'port))          #|line 297|#
        (setf (slot-value  inst 'hasError)  "no")           #|line 298|# #|line 299|#
        )))                                                 #|line 300|#
  )
(defun stop_instantiate (&optional  reg  owner  name  template_data  arg)
  (declare (ignorable  reg  owner  name  template_data  arg)) #|line 302|#
  (let ((name_with_id (funcall (quote gensymbol)   "Stop"   #|line 303|#)))
    (declare (ignorable name_with_id))
    (let ((inst  nil))
      (declare (ignorable inst))                            #|line 304|#
      (return-from stop_instantiate (funcall (quote make_leaf)   name_with_id  owner  inst  ""  #'stop_handler  nil  #|line 305|#)))) #|line 306|#
  )
(defun stop_handler (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 308|#
  (let (( inst (slot-value  eh 'instance_data)))
    (declare (ignorable  inst))                             #|line 309|#
    (let (( parent (slot-value  eh 'owner)))
      (declare (ignorable  parent))                         #|line 310|#
      (let (( s  (concatenate 'string  "   !!! stopping: '"  (concatenate 'string (slot-value  parent 'name)  "'")) #|line 311|#))
        (declare (ignorable  s))
        (format *error-output* "~a~%"  s)                   #|line 312|#
        (format *error-output* "
        ")                                                  #|line 313|#
        (funcall (slot-value  parent 'stop)   parent        #|line 314|#)
        (funcall (quote send)   eh  "" (slot-value (slot-value  mev 'datum) 'v)  mev  #|line 315|#)))) #|line 316|#
  ) #|  all of the the built_in leaves are listed here |#   #|line 318|# #|  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project |# #|line 319|# #|line 320|#
(defun initialize_stock_components (&optional  reg)
  (declare (ignorable  reg))                                #|line 321|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1then2"  nil  #'deracer_instantiate )  #|line 322|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "1→2"  nil  #'deracer_instantiate )  #|line 323|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "trash"  nil  #'trash_instantiate )  #|line 324|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "🗑️"  nil  #'trash_instantiate )  #|line 325|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "🚫"  nil  #'stop_instantiate )  #|line 326|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "blockOnError"  nil  #'blockOnError_instantiate )  #|line 327|#) #|line 328|# #|line 329|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Read Text File"  nil  #'low_level_read_text_file_instantiate )  #|line 330|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "Ensure String Datum"  nil  #'ensure_string_datum_instantiate )  #|line 331|#) #|line 332|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "syncfilewrite"  nil  #'syncfilewrite_instantiate )  #|line 333|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "String Concat"  nil  #'stringconcat_instantiate )  #|line 334|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "switch1*"  nil  #'switch1star_instantiate )  #|line 335|#)
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "String Concat *"  nil  #'strcatstar_instantiate )  #|line 336|#)
  #|  for fakepipe |#                                       #|line 337|#
  (funcall (quote register_component)   reg (funcall (quote mkTemplate)   "fakepipename"  nil  #'fakepipename_instantiate )  #|line 338|#) #|line 339|#
  )
(defun handle_external (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 1|#
  (let ((s (slot-value  eh 'arg)))
    (declare (ignorable s))                                 #|line 2|#
    (let (( firstc (nth  1  s)))
      (declare (ignorable  firstc))                         #|line 3|#
      (cond
        (( equal    firstc  "$")                            #|line 4|#
          (funcall (quote shell_out_handler)   eh  (subseq  (subseq  (subseq  s 1) 1) 1)  mev  #|line 5|#)
          )
        (( equal    firstc  "?")                            #|line 6|#
          (funcall (quote probe_handler)   eh  (subseq  s 1)  mev  #|line 7|#)
          )
        (t                                                  #|line 8|#
          #|  just a string, send it out  |#                #|line 9|#
          (funcall (quote send)   eh  ""  (subseq  s 1)  mev  #|line 10|#) #|line 11|#
          ))))                                              #|line 12|#
  )
(defun probe_handler (&optional  eh  tag  mev)
  (declare (ignorable  eh  tag  mev))                       #|line 14|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 15|#
    (live_update  "Info"  (concatenate 'string  "  @"  (concatenate 'string (format nil "~a"  ticktime)  (concatenate 'string  "  "  (concatenate 'string  "probe "  (concatenate 'string (slot-value  eh 'name)  (concatenate 'string  ": " (format nil "~a"  s)))))))) #|line 23|#) #|line 24|#
  )
(defun shell_out_handler (&optional  eh  cmd  mev)
  (declare (ignorable  eh  cmd  mev))                       #|line 26|#
  (let ((s (slot-value (slot-value  mev 'datum) 'v)))
    (declare (ignorable s))                                 #|line 27|#
    (let (( ret  nil))
      (declare (ignorable  ret))                            #|line 28|#
      (let (( rc  nil))
        (declare (ignorable  rc))                           #|line 29|#
        (let (( stdout  nil))
          (declare (ignorable  stdout))                     #|line 30|#
          (let (( stderr  nil))
            (declare (ignorable  stderr))                   #|line 31|#
            (let (( command  cmd))
              (declare (ignorable  command))                #|line 32|#
              (let (( pbpRoot (uiop:getenv "PBP")           #|line 33|#))
                (declare (ignorable  pbpRoot))
                (cond
                  ((not (equal   pbpRoot  ""))              #|line 34|#
                    (setf  command (substitute  "_/"  (concatenate 'string  pbpRoot  "/")  command) #|line 37|#) #|line 38|#
                    ))
                (cond
                  ( nil                                     #|line 39|#
                    (format *error-output* "~a~%"  (concatenate 'string  "- --- shell-out: "  command)) #|line 40|#
                    (format *error-output* "
                    ")                                      #|line 41|# #|line 42|#
                    ))
                (multiple-value-setq (stdout stderr rc) (uiop::run-program (concatenate 'string  command " "  s) :output :string :error :string)) #|line 43|#
                (cond
                  (( equal    rc  0)                        #|line 44|#
                    (funcall (quote send)   eh  ""  (concatenate 'string  stdout  stderr)  mev  #|line 45|#)
                    )
                  (t                                        #|line 46|#
                    (funcall (quote send)   eh  "✗"  (concatenate 'string  stdout  stderr)  mev  #|line 47|#) #|line 48|#
                    )))))))))                               #|line 49|#
  )
