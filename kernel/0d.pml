($preamble)

(var (counter 0)
     (var (ticktime 0)
	  (var (digits [
	       “₀” “₁” “₂” “₃” “₄” “₅”
		“₆” “₇” “₈” “₉”
		 “₁₀” “₁₁” “₁₂” “₁₃” “₁₄”
		  “₁₅” “₁₆” “₁₇” “₁₈” “₁₉”
		   “₂₀” “₂₁” “₂₂” “₂₃” “₂₄”
		    “₂₅” “₂₆” “₂₇” “₂₈” “₂₉”]
		     )
	       (defun gensymbol (s)
		 (synonym name-with-id ($strcons s (subscripted-digit counter))
			  (⇐ counter (+ 1 counter))
			  name-with-id))

	       (defun subscripted-digit (n)
		 (if (and (>= n 0) (<= n 29))
		     digits.[n]
		   else
		     ($strcons "₊" ($asstr n))))

	       (defobj Datum ((v ϕ) (datum ϕ)))

	       (defun clone-port (s) (clone-string s))

	       (defun make-mevent (port datum)
		 (synonym (clone-string port)
			  (var (m ($fresh Mevent))
			       (⇐ m.port p)
			       (⇐ m.datum (datum.clone))
			       m)))
			       

		 )
	       )
	  )
     )
