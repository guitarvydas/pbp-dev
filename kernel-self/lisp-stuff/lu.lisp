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

