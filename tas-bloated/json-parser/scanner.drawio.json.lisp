
(jarray 
  (dict 
    ("file" . "scanner.drawio") 
    ("name" . "main")
    ("children" . 
      (jarray 
	(dict 
	  ("name" . "Delay") 
	  ("id" . 4)) 
	(dict 
	  ("name" . "Larson") 
	  ("id" . 7))))
    ("connections" . 
      (jarray 
	(dict 
	  ("dir" . 0) 
	  ("source" . 
	    (dict 
	      ("name" . "") 
	      ("id" . 0)))
	  ("source_port" . "")
	  ("target" . 
	    (dict 
	      ("name" . "Larson") 
	      ("id" . 7)))
	  ("target_port" . "tick")) 
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Delay") 
	      ("id" . 4)))
	  ("source_port" . "")
	  ("target" . 
	    (dict 
	      ("name" . "Larson") 
	      ("id" . 7)))
	  ("target_port" . "tick"))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Larson") 
	      ("id" . 7)))
	  ("source_port" . "")
	  ("target" . 
	    (dict 
	      ("name" . "Delay") 
	      ("id" . 4)))
	  ("target_port" . ""))))) 
  (dict 
    ("file" . "scanner.drawio") 
    ("name" . "Larson")
    ("children" . 
      (jarray 
	(dict 
	  ("name" . "Count") 
	  ("id" . 4)) 
	(dict 
	  ("name" . "Reverser") 
	  ("id" . 8))
	(dict 
	  ("name" . "Decode") 
	  ("id" . 13))
	(dict 
	  ("name" . "@") 
	  ("id" . 26))
	(dict 
	  ("name" . "@") 
	  ("id" . 28))
	(dict 
	  ("name" . "@") 
	  ("id" . 29))
	(dict 
	  ("name" . "@") 
	  ("id" . 32))
	(dict 
	  ("name" . "@") 
	  ("id" . 34))
	(dict 
	  ("name" . "@") 
	  ("id" . 36))
	(dict 
	  ("name" . "@") 
	  ("id" . 38))
	(dict 
	  ("name" . "@") 
	  ("id" . 40))
	(dict 
	  ("name" . "@") 
	  ("id" . 42))
	(dict 
	  ("name" . "@") 
	  ("id" . 44))))
    ("connections" . 
      (jarray 
	(dict 
	  ("dir" . 0) 
	  ("source" . 
	    (dict 
	      ("name" . "") 
	      ("id" . 0)))
	  ("source_port" . "tick")
	  ("target" . 
	    (dict 
	      ("name" . "Count") 
	      ("id" . 4)))
	  ("target_port" . "adv")) 
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Count") 
	      ("id" . 4)))
	  ("source_port" . "")
	  ("target" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("target_port" . "N"))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "7")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 34)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "8")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 32)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "9")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 29)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "9")
	  ("target" . 
	    (dict 
	      ("name" . "Reverser") 
	      ("id" . 8)))
	  ("target_port" . "K"))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "0")
	  ("target" . 
	    (dict 
	      ("name" . "Reverser") 
	      ("id" . 8)))
	  ("target_port" . "J"))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "5")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 38)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Reverser") 
	      ("id" . 8)))
	  ("source_port" . "")
	  ("target" . 
	    (dict 
	      ("name" . "Count") 
	      ("id" . 4)))
	  ("target_port" . "rev"))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "0")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 40)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "1")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 44)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "2")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 42)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "3")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 28)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "4")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 26)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 1) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "6")
	  ("target" . 
	    (dict 
	      ("name" . "@") 
	      ("id" . 36)))
	  ("target_port" . ""))
	(dict 
	  ("dir" . 2) 
	  ("source" . 
	    (dict 
	      ("name" . "Decode") 
	      ("id" . 13)))
	  ("source_port" . "done")
	  ("target" . 
	    (dict 
	      ("name" . "") 
	      ("id" . 0)))
	  ("target_port" . ""))))))
