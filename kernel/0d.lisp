
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
  ) #|  Frees the given container and associated data. |#   #|line 200|#
(defun destroy_container (&optional  eh)
  (declare (ignorable  eh))                                 #|line 201|#
  #| pass |#                                                #|line 202|# #|line 203|#
  ) #|  Routing connection for a container component. The `direction` field has |# #|line 205|# #|  no affect on the default mevent routing system _ it is there for debugging |# #|line 206|# #|  purposes, or for reading by other tools. |# #|line 207|# #|line 208|#
(defclass Connector ()                                      #|line 209|#
  (
    (direction :accessor direction :initarg :direction :initform  nil)  #|  down, across, up, through |# #|line 210|#
    (sender :accessor sender :initarg :sender :initform  nil)  #|line 211|#
    (receiver :accessor receiver :initarg :receiver :initform  nil)  #|line 212|#)) #|line 213|#

                                                            #|line 214|# #|  `Sender` is used to “pattern match“ which `Receiver` a mevent should go to, |# #|line 215|# #|  based on component ID (pointer) and port name. |# #|line 216|# #|line 217|#
(defclass Sender ()                                         #|line 218|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 219|#
    (component :accessor component :initarg :component :initform  nil)  #|line 220|#
    (port :accessor port :initarg :port :initform  nil)     #|line 221|#)) #|line 222|#

                                                            #|line 223|# #|line 224|# #|line 225|# #|  `Receiver` is a handle to a destination queue, and a `port` name to assign |# #|line 226|# #|  to incoming mevents to this queue. |# #|line 227|# #|line 228|#
(defclass Receiver ()                                       #|line 229|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 230|#
    (queue :accessor queue :initarg :queue :initform  nil)  #|line 231|#
    (port :accessor port :initarg :port :initform  nil)     #|line 232|#
    (component :accessor component :initarg :component :initform  nil)  #|line 233|#)) #|line 234|#

                                                            #|line 235|#
(defun mkSender (&optional  name  component  port)
  (declare (ignorable  name  component  port))              #|line 236|#
  (let (( s  (make-instance 'Sender)                        #|line 237|#))
    (declare (ignorable  s))
    (setf (slot-value  s 'name)  name)                      #|line 238|#
    (setf (slot-value  s 'component)  component)            #|line 239|#
    (setf (slot-value  s 'port)  port)                      #|line 240|#
    (return-from mkSender  s)                               #|line 241|#) #|line 242|#
  )
(defun mkReceiver (&optional  name  component  port  q)
  (declare (ignorable  name  component  port  q))           #|line 244|#
  (let (( r  (make-instance 'Receiver)                      #|line 245|#))
    (declare (ignorable  r))
    (setf (slot-value  r 'name)  name)                      #|line 246|#
    (setf (slot-value  r 'component)  component)            #|line 247|#
    (setf (slot-value  r 'port)  port)                      #|line 248|#
    #|  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. |# #|line 249|#
    (setf (slot-value  r 'queue)  q)                        #|line 250|#
    (return-from mkReceiver  r)                             #|line 251|#) #|line 252|#
  ) #|  Checks if two senders match, by pointer equality and port name matching. |# #|line 254|#
(defun sender_eq (&optional  s1  s2)
  (declare (ignorable  s1  s2))                             #|line 255|#
  (let ((same_components ( equal   (slot-value  s1 'component) (slot-value  s2 'component))))
    (declare (ignorable same_components))                   #|line 256|#
    (let ((same_ports ( equal   (slot-value  s1 'port) (slot-value  s2 'port))))
      (declare (ignorable same_ports))                      #|line 257|#
      (return-from sender_eq ( and   same_components  same_ports)) #|line 258|#)) #|line 259|#
  ) #|  Delivers the given mevent to the receiver of this connector. |# #|line 261|# #|line 262|#
(defun deposit (&optional  parent  conn  mevent)
  (declare (ignorable  parent  conn  mevent))               #|line 263|#
  (let ((new_mevent (funcall (quote make_mevent)  (slot-value (slot-value  conn 'receiver) 'port) (slot-value  mevent 'datum)  #|line 264|#)))
    (declare (ignorable new_mevent))
    (funcall (quote push_mevent)   parent (slot-value (slot-value  conn 'receiver) 'component) (slot-value (slot-value  conn 'receiver) 'queue)  new_mevent  #|line 265|#)) #|line 266|#
  )
(defun force_tick (&optional  parent  eh)
  (declare (ignorable  parent  eh))                         #|line 268|#
  (let ((tick_mev (funcall (quote make_mevent)   "." (funcall (quote new_datum_bang) )  #|line 269|#)))
    (declare (ignorable tick_mev))
    (funcall (quote push_mevent)   parent  eh (slot-value  eh 'inq)  tick_mev  #|line 270|#)
    (return-from force_tick  tick_mev)                      #|line 271|#) #|line 272|#
  )
(defun push_mevent (&optional  parent  receiver  inq  m)
  (declare (ignorable  parent  receiver  inq  m))           #|line 274|#
  (enqueue  inq  m)                                         #|line 275|#
  (enqueue (slot-value  parent 'visit_ordering)  receiver)  #|line 276|# #|line 277|#
  )
(defun is_self (&optional  child  container)
  (declare (ignorable  child  container))                   #|line 279|#
  #|  in an earlier version “self“ was denoted as ϕ |#      #|line 280|#
  (return-from is_self ( equal    child  container))        #|line 281|# #|line 282|#
  )
(defun step_child (&optional  child  mev)
  (declare (ignorable  child  mev))                         #|line 284|#
  (let ((before_state (slot-value  child 'state)))
    (declare (ignorable before_state))                      #|line 285|#
    (funcall (slot-value  child 'handler)   child  mev      #|line 286|#)
    (let ((after_state (slot-value  child 'state)))
      (declare (ignorable after_state))                     #|line 287|#
      (return-from step_child (values ( and  ( equal    before_state  "idle") (not (equal   after_state  "idle")))  #|line 288|#( and  (not (equal   before_state  "idle")) (not (equal   after_state  "idle")))  #|line 289|#( and  (not (equal   before_state  "idle")) ( equal    after_state  "idle")))) #|line 290|#)) #|line 291|#
  )
(defun step_children (&optional  container  causingMevent)
  (declare (ignorable  container  causingMevent))           #|line 293|#
  (setf (slot-value  container 'state)  "idle")             #|line 294|#
  (loop for child in (queue2list (slot-value  container 'visit_ordering))
    do
      (progn
        child                                               #|line 295|#
        #|  child = container represents self, skip it |#   #|line 296|#
        (cond
          ((not (funcall (quote is_self)   child  container )) #|line 297|#
            (cond
              ((not (empty? (slot-value  child 'inq)))      #|line 298|#
                (let ((mev (dequeue (slot-value  child 'inq)) #|line 299|#))
                  (declare (ignorable mev))
                  (let (( began_long_run  nil))
                    (declare (ignorable  began_long_run))   #|line 300|#
                    (let (( continued_long_run  nil))
                      (declare (ignorable  continued_long_run)) #|line 301|#
                      (let (( ended_long_run  nil))
                        (declare (ignorable  ended_long_run)) #|line 302|#
                        (multiple-value-setq ( began_long_run  continued_long_run  ended_long_run) (funcall (quote step_child)   child  mev  #|line 303|#))
                        (cond
                          ( began_long_run                  #|line 304|#
                            #| pass |#                      #|line 305|#
                            )
                          ( continued_long_run              #|line 306|#
                            #| pass |#                      #|line 307|#
                            )
                          ( ended_long_run                  #|line 308|#
                            #| pass |#                      #|line 309|# #|line 310|#
                            ))
                        (funcall (quote destroy_mevent)   mev  #|line 311|#)))))
                )
              (t                                            #|line 312|#
                (cond
                  ((not (equal  (slot-value  child 'state)  "idle")) #|line 313|#
                    (let ((mev (funcall (quote force_tick)   container  child  #|line 314|#)))
                      (declare (ignorable mev))
                      (funcall (slot-value  child 'handler)   child  mev  #|line 315|#)
                      (funcall (quote destroy_mevent)   mev  #|line 316|#)) #|line 317|#
                    ))                                      #|line 318|#
                ))                                          #|line 319|#
            (cond
              (( equal   (slot-value  child 'state)  "active") #|line 320|#
                #|  if child remains active, then the container must remain active and must propagate “ticks“ to child |# #|line 321|#
                (setf (slot-value  container 'state)  "active") #|line 322|# #|line 323|#
                ))                                          #|line 324|#
            (loop while (not (empty? (slot-value  child 'outq)))
              do
                (progn                                      #|line 325|#
                  (let ((mev (dequeue (slot-value  child 'outq)) #|line 326|#))
                    (declare (ignorable mev))
                    (funcall (quote route)   container  child  mev  #|line 327|#)
                    (funcall (quote destroy_mevent)   mev   #|line 328|#)) #|line 329|#
                  ))                                        #|line 330|#
            ))                                              #|line 331|#
        ))                                                  #|line 332|#
  )
(defun attempt_tick (&optional  parent  eh)
  (declare (ignorable  parent  eh))                         #|line 334|#
  (cond
    ((not (equal  (slot-value  eh 'state)  "idle"))         #|line 335|#
      (funcall (quote force_tick)   parent  eh              #|line 336|#) #|line 337|#
      ))                                                    #|line 338|#
  )
(defun is_tick (&optional  mev)
  (declare (ignorable  mev))                                #|line 340|#
  (return-from is_tick ( equal    "." (slot-value  mev 'port))
    #|  assume that any mevent that is sent to port "." is a tick  |# #|line 341|#) #|line 342|#
  ) #|  Routes a single mevent to all matching destinations, according to |# #|line 344|# #|  the container's connection network. |# #|line 345|# #|line 346|#
(defun route (&optional  container  from_component  mevent)
  (declare (ignorable  container  from_component  mevent))  #|line 347|#
  (let (( was_sent  nil))
    (declare (ignorable  was_sent))
    #|  for checking that output went somewhere (at least during bootstrap) |# #|line 348|#
    (let (( fromname  ""))
      (declare (ignorable  fromname))                       #|line 349|# #|line 350|#
      (setf  ticktime (+  ticktime  1))                     #|line 351|#
      (cond
        ((funcall (quote is_tick)   mevent )                #|line 352|#
          (loop for child in (slot-value  container 'children)
            do
              (progn
                child                                       #|line 353|#
                (funcall (quote attempt_tick)   container  child ) #|line 354|#
                ))
          (setf  was_sent  t)                               #|line 355|#
          )
        (t                                                  #|line 356|#
          (cond
            ((not (funcall (quote is_self)   from_component  container )) #|line 357|#
              (setf  fromname (slot-value  from_component 'name)) #|line 358|# #|line 359|#
              ))
          (let ((from_sender (funcall (quote mkSender)   fromname  from_component (slot-value  mevent 'port)  #|line 360|#)))
            (declare (ignorable from_sender))               #|line 361|#
            (loop for connector in (slot-value  container 'connections)
              do
                (progn
                  connector                                 #|line 362|#
                  (cond
                    ((funcall (quote sender_eq)   from_sender (slot-value  connector 'sender) ) #|line 363|#
                      (funcall (quote deposit)   container  connector  mevent  #|line 364|#)
                      (setf  was_sent  t)                   #|line 365|# #|line 366|#
                      ))                                    #|line 367|#
                  )))                                       #|line 368|#
          ))
      (cond
        ((not  was_sent)                                    #|line 369|#
          (live_update  "✗"  (concatenate 'string (slot-value  container 'name)  (concatenate 'string  ": mevent '"  (concatenate 'string (slot-value  mevent 'port)  (concatenate 'string  "' from "  (concatenate 'string  fromname  " dropped on floor...")))))) #|line 370|# #|line 371|#
          ))))                                              #|line 372|#
  )
(defun any_child_ready (&optional  container)
  (declare (ignorable  container))                          #|line 374|#
  (loop for child in (slot-value  container 'children)
    do
      (progn
        child                                               #|line 375|#
        (cond
          ((funcall (quote child_is_ready)   child )        #|line 376|#
            (return-from any_child_ready  t)                #|line 377|# #|line 378|#
            ))                                              #|line 379|#
        ))
  (return-from any_child_ready  nil)                        #|line 380|# #|line 381|#
  )
(defun child_is_ready (&optional  eh)
  (declare (ignorable  eh))                                 #|line 383|#
  (return-from child_is_ready ( or  ( or  ( or  (not (empty? (slot-value  eh 'outq))) (not (empty? (slot-value  eh 'inq)))) (not (equal  (slot-value  eh 'state)  "idle"))) (funcall (quote any_child_ready)   eh ))) #|line 384|# #|line 385|#
  )
(defun append_routing_descriptor (&optional  container  desc)
  (declare (ignorable  container  desc))                    #|line 387|#
  (enqueue (slot-value  container 'routings)  desc)         #|line 388|# #|line 389|#
  )
(defun injector (&optional  eh  mevent)
  (declare (ignorable  eh  mevent))                         #|line 391|#
  (funcall (slot-value  eh 'handler)   eh  mevent           #|line 392|#) #|line 393|#
  )                                                         #|line 395|# #|line 396|# #|line 397|#
(defclass Component_Registry ()                             #|line 398|#
  (
    (templates :accessor templates :initarg :templates :initform  (dict-fresh))  #|line 399|#)) #|line 400|#

                                                            #|line 401|#
(defclass Template ()                                       #|line 402|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 403|#
    (container :accessor container :initarg :container :initform  nil)  #|line 404|#
    (arg :accessor arg :initarg :arg :initform  nil)        #|line 405|#
    (instantiator :accessor instantiator :initarg :instantiator :initform  nil)  #|line 406|#)) #|line 407|#

                                                            #|line 408|#
(defun mkTemplate (&optional  name  container  arg  instantiator)
  (declare (ignorable  name  container  arg  instantiator)) #|line 409|#
  (let (( templ  (make-instance 'Template)                  #|line 410|#))
    (declare (ignorable  templ))
    (setf (slot-value  templ 'name)  name)                  #|line 411|#
    (setf (slot-value  templ 'container)  container)        #|line 412|#
    (setf (slot-value  templ 'arg)  arg)                    #|line 413|#
    (setf (slot-value  templ 'instantiator)  instantiator)  #|line 414|#
    (return-from mkTemplate  templ)                         #|line 415|#) #|line 416|#
  )                                                         #|line 418|#
(defun lnet2internal_from_file (&optional  pathname  container_xml)
  (declare (ignorable  pathname  container_xml))            #|line 419|#
  (let ((filename  container_xml                            #|line 420|#))
    (declare (ignorable filename))

    ;; read json from a named file and convert it into internal form (a list of Container alists)
    (json2dict (merge-pathnames pathname filename))
                                                            #|line 421|#) #|line 422|#
  )
(defun lnet2internal_from_string (&optional )
  (declare (ignorable ))                                    #|line 424|#

  (internalize-lnet-from-JSON *lnet*)
                                                            #|line 425|# #|line 426|#
  )
(defun delete_decls (&optional  d)
  (declare (ignorable  d))                                  #|line 428|#
  #| pass |#                                                #|line 429|# #|line 430|#
  )
(defun make_component_registry (&optional )
  (declare (ignorable ))                                    #|line 432|#
  (return-from make_component_registry  (make-instance 'Component_Registry) #|line 433|#) #|line 434|#
  )
(defun register_component (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component (funcall (quote abstracted_register_component)   reg  template  nil )) #|line 436|#
  )
(defun register_component_allow_overwriting (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component_allow_overwriting (funcall (quote abstracted_register_component)   reg  template  t )) #|line 437|#
  )
(defun abstracted_register_component (&optional  reg  template  ok_to_overwrite)
  (declare (ignorable  reg  template  ok_to_overwrite))     #|line 439|#
  (let ((name (funcall (quote mangle_name)  (slot-value  template 'name)  #|line 440|#)))
    (declare (ignorable name))
    (cond
      (( and  ( dict-in?  ( and  (not (equal   reg  nil))  name) (slot-value  reg 'templates)) (not  ok_to_overwrite)) #|line 441|#
        (funcall (quote load_error)   (concatenate 'string  "Component /"  (concatenate 'string (slot-value  template 'name)  "/ already declared"))  #|line 442|#)
        (return-from abstracted_register_component  reg)    #|line 443|#
        )
      (t                                                    #|line 444|#
        (setf (gethash name (slot-value  reg 'templates))  template) #|line 445|#
        (return-from abstracted_register_component  reg)    #|line 446|# #|line 447|#
        )))                                                 #|line 448|#
  )
(defun get_component_instance (&optional  reg  full_name  owner)
  (declare (ignorable  reg  full_name  owner))              #|line 450|#
  (let ((template_name (funcall (quote mangle_name)   full_name  #|line 451|#)))
    (declare (ignorable template_name))
    (cond
      (( dict-in?   template_name (slot-value  reg 'templates)) #|line 452|#
        (let ((template (gethash template_name (slot-value  reg 'templates))))
          (declare (ignorable template))                    #|line 453|#
          (cond
            (( equal    template  nil)                      #|line 454|#
              (funcall (quote load_error)   (concatenate 'string  "Registry Error (A): Can't find component /"  (concatenate 'string  template_name  "/"))  #|line 455|#)
              (return-from get_component_instance  nil)     #|line 456|#
              )
            (t                                              #|line 457|#
              (let ((owner_name  ""))
                (declare (ignorable owner_name))            #|line 458|#
                (let ((instance_name  template_name))
                  (declare (ignorable instance_name))       #|line 459|#
                  (cond
                    ((not (equal   nil  owner))             #|line 460|#
                      (setf  owner_name (slot-value  owner 'name)) #|line 461|#
                      (setf  instance_name  (concatenate 'string  owner_name  (concatenate 'string  "▹"  template_name)) #|line 462|#)
                      )
                    (t                                      #|line 463|#
                      (setf  instance_name  template_name)  #|line 464|# #|line 465|#
                      ))
                  (let ((instance (funcall (slot-value  template 'instantiator)   reg  owner  instance_name (slot-value  template 'container) (slot-value  template 'arg)  #|line 466|#)))
                    (declare (ignorable instance))
                    (return-from get_component_instance  instance) #|line 467|#))) #|line 468|#
              )))
        )
      (t                                                    #|line 469|#
        (funcall (quote load_error)   (concatenate 'string  "Registry Error (B): Can't find component /"  (concatenate 'string  template_name  "/"))  #|line 470|#)
        (return-from get_component_instance  nil)           #|line 471|# #|line 472|#
        )))                                                 #|line 473|#
  )
(defun mangle_name (&optional  s)
  (declare (ignorable  s))                                  #|line 475|#
  #|  trim name to remove code from Container component names _ deferred until later (or never) |# #|line 476|#
  (return-from mangle_name  s)                              #|line 477|# #|line 478|#
  )                                                         #|line 480|# #|  Data for an asyncronous component _ effectively, a function with input |# #|line 481|# #|  and output queues of mevents. |# #|line 482|# #|  |# #|line 483|# #|  Components can either be a user_supplied function (“leaf“), or a “container“ |# #|line 484|# #|  that routes mevents to child components according to a list of connections |# #|line 485|# #|  that serve as a mevent routing table. |# #|line 486|# #|  |# #|line 487|# #|  Child components themselves can be leaves or other containers. |# #|line 488|# #|  |# #|line 489|# #|  `handler` invokes the code that is attached to this component. |# #|line 490|# #|  |# #|line 491|# #|  `instance_data` is a pointer to instance data that the `leaf_handler` |# #|line 492|# #|  function may want whenever it is invoked again. |# #|line 493|# #|  |# #|line 494|# #|line 495|# #|  Eh_States :: enum { idle, active } |# #|line 496|#
(defclass Eh ()                                             #|line 497|#
  (
    (name :accessor name :initarg :name :initform  "")      #|line 498|#
    (inq :accessor inq :initarg :inq :initform  (make-instance 'Queue) #|line 499|#)
    (outq :accessor outq :initarg :outq :initform  (make-instance 'Queue) #|line 500|#)
    (owner :accessor owner :initarg :owner :initform  nil)  #|line 501|#
    (children :accessor children :initarg :children :initform  nil)  #|line 502|#
    (visit_ordering :accessor visit_ordering :initarg :visit_ordering :initform  (make-instance 'Queue) #|line 503|#)
    (connections :accessor connections :initarg :connections :initform  nil)  #|line 504|#
    (routings :accessor routings :initarg :routings :initform  (make-instance 'Queue) #|line 505|#)
    (handler :accessor handler :initarg :handler :initform  nil)  #|line 506|#
    (finject :accessor finject :initarg :finject :initform  nil)  #|line 507|#
    (container :accessor container :initarg :container :initform  nil)  #|line 508|#
    (arg :accessor arg :initarg :arg :initform  "")         #|line 509|#
    (state :accessor state :initarg :state :initform  "idle")  #|line 510|# #|  bootstrap debugging |# #|line 511|#
    (kind :accessor kind :initarg :kind :initform  nil)  #|  enum { container, leaf, } |# #|line 512|#)) #|line 513|#

                                                            #|line 514|# #|  Creates a component that acts as a container. It is the same as a `Eh` instance |# #|line 515|# #|  whose handler function is `container_handler`. |# #|line 516|#
(defun make_container (&optional  name  owner)
  (declare (ignorable  name  owner))                        #|line 517|#
  (let (( eh  (make-instance 'Eh)                           #|line 518|#))
    (declare (ignorable  eh))
    (setf (slot-value  eh 'name)  name)                     #|line 519|#
    (setf (slot-value  eh 'owner)  owner)                   #|line 520|#
    (setf (slot-value  eh 'handler)  #'container_handler)   #|line 521|#
    (setf (slot-value  eh 'finject)  #'injector)            #|line 522|#
    (setf (slot-value  eh 'state)  "idle")                  #|line 523|#
    (setf (slot-value  eh 'kind)  "container")              #|line 524|#
    (return-from make_container  eh)                        #|line 525|#) #|line 526|#
  ) #|  Creates a new leaf component out of a handler function, and a data parameter |# #|line 528|# #|  that will be passed back to your handler when called. |# #|line 529|# #|line 530|#
(defun make_leaf (&optional  name  owner  container  arg  handler)
  (declare (ignorable  name  owner  container  arg  handler)) #|line 531|#
  (let (( eh  (make-instance 'Eh)                           #|line 532|#))
    (declare (ignorable  eh))
    (let (( nm  ""))
      (declare (ignorable  nm))                             #|line 533|#
      (cond
        ((not (equal   nil  owner))                         #|line 534|#
          (setf  nm (slot-value  owner 'name))              #|line 535|# #|line 536|#
          ))
      (setf (slot-value  eh 'name)  (concatenate 'string  nm  (concatenate 'string  "▹"  name)) #|line 537|#)
      (setf (slot-value  eh 'owner)  owner)                 #|line 538|#
      (setf (slot-value  eh 'handler)  handler)             #|line 539|#
      (setf (slot-value  eh 'finject)  #'injector)          #|line 540|#
      (setf (slot-value  eh 'container)  container)         #|line 541|#
      (setf (slot-value  eh 'arg)  arg)                     #|line 542|#
      (setf (slot-value  eh 'state)  "idle")                #|line 543|#
      (setf (slot-value  eh 'kind)  "leaf")                 #|line 544|#
      (return-from make_leaf  eh)                           #|line 545|#)) #|line 546|#
  ) #|  Sends a mevent on the given `port` with `data`, placing it on the output |# #|line 548|# #|  of the given component. |# #|line 549|# #|line 550|#
(defun send (&optional  eh  port  obj  causingMevent)
  (declare (ignorable  eh  port  obj  causingMevent))       #|line 551|#
  (let (( d (funcall (quote Datum) )))
    (declare (ignorable  d))                                #|line 552|#
    (setf (slot-value  d 'v)  obj)                          #|line 553|#
    (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 554|#)))
    (setf (slot-value  d 'reclaim)  None)                   #|line 555|#
    (let ((mev (funcall (quote make_mevent)   port  d       #|line 556|#)))
      (declare (ignorable mev))
      (funcall (quote put_output)   eh  mev                 #|line 557|#))) #|line 558|#
  )
(defun forward (&optional  eh  port  mev)
  (declare (ignorable  eh  port  mev))                      #|line 560|#
  (let ((fwdmev (funcall (quote make_mevent)   port (slot-value  mev 'datum)  #|line 561|#)))
    (declare (ignorable fwdmev))
    (funcall (quote put_output)   eh  fwdmev                #|line 562|#)) #|line 563|#
  )
(defun inject (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 565|#
  (funcall (slot-value  eh 'finject)   eh  mev              #|line 566|#) #|line 567|#
  )
(defun set_active (&optional  eh)
  (declare (ignorable  eh))                                 #|line 569|#
  (setf (slot-value  eh 'state)  "active")                  #|line 570|# #|line 571|#
  )
(defun set_idle (&optional  eh)
  (declare (ignorable  eh))                                 #|line 573|#
  (setf (slot-value  eh 'state)  "idle")                    #|line 574|# #|line 575|#
  )
(defun put_output (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 577|#
  (enqueue (slot-value  eh 'outq)  mev)                     #|line 578|# #|line 579|#
  )
(defparameter  projectRoot  "")                             #|line 581|# #|line 582|#
(defun set_environment (&optional  project_root)
  (declare (ignorable  project_root))                       #|line 583|# #|line 584|#
  (setf  projectRoot  project_root)                         #|line 585|# #|line 586|#
  )
(defun obj_clone (&optional  obj)
  (declare (ignorable  obj))                                #|line 588|#
  (return-from obj_clone  obj)                              #|line 589|# #|line 590|#
  ) #|  usage: app ${_00_} diagram_filename1 diagram_filename2 ... |# #|line 592|# #|  where ${_00_} is the root directory for the project |# #|line 593|# #|line 594|#
(defun initialize_component_palette_from_files (&optional  project_root  diagram_source_files)
  (declare (ignorable  project_root  diagram_source_files)) #|line 595|#
  (let (( reg (funcall (quote make_component_registry) )))
    (declare (ignorable  reg))                              #|line 596|#
    (loop for diagram_source in  diagram_source_files
      do
        (progn
          diagram_source                                    #|line 597|#
          (let ((all_containers_within_single_file (funcall (quote lnet2internal_from_file)   project_root  diagram_source  #|line 598|#)))
            (declare (ignorable all_containers_within_single_file))
            (setf  reg (funcall (quote generate_external_components)   reg  all_containers_within_single_file  #|line 599|#))
            (loop for container in  all_containers_within_single_file
              do
                (progn
                  container                                 #|line 600|#
                  (funcall (quote register_component)   reg (funcall (quote mkTemplate)  (gethash  "name"  container)  #| container= |# container  ""  #| instantiator= |# #'container_instantiator )  #|line 601|#) #|line 602|#
                  )))                                       #|line 603|#
          ))
    (funcall (quote initialize_stock_components)   reg      #|line 604|#)
    (return-from initialize_component_palette_from_files  reg) #|line 605|#) #|line 606|#
  )
(defun initialize_component_palette_from_string (&optional  project_root)
  (declare (ignorable  project_root))                       #|line 608|#
  #|  this version ignores project_root  |#                 #|line 609|#
  (let (( reg (funcall (quote make_component_registry) )))
    (declare (ignorable  reg))                              #|line 610|#
    (let ((all_containers (funcall (quote lnet2internal_from_string) )))
      (declare (ignorable all_containers))                  #|line 611|#
      (setf  reg (funcall (quote generate_external_components)   reg  all_containers  #|line 612|#))
      (loop for container in  all_containers
        do
          (progn
            container                                       #|line 613|#
            (funcall (quote register_component)   reg (funcall (quote mkTemplate)  (gethash  "name"  container)  #| container= |# container  ""  #| instantiator= |# #'container_instantiator )  #|line 614|#) #|line 615|#
            ))
      (funcall (quote initialize_stock_components)   reg    #|line 616|#)
      (return-from initialize_component_palette_from_string  reg) #|line 617|#)) #|line 618|#
  )                                                         #|line 620|#
(defun clone_string (&optional  s)
  (declare (ignorable  s))                                  #|line 621|#
  (return-from clone_string  s                              #|line 622|# #|line 623|#) #|line 624|#
  )
(defparameter  load_errors  nil)                            #|line 625|#
(defparameter  runtime_errors  nil)                         #|line 626|# #|line 627|#
(defun load_error (&optional  s)
  (declare (ignorable  s))                                  #|line 628|# #|line 629|#
  (format *error-output* "~a~%"  s)                         #|line 630|#
  (format *error-output* "
  ")                                                        #|line 631|#
  (setf  load_errors  t)                                    #|line 632|# #|line 633|#
  )
(defun runtime_error (&optional  s)
  (declare (ignorable  s))                                  #|line 635|# #|line 636|#
  (format *error-output* "~a~%"  s)                         #|line 637|#
  (setf  runtime_errors  t)                                 #|line 638|# #|line 639|#
  )                                                         #|line 641|#
(defun initialize_from_files (&optional  project_root  diagram_names)
  (declare (ignorable  project_root  diagram_names))        #|line 642|#
  (let ((arg  nil))
    (declare (ignorable arg))                               #|line 643|#
    (let ((palette (funcall (quote initialize_component_palette_from_files)   project_root  diagram_names  #|line 644|#)))
      (declare (ignorable palette))
      (return-from initialize_from_files (values  palette (list   project_root  diagram_names  arg ))) #|line 645|#)) #|line 646|#
  )
(defun initialize_from_string (&optional  project_root)
  (declare (ignorable  project_root))                       #|line 648|#
  (let ((arg  nil))
    (declare (ignorable arg))                               #|line 649|#
    (let ((palette (funcall (quote initialize_component_palette_from_string)   project_root  #|line 650|#)))
      (declare (ignorable palette))
      (return-from initialize_from_string (values  palette (list   project_root  nil  arg ))) #|line 651|#)) #|line 652|#
  )
(defun start (&optional  arg  Part_name  palette  env)
  (declare (ignorable  arg  Part_name  palette  env))       #|line 654|#
  (let ((project_root (nth  0  env)))
    (declare (ignorable project_root))                      #|line 655|#
    (let ((diagram_names (nth  1  env)))
      (declare (ignorable diagram_names))                   #|line 656|#
      (funcall (quote set_environment)   project_root       #|line 657|#)
      #|  get entrypoint container |#                       #|line 658|#
      (let (( Part (funcall (quote get_component_instance)   palette  Part_name  nil  #|line 659|#)))
        (declare (ignorable  Part))
        (cond
          (( equal    nil  Part)                            #|line 660|#
            (funcall (quote load_error)   (concatenate 'string  "Couldn't find container with page name /"  (concatenate 'string  Part_name  (concatenate 'string  "/ in files "  (concatenate 'string (format nil "~a"  diagram_names)  " (check tab names, or disable compression?)"))))  #|line 664|#) #|line 665|#
            ))
        (cond
          ((not  load_errors)                               #|line 666|#
            (let (( d (funcall (quote Datum) )))
              (declare (ignorable  d))                      #|line 667|#
              (setf (slot-value  d 'v)  arg)                #|line 668|#
              (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 669|#)))
              (setf (slot-value  d 'reclaim)  None)         #|line 670|#
              (let (( mev (funcall (quote make_mevent)   ""  d  #|line 671|#)))
                (declare (ignorable  mev))
                (funcall (quote inject)   Part  mev         #|line 672|#))) #|line 673|#
            ))
        (queue-as-json-to-stdout (slot-value  Part 'outq))  #|line 674|#))) #|line 675|#
  )
(defun new_datum_bang (&optional )
  (declare (ignorable ))                                    #|line 677|#
  (let (( d (funcall (quote Datum) )))
    (declare (ignorable  d))                                #|line 678|#
    (setf (slot-value  d 'v)  "!")                          #|line 679|#
    (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 680|#)))
    (setf (slot-value  d 'reclaim)  None)                   #|line 681|#
    (return-from new_datum_bang  d)                         #|line 682|#) #|line 683|#
  )