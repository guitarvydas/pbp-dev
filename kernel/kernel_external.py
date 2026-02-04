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
    s =  mev.datum.v                                   #line 27
    ret =  None                                        #line 28
    rc =  None                                         #line 29
    stdout =  None                                     #line 30
    stderr =  None                                     #line 31
    command =  cmd                                     #line 32
    pbpRoot = os.getenv('PBP', '<none>')               #line 33
    if  pbpRoot!= "":                                  #line 34
        command = re.sub ( "_/",  str( pbpRoot) +  "/" ,  command)#line 37#line 38
    if ( False ):                                      #line 39
        print ( str( "- --- shell-out ;") +  s , file=sys.stderr)#line 40
                                                       #line 41#line 42

    try:
        with open('junk.command.txt', 'w') as file:
            file.write(os.getcwd())
            file.write(' ')
            file.write(cmd)
            file.write(' ')
        ret = subprocess.run (shlex.split ( command), input= s, text=True, capture_output=True)
        rc = ret.returncode
        stdout = ret.stdout.strip ()
        stderr = ret.stderr.strip ()
    except Exception as e:
        ret = None
        rc = 1
        stdout = ''
        stderr = str(e)
                                                       #line 43
    if  rc ==  0:                                      #line 44
        send ( eh, "", str( stdout) +  stderr , mev)   #line 45
    else:                                              #line 46
        send ( eh, "✗", str( stdout) +  stderr , mev)  #line 47#line 48#line 49#line 50
