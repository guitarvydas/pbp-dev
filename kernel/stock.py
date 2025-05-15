
#line 1
def trash_instantiate (reg,owner,name,template_data,arg):#line 2
    name_with_id = gensymbol ( "trash")                #line 3
    return make_leaf ( name_with_id, owner, None, "", trash_handler)#line 4#line 5#line 6

def trash_handler (eh,mev):                            #line 7
    # to appease dumped_on_floor checker               #line 8
    pass                                               #line 9#line 10

class TwoMevents:
    def __init__ (self,):                              #line 11
        self.firstmev =  None                          #line 12
        self.secondmev =  None                         #line 13#line 14
                                                       #line 15
# Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev }#line 16
class Deracer_Instance_Data:
    def __init__ (self,):                              #line 17
        self.state =  None                             #line 18
        self.buffer =  None                            #line 19#line 20
                                                       #line 21
def reclaim_Buffers_from_heap (inst):                  #line 22
    pass                                               #line 23#line 24#line 25

def deracer_instantiate (reg,owner,name,template_data,arg):#line 26
    name_with_id = gensymbol ( "deracer")              #line 27
    inst =  Deracer_Instance_Data ()                   #line 28
    inst.state =  "idle"                               #line 29
    inst.buffer =  TwoMevents ()                       #line 30
    eh = make_leaf ( name_with_id, owner, inst, "", deracer_handler)#line 31
    return  eh                                         #line 32#line 33#line 34

def send_firstmev_then_secondmev (eh,inst):            #line 35
    forward ( eh, "1", inst.buffer.firstmev)           #line 36
    forward ( eh, "2", inst.buffer.secondmev)          #line 37
    reclaim_Buffers_from_heap ( inst)                  #line 38#line 39#line 40

def deracer_handler (eh,mev):                          #line 41
    inst =  eh.instance_data                           #line 42
    if  inst.state ==  "idle":                         #line 43
        if  "1" ==  mev.port:                          #line 44
            inst.buffer.firstmev =  mev                #line 45
            inst.state =  "waitingForSecondmev"        #line 46
        elif  "2" ==  mev.port:                        #line 47
            inst.buffer.secondmev =  mev               #line 48
            inst.state =  "waitingForFirstmev"         #line 49
        else:                                          #line 50
            runtime_error ( str( "bad mev.port (case A) for deracer ") +  mev.port )#line 51#line 52
    elif  inst.state ==  "waitingForFirstmev":         #line 53
        if  "1" ==  mev.port:                          #line 54
            inst.buffer.firstmev =  mev                #line 55
            send_firstmev_then_secondmev ( eh, inst)   #line 56
            inst.state =  "idle"                       #line 57
        else:                                          #line 58
            runtime_error ( str( "bad mev.port (case B) for deracer ") +  mev.port )#line 59#line 60
    elif  inst.state ==  "waitingForSecondmev":        #line 61
        if  "2" ==  mev.port:                          #line 62
            inst.buffer.secondmev =  mev               #line 63
            send_firstmev_then_secondmev ( eh, inst)   #line 64
            inst.state =  "idle"                       #line 65
        else:                                          #line 66
            runtime_error ( str( "bad mev.port (case C) for deracer ") +  mev.port )#line 67#line 68
    else:                                              #line 69
        runtime_error ( "bad state for deracer {eh.state}")#line 70#line 71#line 72#line 73

def low_level_read_text_file_instantiate (reg,owner,name,template_data,arg):#line 74
    name_with_id = gensymbol ( "Low Level Read Text File")#line 75
    return make_leaf ( name_with_id, owner, None, "", low_level_read_text_file_handler)#line 76#line 77#line 78

def low_level_read_text_file_handler (eh,mev):         #line 79
    fname =  mev.datum.v                               #line 80

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
                                                       #line 81#line 82#line 83

def ensure_string_datum_instantiate (reg,owner,name,template_data,arg):#line 84
    name_with_id = gensymbol ( "Ensure String Datum")  #line 85
    return make_leaf ( name_with_id, owner, None, "", ensure_string_datum_handler)#line 86#line 87#line 88

def ensure_string_datum_handler (eh,mev):              #line 89
    if  "string" ==  mev.datum.kind ():                #line 90
        forward ( eh, "", mev)                         #line 91
    else:                                              #line 92
        emev =  str( "*** ensure: type error (expected a string datum) but got ") +  mev.datum #line 93
        send ( eh, "✗", emev, mev)                     #line 94#line 95#line 96#line 97

class Syncfilewrite_Data:
    def __init__ (self,):                              #line 98
        self.filename =  ""                            #line 99#line 100
                                                       #line 101
# temp copy for bootstrap, sends "done“ (error during bootstrap if not wired)#line 102
def syncfilewrite_instantiate (reg,owner,name,template_data,arg):#line 103
    name_with_id = gensymbol ( "syncfilewrite")        #line 104
    inst =  Syncfilewrite_Data ()                      #line 105
    return make_leaf ( name_with_id, owner, inst, "", syncfilewrite_handler)#line 106#line 107#line 108

def syncfilewrite_handler (eh,mev):                    #line 109
    inst =  eh.instance_data                           #line 110
    if  "filename" ==  mev.port:                       #line 111
        inst.filename =  mev.datum.v                   #line 112
    elif  "input" ==  mev.port:                        #line 113
        contents =  mev.datum.v                        #line 114
        f = open ( inst.filename, "w")                 #line 115
        if  f!= None:                                  #line 116
            f.write ( mev.datum.v)                     #line 117
            f.close ()                                 #line 118
            send ( eh, "done",new_datum_bang (), mev)  #line 119
        else:                                          #line 120
            send ( eh, "✗", str( "open error on file ") +  inst.filename , mev)#line 121#line 122#line 123#line 124#line 125

class StringConcat_Instance_Data:
    def __init__ (self,):                              #line 126
        self.buffer1 =  None                           #line 127
        self.buffer2 =  None                           #line 128#line 129
                                                       #line 130
def stringconcat_instantiate (reg,owner,name,template_data,arg):#line 131
    name_with_id = gensymbol ( "stringconcat")         #line 132
    instp =  StringConcat_Instance_Data ()             #line 133
    return make_leaf ( name_with_id, owner, instp, "", stringconcat_handler)#line 134#line 135#line 136

def stringconcat_handler (eh,mev):                     #line 137
    inst =  eh.instance_data                           #line 138
    if  "1" ==  mev.port:                              #line 139
        inst.buffer1 = clone_string ( mev.datum.v)     #line 140
        maybe_stringconcat ( eh, inst, mev)            #line 141
    elif  "2" ==  mev.port:                            #line 142
        inst.buffer2 = clone_string ( mev.datum.v)     #line 143
        maybe_stringconcat ( eh, inst, mev)            #line 144
    elif  "reset" ==  mev.port:                        #line 145
        inst.buffer1 =  None                           #line 146
        inst.buffer2 =  None                           #line 147
    else:                                              #line 148
        runtime_error ( str( "bad mev.port for stringconcat: ") +  mev.port )#line 149#line 150#line 151#line 152

def maybe_stringconcat (eh,inst,mev):                  #line 153
    if  inst.buffer1!= None and  inst.buffer2!= None:  #line 154
        concatenated_string =  ""                      #line 155
        if  0 == len ( inst.buffer1):                  #line 156
            concatenated_string =  inst.buffer2        #line 157
        elif  0 == len ( inst.buffer2):                #line 158
            concatenated_string =  inst.buffer1        #line 159
        else:                                          #line 160
            concatenated_string =  inst.buffer1+ inst.buffer2#line 161#line 162
        send ( eh, "", concatenated_string, mev)       #line 163
        inst.buffer1 =  None                           #line 164
        inst.buffer2 =  None                           #line 165#line 166#line 167#line 168

#                                                      #line 169#line 170
def string_constant_instantiate (reg,owner,name,template_data,arg):#line 171
    global projectRoot                                 #line 172
    name_with_id = gensymbol ( "strconst")             #line 173
    s =  template_data                                 #line 174
    if  projectRoot!= "":                              #line 175
        s = re.sub ( "_00_",  projectRoot,  s)         #line 176#line 177
    return make_leaf ( name_with_id, owner, s, "", string_constant_handler)#line 178#line 179#line 180

def string_constant_handler (eh,mev):                  #line 181
    s =  eh.instance_data                              #line 182
    send ( eh, "", s, mev)                             #line 183#line 184#line 185

def fakepipename_instantiate (reg,owner,name,template_data,arg):#line 186
    instance_name = gensymbol ( "fakepipe")            #line 187
    return make_leaf ( instance_name, owner, None, "", fakepipename_handler)#line 188#line 189#line 190

rand =  0                                              #line 191#line 192
def fakepipename_handler (eh,mev):                     #line 193
    global rand                                        #line 194
    rand =  rand+ 1
    # not very random, but good enough _ ;rand' must be unique within a single run#line 195
    send ( eh, "", str( "/tmp/fakepipe") +  rand , mev)#line 196#line 197#line 198
                                                       #line 199
class Switch1star_Instance_Data:
    def __init__ (self,):                              #line 200
        self.state =  "1"                              #line 201#line 202
                                                       #line 203
def switch1star_instantiate (reg,owner,name,template_data,arg):#line 204
    name_with_id = gensymbol ( "switch1*")             #line 205
    instp =  Switch1star_Instance_Data ()              #line 206
    return make_leaf ( name_with_id, owner, instp, "", switch1star_handler)#line 207#line 208#line 209

def switch1star_handler (eh,mev):                      #line 210
    inst =  eh.instance_data                           #line 211
    whichOutput =  inst.state                          #line 212
    if  "" ==  mev.port:                               #line 213
        if  "1" ==  whichOutput:                       #line 214
            forward ( eh, "1", mev)                    #line 215
            inst.state =  "*"                          #line 216
        elif  "*" ==  whichOutput:                     #line 217
            forward ( eh, "*", mev)                    #line 218
        else:                                          #line 219
            send ( eh, "✗", "internal error bad state in switch1*", mev)#line 220#line 221
    elif  "reset" ==  mev.port:                        #line 222
        inst.state =  "1"                              #line 223
    else:                                              #line 224
        send ( eh, "✗", "internal error bad mevent for switch1*", mev)#line 225#line 226#line 227#line 228

class StringAccumulator:
    def __init__ (self,):                              #line 229
        self.s =  ""                                   #line 230#line 231
                                                       #line 232
def strcatstar_instantiate (reg,owner,name,template_data,arg):#line 233
    name_with_id = gensymbol ( "String Concat *")      #line 234
    instp =  StringAccumulator ()                      #line 235
    return make_leaf ( name_with_id, owner, instp, "", strcatstar_handler)#line 236#line 237#line 238

def strcatstar_handler (eh,mev):                       #line 239
    accum =  eh.instance_data                          #line 240
    if  "" ==  mev.port:                               #line 241
        accum.s =  str( accum.s) +  mev.datum.v        #line 242
    elif  "fini" ==  mev.port:                         #line 243
        send ( eh, "", accum.s, mev)                   #line 244
    else:                                              #line 245
        send ( eh, "✗", "internal error bad mevent for String Concat *", mev)#line 246#line 247#line 248#line 249

class BlockOnErrorState:
    def __init__ (self,):                              #line 250
        self.hasError =  "no"                          #line 251#line 252
                                                       #line 253
def blockOnError_instantiate (reg,owner,name,template_data):#line 254
    name_with_id = gensymbol ( "blockOnError")         #line 255
    instp =  BlockOnErrorState ()                      #line 256
    return make_leaf ( name_with_id, owner, instp, blockOnError_handler)#line 257#line 258#line 259

def blockOnError_handler (eh,mev):                     #line 260
    inst =  eh.instance_data                           #line 261
    if  "" ==  mev.port:                               #line 262
        if  inst.hasError ==  "no":                    #line 263
            send ( eh, "", mev.datum.v, mev)           #line 264#line 265
    elif  "✗" ==  mev.port:                            #line 266
        inst.hasError =  "yes"                         #line 267
    elif  "reset" ==  mev.port:                        #line 268
        inst.hasError =  "no"                          #line 269#line 270#line 271#line 272

# all of the the built_in leaves are listed here       #line 273
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 274#line 275
def initialize_stock_components (reg):                 #line 276
    register_component ( reg,mkTemplate ( "1then2", None, deracer_instantiate))#line 277
    register_component ( reg,mkTemplate ( "trash", None, trash_instantiate))#line 278
    register_component ( reg,mkTemplate ( "blockOnError", None, blockOnError_instantiate))#line 279#line 280#line 281
    register_component ( reg,mkTemplate ( "Read Text File", None, low_level_read_text_file_instantiate))#line 282
    register_component ( reg,mkTemplate ( "Ensure String Datum", None, ensure_string_datum_instantiate))#line 283#line 284
    register_component ( reg,mkTemplate ( "syncfilewrite", None, syncfilewrite_instantiate))#line 285
    register_component ( reg,mkTemplate ( "stringconcat", None, stringconcat_instantiate))#line 286
    register_component ( reg,mkTemplate ( "switch1*", None, switch1star_instantiate))#line 287
    register_component ( reg,mkTemplate ( "String Concat *", None, strcatstar_instantiate))#line 288
    # for fakepipe                                     #line 289
    register_component ( reg,mkTemplate ( "fakepipename", None, fakepipename_instantiate))#line 290#line 291#line 292