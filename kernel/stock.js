
function probe_instantiate (reg,owner,name,template_data) {/* line 1 */
    let name_with_id = gensymbol ( "?A")               /* line 2 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 3 */;/* line 4 *//* line 5 */
}

function probe_handler (eh,mev) {                      /* line 6 *//* line 7 */
    let s =  mev.datum.v;                              /* line 8 */
    live_update ( "Info",  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.arg.toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 15 *//* line 16 *//* line 17 */
}

function trash_instantiate (reg,owner,name,template_data) {/* line 18 */
    let name_with_id = gensymbol ( "trash")            /* line 19 */;
    return make_leaf ( name_with_id, owner, null, trash_handler)/* line 20 */;/* line 21 *//* line 22 */
}

function trash_handler (eh,mev) {                      /* line 23 */
    /*  to appease dumped_on_floor checker */          /* line 24 *//* line 25 *//* line 26 */
}

class TwoMevents {
  constructor () {                                     /* line 27 */

    this.firstmev =  null;                             /* line 28 */
    this.secondmev =  null;                            /* line 29 *//* line 30 */
  }
}
                                                       /* line 31 */
/*  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } *//* line 32 */
class Deracer_Instance_Data {
  constructor () {                                     /* line 33 */

    this.state =  null;                                /* line 34 */
    this.buffer =  null;                               /* line 35 *//* line 36 */
  }
}
                                                       /* line 37 */
function reclaim_Buffers_from_heap (inst) {            /* line 38 *//* line 39 *//* line 40 *//* line 41 */
}

function deracer_instantiate (reg,owner,name,template_data) {/* line 42 */
    let name_with_id = gensymbol ( "deracer")          /* line 43 */;
    let  inst =  new Deracer_Instance_Data ();         /* line 44 */;
    inst.state =  "idle";                              /* line 45 */
    inst.buffer =  new TwoMevents ();                  /* line 46 */;
    let eh = make_leaf ( name_with_id, owner, inst, deracer_handler)/* line 47 */;
    return  eh;                                        /* line 48 *//* line 49 *//* line 50 */
}

function send_firstmev_then_secondmev (eh,inst) {      /* line 51 */
    forward ( eh, "1", inst.buffer.firstmev)           /* line 52 */
    forward ( eh, "2", inst.buffer.secondmev)          /* line 53 */
    reclaim_Buffers_from_heap ( inst)                  /* line 54 *//* line 55 *//* line 56 */
}

function deracer_handler (eh,mev) {                    /* line 57 */
    let  inst =  eh.instance_data;                     /* line 58 */
    if ( inst.state ==  "idle") {                      /* line 59 */
      if ( "1" ==  mev.port) {                         /* line 60 */
        inst.buffer.firstmev =  mev;                   /* line 61 */
        inst.state =  "waitingForSecondmev";           /* line 62 */
      }
      else if ( "2" ==  mev.port) {                    /* line 63 */
        inst.buffer.secondmev =  mev;                  /* line 64 */
        inst.state =  "waitingForFirstmev";            /* line 65 */
      }
      else {                                           /* line 66 */
        runtime_error ( ( "bad mev.port (case A) for deracer ".toString ()+  mev.port.toString ()) )/* line 67 *//* line 68 */
      }
    }
    else if ( inst.state ==  "waitingForFirstmev") {   /* line 69 */
      if ( "1" ==  mev.port) {                         /* line 70 */
        inst.buffer.firstmev =  mev;                   /* line 71 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 72 */
        inst.state =  "idle";                          /* line 73 */
      }
      else {                                           /* line 74 */
        runtime_error ( ( "bad mev.port (case B) for deracer ".toString ()+  mev.port.toString ()) )/* line 75 *//* line 76 */
      }
    }
    else if ( inst.state ==  "waitingForSecondmev") {  /* line 77 */
      if ( "2" ==  mev.port) {                         /* line 78 */
        inst.buffer.secondmev =  mev;                  /* line 79 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 80 */
        inst.state =  "idle";                          /* line 81 */
      }
      else {                                           /* line 82 */
        runtime_error ( ( "bad mev.port (case C) for deracer ".toString ()+  mev.port.toString ()) )/* line 83 *//* line 84 */
      }
    }
    else {                                             /* line 85 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 86 *//* line 87 */
    }                                                  /* line 88 *//* line 89 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data) {/* line 90 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 91 */;
    return make_leaf ( name_with_id, owner, null, low_level_read_text_file_handler)/* line 92 */;/* line 93 *//* line 94 */
}

function low_level_read_text_file_handler (eh,mev) {   /* line 95 */
    let fname =  mev.datum.v;                          /* line 96 */

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
                                                       /* line 97 *//* line 98 *//* line 99 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data) {/* line 100 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 101 */;
    return make_leaf ( name_with_id, owner, null, ensure_string_datum_handler)/* line 102 */;/* line 103 *//* line 104 */
}

function ensure_string_datum_handler (eh,mev) {        /* line 105 */
    if ( "string" ==  mev.datum.kind ()) {             /* line 106 */
      forward ( eh, "", mev)                           /* line 107 */
    }
    else {                                             /* line 108 */
      let emev =  ( "*** ensure: type error (expected a string datum) but got ".toString ()+  mev.datum.toString ()) /* line 109 */;
      send ( eh, "✗", emev, mev)                       /* line 110 *//* line 111 */
    }                                                  /* line 112 *//* line 113 */
}

class Syncfilewrite_Data {
  constructor () {                                     /* line 114 */

    this.filename =  "";                               /* line 115 *//* line 116 */
  }
}
                                                       /* line 117 */
/*  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) *//* line 118 */
function syncfilewrite_instantiate (reg,owner,name,template_data) {/* line 119 */
    let name_with_id = gensymbol ( "syncfilewrite")    /* line 120 */;
    let inst =  new Syncfilewrite_Data ();             /* line 121 */;
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)/* line 122 */;/* line 123 *//* line 124 */
}

function syncfilewrite_handler (eh,mev) {              /* line 125 */
    let  inst =  eh.instance_data;                     /* line 126 */
    if ( "filename" ==  mev.port) {                    /* line 127 */
      inst.filename =  mev.datum.v;                    /* line 128 */
    }
    else if ( "input" ==  mev.port) {                  /* line 129 */
      let contents =  mev.datum.v;                     /* line 130 */
      let  f = open ( inst.filename, "w")              /* line 131 */;
      if ( f!= null) {                                 /* line 132 */
        f.write ( mev.datum.v)                         /* line 133 */
        f.close ()                                     /* line 134 */
        send ( eh, "done",new_datum_bang (), mev)      /* line 135 */
      }
      else {                                           /* line 136 */
        send ( eh, "✗", ( "open error on file ".toString ()+  inst.filename.toString ()) , mev)/* line 137 *//* line 138 */
      }                                                /* line 139 */
    }                                                  /* line 140 *//* line 141 */
}

class StringConcat_Instance_Data {
  constructor () {                                     /* line 142 */

    this.buffer1 =  null;                              /* line 143 */
    this.buffer2 =  null;                              /* line 144 *//* line 145 */
  }
}
                                                       /* line 146 */
function stringconcat_instantiate (reg,owner,name,template_data) {/* line 147 */
    let name_with_id = gensymbol ( "stringconcat")     /* line 148 */;
    let instp =  new StringConcat_Instance_Data ();    /* line 149 */;
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)/* line 150 */;/* line 151 *//* line 152 */
}

function stringconcat_handler (eh,mev) {               /* line 153 */
    let  inst =  eh.instance_data;                     /* line 154 */
    if ( "1" ==  mev.port) {                           /* line 155 */
      inst.buffer1 = clone_string ( mev.datum.v)       /* line 156 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 157 */
    }
    else if ( "2" ==  mev.port) {                      /* line 158 */
      inst.buffer2 = clone_string ( mev.datum.v)       /* line 159 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 160 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 161 */
      inst.buffer1 =  null;                            /* line 162 */
      inst.buffer2 =  null;                            /* line 163 */
    }
    else {                                             /* line 164 */
      runtime_error ( ( "bad mev.port for stringconcat: ".toString ()+  mev.port.toString ()) )/* line 165 *//* line 166 */
    }                                                  /* line 167 *//* line 168 */
}

function maybe_stringconcat (eh,inst,mev) {            /* line 169 */
    if ((( inst.buffer1!= null) && ( inst.buffer2!= null))) {/* line 170 */
      let  concatenated_string =  "";                  /* line 171 */
      if ( 0 == ( inst.buffer1.length)) {              /* line 172 */
        concatenated_string =  inst.buffer2;           /* line 173 */
      }
      else if ( 0 == ( inst.buffer2.length)) {         /* line 174 */
        concatenated_string =  inst.buffer1;           /* line 175 */
      }
      else {                                           /* line 176 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 177 *//* line 178 */
      }
      send ( eh, "", concatenated_string, mev)         /* line 179 */
      inst.buffer1 =  null;                            /* line 180 */
      inst.buffer2 =  null;                            /* line 181 *//* line 182 */
    }                                                  /* line 183 *//* line 184 */
}

/*  */                                                 /* line 185 *//* line 186 */
function string_constant_instantiate (reg,owner,name,template_data) {/* line 187 *//* line 188 */
    let name_with_id = gensymbol ( "strconst")         /* line 189 */;
    let  s =  template_data;                           /* line 190 */
    if ( projectRoot!= "") {                           /* line 191 */
      s =  s.replaceAll ( "_00_",  projectRoot)        /* line 192 */;/* line 193 */
    }
    return make_leaf ( name_with_id, owner, s, string_constant_handler)/* line 194 */;/* line 195 *//* line 196 */
}

function string_constant_handler (eh,mev) {            /* line 197 */
    let s =  eh.instance_data;                         /* line 198 */
    send ( eh, "", s, mev)                             /* line 199 *//* line 200 *//* line 201 */
}

function fakepipename_instantiate (reg,owner,name,template_data) {/* line 202 */
    let instance_name = gensymbol ( "fakepipe")        /* line 203 */;
    return make_leaf ( instance_name, owner, null, fakepipename_handler)/* line 204 */;/* line 205 *//* line 206 */
}

let  rand =  0;                                        /* line 207 *//* line 208 */
function fakepipename_handler (eh,mev) {               /* line 209 *//* line 210 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ ;rand' must be unique within a single run *//* line 211 */
    send ( eh, "", ( "/tmp/fakepipe".toString ()+  rand.toString ()) , mev)/* line 212 *//* line 213 *//* line 214 */
}
                                                       /* line 215 */
class Switch1star_Instance_Data {
  constructor () {                                     /* line 216 */

    this.state =  "1";                                 /* line 217 *//* line 218 */
  }
}
                                                       /* line 219 */
function switch1star_instantiate (reg,owner,name,template_data) {/* line 220 */
    let name_with_id = gensymbol ( "switch1*")         /* line 221 */;
    let instp =  new Switch1star_Instance_Data ();     /* line 222 */;
    return make_leaf ( name_with_id, owner, instp, switch1star_handler)/* line 223 */;/* line 224 *//* line 225 */
}

function switch1star_handler (eh,mev) {                /* line 226 */
    let  inst =  eh.instance_data;                     /* line 227 */
    let whichOutput =  inst.state;                     /* line 228 */
    if ( "" ==  mev.port) {                            /* line 229 */
      if ( "1" ==  whichOutput) {                      /* line 230 */
        forward ( eh, "1", mev)                        /* line 231 */
        inst.state =  "*";                             /* line 232 */
      }
      else if ( "*" ==  whichOutput) {                 /* line 233 */
        forward ( eh, "*", mev)                        /* line 234 */
      }
      else {                                           /* line 235 */
        send ( eh, "✗", "internal error bad state in switch1*", mev)/* line 236 *//* line 237 */
      }
    }
    else if ( "reset" ==  mev.port) {                  /* line 238 */
      inst.state =  "1";                               /* line 239 */
    }
    else {                                             /* line 240 */
      send ( eh, "✗", "internal error bad mevent for switch1*", mev)/* line 241 *//* line 242 */
    }                                                  /* line 243 *//* line 244 */
}

class StringAccumulator {
  constructor () {                                     /* line 245 */

    this.s =  "";                                      /* line 246 *//* line 247 */
  }
}
                                                       /* line 248 */
function strcatstar_instantiate (reg,owner,name,template_data) {/* line 249 */
    let name_with_id = gensymbol ( "String Concat *")  /* line 250 */;
    let instp =  new StringAccumulator ();             /* line 251 */;
    return make_leaf ( name_with_id, owner, instp, strcatstar_handler)/* line 252 */;/* line 253 *//* line 254 */
}

function strcatstar_handler (eh,mev) {                 /* line 255 */
    let  accum =  eh.instance_data;                    /* line 256 */
    if ( "" ==  mev.port) {                            /* line 257 */
      accum.s =  ( accum.s.toString ()+  mev.datum.v.toString ()) /* line 258 */;
    }
    else if ( "fini" ==  mev.port) {                   /* line 259 */
      send ( eh, "", accum.s, mev)                     /* line 260 */
    }
    else {                                             /* line 261 */
      send ( eh, "✗", "internal error bad mevent for String Concat *", mev)/* line 262 *//* line 263 */
    }                                                  /* line 264 *//* line 265 */
}

/*  all of the the built_in leaves are listed here */  /* line 266 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 267 *//* line 268 */
function initialize_stock_components (reg) {           /* line 269 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 270 */
    register_component ( reg,mkTemplate ( "?", null, probe_instantiate))/* line 271 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 272 *//* line 273 *//* line 274 */
    register_component ( reg,mkTemplate ( "Read Text File", null, low_level_read_text_file_instantiate))/* line 275 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 276 *//* line 277 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 278 */
    register_component ( reg,mkTemplate ( "stringconcat", null, stringconcat_instantiate))/* line 279 */
    register_component ( reg,mkTemplate ( "switch1*", null, switch1star_instantiate))/* line 280 */
    register_component ( reg,mkTemplate ( "String Concat *", null strcatstar_instantiate))/* line 281 */
    /*  for fakepipe */                                /* line 282 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 283 *//* line 284 *//* line 285 */
}