# (This used to be called `external` due to historical reasons). This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way. #line 1#line 2
def jit_instantiate (reg,owner,name,arg):              #line 3
    name_with_id = gensymbol ( name)                   #line 4
    inst = make_leaf ( name_with_id, owner, None, arg, handle_external, None)#line 5
    firstc =  name [ 1]                                #line 6
    if ( firstc ==  "?"):                              #line 7
        # probes get to go to the front of the line    #line 8
        inst.special =  True                           #line 9#line 10
    return  inst                                       #line 11#line 12#line 13

def handle_jit (eh,mev):                               #line 14
    s =  eh.arg                                        #line 15
    firstc =  s [ 1]                                   #line 16
    if  firstc ==  "$":                                #line 17
        shell_out_handler ( eh,    s[1:] [1:] [1:] , mev)#line 18
    elif  firstc ==  "?":                              #line 19
        probe_handler ( eh,  s[1:] , mev)              #line 20
    else:                                              #line 21
        # just a string, send it out                   #line 22
        send ( eh, "",  s[1:] , mev)                   #line 23#line 24#line 25#line 26

def probe_handler (eh,tag,mev):                        #line 27
    s =  mev.datum.v                                   #line 28
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.name) +  str( ": ") + str ( s)      )#line 36#line 37#line 38

def shell_out_handler (eh,cmd,mev):                    #line 39
    s =  mev.datum.v                                   #line 40
    ret =  None                                        #line 41
    rc =  None                                         #line 42
    stdout =  None                                     #line 43
    stderr =  None                                     #line 44
    command =  cmd                                     #line 45
    pbpRoot = os.getenv('PBP', '<none>')               #line 46
    if  pbpRoot!= "":                                  #line 47
        command = re.sub ( "_/",  str( pbpRoot) +  "/" ,  command)#line 50#line 51
    if ( False ):                                      #line 52
        print ( str( "- --- shell-out: ") +  command , file=sys.stderr)#line 53
                                                       #line 54#line 55

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
                                                       #line 56
    if  rc ==  0:                                      #line 57
        send ( eh, "", str( stdout) +  stderr , mev)   #line 58
    else:                                              #line 59
        send ( eh, "✗", str( stdout) +  stderr , mev)  #line 60#line 61#line 62#line 63
