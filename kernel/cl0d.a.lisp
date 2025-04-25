

(defparameter  counter  0)
(defparameter  digits (list  "₀"  "₁"  "₂"  "₃"  "₄"  "₅"  "₆"  "₇"  "₈"  "₉"  "₁₀"  "₁₁"  "₁₂"  "₁₃"  "₁₄"  "₁₅"  "₁₆"  "₁₇"  "₁₈"  "₁₉"  "₂₀"  "₂₁"  "₂₂"  "₂₃"  "₂₄"  "₂₅"  "₂₆"  "₂₇"  "₂₈"  "₂₉" ))
(defun gensymbol (&optional  s)
  (let (( name_with_id  (concatenate 'string  s (subscripted_digit   counter))))
    (setf  counter (+  counter  1))
    (return-from gensymbol  name_with_id)))
(defun subscripted_digit (&optional  n)
  (cond 
    ((and ( >=   n  0) ( <=   n  29))
        (return-from subscripted_digit (nth  n  digits)))
    (t
        (return-from subscripted_digit  (concatenate 'string  "₊"  n)))))
(defun Datum (&optional )
  (list
    (cons 'data  nil)
    (cons 'clone  nil)
    (cons 'reclaim  nil)
    (cons 'srepr  nil)
    (cons 'kind  nil)
    (cons 'raw  nil) ))

(defun new_datum_string (&optional  s)
  (let (( d  (Datum)))
    (setf (fieldf 'data  d)  s)
    (setf (fieldf 'clone  d)  #'(lambda (&optional ) (clone_datum_string   d)))
    (setf (fieldf 'reclaim  d)  #'(lambda (&optional ) (reclaim_datum_string   d)))
    (setf (fieldf 'srepr  d)  #'(lambda (&optional ) (srepr_datum_string   d)))
    (setf (fieldf 'raw  d)  #'(lambda (&optional ) (raw_datum_string   d)))
    (setf (fieldf 'kind  d)  #'(lambda (&optional )  "string"))
    (return-from new_datum_string  d)))
(defun clone_datum_string (&optional  d)
  (let (( d (new_datum_string  (fieldf 'data  d))))
    (return-from clone_datum_string  d)))
(defun reclaim_datum_string (&optional  src)
  #| pass |#)
(defun srepr_datum_string (&optional  d)
  (return-from srepr_datum_string (fieldf 'data  d)))
(defun raw_datum_string (&optional  d)
  (return-from raw_datum_string (bytearray  (fieldf 'data  d)  "UTF_8")))
(defun new_datum_bang (&optional )
  (let (( p (Datum )))
    (setf (fieldf 'data  p)  t)
    (setf (fieldf 'clone  p)  #'(lambda (&optional ) (clone_datum_bang   p)))
    (setf (fieldf 'reclaim  p)  #'(lambda (&optional ) (reclaim_datum_bang   p)))
    (setf (fieldf 'srepr  p)  #'(lambda (&optional ) (srepr_datum_bang )))
    (setf (fieldf 'raw  p)  #'(lambda (&optional ) (raw_datum_bang )))
    (setf (fieldf 'kind  p)  #'(lambda (&optional )  "bang"))
    (return-from new_datum_bang  p)))
(defun clone_datum_bang (&optional  d)
  (return-from clone_datum_bang (new_datum_bang )))
(defun reclaim_datum_bang (&optional  d)
  #| pass |#)
(defun srepr_datum_bang (&optional )
  (return-from srepr_datum_bang  "!"))
(defun raw_datum_bang (&optional )
  (return-from raw_datum_bang nil))
(defun new_datum_tick (&optional )
  (let (( p (new_datum_bang )))
    (setf (fieldf 'kind  p)  #'(lambda (&optional )  "tick"))
    (setf (fieldf 'clone  p)  #'(lambda (&optional ) (new_datum_tick )))
    (setf (fieldf 'srepr  p)  #'(lambda (&optional ) (srepr_datum_tick )))
    (setf (fieldf 'raw  p)  #'(lambda (&optional ) (raw_datum_tick )))
    (return-from new_datum_tick  p)))
(defun srepr_datum_tick (&optional )
  (return-from srepr_datum_tick  "."))
(defun raw_datum_tick (&optional )
  (return-from raw_datum_tick nil))
(defun new_datum_bytes (&optional  b)
  (let (( p (Datum )))
    (setf (fieldf 'data  p)  b)
    (setf (fieldf 'clone  p)  clone_datum_bytes)
    (setf (fieldf 'reclaim  p)  #'(lambda (&optional ) (reclaim_datum_bytes   p)))
    (setf (fieldf 'srepr  p)  #'(lambda (&optional ) (srepr_datum_bytes   b)))
    (setf (fieldf 'raw  p)  #'(lambda (&optional ) (raw_datum_bytes   b)))
    (setf (fieldf 'kind  p)  #'(lambda (&optional )  "bytes"))
    (return-from new_datum_bytes  p)))
(defun clone_datum_bytes (&optional  src)
  (let (( p (Datum )))
    (let (( p  src))
      (setf (fieldf 'data  p) (funcall2 (fieldf 'clone  src) ))
      (return-from clone_datum_bytes  p))))
(defun reclaim_datum_bytes (&optional  src)
  #| pass |#)
(defun srepr_datum_bytes (&optional  d)
  (return-from srepr_datum_bytes (funcall2 (fieldf 'decode (fieldf 'data  d))   "UTF_8")))
(defun raw_datum_bytes (&optional  d)
  (return-from raw_datum_bytes (fieldf 'data  d)))
(defun new_datum_handle (&optional  h)
  (return-from new_datum_handle (new_datum_int   h)))
(defun new_datum_int (&optional  i)
  (let (( p (Datum )))
    (setf (fieldf 'data  p)  i)
    (setf (fieldf 'clone  p)  #'(lambda (&optional ) (clone_int   i)))
    (setf (fieldf 'reclaim  p)  #'(lambda (&optional ) (reclaim_int   i)))
    (setf (fieldf 'srepr  p)  #'(lambda (&optional ) (srepr_datum_int   i)))
    (setf (fieldf 'raw  p)  #'(lambda (&optional ) (raw_datum_int   i)))
    (setf (fieldf 'kind  p)  #'(lambda (&optional )  "int"))
    (return-from new_datum_int  p)))
(defun clone_int (&optional  i)
  (let (( p (new_datum_int   i)))
    (return-from clone_int  p)))
(defun reclaim_int (&optional  src)
  #| pass |#)
(defun srepr_datum_int (&optional  i)
  (return-from srepr_datum_int (str   i)))
(defun raw_datum_int (&optional  i)
  (return-from raw_datum_int  i))
#|  Message passed to a leaf component. |#
#|  |#
#|  `port` refers to the name of the incoming or outgoing port of this component. |#
#|  `datum` is the data attached to this message. |#
(defun Message (&optional  port datum)
  (list
    (cons 'port  port)
    (cons 'datum  datum) ))

(defun clone_port (&optional  s)
  (return-from clone_port (clone_string   s)))
#|  Utility for making a `Message`. Used to safely “seed“ messages |#
#|  entering the very top of a network. |#
(defun make_message (&optional  port datum)
  (let (( p (clone_string   port)))
    (let (( m (Message  :port  p :datum (funcall2 (fieldf 'clone  datum) ))))
      (return-from make_message  m))))
#|  Clones a message. Primarily used internally for “fanning out“ a message to multiple destinations. |#
(defun message_clone (&optional  message)
  (let (( m (Message  :port (clone_port  (fieldf 'port  message)) :datum (funcall2 (fieldf 'clone (fieldf 'datum  message)) ))))
    (return-from message_clone  m)))
#|  Frees a message. |#
(defun destroy_message (&optional  msg)
  
  #|  during debug, dont destroy any message, since we want to trace messages, thus, we need to persist ancestor messages |#
  #| pass |#)
(defun destroy_datum (&optional  msg)
  #| pass |#)
(defun destroy_port (&optional  msg)
  #| pass |#)
#|  |#
(defun format_message (&optional  m)
  (cond 
    (( equal    m  nil)
        (return-from format_message  "ϕ"))
    (t
        (return-from format_message  (concatenate 'string  "⟪"  (concatenate 'string (fieldf 'port  m)  (concatenate 'string  "⦂"  (concatenate 'string (funcall2 (fieldf 'srepr (fieldf 'datum  m)) )  "⟫"))))))))
#|  dynamic routing descriptors |#
(defparameter  drInject  "inject")
(defparameter  drSend  "send")
(defparameter  drInOut  "inout")
(defparameter  drForward  "forward")
(defparameter  drDown  "down")
(defparameter  drUp  "up")
(defparameter  drAcross  "across")
(defparameter  drThrough  "through")
#|  See “class_free programming“ starting at 45:01 of https://www.youtube.com/watch?v=XFTOG895C7c |#
(defun make_Routing_Descriptor (&optional  action component port message)
  (return-from make_Routing_Descriptor 
    (let ((_dict (make-hash-table :test 'equal)))
      (setf (gethash "action" _dict)  action)
      (setf (gethash "component" _dict)  component)
      (setf (gethash "port" _dict)  port)
      (setf (gethash "message" _dict)  message)
      _dict)))
#|  |#
(defun make_Send_Descriptor (&optional  component port message cause_port cause_message)
  (let (( rdesc (make_Routing_Descriptor  :action  drSend :component  component :port  port :message  message)))
    (return-from make_Send_Descriptor 
      (let ((_dict (make-hash-table :test 'equal)))
        (setf (gethash "action" _dict)  drSend)
        (setf (gethash "component" _dict) (cdr (assoc 'component  rdesc)))
        (setf (gethash "port" _dict) (cdr (assoc 'port  rdesc)))
        (setf (gethash "message" _dict) (cdr (assoc 'message  rdesc)))
        (setf (gethash "cause_port" _dict)  cause_port)
        (setf (gethash "cause_message" _dict)  cause_message)
        (setf (gethash "fmt" _dict)  fmt_send)
        _dict))))
(defun log_send (&optional  sender sender_port msg cause_msg)
  (let (( send_desc (make_Send_Descriptor  :component  sender :port  sender_port :message  msg :cause_port (fieldf 'port  cause_msg) :cause_message  cause_msg)))
    (append_routing_descriptor  :container (fieldf 'owner  sender) :desc  send_desc) ))
(defun log_send_string (&optional  sender sender_port msg cause_msg)
  (let (( send_desc (make_Send_Descriptor   sender  sender_port  msg (fieldf 'port  cause_msg)  cause_msg)))
    (append_routing_descriptor  :container (fieldf 'owner  sender) :desc  send_desc) ))
(defun fmt_send (&optional  desc indent)
  (return-from fmt_send  ""
    
    #| return f;\n{indent}⋯ {desc@component.name}.“{desc@cause_port}“ ∴ {desc@component.name}.“{desc@port}“ {format_message (desc@message)}' |#))
(defun fmt_send_string (&optional  desc indent)
  (return-from fmt_send_string (fmt_send   desc  indent)))
#|  |#
(defun make_Forward_Descriptor (&optional  component port message cause_port cause_message)
  (let (( rdesc (make_Routing_Descriptor  :action  drSend :component  component :port  port :message  message)))
    (let (( fmt_forward  #'(lambda (&optional desc)  "")))
      (return-from make_Forward_Descriptor 
        (let ((_dict (make-hash-table :test 'equal)))
          (setf (gethash "action" _dict)  drForward)
          (setf (gethash "component" _dict) (cdr (assoc 'component  rdesc)))
          (setf (gethash "port" _dict) (cdr (assoc 'port  rdesc)))
          (setf (gethash "message" _dict) (cdr (assoc 'message  rdesc)))
          (setf (gethash "cause_port" _dict)  cause_port)
          (setf (gethash "cause_message" _dict)  cause_message)
          (setf (gethash "fmt" _dict)  fmt_forward)
          _dict)))))
(defun log_forward (&optional  sender sender_port msg cause_msg)
  #| pass |#
  
  #|  when needed, it is too frequent to bother logging |#)
(defun fmt_forward (&optional  desc)
  (print   (concatenate 'string  "*** Error fmt_forward "  desc))
  (quit ) )
#|  |#
(defun make_Inject_Descriptor (&optional  receiver port message)
  (let (( rdesc (make_Routing_Descriptor  :action  drInject :component  receiver :port  port :message  message)))
    (return-from make_Inject_Descriptor 
      (let ((_dict (make-hash-table :test 'equal)))
        (setf (gethash "action" _dict)  drInject)
        (setf (gethash "component" _dict) (cdr (assoc 'component  rdesc)))
        (setf (gethash "port" _dict) (cdr (assoc 'port  rdesc)))
        (setf (gethash "message" _dict) (cdr (assoc 'message  rdesc)))
        (setf (gethash "fmt" _dict)  fmt_inject)
        _dict))))
(defun log_inject (&optional  receiver port msg)
  (let (( inject_desc (make_Inject_Descriptor  :receiver  receiver :port  port :message  msg)))
    (append_routing_descriptor  :container  receiver :desc  inject_desc) ))
(defun fmt_inject (&optional  desc indent)
  
  #| return f'\n{indent}⟹  {desc@component.name}.“{desc@port}“ {format_message (desc@message)}' |#
  (return-from fmt_inject  (concatenate 'string  "\n"  (concatenate 'string  indent  (concatenate 'string  "⟹  "  (concatenate 'string (fieldf 'name (cdr (assoc 'component  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'port  desc))  (concatenate 'string  " " (format_message  (cdr (assoc 'message  desc))))))))))))
#|  |#
(defun make_Down_Descriptor (&optional  container source_port source_message target target_port target_message)
  (return-from make_Down_Descriptor 
    (let ((_dict (make-hash-table :test 'equal)))
      (setf (gethash "action" _dict)  drDown)
      (setf (gethash "container" _dict)  container)
      (setf (gethash "source_port" _dict)  source_port)
      (setf (gethash "source_message" _dict)  source_message)
      (setf (gethash "target" _dict)  target)
      (setf (gethash "target_port" _dict)  target_port)
      (setf (gethash "target_message" _dict)  target_message)
      (setf (gethash "fmt" _dict)  fmt_down)
      _dict)))
(defun log_down (&optional  container source_port source_message target target_port target_message)
  (let (( rdesc (make_Down_Descriptor   container  source_port  source_message  target  target_port  target_message)))
    (append_routing_descriptor   container  rdesc) ))
(defun fmt_down (&optional  desc indent)
  
  #| return f'\n{indent}↓ {desc@container.name}.“{desc@source_port}“ ➔ {desc@target.name}.“{desc@target_port}“ {format_message (desc@target_message)}' |#
  (return-from fmt_down  (concatenate 'string  "\n"  (concatenate 'string  indent  (concatenate 'string  " ↓ "  (concatenate 'string (fieldf 'name (cdr (assoc 'container  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'source_port  desc))  (concatenate 'string  " ➔ "  (concatenate 'string (fieldf 'name (cdr (assoc 'target  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'target_port  desc))  (concatenate 'string  " " (format_message  (cdr (assoc 'target_message  desc))))))))))))))))
#|  |#
(defun make_Up_Descriptor (&optional  source source_port source_message container container_port container_message)
  (return-from make_Up_Descriptor 
    (let ((_dict (make-hash-table :test 'equal)))
      (setf (gethash "action" _dict)  drUp)
      (setf (gethash "source" _dict)  source)
      (setf (gethash "source_port" _dict)  source_port)
      (setf (gethash "source_message" _dict)  source_message)
      (setf (gethash "container" _dict)  container)
      (setf (gethash "container_port" _dict)  container_port)
      (setf (gethash "container_message" _dict)  container_message)
      (setf (gethash "fmt" _dict)  fmt_up)
      _dict)))
(defun log_up (&optional  source source_port source_message container target_port target_message)
  (let (( rdesc (make_Up_Descriptor   source  source_port  source_message  container  target_port  target_message)))
    (append_routing_descriptor   container  rdesc) ))
(defun fmt_up (&optional  desc indent)
  
  #| return f'\n{indent}↑ {desc@source.name}.“{desc@source_port}“ ➔ {desc@container.name}.“{desc@container_port}“ {format_message (desc@container_message)}' |#
  (return-from fmt_up  (concatenate 'string  "\n"  (concatenate 'string  indent  (concatenate 'string  "↑ "  (concatenate 'string (fieldf 'name (cdr (assoc 'source  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'source_port  desc))  (concatenate 'string  " ➔ "  (concatenate 'string (fieldf 'name (cdr (assoc 'container  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'container_port  desc))  (concatenate 'string  " " (format_message  (cdr (assoc 'container_message  desc))))))))))))))))
(defun make_Across_Descriptor (&optional  container source source_port source_message target target_port target_message)
  (return-from make_Across_Descriptor 
    (let ((_dict (make-hash-table :test 'equal)))
      (setf (gethash "action" _dict)  drAcross)
      (setf (gethash "container" _dict)  container)
      (setf (gethash "source" _dict)  source)
      (setf (gethash "source_port" _dict)  source_port)
      (setf (gethash "source_message" _dict)  source_message)
      (setf (gethash "target" _dict)  target)
      (setf (gethash "target_port" _dict)  target_port)
      (setf (gethash "target_message" _dict)  target_message)
      (setf (gethash "fmt" _dict)  fmt_across)
      _dict)))
(defun log_across (&optional  container source source_port source_message target target_port target_message)
  (let (( rdesc (make_Across_Descriptor   container  source  source_port  source_message  target  target_port  target_message)))
    (append_routing_descriptor   container  rdesc) ))
(defun fmt_across (&optional  desc indent)
  
  #| return f'\n{indent}→ {desc@source.name}.“{desc@source_port}“ ➔ {desc@target.name}.“{desc@target_port}“  {format_message (desc@target_message)}' |#
  (return-from fmt_across  (concatenate 'string  "\n"  (concatenate 'string  indent  (concatenate 'string  "→ "  (concatenate 'string (fieldf 'name (cdr (assoc 'source  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'source_port  desc))  (concatenate 'string  " ➔ "  (concatenate 'string (fieldf 'name (cdr (assoc 'target  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'target_port  desc))  (concatenate 'string  "  " (format_message  (cdr (assoc 'target_message  desc))))))))))))))))
#|  |#
(defun make_Through_Descriptor (&optional  container source_port source_message target_port message)
  (return-from make_Through_Descriptor 
    (let ((_dict (make-hash-table :test 'equal)))
      (setf (gethash "action" _dict)  drThrough)
      (setf (gethash "container" _dict)  container)
      (setf (gethash "source_port" _dict)  source_port)
      (setf (gethash "source_message" _dict)  source_message)
      (setf (gethash "target_port" _dict)  target_port)
      (setf (gethash "message" _dict)  message)
      (setf (gethash "fmt" _dict)  fmt_through)
      _dict)))
(defun log_through (&optional  container source_port source_message target_port message)
  (let (( rdesc (make_Through_Descriptor   container  source_port  source_message  target_port  message)))
    (append_routing_descriptor   container  rdesc) ))
(defun fmt_through (&optional  desc indent)
  
  #| return f'\n{indent}⇶ {desc @container.name}.“{desc@source_port}“ ➔ {desc@container.name}.“{desc@target_port}“ {format_message (desc@message)}' |#
  (return-from fmt_through  (concatenate 'string  "\n"  (concatenate 'string  indent  (concatenate 'string  "⇶ "  (concatenate 'string (fieldf 'name (cdr (assoc 'container  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'source_port  desc))  (concatenate 'string  " ➔ "  (concatenate 'string (fieldf 'name (cdr (assoc 'container  desc)))  (concatenate 'string  "."  (concatenate 'string (cdr (assoc 'target_port  desc))  (concatenate 'string  " " (format_message  (cdr (assoc 'message  desc))))))))))))))))
#|  |#
(defun make_InOut_Descriptor (&optional  container component in_message out_port out_message)
  (return-from make_InOut_Descriptor 
    (let ((_dict (make-hash-table :test 'equal)))
      (setf (gethash "action" _dict)  drInOut)
      (setf (gethash "container" _dict)  container)
      (setf (gethash "component" _dict)  component)
      (setf (gethash "in_message" _dict)  in_message)
      (setf (gethash "out_message" _dict)  out_message)
      (setf (gethash "fmt" _dict)  fmt_inout)
      _dict)))
(defun log_inout (&optional  container component in_message)
  (cond 
    ((funcall2 (fieldf 'empty (fieldf 'outq  component)) )
        (log_inout_no_output  :container  container :component  component :in_message  in_message) )
    (t
        (log_inout_recursively  :container  container :component  component :in_message  in_message :out_messages (list  (fieldf 'queue (fieldf 'outq  component)))) )))
(defun log_inout_no_output (&optional  container component in_message)
  (let (( rdesc (make_InOut_Descriptor  :container  container :component  component :in_message  in_message :out_port  nil :out_message  nil)))
    (append_routing_descriptor   container  rdesc) ))
(defun log_inout_single (&optional  container component in_message out_message)
  (let (( rdesc (make_InOut_Descriptor  :container  container :component  component :in_message  in_message :out_port  nil :out_message  out_message)))
    (append_routing_descriptor   container  rdesc) ))
(defun log_inout_recursively (&optional  container component in_message (out_messages nil))
  (cond 
    (( equal   nil  out_messages)
        #| pass |#)
    (t
        (let (( m  (car  out_messages)))
          (let (( rest  (cdr  out_messages)))
            (log_inout_single  :container  container :component  component :in_message  in_message :out_message  m)
            (log_inout_recursively  :container  container :component  component :in_message  in_message :out_messages  rest) )))))
(defun fmt_inout (&optional  desc indent)
  (let (( outm (cdr (assoc 'out_message  desc))))
    (cond 
      (( equal    nil  outm)
          (return-from fmt_inout  (concatenate 'string  "\n"  (concatenate 'string  indent  "  ⊥"))))
      (t
          (return-from fmt_inout  (concatenate 'string  "\n"  (concatenate 'string  indent  (concatenate 'string  "  ∴ "  (concatenate 'string (fieldf 'name (cdr (assoc 'component  desc)))  (concatenate 'string  " " (format_message   outm)))))))))))
(defun log_tick (&optional  container component in_message)
  #| pass |#)
#|  |#
(defun routing_trace_all (&optional  container)
  (let (( indent  ""))
    (let (( lis (list  (fieldf 'queue (fieldf 'routings  container)))))
      (return-from routing_trace_all (recursive_routing_trace   container  lis  indent)))))
(defun recursive_routing_trace (&optional  container lis indent)
  (cond 
    (( equal   nil  lis)
        (return-from recursive_routing_trace  ""))
    (t
        (let (( desc (first   lis)))
          (let (( formatted (funcall2 (cdr (assoc 'fmt  desc))   desc  indent)))
            (return-from recursive_routing_trace (+  formatted (recursive_routing_trace   container (rest   lis) (+  indent  "  ")))))))))
(defparameter  enumDown  0)
(defparameter  enumAcross  1)
(defparameter  enumUp  2)
(defparameter  enumThrough  3)
(defun container_instantiator (&optional  reg owner container_name desc)
  (let (( container (make_container   container_name  owner)))
    (let (( children nil))
      (let (( children_by_id bil))
        
        #|  not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here |#
        
        #|  collect children |#
        (loop for child_desc in (cdr (assoc 'children  desc))
          do
            (let (( child_instance (get_component_instance   reg (cdr (assoc 'name  child_desc))  container)))
              (funcall2 (fieldf 'append  children)   child_instance)
              (let (((nth (cdr (assoc 'id  child_desc))  children_by_id)  child_instance)))))
        (setf (fieldf 'children  container)  children)
        (let (( me  container))
          (let (( connectors nil))
            (loop for proto_conn in (cdr (assoc 'connections  desc))
              do
                (let (( source_component  nil))
                  (let (( target_component  nil))
                    (let (( connector (Connector )))
                      (cond 
                        (( equal   (cdr (assoc 'dir  proto_conn))  enumDown)
                            
                            #|  JSON: {'dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''}, |#
                            (setf (fieldf 'direction  connector)  "down")
                            (setf (fieldf 'sender  connector) (Sender  (fieldf 'name  me)  me (cdr (assoc 'source_port  proto_conn))))
                            (let (( target_component (nth (cdr (assoc 'id (cdr (assoc 'target  proto_conn))))  children_by_id)))
                              (cond 
                                (( equal    target_component  nil)
                                    (load_error   (concatenate 'string  "internal error: .Down connection target internal error " (cdr (assoc 'target  proto_conn)))) )
                                (t
                                    (setf (fieldf 'receiver  connector) (Receiver  (fieldf 'name  target_component) (fieldf 'inq  target_component) (cdr (assoc 'target_port  proto_conn))  target_component))
                                    (funcall2 (fieldf 'append  connectors)   connector) ))))
                        (( equal   (cdr (assoc 'dir  proto_conn))  enumAcross)
                            (setf (fieldf 'direction  connector)  "across")
                            (let (( source_component (nth (cdr (assoc 'id (cdr (assoc 'source  proto_conn))))  children_by_id)))
                              (let (( target_component (nth (cdr (assoc 'id (cdr (assoc 'target  proto_conn))))  children_by_id)))
                                (cond 
                                  (( equal    source_component  nil)
                                      (load_error   (concatenate 'string  "internal error: .Across connection source not ok " (cdr (assoc 'source  proto_conn)))) )
                                  (t
                                      (setf (fieldf 'sender  connector) (Sender  (fieldf 'name  source_component)  source_component (cdr (assoc 'source_port  proto_conn))))
                                      (cond 
                                        (( equal    target_component  nil)
                                            (load_error   (concatenate 'string  "internal error: .Across connection target not ok " (fieldf 'target  proto_conn))) )
                                        (t
                                            (setf (fieldf 'receiver  connector) (Receiver  (fieldf 'name  target_component) (fieldf 'inq  target_component) (cdr (assoc 'target_port  proto_conn))  target_component))
                                            (funcall2 (fieldf 'append  connectors)   connector) )))))))
                        (( equal   (cdr (assoc 'dir  proto_conn))  enumUp)
                            (setf (fieldf 'direction  connector)  "up")
                            (let (( source_component (nth (cdr (assoc 'id (cdr (assoc 'source  proto_conn))))  children_by_id)))
                              (cond 
                                (( equal    source_component  nil)
                                    (print   (concatenate 'string  "internal error: .Up connection source not ok " (cdr (assoc 'source  proto_conn)))) )
                                (t
                                    (setf (fieldf 'sender  connector) (Sender  (fieldf 'name  source_component)  source_component (cdr (assoc 'source_port  proto_conn))))
                                    (setf (fieldf 'receiver  connector) (Receiver  (fieldf 'name  me) (fieldf 'outq  container) (cdr (assoc 'target_port  proto_conn))  me))
                                    (funcall2 (fieldf 'append  connectors)   connector) ))))
                        (( equal   (cdr (assoc 'dir  proto_conn))  enumThrough)
                            (setf (fieldf 'direction  connector)  "through")
                            (setf (fieldf 'sender  connector) (Sender  (fieldf 'name  me)  me (cdr (assoc 'source_port  proto_conn))))
                            (setf (fieldf 'receiver  connector) (Receiver  (fieldf 'name  me) (fieldf 'outq  container) (cdr (assoc 'target_port  proto_conn))  me))
                            (funcall2 (fieldf 'append  connectors)   connector) ))))))
            (setf (fieldf 'connections  container)  connectors)
            (return-from container_instantiator  container)))))))
#|  The default handler for container components. |#
(defun container_handler (&optional  container message)
  (route  :container  container :from_component  container :message  message)
  
  #|  references to 'self' are replaced by the container during instantiation |#
  (loop while (any_child_ready   container)
    do
      (step_children   container  message) ))
#|  Frees the given container and associated data. |#
(defun destroy_container (&optional  eh)
  #| pass |#)
(defun fifo_is_empty (&optional  fifo)
  (return-from fifo_is_empty (funcall2 (fieldf 'empty  fifo) )))
#|  Routing connection for a container component. The `direction` field has |#
#|  no affect on the default message routing system _ it is there for debugging |#
#|  purposes, or for reading by other tools. |#
(defun Connector (&optional )
  (list
    (cons 'direction  nil)
    #|  down, across, up, through |#
    (cons 'sender  nil)
    (cons 'receiver  nil) ))

#|  `Sender` is used to “pattern match“ which `Receiver` a message should go to, |#
#|  based on component ID (pointer) and port name. |#
(defun Sender (&optional  name component port)
  (list
    (cons 'name  name)
    (cons 'component  component)
    #|  from |#
    (cons 'port  port)
    #|  from's port |#))

#|  `Receiver` is a handle to a destination queue, and a `port` name to assign |#
#|  to incoming messages to this queue. |#
(defun Receiver (&optional  name queue port component)
  (list
    (cons 'name  name)
    (cons 'queue  queue)
    #|  queue (input | output) of receiver |#
    (cons 'port  port)
    #|  destination port |#
    (cons 'component  component)
    #|  to (for bootstrap debug) |#))

#|  Checks if two senders match, by pointer equality and port name matching. |#
(defun sender_eq (&optional  s1 s2)
  (let (( same_components ( equal   (fieldf 'component  s1) (fieldf 'component  s2))))
    (let (( same_ports ( equal   (fieldf 'port  s1) (fieldf 'port  s2))))
      (return-from sender_eq (and  same_components  same_ports)))))
#|  Delivers the given message to the receiver of this connector. |#
(defun deposit (&optional  parent conn message)
  (let (( new_message (make_message  :port (fieldf 'port (fieldf 'receiver  conn)) :datum (fieldf 'datum  message))))
    (log_connection   parent  conn  new_message)
    (push_message   parent (fieldf 'component (fieldf 'receiver  conn)) (fieldf 'queue (fieldf 'receiver  conn))  new_message) ))
(defun force_tick (&optional  parent eh)
  (let (( tick_msg (make_message   "." (new_datum_tick ))))
    (push_message   parent  eh (fieldf 'inq  eh)  tick_msg)
    (return-from force_tick  tick_msg)))
(defun push_message (&optional  parent receiver inq m)
  (funcall2 (fieldf 'put  inq)   m)
  (funcall2 (fieldf 'put (fieldf 'visit_ordering  parent))   receiver) )
(defun is_self (&optional  child container)
  
  #|  in an earlier version “self“ was denoted as ϕ |#
  (return-from is_self ( equal    child  container)))
(defun step_child (&optional  child msg)
  (let (( before_state (fieldf 'state  child)))
    (funcall2 (fieldf 'handler  child)   child  msg)
    (let (( after_state (fieldf 'state  child)))
      (return-from step_child (values (and ( equal    before_state  "idle") (not (equal   after_state  "idle")))  (and (not (equal   before_state  "idle")) (not (equal   after_state  "idle"))) (and (not (equal   before_state  "idle")) ( equal    after_state  "idle")))))))
(defun save_message (&optional  eh msg)
  (funcall2 (fieldf 'put (fieldf 'saved_messages  eh))   msg) )
(defun fetch_saved_message_and_clear (&optional  eh)
  (return-from fetch_saved_message_and_clear (funcall2 (fieldf 'get (fieldf 'saved_messages  eh)) )))
(defun step_children (&optional  container causingMessage)
  (setf (fieldf 'state  container)  "idle")
  (loop for child in (list  (fieldf 'queue (fieldf 'visit_ordering  container)))
    do
      
      #|  child = container represents self, skip it |#
      (cond 
        ((not (is_self   child  container))
            (cond 
              ((not (funcall2 (fieldf 'empty (fieldf 'inq  child)) ))
                  (let (( msg (funcall2 (fieldf 'get (fieldf 'inq  child)) )))
                    (multiple-value-setq ( began_long_run  continued_long_run  ended_long_run) (step_child   child  msg))
                    (cond 
                      ( began_long_run
                          (save_message   child  msg) )
                      ( continued_long_run
                          #| pass |#)
                      ( ended_long_run
                          (log_inout  :container  container :component  child :in_message (fetch_saved_message_and_clear   child)) )
                      (t
                          (log_inout  :container  container :component  child :in_message  msg) ))
                    (destroy_message   msg) ))
              (t
                  (cond 
                    ((not (equal  (fieldf 'state  child)  "idle"))
                        (let (( msg (force_tick   container  child)))
                          (funcall2 (fieldf 'handler  child)   child  msg)
                          (log_tick  :container  container :component  child :in_message  msg)
                          (destroy_message   msg) )))))
            (cond 
              (( equal   (fieldf 'state  child)  "active")
                  
                  #|  if child remains active, then the container must remain active and must propagate “ticks“ to child |#
                  (setf (fieldf 'state  container)  "active")))
            (loop while (not (funcall2 (fieldf 'empty (fieldf 'outq  child)) ))
              do
                (let (( msg (funcall2 (fieldf 'get (fieldf 'outq  child)) )))
                  (route   container  child  msg)
                  (destroy_message   msg) ))))))
(defun attempt_tick (&optional  parent eh)
  (cond 
    ((not (equal  (fieldf 'state  eh)  "idle"))
        (force_tick   parent  eh) )))
(defun is_tick (&optional  msg)
  (return-from is_tick ( equal    "tick" (funcall2 (fieldf 'kind (fieldf 'datum  msg)) ))))
#|  Routes a single message to all matching destinations, according to |#
#|  the container's connection network. |#
(defun route (&optional  container from_component message)
  (let (( was_sent  nil))
    
    #|  for checking that output went somewhere (at least during bootstrap) |#
    (let (( fromname  ""))
      (cond 
        ((is_tick   message)
            (loop for child in (fieldf 'children  container)
              do
                (attempt_tick   container  child  message) )
            (setf  was_sent  t))
        (t
            (cond 
              ((not (is_self   from_component  container))
                  (setf  fromname (fieldf 'name  from_component))))
            (let (( from_sender (Sender  :name  fromname :component  from_component :port (fieldf 'port  message))))
              (loop for connector in (fieldf 'connections  container)
                do
                  (cond 
                    ((sender_eq   from_sender (fieldf 'sender  connector))
                        (deposit   container  connector  message)
                        (setf  was_sent  t)))))))
      (cond 
        ((not  was_sent)
            (print   "\n\n*** Error: ***")
            (dump_possible_connections   container)
            (print_routing_trace   container)
            (print   "***")
            (print   (concatenate 'string (fieldf 'name  container)  (concatenate 'string  ": message '"  (concatenate 'string (fieldf 'port  message)  (concatenate 'string  "' from "  (concatenate 'string  fromname  " dropped on floor..."))))))
            (print   "***")
            (exit ) )))))
(defun dump_possible_connections (&optional  container)
  (print   (concatenate 'string  "*** possible connections for "  (concatenate 'string (fieldf 'name  container)  ":")))
  (loop for connector in (fieldf 'connections  container)
    do
      (print   (concatenate 'string (fieldf 'direction  connector)  (concatenate 'string  " "  (concatenate 'string (fieldf 'name (fieldf 'sender  connector))  (concatenate 'string  "."  (concatenate 'string (fieldf 'port (fieldf 'sender  connector))  (concatenate 'string  " -> "  (concatenate 'string (fieldf 'name (fieldf 'receiver  connector))  (concatenate 'string  "." (fieldf 'port (fieldf 'receiver  connector))))))))))) ))
(defun any_child_ready (&optional  container)
  (loop for child in (fieldf 'children  container)
    do
      (cond 
        ((child_is_ready   child)
            (return-from any_child_ready  t))))
  (return-from any_child_ready  nil))
(defun child_is_ready (&optional  eh)
  (return-from child_is_ready (or (or (or (not (funcall2 (fieldf 'empty (fieldf 'outq  eh)) )) (not (funcall2 (fieldf 'empty (fieldf 'inq  eh)) ))) (not (equal  (fieldf 'state  eh)  "idle"))) (any_child_ready   eh))))
(defun print_routing_trace (&optional  eh)
  (print  (routing_trace_all   eh)) )
(defun append_routing_descriptor (&optional  container desc)
  (funcall2 (fieldf 'put (fieldf 'routings  container))   desc) )
(defun log_connection (&optional  container connector message)
  (cond 
    (( equal    "down" (fieldf 'direction  connector))
        (log_down  :container  container :source_port (fieldf 'port (fieldf 'sender  connector)) :source_message  nil :target (fieldf 'component (fieldf 'receiver  connector)) :target_port (fieldf 'port (fieldf 'receiver  connector)) :target_message  message) )
    (( equal    "up" (fieldf 'direction  connector))
        (log_up  :source (fieldf 'component (fieldf 'sender  connector)) :source_port (fieldf 'port (fieldf 'sender  connector)) :source_message  nil :container  container :target_port (fieldf 'port (fieldf 'receiver  connector)) :target_message  message) )
    (( equal    "across" (fieldf 'direction  connector))
        (log_across  :container  container :source (fieldf 'component (fieldf 'sender  connector)) :source_port (fieldf 'port (fieldf 'sender  connector)) :source_message  nil :target (fieldf 'component (fieldf 'receiver  connector)) :target_port (fieldf 'port (fieldf 'receiver  connector)) :target_message  message) )
    (( equal    "through" (fieldf 'direction  connector))
        (log_through  :container  container :source_port (fieldf 'port (fieldf 'sender  connector)) :source_message  nil :target_port (fieldf 'port (fieldf 'receiver  connector)) :message  message) )
    (t
        (print   (concatenate 'string  "*** FATAL error: in log_connection /"  (concatenate 'string (fieldf 'direction  connector)  (concatenate 'string  "/ /"  (concatenate 'string (fieldf 'port  message)  (concatenate 'string  "/ /"  (concatenate 'string (funcall2 (fieldf 'srepr (fieldf 'datum  message)) )  "/")))))))
        (exit ) )))
(defun container_injector (&optional  container message)
  (log_inject  :receiver  container :port (fieldf 'port  message) :msg  message)
  (container_handler   container  message) )




