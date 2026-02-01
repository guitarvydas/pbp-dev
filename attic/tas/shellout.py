
# this needs to be rewritten to use the low_level "shell_out“ component, this can be done solely as a diagram without using python code here#line 1
def shell_out_instantiate (reg,owner,name,template_data):#line 2
    name_with_id = gensymbol ( "shell_out")            #line 3
    cmd = shlex.split ( template_data)                 #line 4
    return make_leaf ( name_with_id, owner, cmd, shell_out_handler)#line 5#line 6#line 7

def shell_out_handler (eh,msg):                        #line 8
    cmd =  eh.instance_data                            #line 9
    s =  msg.datum.v                                   #line 10
    ret =  None                                        #line 11
    rc =  None                                         #line 12
    stdout =  None                                     #line 13
    stderr =  None                                     #line 14

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
                                                       #line 15
    if  rc ==  0:                                      #line 16
        send ( eh, "", str( stdout) +  stderr , msg)   #line 17
    else:                                              #line 18
        send ( eh, "✗", str( stdout) +  stderr , msg)  #line 19#line 20#line 21#line 22

def generate_shell_components (reg,container_list):    #line 23
    # [                                                #line 24
    #     {;file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 25
    #     {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []}#line 26
    # ]                                                #line 27
    if  None!= container_list:                         #line 28
        for diagram in  container_list:                #line 29
            # loop through every component in the diagram and look for names that start with “$“ or “'“ #line 30
            # {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 31
            for child_descriptor in  diagram [ "children"]:#line 32
                if first_char_is ( child_descriptor [ "name"], "$"):#line 33
                    name =  child_descriptor [ "name"] #line 34
                    cmd =   name[1:] .strip ()         #line 35
                    generated_leaf = mkTemplate ( name, cmd, shell_out_instantiate)#line 36
                    register_component ( reg, generated_leaf)#line 37
                elif first_char_is ( child_descriptor [ "name"], "'"):#line 38
                    name =  child_descriptor [ "name"] #line 39
                    s =   name[1:]                     #line 40
                    generated_leaf = mkTemplate ( name, s, string_constant_instantiate)#line 41
                    register_component_allow_overwriting ( reg, generated_leaf)#line 42#line 43#line 44#line 45#line 46
    return  reg                                        #line 47#line 48#line 49

def first_char (s):                                    #line 50
    return   s[0]                                      #line 51#line 52#line 53

def first_char_is (s,c):                               #line 54
    return  c == first_char ( s)                       #line 55#line 56#line 57
                                                       #line 58
# TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here#line 59
# I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped#line 60#line 61