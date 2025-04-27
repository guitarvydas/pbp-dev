
def handle_external (s,eh,mev):                        #line 1
    firstc ==  s [ 1]                                  #line 2
    if  firstc ==  "$":                                #line 3
        shell_out_handler ( eh,   s[1:] [1:] , mev)    #line 4
    elif  firstc ==  "?":                              #line 5
        probe_handler ( eh,  s[1:] , mev)              #line 6
    else:                                              #line 7
        # just a string, send it out                   #line 8
        send ( eh, "",   s[1:] [1:] , msg)             #line 9#line 10#line 11#line 12

def probe_handler (eh,s,mev):                          #line 13
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( ": ") + str ( s)     )#line 19#line 20#line 21

def shell_out_handler (eh,cmd,msg):                    #line 22
    s =  msg.datum.v                                   #line 23
    ret =  None                                        #line 24
    rc =  None                                         #line 25
    stdout =  None                                     #line 26
    stderr =  None                                     #line 27

    try:
        ret = subprocess.run ( cmd, input= s, text=True, capture_output=True)
        rc = ret.returncode
        stdout = ret.stdout.strip ()
        stderr = ret.stderr.strip ()
    except Exception as e:
        ret = None
        rc = 1
        stdout = ''
        stderr = str(e)
                                                       #line 28
    if  rc ==  0:                                      #line 29
        send ( eh, "", str( stdout) +  stderr , msg)   #line 30
    else:                                              #line 31
        send ( eh, "✗", str( stdout) +  stderr , msg)  #line 32#line 33#line 34#line 35