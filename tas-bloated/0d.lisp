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
(defun step_child_once (&optional  child  mev)
  (declare (ignorable  child  mev))                         #|line 284|#
  (let ((before_state (slot-value  child 'state)))
    (declare (ignorable before_state))                      #|line 285|#
    (funcall (slot-value  child 'handler)   child  mev      #|line 286|#)
    (let ((after_state (slot-value  child 'state)))
      (declare (ignorable after_state))                     #|line 287|#
      (return-from step_child_once (values ( and  ( equal    before_state  "idle") (not (equal   after_state  "idle")))  #|line 288|#( and  (not (equal   before_state  "idle")) (not (equal   after_state  "idle")))  #|line 289|#( and  (not (equal   before_state  "idle")) ( equal    after_state  "idle")))) #|line 290|#)) #|line 291|#
  )
(defun step_children (&optional  container  causingMevent)
  (declare (ignorable  container  causingMevent))           #|line 293|#
  (setf (slot-value  container 'state)  "idle")             #|line 294|# #|line 295|#
  #|  phase 1 - loop through children and process inputs or children that not "idle"  |# #|line 296|#
  (loop for child in (queue2list (slot-value  container 'visit_ordering))
    do
      (progn
        child                                               #|line 297|#
        #|  child = container represents self, skip it |#   #|line 298|#
        (cond
          ((not (funcall (quote is_self)   child  container )) #|line 299|#
            (cond
              ((not (empty? (slot-value  child 'inq)))      #|line 300|#
                (let ((mev (dequeue (slot-value  child 'inq)) #|line 301|#))
                  (declare (ignorable mev))
                  (funcall (quote step_child_once)   child  mev  #|line 302|#) #|line 303|#
                  (funcall (quote destroy_mevent)   mev     #|line 304|#))
                )
              (t                                            #|line 305|#
                (cond
                  ((not (equal  (slot-value  child 'state)  "idle")) #|line 306|#
                    (let ((mev (funcall (quote force_tick)   container  child  #|line 307|#)))
                      (declare (ignorable mev))
                      (funcall (quote step_child_once)   child  mev  #|line 308|#)
                      (funcall (quote destroy_mevent)   mev  #|line 309|#)) #|line 310|#
                    ))                                      #|line 311|#
                ))                                          #|line 312|#
            ))                                              #|line 313|#
        ))

  (setf (slot-value  container 'visit_ordering) (make-instance 'Queue)) #|line 314|# #|line 315|#
  #|  phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections  |# #|line 316|#
  (loop for child in (slot-value  container 'children)
    do
      (progn
        child                                               #|line 317|#
        (cond
          (( equal   (slot-value  child 'state)  "active")  #|line 318|#
            #|  if child remains active, then the container must remain active and must propagate “ticks“ to child |# #|line 319|#
            (setf (slot-value  container 'state)  "active") #|line 320|# #|line 321|#
            ))                                              #|line 322|#
        (loop while (not (empty? (slot-value  child 'outq)))
          do
            (progn                                          #|line 323|#
              (let ((mev (dequeue (slot-value  child 'outq)) #|line 324|#))
                (declare (ignorable mev))
                (funcall (quote route)   container  child  mev  #|line 325|#)
                (funcall (quote destroy_mevent)   mev       #|line 326|#)) #|line 327|#
              ))                                            #|line 328|#
        ))                                                  #|line 329|#
  )
(defun attempt_tick (&optional  parent  eh)
  (declare (ignorable  parent  eh))                         #|line 331|#
  (cond
    ((not (equal  (slot-value  eh 'state)  "idle"))         #|line 332|#
      (funcall (quote force_tick)   parent  eh              #|line 333|#) #|line 334|#
      ))                                                    #|line 335|#
  )
(defun is_tick (&optional  mev)
  (declare (ignorable  mev))                                #|line 337|#
  (return-from is_tick ( equal    "." (slot-value  mev 'port))
    #|  assume that any mevent that is sent to port "." is a tick  |# #|line 338|#) #|line 339|#
  ) #|  Routes a single mevent to all matching destinations, according to |# #|line 341|# #|  the container's connection network. |# #|line 342|# #|line 343|#
(defun route (&optional  container  from_component  mevent)
  (declare (ignorable  container  from_component  mevent))  #|line 344|#
  (let (( was_sent  nil))
    (declare (ignorable  was_sent))
    #|  for checking that output went somewhere (at least during bootstrap) |# #|line 345|#
    (let (( fromname  ""))
      (declare (ignorable  fromname))                       #|line 346|# #|line 347|#
      (setf  ticktime (+  ticktime  1))                     #|line 348|#
      (cond
        ((funcall (quote is_tick)   mevent )                #|line 349|#
          (loop for child in (slot-value  container 'children)
            do
              (progn
                child                                       #|line 350|#
                (funcall (quote attempt_tick)   container  child ) #|line 351|#
                ))
          (setf  was_sent  t)                               #|line 352|#
          )
        (t                                                  #|line 353|#
          (cond
            ((not (funcall (quote is_self)   from_component  container )) #|line 354|#
              (setf  fromname (slot-value  from_component 'name)) #|line 355|# #|line 356|#
              ))
          (let ((from_sender (funcall (quote mkSender)   fromname  from_component (slot-value  mevent 'port)  #|line 357|#)))
            (declare (ignorable from_sender))               #|line 358|#
            (loop for connector in (slot-value  container 'connections)
              do
                (progn
                  connector                                 #|line 359|#
                  (cond
                    ((funcall (quote sender_eq)   from_sender (slot-value  connector 'sender) ) #|line 360|#
                      (funcall (quote deposit)   container  connector  mevent  #|line 361|#)
                      (setf  was_sent  t)                   #|line 362|# #|line 363|#
                      ))                                    #|line 364|#
                  )))                                       #|line 365|#
          ))
      (cond
        ((not  was_sent)                                    #|line 366|#
          (live_update  "✗"  (concatenate 'string (slot-value  container 'name)  (concatenate 'string  ": mevent '"  (concatenate 'string (slot-value  mevent 'port)  (concatenate 'string  "' from "  (concatenate 'string  fromname  " dropped on floor...")))))) #|line 367|# #|line 368|#
          ))))                                              #|line 369|#
  )
(defun any_child_ready (&optional  container)
  (declare (ignorable  container))                          #|line 371|#
  (loop for child in (slot-value  container 'children)
    do
      (progn
        child                                               #|line 372|#
        (cond
          ((funcall (quote child_is_ready)   child )        #|line 373|#
            (return-from any_child_ready  t)                #|line 374|# #|line 375|#
            ))                                              #|line 376|#
        ))
  (return-from any_child_ready  nil)                        #|line 377|# #|line 378|#
  )
(defun child_is_ready (&optional  eh)
  (declare (ignorable  eh))                                 #|line 380|#
  (return-from child_is_ready ( or  ( or  ( or  (not (empty? (slot-value  eh 'outq))) (not (empty? (slot-value  eh 'inq)))) (not (equal  (slot-value  eh 'state)  "idle"))) (funcall (quote any_child_ready)   eh ))) #|line 381|# #|line 382|#
  )
(defun append_routing_descriptor (&optional  container  desc)
  (declare (ignorable  container  desc))                    #|line 384|#
  (enqueue (slot-value  container 'routings)  desc)         #|line 385|# #|line 386|#
  )
(defun injector (&optional  eh  mevent)
  (declare (ignorable  eh  mevent))                         #|line 388|#
  (funcall (slot-value  eh 'handler)   eh  mevent           #|line 389|#) #|line 390|#
  )                                                         #|line 392|# #|line 393|# #|line 394|#
(defclass Component_Registry ()                             #|line 395|#
  (
    (templates :accessor templates :initarg :templates :initform  (dict-fresh))  #|line 396|#)) #|line 397|#

                                                            #|line 398|#
(defclass Template ()                                       #|line 399|#
  (
    (name :accessor name :initarg :name :initform  nil)     #|line 400|#
    (container :accessor container :initarg :container :initform  nil)  #|line 401|#
    (instantiator :accessor instantiator :initarg :instantiator :initform  nil)  #|line 402|#)) #|line 403|#

                                                            #|line 404|#
(defun mkTemplate (&optional  name  template_data  instantiator)
  (declare (ignorable  name  template_data  instantiator))  #|line 405|#
  (let (( templ  (make-instance 'Template)                  #|line 406|#))
    (declare (ignorable  templ))
    (setf (slot-value  templ 'name)  name)                  #|line 407|#
    (setf (slot-value  templ 'template_data)  template_data) #|line 408|#
    (setf (slot-value  templ 'instantiator)  instantiator)  #|line 409|#
    (return-from mkTemplate  templ)                         #|line 410|#) #|line 411|#
  )                                                         #|line 413|#
(defun lnet2internal_from_file (&optional  pathname  container_xml)
  (declare (ignorable  pathname  container_xml))            #|line 414|#
  (let ((filename  container_xml                            #|line 415|#))
    (declare (ignorable filename))

    ;; read json from a named file and convert it into internal form (a list of Container alists)
    (json2dict (merge-pathnames pathname filename))
                                                            #|line 416|#) #|line 417|#
  )
(defun lnet2internal_from_string (&optional  lnet)
  (declare (ignorable  lnet))                               #|line 419|#

  (internalize-lnet-from-JSON *lnet*)
                                                            #|line 420|# #|line 421|#
  )
(defun delete_decls (&optional  d)
  (declare (ignorable  d))                                  #|line 423|#
  #| pass |#                                                #|line 424|# #|line 425|#
  )
(defun make_component_registry (&optional )
  (declare (ignorable ))                                    #|line 427|#
  (return-from make_component_registry  (make-instance 'Component_Registry) #|line 428|#) #|line 429|#
  )
(defun register_component (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component (funcall (quote abstracted_register_component)   reg  template  nil )) #|line 431|#
  )
(defun register_component_allow_overwriting (&optional  reg  template)
  (declare (ignorable  reg  template))
  (return-from register_component_allow_overwriting (funcall (quote abstracted_register_component)   reg  template  t )) #|line 432|#
  )
(defun abstracted_register_component (&optional  reg  template  ok_to_overwrite)
  (declare (ignorable  reg  template  ok_to_overwrite))     #|line 434|#
  (let ((name (funcall (quote mangle_name)  (slot-value  template 'name)  #|line 435|#)))
    (declare (ignorable name))
    (cond
      (( and  ( dict-in?  ( and  (not (equal   reg  nil))  name) (slot-value  reg 'templates)) (not  ok_to_overwrite)) #|line 436|#
        (funcall (quote load_error)   (concatenate 'string  "Component /"  (concatenate 'string (slot-value  template 'name)  "/ already declared"))  #|line 437|#)
        (return-from abstracted_register_component  reg)    #|line 438|#
        )
      (t                                                    #|line 439|#
        (setf (gethash name (slot-value  reg 'templates))  template) #|line 440|#
        (return-from abstracted_register_component  reg)    #|line 441|# #|line 442|#
        )))                                                 #|line 443|#
  )
(defun get_component_instance (&optional  reg  full_name  owner)
  (declare (ignorable  reg  full_name  owner))              #|line 445|#
  #|  If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it.  |# #|line 446|#
  #|  ":?<string>" is a probe part that is tagged with <string>  |# #|line 447|#
  #|  ":$ <command>" is a shell-out part that sends <command> to the operating system shell  |# #|line 448|#
  #|  ":<string>" else, it's just treated as a string part that produces <string> on its output  |# #|line 449|#
  (let ((template_name (funcall (quote mangle_name)   full_name  #|line 450|#)))
    (declare (ignorable template_name))
    (cond
      (( equal    ":"  (string (char  full_name 0)))        #|line 451|#
        (let ((instance_name (funcall (quote generate_instance_name)   owner  template_name  #|line 452|#)))
          (declare (ignorable instance_name))
          (let ((instance (funcall (quote external_instantiate)   reg  owner  instance_name  full_name  #|line 453|#)))
            (declare (ignorable instance))
            (return-from get_component_instance  instance)  #|line 454|#))
        )
      (t                                                    #|line 455|#
        (cond
          (( dict-in?   template_name (slot-value  reg 'templates)) #|line 456|#
            (let ((template (gethash template_name (slot-value  reg 'templates))))
              (declare (ignorable template))                #|line 457|#
              (cond
                (( equal    template  nil)                  #|line 458|#
                  (funcall (quote load_error)   (concatenate 'string  "Registry Error (A): Can't find component /"  (concatenate 'string  template_name  "/"))  #|line 459|#)
                  (return-from get_component_instance  nil) #|line 460|#
                  )
                (t                                          #|line 461|#
                  (let ((instance_name (funcall (quote generate_instance_name)   owner  template_name  #|line 462|#)))
                    (declare (ignorable instance_name))
                    (let ((instance (funcall (slot-value  template 'instantiator)   reg  owner  instance_name (slot-value  template 'template_data)  ""  #|line 463|#)))
                      (declare (ignorable instance))
                      (return-from get_component_instance  instance) #|line 464|#)) #|line 465|#
                  )))
            )
          (t                                                #|line 466|#
            (funcall (quote load_error)   (concatenate 'string  "Registry Error (B): Can't find component /"  (concatenate 'string  template_name  "/"))  #|line 467|#)
            (return-from get_component_instance  nil)       #|line 468|# #|line 469|#
            ))                                              #|line 470|#
        )))                                                 #|line 471|#
  )
(defun generate_instance_name (&optional  owner  template_name)
  (declare (ignorable  owner  template_name))               #|line 473|#
  (let ((owner_name  ""))
    (declare (ignorable owner_name))                        #|line 474|#
    (let ((instance_name  template_name))
      (declare (ignorable instance_name))                   #|line 475|#
      (cond
        ((not (equal   nil  owner))                         #|line 476|#
          (setf  owner_name (slot-value  owner 'name))      #|line 477|#
          (setf  instance_name  (concatenate 'string  owner_name  (concatenate 'string  "▹"  template_name)) #|line 478|#)
          )
        (t                                                  #|line 479|#
          (setf  instance_name  template_name)              #|line 480|# #|line 481|#
          ))
      (return-from generate_instance_name  instance_name)   #|line 482|#)) #|line 483|#
  )
(defun mangle_name (&optional  s)
  (declare (ignorable  s))                                  #|line 485|#
  #|  trim name to remove code from Container component names _ deferred until later (or never) |# #|line 486|#
  (return-from mangle_name  s)                              #|line 487|# #|line 488|#
  )                                                         #|line 490|# #|  Data for an asyncronous component _ effectively, a function with input |# #|line 491|# #|  and output queues of mevents. |# #|line 492|# #|  |# #|line 493|# #|  Components can either be a user_supplied function (“leaf“), or a “container“ |# #|line 494|# #|  that routes mevents to child components according to a list of connections |# #|line 495|# #|  that serve as a mevent routing table. |# #|line 496|# #|  |# #|line 497|# #|  Child components themselves can be leaves or other containers. |# #|line 498|# #|  |# #|line 499|# #|  `handler` invokes the code that is attached to this component. |# #|line 500|# #|  |# #|line 501|# #|  `instance_data` is a pointer to instance data that the `leaf_handler` |# #|line 502|# #|  function may want whenever it is invoked again. |# #|line 503|# #|  |# #|line 504|# #|line 505|# #|  Eh_States :: enum { idle, active } |# #|line 506|#
(defclass Eh ()                                             #|line 507|#
  (
    (name :accessor name :initarg :name :initform  "")      #|line 508|#
    (inq :accessor inq :initarg :inq :initform  (make-instance 'Queue) #|line 509|#)
    (outq :accessor outq :initarg :outq :initform  (make-instance 'Queue) #|line 510|#)
    (owner :accessor owner :initarg :owner :initform  nil)  #|line 511|#
    (children :accessor children :initarg :children :initform  nil)  #|line 512|#
    (visit_ordering :accessor visit_ordering :initarg :visit_ordering :initform  (make-instance 'Queue) #|line 513|#)
    (connections :accessor connections :initarg :connections :initform  nil)  #|line 514|#
    (routings :accessor routings :initarg :routings :initform  (make-instance 'Queue) #|line 515|#)
    (handler :accessor handler :initarg :handler :initform  nil)  #|line 516|#
    (finject :accessor finject :initarg :finject :initform  nil)  #|line 517|#
    (instance_data :accessor instance_data :initarg :instance_data :initform  nil)  #|line 518|# #|  arg needed for probe support  |# #|line 519|#
    (arg :accessor arg :initarg :arg :initform  "")         #|line 520|#
    (state :accessor state :initarg :state :initform  "idle")  #|line 521|# #|  bootstrap debugging |# #|line 522|#
    (kind :accessor kind :initarg :kind :initform  nil)  #|  enum { container, leaf, } |# #|line 523|#)) #|line 524|#

                                                            #|line 525|# #|  Creates a component that acts as a container. It is the same as a `Eh` instance |# #|line 526|# #|  whose handler function is `container_handler`. |# #|line 527|#
(defun make_container (&optional  name  owner)
  (declare (ignorable  name  owner))                        #|line 528|#
  (let (( eh  (make-instance 'Eh)                           #|line 529|#))
    (declare (ignorable  eh))
    (setf (slot-value  eh 'name)  name)                     #|line 530|#
    (setf (slot-value  eh 'owner)  owner)                   #|line 531|#
    (setf (slot-value  eh 'handler)  #'container_handler)   #|line 532|#
    (setf (slot-value  eh 'finject)  #'injector)            #|line 533|#
    (setf (slot-value  eh 'state)  "idle")                  #|line 534|#
    (setf (slot-value  eh 'kind)  "container")              #|line 535|#
    (return-from make_container  eh)                        #|line 536|#) #|line 537|#
  ) #|  Creates a new leaf component out of a handler function, and a data parameter |# #|line 539|# #|  that will be passed back to your handler when called. |# #|line 540|# #|line 541|#
(defun make_leaf (&optional  name  owner  instance_data  arg  handler)
  (declare (ignorable  name  owner  instance_data  arg  handler)) #|line 542|#
  (let (( eh  (make-instance 'Eh)                           #|line 543|#))
    (declare (ignorable  eh))
    (let (( nm  ""))
      (declare (ignorable  nm))                             #|line 544|#
      (cond
        ((not (equal   nil  owner))                         #|line 545|#
          (setf  nm (slot-value  owner 'name))              #|line 546|# #|line 547|#
          ))
      (setf (slot-value  eh 'name)  (concatenate 'string  nm  (concatenate 'string  "▹"  name)) #|line 548|#)
      (setf (slot-value  eh 'owner)  owner)                 #|line 549|#
      (setf (slot-value  eh 'handler)  handler)             #|line 550|#
      (setf (slot-value  eh 'finject)  #'injector)          #|line 551|#
      (setf (slot-value  eh 'instance_data)  instance_data) #|line 552|#
      (setf (slot-value  eh 'arg)  arg)                     #|line 553|#
      (setf (slot-value  eh 'state)  "idle")                #|line 554|#
      (setf (slot-value  eh 'kind)  "leaf")                 #|line 555|#
      (return-from make_leaf  eh)                           #|line 556|#)) #|line 557|#
  ) #|  Sends a mevent on the given `port` with `data`, placing it on the output |# #|line 559|# #|  of the given component. |# #|line 560|# #|line 561|#
(defun send (&optional  eh  port  obj  causingMevent)
  (declare (ignorable  eh  port  obj  causingMevent))       #|line 562|#
  (let (( d  (make-instance 'Datum)                         #|line 563|#))
    (declare (ignorable  d))
    (setf (slot-value  d 'v)  obj)                          #|line 564|#
    (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 565|#)))
    (setf (slot-value  d 'reclaim)  nil)                    #|line 566|#
    (let ((mev (funcall (quote make_mevent)   port  d       #|line 567|#)))
      (declare (ignorable mev))
      (funcall (quote put_output)   eh  mev                 #|line 568|#))) #|line 569|#
  )
(defun forward (&optional  eh  port  mev)
  (declare (ignorable  eh  port  mev))                      #|line 571|#
  (let ((fwdmev (funcall (quote make_mevent)   port (slot-value  mev 'datum)  #|line 572|#)))
    (declare (ignorable fwdmev))
    (funcall (quote put_output)   eh  fwdmev                #|line 573|#)) #|line 574|#
  )
(defun inject_mevent (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 576|#
  (funcall (slot-value  eh 'finject)   eh  mev              #|line 577|#) #|line 578|#
  )
(defun set_active (&optional  eh)
  (declare (ignorable  eh))                                 #|line 580|#
  (setf (slot-value  eh 'state)  "active")                  #|line 581|# #|line 582|#
  )
(defun set_idle (&optional  eh)
  (declare (ignorable  eh))                                 #|line 584|#
  (setf (slot-value  eh 'state)  "idle")                    #|line 585|# #|line 586|#
  )
(defun put_output (&optional  eh  mev)
  (declare (ignorable  eh  mev))                            #|line 588|#
  (enqueue (slot-value  eh 'outq)  mev)                     #|line 589|# #|line 590|#
  )
(defparameter  projectRoot  "")                             #|line 592|# #|line 593|#
(defun set_environment (&optional  project_root)
  (declare (ignorable  project_root))                       #|line 594|# #|line 595|#
  (setf  projectRoot  project_root)                         #|line 596|# #|line 597|#
  )
(defun obj_clone (&optional  obj)
  (declare (ignorable  obj))                                #|line 599|#
  (return-from obj_clone  obj)                              #|line 600|# #|line 601|#
  ) #|  usage: app ${_00_} diagram_filename1 diagram_filename2 ... |# #|line 603|# #|  where ${_00_} is the root directory for the project |# #|line 604|# #|line 605|#
(defun initialize_component_palette_from_files (&optional  project_root  diagram_source_files)
  (declare (ignorable  project_root  diagram_source_files)) #|line 606|#
  (let (( reg (funcall (quote make_component_registry) )))
    (declare (ignorable  reg))                              #|line 607|#
    (loop for diagram_source in  diagram_source_files
      do
        (progn
          diagram_source                                    #|line 608|#
          (let ((all_containers_within_single_file (funcall (quote lnet2internal_from_file)   project_root  diagram_source  #|line 609|#)))
            (declare (ignorable all_containers_within_single_file))
            (setf  reg (funcall (quote generate_external_components)   reg  all_containers_within_single_file  #|line 610|#))
            (loop for container in  all_containers_within_single_file
              do
                (progn
                  container                                 #|line 611|#
                  (funcall (quote register_component)   reg (funcall (quote mkTemplate)  (gethash  "name"  container)  #| container= |# container  #| instantiator= |# #'container_instantiator )  #|line 612|#) #|line 613|#
                  )))                                       #|line 614|#
          ))
    (funcall (quote initialize_stock_components)   reg      #|line 615|#)
    (return-from initialize_component_palette_from_files  reg) #|line 616|#) #|line 617|#
  )
(defun initialize_component_palette_from_string (&optional  project_root  lnet)
  (declare (ignorable  project_root  lnet))                 #|line 619|#
  #|  this version ignores project_root  |#                 #|line 620|#
  (let (( reg (funcall (quote make_component_registry) )))
    (declare (ignorable  reg))                              #|line 621|#
    (let ((all_containers (funcall (quote lnet2internal_from_string)   lnet  #|line 622|#)))
      (declare (ignorable all_containers))
      (setf  reg (funcall (quote generate_external_components)   reg  all_containers  #|line 623|#))
      (loop for container in  all_containers
        do
          (progn
            container                                       #|line 624|#
            (funcall (quote register_component)   reg (funcall (quote mkTemplate)  (gethash  "name"  container)  #| container= |# container  #| instantiator= |# #'container_instantiator )  #|line 625|#) #|line 626|#
            ))
      (funcall (quote initialize_stock_components)   reg    #|line 627|#)
      (return-from initialize_component_palette_from_string  reg) #|line 628|#)) #|line 629|#
  )                                                         #|line 631|#
(defun clone_string (&optional  s)
  (declare (ignorable  s))                                  #|line 632|#
  (return-from clone_string  s                              #|line 633|# #|line 634|#) #|line 635|#
  )
(defparameter  load_errors  nil)                            #|line 636|#
(defparameter  runtime_errors  nil)                         #|line 637|# #|line 638|#
(defun load_error (&optional  s)
  (declare (ignorable  s))                                  #|line 639|# #|line 640|#
  (format *error-output* "~a~%"  s)                         #|line 641|#
  (format *error-output* "
  ")                                                        #|line 642|#
  (setf  load_errors  t)                                    #|line 643|# #|line 644|#
  )
(defun runtime_error (&optional  s)
  (declare (ignorable  s))                                  #|line 646|# #|line 647|#
  (format *error-output* "~a~%"  s)                         #|line 648|#
  (setf  runtime_errors  t)                                 #|line 649|# #|line 650|#
  )                                                         #|line 652|#
(defun initialize_from_files (&optional  project_root  diagram_names)
  (declare (ignorable  project_root  diagram_names))        #|line 653|#
  (let ((arg  nil))
    (declare (ignorable arg))                               #|line 654|#
    (let ((palette (funcall (quote initialize_component_palette_from_files)   project_root  diagram_names  #|line 655|#)))
      (declare (ignorable palette))
      (return-from initialize_from_files (values  palette (list   project_root  diagram_names  arg ))) #|line 656|#)) #|line 657|#
  )
(defun initialize_from_string (&optional  project_root)
  (declare (ignorable  project_root))                       #|line 659|#
  (let ((arg  nil))
    (declare (ignorable arg))                               #|line 660|#
    (let ((palette (funcall (quote initialize_component_palette_from_string)   project_root  #|line 661|#)))
      (declare (ignorable palette))
      (return-from initialize_from_string (values  palette (list   project_root  nil  arg ))) #|line 662|#)) #|line 663|#
  )
(defun start (&optional  arg  part_name  palette  env)
  (declare (ignorable  arg  part_name  palette  env))       #|line 665|#
  (let ((part (funcall (quote start_bare)   part_name  palette  env  #|line 666|#)))
    (declare (ignorable part))
    (funcall (quote inject)   part  ""  arg                 #|line 667|#)
    (funcall (quote finalize)   part                        #|line 668|#)) #|line 669|#
  )
(defun start_bare (&optional  part_name  palette  env)
  (declare (ignorable  part_name  palette  env))            #|line 671|#
  (let ((project_root (nth  0  env)))
    (declare (ignorable project_root))                      #|line 672|#
    (let ((diagram_names (nth  1  env)))
      (declare (ignorable diagram_names))                   #|line 673|#
      (funcall (quote set_environment)   project_root       #|line 674|#)
      #|  get entrypoint container |#                       #|line 675|#
      (let (( part (funcall (quote get_component_instance)   palette  part_name  nil  #|line 676|#)))
        (declare (ignorable  part))
        (cond
          (( equal    nil  part)                            #|line 677|#
            (funcall (quote load_error)   (concatenate 'string  "Couldn't find container with page name /"  (concatenate 'string  part_name  (concatenate 'string  "/ in files "  (concatenate 'string (format nil "~a"  diagram_names)  " (check tab names, or disable compression?)"))))  #|line 681|#) #|line 682|#
            ))
        (return-from start_bare  part)                      #|line 683|#))) #|line 684|#
  )
(defun inject (&optional  part  port  payload)
  (declare (ignorable  part  port  payload))                #|line 686|#
  (cond
    ((not  load_errors)                                     #|line 687|#
      (let (( d  (make-instance 'Datum)                     #|line 688|#))
        (declare (ignorable  d))
        (setf (slot-value  d 'v)  payload)                  #|line 689|#
        (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 690|#)))
        (setf (slot-value  d 'reclaim)  nil)                #|line 691|#
        (let (( mev (funcall (quote make_mevent)   port  d  #|line 692|#)))
          (declare (ignorable  mev))
          (funcall (quote inject_mevent)   part  mev        #|line 693|#)))
      )
    (t                                                      #|line 694|#
      (break)                                               #|line 695|# #|line 696|#
      ))                                                    #|line 697|#
  )
(defun finalize (&optional  part)
  (declare (ignorable  part))                               #|line 699|#
  (queue-as-json-to-stdout (slot-value  part 'outq))        #|line 700|# #|line 701|#
  )
(defun new_datum_bang (&optional )
  (declare (ignorable ))                                    #|line 703|#
  (let (( d  (make-instance 'Datum)                         #|line 704|#))
    (declare (ignorable  d))
    (setf (slot-value  d 'v)  "!")                          #|line 705|#
    (setf (slot-value  d 'clone)  #'(lambda (&optional )(funcall (quote obj_clone)   d  #|line 706|#)))
    (setf (slot-value  d 'reclaim)  nil)                    #|line 707|#
    (return-from new_datum_bang  d                          #|line 708|# #|line 709|#))
  )
