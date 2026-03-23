/*  (This used to be called `external` due to historical reasons). This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way.  *//* line 1 *//* line 2 */
function jit_instantiate (reg,owner,name,arg) {        /* line 3 */
    let name_with_id = gensymbol ( name)               /* line 4 */;
    let  inst = make_leaf ( name_with_id, owner, null, arg, handle_jit, null)/* line 5 */;
    let  firstc =  name [ 1];                          /* line 6 */
    if (( firstc ==  "?")) {                           /* line 7 */
      /*  probes get to go to the front of the line  *//* line 8 */
      inst.special =  true;                            /* line 9 *//* line 10 */
    }
    return  inst;                                      /* line 11 *//* line 12 *//* line 13 */
}

function handle_jit (eh,mev) {                         /* line 14 */
    let s =  eh.arg;                                   /* line 15 */
    let  firstc =  s [ 1];                             /* line 16 */
    if ( firstc ==  "$") {                             /* line 17 */
      shell_out_handler ( eh,    s.substring (1) .substring (1) .substring (1) , mev)/* line 18 */
    }
    else if ( firstc ==  "?") {                        /* line 19 */
      probe_handler ( eh,  s.substring (1) , mev)      /* line 20 */
    }
    else {                                             /* line 21 */
      /*  just a string, send it out  */               /* line 22 */
      send ( eh, "",  s.substring (1) , mev)           /* line 23 *//* line 24 */
    }                                                  /* line 25 *//* line 26 */
}

function probe_handler (eh,tag,mev) {                  /* line 27 */
    let s =  mev.datum.v;                              /* line 28 */
    console.error ( "Info" + ": " +  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.name.toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 36 *//* line 37 *//* line 38 */
}

function shell_out_handler (eh,cmd,mev) {              /* line 39 */
    let s =  mev.datum.v;                              /* line 40 */
    let  ret =  null;                                  /* line 41 */
    let  rc =  null;                                   /* line 42 */
    let  stdout =  null;                               /* line 43 */
    let  stderr =  null;                               /* line 44 */
    let  command =  cmd;                               /* line 45 */
    let  pbpRoot = process.env.PBP                     /* line 46 */;
    if ( pbpRoot!= "") {                               /* line 47 */
      command =  command.replaceAll ( "_/",  ( pbpRoot.toString ()+  "/".toString ()) )/* line 50 */;/* line 51 */
    }
    if (( false )) {                                   /* line 52 */
      console.error ( ( "- --- shell-out: ".toString ()+  command.toString ()) );/* line 53 */
                                                       /* line 54 *//* line 55 */
    }

    stdout = execSync(`${ command} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 56 */
    if ( rc ==  0) {                                   /* line 57 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 58 */
    }
    else {                                             /* line 59 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 60 *//* line 61 */
    }                                                  /* line 62 *//* line 63 */
}
