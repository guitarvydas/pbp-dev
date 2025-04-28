
def handle_external (eh,mev):                          #line 1
    s =  eh.arg                                        #line 2
    firstc =  s [ 1]                                   #line 3
    if  firstc ==  "$":                                #line 4
        shell_out_handler ( eh,    s[1:] [1:] [1:] , mev)#line 5
    elif  firstc ==  "?":                              #line 6
        probe_handler ( eh,  s[1:] , mev)              #line 7
    else:                                              #line 8
        # just a string, send it out                   #line 9
        send ( eh, "",   s[1:] [1:] , mev)             #line 10#line 11#line 12#line 13

def probe_handler (eh,s,mev):                          #line 14
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.name) +  str( ": ") + str ( s)      )#line 22#line 23#line 24

def shell_out_handler (eh,cmd,mev):                    #line 25
    s =  mev.datum.v                                   #line 26
    ret =  None                                        #line 27
    rc =  None                                         #line 28
    stdout =  None                                     #line 29
    stderr =  None                                     #line 30

    try:
        with open('junk.txt', 'w') as file:
            file.write(cmd)
        ret = subprocess.run (shlex.split ( cmd), input= s, text=True, capture_output=True)
        rc = ret.returncode
        stdout = ret.stdout.strip ()
        stderr = ret.stderr.strip ()
    except Exception as e:
        ret = None
        rc = 1
        stdout = ''
        stderr = str(e)
                                                       #line 31
    if  rc ==  0:                                      #line 32
        send ( eh, "", str( stdout) +  stderr , mev)   #line 33
    else:                                              #line 34
        send ( eh, "✗", str( stdout) +  stderr , mev)  #line 35#line 36#line 37#line 38