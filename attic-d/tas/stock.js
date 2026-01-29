
function probeA_instantiate (reg,owner,name,template_data) {/* line 1 */
    let name_with_id = gensymbol ( "?A")               /* line 2 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 3 */;/* line 4 *//* line 5 */
}

function probeB_instantiate (reg,owner,name,template_data) {/* line 6 */
    let name_with_id = gensymbol ( "?B")               /* line 7 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 8 */;/* line 9 *//* line 10 */
}

function probeC_instantiate (reg,owner,name,template_data) {/* line 11 */
    let name_with_id = gensymbol ( "?C")               /* line 12 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 13 */;/* line 14 *//* line 15 */
}

function probe_handler (eh,mev) {                      /* line 16 *//* line 17 */
    let s =  mev.datum.v;                              /* line 18 */
    live_update ( "Info",  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.name.toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 25 *//* line 26 *//* line 27 */
}

function trash_instantiate (reg,owner,name,template_data) {/* line 28 */
    let name_with_id = gensymbol ( "trash")            /* line 29 */;
    return make_leaf ( name_with_id, owner, null, trash_handler)/* line 30 */;/* line 31 *//* line 32 */
}

function trash_handler (eh,mev) {                      /* line 33 */
    /*  to appease dumped_on_floor checker */          /* line 34 *//* line 35 *//* line 36 */
}

class TwoMevents {
  constructor () {                                     /* line 37 */

    this.firstmev =  null;                             /* line 38 */
    this.secondmev =  null;                            /* line 39 *//* line 40 */
  }
}
                                                       /* line 41 */
/*  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } *//* line 42 */
class Deracer_Instance_Data {
  constructor () {                                     /* line 43 */

    this.state =  null;                                /* line 44 */
    this.buffer =  null;                               /* line 45 *//* line 46 */
  }
}
                                                       /* line 47 */
function reclaim_Buffers_from_heap (inst) {            /* line 48 *//* line 49 *//* line 50 *//* line 51 */
}

function deracer_instantiate (reg,owner,name,template_data) {/* line 52 */
    let name_with_id = gensymbol ( "deracer")          /* line 53 */;
    let  inst =  new Deracer_Instance_Data ();         /* line 54 */;
    inst.state =  "idle";                              /* line 55 */
    inst.buffer =  new TwoMevents ();                  /* line 56 */;
    let eh = make_leaf ( name_with_id, owner, inst, deracer_handler)/* line 57 */;
    return  eh;                                        /* line 58 *//* line 59 *//* line 60 */
}

function send_firstmev_then_secondmev (eh,inst) {      /* line 61 */
    forward ( eh, "1", inst.buffer.firstmev)           /* line 62 */
    forward ( eh, "2", inst.buffer.secondmev)          /* line 63 */
    reclaim_Buffers_from_heap ( inst)                  /* line 64 *//* line 65 *//* line 66 */
}

function deracer_handler (eh,mev) {                    /* line 67 */
    let  inst =  eh.instance_data;                     /* line 68 */
    if ( inst.state ==  "idle") {                      /* line 69 */
      if ( "1" ==  mev.port) {                         /* line 70 */
        inst.buffer.firstmev =  mev;                   /* line 71 */
        inst.state =  "waitingForSecondmev";           /* line 72 */
      }
      else if ( "2" ==  mev.port) {                    /* line 73 */
        inst.buffer.secondmev =  mev;                  /* line 74 */
        inst.state =  "waitingForFirstmev";            /* line 75 */
      }
      else {                                           /* line 76 */
        runtime_error ( ( "bad mev.port (case A) for deracer ".toString ()+  mev.port.toString ()) )/* line 77 *//* line 78 */
      }
    }
    else if ( inst.state ==  "waitingForFirstmev") {   /* line 79 */
      if ( "1" ==  mev.port) {                         /* line 80 */
        inst.buffer.firstmev =  mev;                   /* line 81 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 82 */
        inst.state =  "idle";                          /* line 83 */
      }
      else {                                           /* line 84 */
        runtime_error ( ( "bad mev.port (case B) for deracer ".toString ()+  mev.port.toString ()) )/* line 85 *//* line 86 */
      }
    }
    else if ( inst.state ==  "waitingForSecondmev") {  /* line 87 */
      if ( "2" ==  mev.port) {                         /* line 88 */
        inst.buffer.secondmev =  mev;                  /* line 89 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 90 */
        inst.state =  "idle";                          /* line 91 */
      }
      else {                                           /* line 92 */
        runtime_error ( ( "bad mev.port (case C) for deracer ".toString ()+  mev.port.toString ()) )/* line 93 *//* line 94 */
      }
    }
    else {                                             /* line 95 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 96 *//* line 97 */
    }                                                  /* line 98 *//* line 99 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data) {/* line 100 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 101 */;
    return make_leaf ( name_with_id, owner, null, low_level_read_text_file_handler)/* line 102 */;/* line 103 *//* line 104 */
}

function low_level_read_text_file_handler (eh,mev) {   /* line 105 */
    let fname =  mev.datum.v;                          /* line 106 */

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
                                                       /* line 107 *//* line 108 *//* line 109 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data) {/* line 110 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 111 */;
    return make_leaf ( name_with_id, owner, null, ensure_string_datum_handler)/* line 112 */;/* line 113 *//* line 114 */
}

function ensure_string_datum_handler (eh,mev) {        /* line 115 */
    if ( "string" ==  mev.datum.kind ()) {             /* line 116 */
      forward ( eh, "", mev)                           /* line 117 */
    }
    else {                                             /* line 118 */
      let emev =  ( "*** ensure: type error (expected a string datum) but got ".toString ()+  mev.datum.toString ()) /* line 119 */;
      send ( eh, "✗", emev, mev)                       /* line 120 *//* line 121 */
    }                                                  /* line 122 *//* line 123 */
}

class Syncfilewrite_Data {
  constructor () {                                     /* line 124 */

    this.filename =  "";                               /* line 125 *//* line 126 */
  }
}
                                                       /* line 127 */
/*  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) *//* line 128 */
function syncfilewrite_instantiate (reg,owner,name,template_data) {/* line 129 */
    let name_with_id = gensymbol ( "syncfilewrite")    /* line 130 */;
    let inst =  new Syncfilewrite_Data ();             /* line 131 */;
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)/* line 132 */;/* line 133 *//* line 134 */
}

function syncfilewrite_handler (eh,mev) {              /* line 135 */
    let  inst =  eh.instance_data;                     /* line 136 */
    if ( "filename" ==  mev.port) {                    /* line 137 */
      inst.filename =  mev.datum.v;                    /* line 138 */
    }
    else if ( "input" ==  mev.port) {                  /* line 139 */
      let contents =  mev.datum.v;                     /* line 140 */
      let  f = open ( inst.filename, "w")              /* line 141 */;
      if ( f!= null) {                                 /* line 142 */
        f.write ( mev.datum.v)                         /* line 143 */
        f.close ()                                     /* line 144 */
        send ( eh, "done",new_datum_bang (), mev)      /* line 145 */
      }
      else {                                           /* line 146 */
        send ( eh, "✗", ( "open error on file ".toString ()+  inst.filename.toString ()) , mev)/* line 147 *//* line 148 */
      }                                                /* line 149 */
    }                                                  /* line 150 *//* line 151 */
}

class StringConcat_Instance_Data {
  constructor () {                                     /* line 152 */

    this.buffer1 =  null;                              /* line 153 */
    this.buffer2 =  null;                              /* line 154 *//* line 155 */
  }
}
                                                       /* line 156 */
function stringconcat_instantiate (reg,owner,name,template_data) {/* line 157 */
    let name_with_id = gensymbol ( "stringconcat")     /* line 158 */;
    let instp =  new StringConcat_Instance_Data ();    /* line 159 */;
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)/* line 160 */;/* line 161 *//* line 162 */
}

function stringconcat_handler (eh,mev) {               /* line 163 */
    let  inst =  eh.instance_data;                     /* line 164 */
    if ( "1" ==  mev.port) {                           /* line 165 */
      inst.buffer1 = clone_string ( mev.datum.v)       /* line 166 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 167 */
    }
    else if ( "2" ==  mev.port) {                      /* line 168 */
      inst.buffer2 = clone_string ( mev.datum.v)       /* line 169 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 170 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 171 */
      inst.buffer1 =  null;                            /* line 172 */
      inst.buffer2 =  null;                            /* line 173 */
    }
    else {                                             /* line 174 */
      runtime_error ( ( "bad mev.port for stringconcat: ".toString ()+  mev.port.toString ()) )/* line 175 *//* line 176 */
    }                                                  /* line 177 *//* line 178 */
}

function maybe_stringconcat (eh,inst,mev) {            /* line 179 */
    if ((( inst.buffer1!= null) && ( inst.buffer2!= null))) {/* line 180 */
      let  concatenated_string =  "";                  /* line 181 */
      if ( 0 == ( inst.buffer1.length)) {              /* line 182 */
        concatenated_string =  inst.buffer2;           /* line 183 */
      }
      else if ( 0 == ( inst.buffer2.length)) {         /* line 184 */
        concatenated_string =  inst.buffer1;           /* line 185 */
      }
      else {                                           /* line 186 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 187 *//* line 188 */
      }
      send ( eh, "", concatenated_string, mev)         /* line 189 */
      inst.buffer1 =  null;                            /* line 190 */
      inst.buffer2 =  null;                            /* line 191 *//* line 192 */
    }                                                  /* line 193 *//* line 194 */
}

/*  */                                                 /* line 195 *//* line 196 */
function string_constant_instantiate (reg,owner,name,template_data) {/* line 197 *//* line 198 */
    let name_with_id = gensymbol ( "strconst")         /* line 199 */;
    let  s =  template_data;                           /* line 200 */
    if ( projectRoot!= "") {                           /* line 201 */
      s =  s.replaceAll ( "_00_",  projectRoot)        /* line 202 */;/* line 203 */
    }
    return make_leaf ( name_with_id, owner, s, string_constant_handler)/* line 204 */;/* line 205 *//* line 206 */
}

function string_constant_handler (eh,mev) {            /* line 207 */
    let s =  eh.instance_data;                         /* line 208 */
    send ( eh, "", s, mev)                             /* line 209 *//* line 210 *//* line 211 */
}

function fakepipename_instantiate (reg,owner,name,template_data) {/* line 212 */
    let instance_name = gensymbol ( "fakepipe")        /* line 213 */;
    return make_leaf ( instance_name, owner, null, fakepipename_handler)/* line 214 */;/* line 215 *//* line 216 */
}

let  rand =  0;                                        /* line 217 *//* line 218 */
function fakepipename_handler (eh,mev) {               /* line 219 *//* line 220 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ ;rand' must be unique within a single run *//* line 221 */
    send ( eh, "", ( "/tmp/fakepipe".toString ()+  rand.toString ()) , mev)/* line 222 *//* line 223 *//* line 224 */
}
                                                       /* line 225 */
class Switch1star_Instance_Data {
  constructor () {                                     /* line 226 */

    this.state =  "1";                                 /* line 227 *//* line 228 */
  }
}
                                                       /* line 229 */
function switch1star_instantiate (reg,owner,name,template_data) {/* line 230 */
    let name_with_id = gensymbol ( "switch1*")         /* line 231 */;
    let instp =  new Switch1star_Instance_Data ();     /* line 232 */;
    return make_leaf ( name_with_id, owner, instp, switch1star_handler)/* line 233 */;/* line 234 *//* line 235 */
}

function switch1star_handler (eh,mev) {                /* line 236 */
    let  inst =  eh.instance_data;                     /* line 237 */
    let whichOutput =  inst.state;                     /* line 238 */
    if ( "" ==  mev.port) {                            /* line 239 */
      if ( "1" ==  whichOutput) {                      /* line 240 */
        forward ( eh, "1", mev)                        /* line 241 */
        inst.state =  "*";                             /* line 242 */
      }
      else if ( "*" ==  whichOutput) {                 /* line 243 */
        forward ( eh, "*", mev)                        /* line 244 */
      }
      else {                                           /* line 245 */
        send ( eh, "✗", "internal error bad state in switch1*", mev)/* line 246 *//* line 247 */
      }
    }
    else if ( "reset" ==  mev.port) {                  /* line 248 */
      inst.state =  "1";                               /* line 249 */
    }
    else {                                             /* line 250 */
      send ( eh, "✗", "internal error bad mevent for switch1*", mev)/* line 251 *//* line 252 */
    }                                                  /* line 253 *//* line 254 */
}

class StringAccumulator {
  constructor () {                                     /* line 255 */

    this.s =  "";                                      /* line 256 *//* line 257 */
  }
}
                                                       /* line 258 */
function strcatstar_instantiate (reg,owner,name,template_data) {/* line 259 */
    let name_with_id = gensymbol ( "String Concat *")  /* line 260 */;
    let instp =  new StringAccumulator ();             /* line 261 */;
    return make_leaf ( name_with_id, owner, instp, strcatstar_handler)/* line 262 */;/* line 263 *//* line 264 */
}

function strcatstar_handler (eh,mev) {                 /* line 265 */
    let  accum =  eh.instance_data;                    /* line 266 */
    if ( "" ==  mev.port) {                            /* line 267 */
      accum.s =  ( accum.s.toString ()+  mev.datum.v.toString ()) /* line 268 */;
    }
    else if ( "fini" ==  mev.port) {                   /* line 269 */
      send ( eh, "", accum.s, mev)                     /* line 270 */
    }
    else {                                             /* line 271 */
      send ( eh, "✗", "internal error bad mevent for String Concat *", mev)/* line 272 *//* line 273 */
    }                                                  /* line 274 *//* line 275 */
}

/*  all of the the built_in leaves are listed here */  /* line 276 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 277 *//* line 278 */
function initialize_stock_components (reg) {           /* line 279 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 280 */
    register_component ( reg,mkTemplate ( "?A", null, probeA_instantiate))/* line 281 */
    register_component ( reg,mkTemplate ( "?B", null, probeB_instantiate))/* line 282 */
    register_component ( reg,mkTemplate ( "?C", null, probeC_instantiate))/* line 283 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 284 *//* line 285 *//* line 286 */
    register_component ( reg,mkTemplate ( "Read Text File", null, low_level_read_text_file_instantiate))/* line 287 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 288 *//* line 289 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 290 */
    register_component ( reg,mkTemplate ( "stringconcat", null, stringconcat_instantiate))/* line 291 */
    register_component ( reg,mkTemplate ( "switch1*", null, switch1star_instantiate))/* line 292 */
    register_component ( reg,mkTemplate ( "String Concat *", null, strcatstar_instantiate))/* line 293 */
    /*  for fakepipe */                                /* line 294 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 295 *//* line 296 *//* line 297 */
}