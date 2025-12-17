/* line 1 */
function trash_instantiate (reg,owner,name,template_data,arg) {/* line 2 */
    let name_with_id = gensymbol ( "trash")            /* line 3 */;
    return make_leaf ( name_with_id, owner, null, "", trash_handler)/* line 4 */;/* line 5 *//* line 6 */
}

function trash_handler (eh,mev) {                      /* line 7 */
    /*  to appease dumped_on_floor checker */          /* line 8 *//* line 9 *//* line 10 */
}

class TwoMevents {
  constructor () {                                     /* line 11 */

    this.firstmev =  null;                             /* line 12 */
    this.secondmev =  null;                            /* line 13 *//* line 14 */
  }
}
                                                       /* line 15 */
/*  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } *//* line 16 */
class Deracer_Instance_Data {
  constructor () {                                     /* line 17 */

    this.state =  null;                                /* line 18 */
    this.buffer =  null;                               /* line 19 *//* line 20 */
  }
}
                                                       /* line 21 */
function reclaim_Buffers_from_heap (inst) {            /* line 22 *//* line 23 *//* line 24 *//* line 25 */
}

function deracer_instantiate (reg,owner,name,template_data,arg) {/* line 26 */
    let name_with_id = gensymbol ( "deracer")          /* line 27 */;
    let  inst =  new Deracer_Instance_Data ();         /* line 28 */;
    inst.state =  "idle";                              /* line 29 */
    inst.buffer =  new TwoMevents ();                  /* line 30 */;
    let eh = make_leaf ( name_with_id, owner, inst, "", deracer_handler)/* line 31 */;
    return  eh;                                        /* line 32 *//* line 33 *//* line 34 */
}

function send_firstmev_then_secondmev (eh,inst) {      /* line 35 */
    forward ( eh, "1", inst.buffer.firstmev)           /* line 36 */
    forward ( eh, "2", inst.buffer.secondmev)          /* line 37 */
    reclaim_Buffers_from_heap ( inst)                  /* line 38 *//* line 39 *//* line 40 */
}

function deracer_handler (eh,mev) {                    /* line 41 */
    let  inst =  eh.instance_data;                     /* line 42 */
    if ( inst.state ==  "idle") {                      /* line 43 */
      if ( "1" ==  mev.port) {                         /* line 44 */
        inst.buffer.firstmev =  mev;                   /* line 45 */
        inst.state =  "waitingForSecondmev";           /* line 46 */
      }
      else if ( "2" ==  mev.port) {                    /* line 47 */
        inst.buffer.secondmev =  mev;                  /* line 48 */
        inst.state =  "waitingForFirstmev";            /* line 49 */
      }
      else {                                           /* line 50 */
        runtime_error ( ( "bad mev.port (case A) for deracer ".toString ()+  mev.port.toString ()) )/* line 51 *//* line 52 */
      }
    }
    else if ( inst.state ==  "waitingForFirstmev") {   /* line 53 */
      if ( "1" ==  mev.port) {                         /* line 54 */
        inst.buffer.firstmev =  mev;                   /* line 55 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 56 */
        inst.state =  "idle";                          /* line 57 */
      }
      else {                                           /* line 58 */
        runtime_error ( ( "bad mev.port (case B) for deracer ".toString ()+  mev.port.toString ()) )/* line 59 *//* line 60 */
      }
    }
    else if ( inst.state ==  "waitingForSecondmev") {  /* line 61 */
      if ( "2" ==  mev.port) {                         /* line 62 */
        inst.buffer.secondmev =  mev;                  /* line 63 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 64 */
        inst.state =  "idle";                          /* line 65 */
      }
      else {                                           /* line 66 */
        runtime_error ( ( "bad mev.port (case C) for deracer ".toString ()+  mev.port.toString ()) )/* line 67 *//* line 68 */
      }
    }
    else {                                             /* line 69 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 70 *//* line 71 */
    }                                                  /* line 72 *//* line 73 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data,arg) {/* line 74 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 75 */;
    return make_leaf ( name_with_id, owner, null, "", low_level_read_text_file_handler)/* line 76 */;/* line 77 *//* line 78 */
}

function low_level_read_text_file_handler (eh,mev) {   /* line 79 */
    let fname =  mev.datum.v;                          /* line 80 */

    if (fname == "0") {
    data = fs.readFileSync (0, { encoding: 'utf8'});
    } else {
    data = fs.readFileSync (fname, { encoding: 'utf8'});
    }
    if (data) {
      send_string (eh, "", data, mev);
    } else {
      send_string (eh, "✗", `read error on file '${fname}'`, mev);
    }
                                                       /* line 81 *//* line 82 *//* line 83 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data,arg) {/* line 84 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 85 */;
    return make_leaf ( name_with_id, owner, null, "", ensure_string_datum_handler)/* line 86 */;/* line 87 *//* line 88 */
}

function ensure_string_datum_handler (eh,mev) {        /* line 89 */
    if ( "string" ==  mev.datum.kind ()) {             /* line 90 */
      forward ( eh, "", mev)                           /* line 91 */
    }
    else {                                             /* line 92 */
      let emev =  ( "*** ensure: type error (expected a string datum) but got ".toString ()+  mev.datum.toString ()) /* line 93 */;
      send ( eh, "✗", emev, mev)                       /* line 94 *//* line 95 */
    }                                                  /* line 96 *//* line 97 */
}

class Syncfilewrite_Data {
  constructor () {                                     /* line 98 */

    this.filename =  "";                               /* line 99 *//* line 100 */
  }
}
                                                       /* line 101 */
/*  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) *//* line 102 */
function syncfilewrite_instantiate (reg,owner,name,template_data,arg) {/* line 103 */
    let name_with_id = gensymbol ( "syncfilewrite")    /* line 104 */;
    let inst =  new Syncfilewrite_Data ();             /* line 105 */;
    return make_leaf ( name_with_id, owner, inst, "", syncfilewrite_handler)/* line 106 */;/* line 107 *//* line 108 */
}

function syncfilewrite_handler (eh,mev) {              /* line 109 */
    let  inst =  eh.instance_data;                     /* line 110 */
    if ( "filename" ==  mev.port) {                    /* line 111 */
      inst.filename =  mev.datum.v;                    /* line 112 */
    }
    else if ( "input" ==  mev.port) {                  /* line 113 */
      let contents =  mev.datum.v;                     /* line 114 */
      let  f = open ( inst.filename, "w")              /* line 115 */;
      if ( f!= null) {                                 /* line 116 */
        f.write ( mev.datum.v)                         /* line 117 */
        f.close ()                                     /* line 118 */
        send ( eh, "done",new_datum_bang (), mev)      /* line 119 */
      }
      else {                                           /* line 120 */
        send ( eh, "✗", ( "open error on file ".toString ()+  inst.filename.toString ()) , mev)/* line 121 *//* line 122 */
      }                                                /* line 123 */
    }                                                  /* line 124 *//* line 125 */
}

class StringConcat_Instance_Data {
  constructor () {                                     /* line 126 */

    this.buffer1 =  null;                              /* line 127 */
    this.buffer2 =  null;                              /* line 128 *//* line 129 */
  }
}
                                                       /* line 130 */
function stringconcat_instantiate (reg,owner,name,template_data,arg) {/* line 131 */
    let name_with_id = gensymbol ( "stringconcat")     /* line 132 */;
    let instp =  new StringConcat_Instance_Data ();    /* line 133 */;
    return make_leaf ( name_with_id, owner, instp, "", stringconcat_handler)/* line 134 */;/* line 135 *//* line 136 */
}

function stringconcat_handler (eh,mev) {               /* line 137 */
    let  inst =  eh.instance_data;                     /* line 138 */
    if ( "1" ==  mev.port) {                           /* line 139 */
      inst.buffer1 = clone_string ( mev.datum.v)       /* line 140 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 141 */
    }
    else if ( "2" ==  mev.port) {                      /* line 142 */
      inst.buffer2 = clone_string ( mev.datum.v)       /* line 143 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 144 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 145 */
      inst.buffer1 =  null;                            /* line 146 */
      inst.buffer2 =  null;                            /* line 147 */
    }
    else {                                             /* line 148 */
      runtime_error ( ( "bad mev.port for stringconcat: ".toString ()+  mev.port.toString ()) )/* line 149 *//* line 150 */
    }                                                  /* line 151 *//* line 152 */
}

function maybe_stringconcat (eh,inst,mev) {            /* line 153 */
    if ((( inst.buffer1!= null) && ( inst.buffer2!= null))) {/* line 154 */
      let  concatenated_string =  "";                  /* line 155 */
      if ( 0 == ( inst.buffer1.length)) {              /* line 156 */
        concatenated_string =  inst.buffer2;           /* line 157 */
      }
      else if ( 0 == ( inst.buffer2.length)) {         /* line 158 */
        concatenated_string =  inst.buffer1;           /* line 159 */
      }
      else {                                           /* line 160 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 161 *//* line 162 */
      }
      send ( eh, "", concatenated_string, mev)         /* line 163 */
      inst.buffer1 =  null;                            /* line 164 */
      inst.buffer2 =  null;                            /* line 165 *//* line 166 */
    }                                                  /* line 167 *//* line 168 */
}

/*  */                                                 /* line 169 *//* line 170 */
function string_constant_instantiate (reg,owner,name,template_data,arg) {/* line 171 *//* line 172 */
    let name_with_id = gensymbol ( "strconst")         /* line 173 */;
    let  s =  template_data;                           /* line 174 */
    if ( projectRoot!= "") {                           /* line 175 */
      s =  s.replaceAll ( "_00_",  projectRoot)        /* line 176 */;/* line 177 */
    }
    return make_leaf ( name_with_id, owner, s, "", string_constant_handler)/* line 178 */;/* line 179 *//* line 180 */
}

function string_constant_handler (eh,mev) {            /* line 181 */
    let s =  eh.instance_data;                         /* line 182 */
    send ( eh, "", s, mev)                             /* line 183 *//* line 184 *//* line 185 */
}

function fakepipename_instantiate (reg,owner,name,template_data,arg) {/* line 186 */
    let instance_name = gensymbol ( "fakepipe")        /* line 187 */;
    return make_leaf ( instance_name, owner, null, "", fakepipename_handler)/* line 188 */;/* line 189 *//* line 190 */
}

let  rand =  0;                                        /* line 191 *//* line 192 */
function fakepipename_handler (eh,mev) {               /* line 193 *//* line 194 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ ;rand' must be unique within a single run *//* line 195 */
    send ( eh, "", ( "/tmp/fakepipe".toString ()+  rand.toString ()) , mev)/* line 196 *//* line 197 *//* line 198 */
}
                                                       /* line 199 */
class Switch1star_Instance_Data {
  constructor () {                                     /* line 200 */

    this.state =  "1";                                 /* line 201 *//* line 202 */
  }
}
                                                       /* line 203 */
function switch1star_instantiate (reg,owner,name,template_data,arg) {/* line 204 */
    let name_with_id = gensymbol ( "switch1*")         /* line 205 */;
    let instp =  new Switch1star_Instance_Data ();     /* line 206 */;
    return make_leaf ( name_with_id, owner, instp, "", switch1star_handler)/* line 207 */;/* line 208 *//* line 209 */
}

function switch1star_handler (eh,mev) {                /* line 210 */
    let  inst =  eh.instance_data;                     /* line 211 */
    let whichOutput =  inst.state;                     /* line 212 */
    if ( "" ==  mev.port) {                            /* line 213 */
      if ( "1" ==  whichOutput) {                      /* line 214 */
        forward ( eh, "1", mev)                        /* line 215 */
        inst.state =  "*";                             /* line 216 */
      }
      else if ( "*" ==  whichOutput) {                 /* line 217 */
        forward ( eh, "*", mev)                        /* line 218 */
      }
      else {                                           /* line 219 */
        send ( eh, "✗", "internal error bad state in switch1*", mev)/* line 220 *//* line 221 */
      }
    }
    else if ( "reset" ==  mev.port) {                  /* line 222 */
      inst.state =  "1";                               /* line 223 */
    }
    else {                                             /* line 224 */
      send ( eh, "✗", "internal error bad mevent for switch1*", mev)/* line 225 *//* line 226 */
    }                                                  /* line 227 *//* line 228 */
}

class StringAccumulator {
  constructor () {                                     /* line 229 */

    this.s =  "";                                      /* line 230 *//* line 231 */
  }
}
                                                       /* line 232 */
function strcatstar_instantiate (reg,owner,name,template_data,arg) {/* line 233 */
    let name_with_id = gensymbol ( "String Concat *")  /* line 234 */;
    let instp =  new StringAccumulator ();             /* line 235 */;
    return make_leaf ( name_with_id, owner, instp, "", strcatstar_handler)/* line 236 */;/* line 237 *//* line 238 */
}

function strcatstar_handler (eh,mev) {                 /* line 239 */
    let  accum =  eh.instance_data;                    /* line 240 */
    if ( "" ==  mev.port) {                            /* line 241 */
      accum.s =  ( accum.s.toString ()+  mev.datum.v.toString ()) /* line 242 */;
    }
    else if ( "fini" ==  mev.port) {                   /* line 243 */
      send ( eh, "", accum.s, mev)                     /* line 244 */
    }
    else {                                             /* line 245 */
      send ( eh, "✗", "internal error bad mevent for String Concat *", mev)/* line 246 *//* line 247 */
    }                                                  /* line 248 *//* line 249 */
}

class BlockOnErrorState {
  constructor () {                                     /* line 250 */

    this.hasError =  "no";                             /* line 251 *//* line 252 */
  }
}
                                                       /* line 253 */
function blockOnError_instantiate (reg,owner,name,template_data) {/* line 254 */
    let name_with_id = gensymbol ( "blockOnError")     /* line 255 */;
    let instp =  new BlockOnErrorState ();             /* line 256 */;
    return make_leaf ( name_with_id, owner, instp, blockOnError_handler)/* line 257 */;/* line 258 *//* line 259 */
}

function blockOnError_handler (eh,mev) {               /* line 260 */
    let  inst =  eh.instance_data;                     /* line 261 */
    if ( "" ==  mev.port) {                            /* line 262 */
      if ( inst.hasError ==  "no") {                   /* line 263 */
        send ( eh, "", mev.datum.v, mev)               /* line 264 *//* line 265 */
      }
    }
    else if ( "✗" ==  mev.port) {                      /* line 266 */
      inst.hasError =  "yes";                          /* line 267 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 268 */
      inst.hasError =  "no";                           /* line 269 *//* line 270 */
    }                                                  /* line 271 *//* line 272 */
}

/*  all of the the built_in leaves are listed here */  /* line 273 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 274 *//* line 275 */
function initialize_stock_components (reg) {           /* line 276 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 277 */
    register_component ( reg,mkTemplate ( "1→2", null, deracer_instantiate))/* line 278 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 279 */
    register_component ( reg,mkTemplate ( "blockOnError", null, blockOnError_instantiate))/* line 280 *//* line 281 *//* line 282 */
    register_component ( reg,mkTemplate ( "Read Text File", null, low_level_read_text_file_instantiate))/* line 283 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 284 *//* line 285 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 286 */
    register_component ( reg,mkTemplate ( "String Concat", null, stringconcat_instantiate))/* line 287 */
    register_component ( reg,mkTemplate ( "switch1*", null, switch1star_instantiate))/* line 288 */
    register_component ( reg,mkTemplate ( "String Concat *", null, strcatstar_instantiate))/* line 289 */
    /*  for fakepipe */                                /* line 290 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 291 *//* line 292 *//* line 293 */
}
