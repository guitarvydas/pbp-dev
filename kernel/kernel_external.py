def handle_external (eh,mev):                          #line 1
    s =  eh.arg                                        #line 2
    firstc =  s [ 1]                                   #line 3
    if  firstc ==  "$":                                #line 4
        shell_out_handler ( eh,    s[1:] [1:] [1:] , mev)#line 5
    elif  firstc ==  "?":                              #line 6
        probe_handler ( eh,  s[1:] , mev)              #line 7
    else:                                              #line 8
        # just a string, send it out                   #line 9
        send ( eh, "",  s[1:] , mev)                   #line 10#line 11#line 12#line 13

def probe_handler (eh,tag,mev):                        #line 14
    s =  mev.datum.v                                   #line 15
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.name) +  str( ": ") + str ( s)      )#line 23#line 24#line 25

def shell_out_handler (eh,cmd,mev):                    #line 26
    global projectRoot                                 #line 27
    s =  mev.datum.v                                   #line 28
    ret =  None                                        #line 29
    rc =  None                                         #line 30
    stdout =  None                                     #line 31
    stderr =  None                                     #line 32
    command =  cmd                                     #line 33
    if  projectRoot!= "":                              #line 34
        command = re.sub ( "_00_",  projectRoot,  command)#line 35#line 36

    try:
        with open('junk.txt', 'w') as file:
            file.write(cmd)
        ret = subprocess.run (shlex.split ( command), input= s, text=True, capture_output=True)
        rc = ret.returncode
        stdout = ret.stdout.strip ()
        stderr = ret.stderr.strip ()
    except Exception as e:
        ret = None
        rc = 1
        stdout = ''
        stderr = str(e)
                                                       #line 37
    if  rc ==  0:                                      #line 38
        send ( eh, "", str( stdout) +  stderr , mev)   #line 39
    else:                                              #line 40
        send ( eh, "✗", str( stdout) +  stderr , mev)  #line 41#line 42#line 43#line 44
