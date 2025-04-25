
def probeA_instantiate (reg,owner,name,template_data): #line 1
    name_with_id = gensymbol ( "?A")                   #line 2
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 3#line 4#line 5

def probeB_instantiate (reg,owner,name,template_data): #line 6
    name_with_id = gensymbol ( "?B")                   #line 7
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 8#line 9#line 10

def probeC_instantiate (reg,owner,name,template_data): #line 11
    name_with_id = gensymbol ( "?C")                   #line 12
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 13#line 14#line 15

def probe_handler (eh,mev):                            #line 16
    global ticktime                                    #line 17
    s =  mev.datum.v                                   #line 18
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.name) +  str( ": ") + str ( s)      )#line 25#line 26#line 27

def trash_instantiate (reg,owner,name,template_data):  #line 28
    name_with_id = gensymbol ( "trash")                #line 29
    return make_leaf ( name_with_id, owner, None, trash_handler)#line 30#line 31#line 32

def trash_handler (eh,mev):                            #line 33
    # to appease dumped_on_floor checker               #line 34
    pass                                               #line 35#line 36

class TwoMevents:
    def __init__ (self,):                              #line 37
        self.firstmev =  None                          #line 38
        self.secondmev =  None                         #line 39#line 40
                                                       #line 41
# Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev }#line 42
class Deracer_Instance_Data:
    def __init__ (self,):                              #line 43
        self.state =  None                             #line 44
        self.buffer =  None                            #line 45#line 46
                                                       #line 47
def reclaim_Buffers_from_heap (inst):                  #line 48
    pass                                               #line 49#line 50#line 51

def deracer_instantiate (reg,owner,name,template_data):#line 52
    name_with_id = gensymbol ( "deracer")              #line 53
    inst =  Deracer_Instance_Data ()                   #line 54
    inst.state =  "idle"                               #line 55
    inst.buffer =  TwoMevents ()                       #line 56
    eh = make_leaf ( name_with_id, owner, inst, deracer_handler)#line 57
    return  eh                                         #line 58#line 59#line 60

def send_firstmev_then_secondmev (eh,inst):            #line 61
    forward ( eh, "1", inst.buffer.firstmev)           #line 62
    forward ( eh, "2", inst.buffer.secondmev)          #line 63
    reclaim_Buffers_from_heap ( inst)                  #line 64#line 65#line 66

def deracer_handler (eh,mev):                          #line 67
    inst =  eh.instance_data                           #line 68
    if  inst.state ==  "idle":                         #line 69
        if  "1" ==  mev.port:                          #line 70
            inst.buffer.firstmev =  mev                #line 71
            inst.state =  "waitingForSecondmev"        #line 72
        elif  "2" ==  mev.port:                        #line 73
            inst.buffer.secondmev =  mev               #line 74
            inst.state =  "waitingForFirstmev"         #line 75
        else:                                          #line 76
            runtime_error ( str( "bad mev.port (case A) for deracer ") +  mev.port )#line 77#line 78
    elif  inst.state ==  "waitingForFirstmev":         #line 79
        if  "1" ==  mev.port:                          #line 80
            inst.buffer.firstmev =  mev                #line 81
            send_firstmev_then_secondmev ( eh, inst)   #line 82
            inst.state =  "idle"                       #line 83
        else:                                          #line 84
            runtime_error ( str( "bad mev.port (case B) for deracer ") +  mev.port )#line 85#line 86
    elif  inst.state ==  "waitingForSecondmev":        #line 87
        if  "2" ==  mev.port:                          #line 88
            inst.buffer.secondmev =  mev               #line 89
            send_firstmev_then_secondmev ( eh, inst)   #line 90
            inst.state =  "idle"                       #line 91
        else:                                          #line 92
            runtime_error ( str( "bad mev.port (case C) for deracer ") +  mev.port )#line 93#line 94
    else:                                              #line 95
        runtime_error ( "bad state for deracer {eh.state}")#line 96#line 97#line 98#line 99

def low_level_read_text_file_instantiate (reg,owner,name,template_data):#line 100
    name_with_id = gensymbol ( "Low Level Read Text File")#line 101
    return make_leaf ( name_with_id, owner, None, low_level_read_text_file_handler)#line 102#line 103#line 104

def low_level_read_text_file_handler (eh,mev):         #line 105
    fname =  mev.datum.v                               #line 106

    try:
        f = open (fname)
    except Exception as e:
        f = None
    if f != None:
        data = f.read ()
        if data!= None:
            send (eh, "", data, mev)
        else:
            send (eh, "✗", f"read error on file '{fname}'", mev)
        f.close ()
    else:
        send (eh, "✗", f"open error on file '{fname}'", mev)
                                                       #line 107#line 108#line 109

def ensure_string_datum_instantiate (reg,owner,name,template_data):#line 110
    name_with_id = gensymbol ( "Ensure String Datum")  #line 111
    return make_leaf ( name_with_id, owner, None, ensure_string_datum_handler)#line 112#line 113#line 114

def ensure_string_datum_handler (eh,mev):              #line 115
    if  "string" ==  mev.datum.kind ():                #line 116
        forward ( eh, "", mev)                         #line 117
    else:                                              #line 118
        emev =  str( "*** ensure: type error (expected a string datum) but got ") +  mev.datum #line 119
        send ( eh, "✗", emev, mev)                     #line 120#line 121#line 122#line 123

class Syncfilewrite_Data:
    def __init__ (self,):                              #line 124
        self.filename =  ""                            #line 125#line 126
                                                       #line 127
# temp copy for bootstrap, sends "done“ (error during bootstrap if not wired)#line 128
def syncfilewrite_instantiate (reg,owner,name,template_data):#line 129
    name_with_id = gensymbol ( "syncfilewrite")        #line 130
    inst =  Syncfilewrite_Data ()                      #line 131
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)#line 132#line 133#line 134

def syncfilewrite_handler (eh,mev):                    #line 135
    inst =  eh.instance_data                           #line 136
    if  "filename" ==  mev.port:                       #line 137
        inst.filename =  mev.datum.v                   #line 138
    elif  "input" ==  mev.port:                        #line 139
        contents =  mev.datum.v                        #line 140
        f = open ( inst.filename, "w")                 #line 141
        if  f!= None:                                  #line 142
            f.write ( mev.datum.v)                     #line 143
            f.close ()                                 #line 144
            send ( eh, "done",new_datum_bang (), mev)  #line 145
        else:                                          #line 146
            send ( eh, "✗", str( "open error on file ") +  inst.filename , mev)#line 147#line 148#line 149#line 150#line 151

class StringConcat_Instance_Data:
    def __init__ (self,):                              #line 152
        self.buffer1 =  None                           #line 153
        self.buffer2 =  None                           #line 154#line 155
                                                       #line 156
def stringconcat_instantiate (reg,owner,name,template_data):#line 157
    name_with_id = gensymbol ( "stringconcat")         #line 158
    instp =  StringConcat_Instance_Data ()             #line 159
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)#line 160#line 161#line 162

def stringconcat_handler (eh,mev):                     #line 163
    inst =  eh.instance_data                           #line 164
    if  "1" ==  mev.port:                              #line 165
        inst.buffer1 = clone_string ( mev.datum.v)     #line 166
        maybe_stringconcat ( eh, inst, mev)            #line 167
    elif  "2" ==  mev.port:                            #line 168
        inst.buffer2 = clone_string ( mev.datum.v)     #line 169
        maybe_stringconcat ( eh, inst, mev)            #line 170
    elif  "reset" ==  mev.port:                        #line 171
        inst.buffer1 =  None                           #line 172
        inst.buffer2 =  None                           #line 173
    else:                                              #line 174
        runtime_error ( str( "bad mev.port for stringconcat: ") +  mev.port )#line 175#line 176#line 177#line 178

def maybe_stringconcat (eh,inst,mev):                  #line 179
    if  inst.buffer1!= None and  inst.buffer2!= None:  #line 180
        concatenated_string =  ""                      #line 181
        if  0 == len ( inst.buffer1):                  #line 182
            concatenated_string =  inst.buffer2        #line 183
        elif  0 == len ( inst.buffer2):                #line 184
            concatenated_string =  inst.buffer1        #line 185
        else:                                          #line 186
            concatenated_string =  inst.buffer1+ inst.buffer2#line 187#line 188
        send ( eh, "", concatenated_string, mev)       #line 189
        inst.buffer1 =  None                           #line 190
        inst.buffer2 =  None                           #line 191#line 192#line 193#line 194

#                                                      #line 195#line 196
def string_constant_instantiate (reg,owner,name,template_data):#line 197
    global projectRoot                                 #line 198
    name_with_id = gensymbol ( "strconst")             #line 199
    s =  template_data                                 #line 200
    if  projectRoot!= "":                              #line 201
        s = re.sub ( "_00_",  projectRoot,  s)         #line 202#line 203
    return make_leaf ( name_with_id, owner, s, string_constant_handler)#line 204#line 205#line 206

def string_constant_handler (eh,mev):                  #line 207
    s =  eh.instance_data                              #line 208
    send ( eh, "", s, mev)                             #line 209#line 210#line 211

def fakepipename_instantiate (reg,owner,name,template_data):#line 212
    instance_name = gensymbol ( "fakepipe")            #line 213
    return make_leaf ( instance_name, owner, None, fakepipename_handler)#line 214#line 215#line 216

rand =  0                                              #line 217#line 218
def fakepipename_handler (eh,mev):                     #line 219
    global rand                                        #line 220
    rand =  rand+ 1
    # not very random, but good enough _ ;rand' must be unique within a single run#line 221
    send ( eh, "", str( "/tmp/fakepipe") +  rand , mev)#line 222#line 223#line 224
                                                       #line 225
class Switch1star_Instance_Data:
    def __init__ (self,):                              #line 226
        self.state =  "1"                              #line 227#line 228
                                                       #line 229
def switch1star_instantiate (reg,owner,name,template_data):#line 230
    name_with_id = gensymbol ( "switch1*")             #line 231
    instp =  Switch1star_Instance_Data ()              #line 232
    return make_leaf ( name_with_id, owner, instp, switch1star_handler)#line 233#line 234#line 235

def switch1star_handler (eh,mev):                      #line 236
    inst =  eh.instance_data                           #line 237
    whichOutput =  inst.state                          #line 238
    if  "" ==  mev.port:                               #line 239
        if  "1" ==  whichOutput:                       #line 240
            forward ( eh, "1", mev)                    #line 241
            inst.state =  "*"                          #line 242
        elif  "*" ==  whichOutput:                     #line 243
            forward ( eh, "*", mev)                    #line 244
        else:                                          #line 245
            send ( eh, "✗", "internal error bad state in switch1*", mev)#line 246#line 247
    elif  "reset" ==  mev.port:                        #line 248
        inst.state =  "1"                              #line 249
    else:                                              #line 250
        send ( eh, "✗", "internal error bad mevent for switch1*", mev)#line 251#line 252#line 253#line 254

class StringAccumulator:
    def __init__ (self,):                              #line 255
        self.s =  ""                                   #line 256#line 257
                                                       #line 258
def strcatstar_instantiate (reg,owner,name,template_data):#line 259
    name_with_id = gensymbol ( "String Concat *")      #line 260
    instp =  StringAccumulator ()                      #line 261
    return make_leaf ( name_with_id, owner, instp, strcatstar_handler)#line 262#line 263#line 264

def strcatstar_handler (eh,mev):                       #line 265
    accum =  eh.instance_data                          #line 266
    if  "" ==  mev.port:                               #line 267
        accum.s =  str( accum.s) +  mev.datum.v        #line 268
    elif  "fini" ==  mev.port:                         #line 269
        send ( eh, "", accum.s, mev)                   #line 270
    else:                                              #line 271
        send ( eh, "✗", "internal error bad mevent for String Concat *", mev)#line 272#line 273#line 274#line 275

# all of the the built_in leaves are listed here       #line 276
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 277#line 278
def initialize_stock_components (reg):                 #line 279
    register_component ( reg,mkTemplate ( "1then2", None, deracer_instantiate))#line 280
    register_component ( reg,mkTemplate ( "?A", None, probeA_instantiate))#line 281
    register_component ( reg,mkTemplate ( "?B", None, probeB_instantiate))#line 282
    register_component ( reg,mkTemplate ( "?C", None, probeC_instantiate))#line 283
    register_component ( reg,mkTemplate ( "trash", None, trash_instantiate))#line 284#line 285#line 286
    register_component ( reg,mkTemplate ( "Read Text File", None, low_level_read_text_file_instantiate))#line 287
    register_component ( reg,mkTemplate ( "Ensure String Datum", None, ensure_string_datum_instantiate))#line 288#line 289
    register_component ( reg,mkTemplate ( "syncfilewrite", None, syncfilewrite_instantiate))#line 290
    register_component ( reg,mkTemplate ( "stringconcat", None, stringconcat_instantiate))#line 291
    register_component ( reg,mkTemplate ( "switch1*", None, switch1star_instantiate))#line 292
    register_component ( reg,mkTemplate ( "String Concat *", None, strcatstar_instantiate))#line 293
    # for fakepipe                                     #line 294
    register_component ( reg,mkTemplate ( "fakepipename", None, fakepipename_instantiate))#line 295#line 296#line 297