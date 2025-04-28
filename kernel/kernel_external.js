
function handle_external (eh,mev) {                    /* line 1 */
    let s =  eh.arg;                                   /* line 2 */
    let  firstc =  s [ 1];                             /* line 3 */
    if ( firstc ==  "$") {                             /* line 4 */
      shell_out_handler ( eh,    s.substring (1) .substring (1) .substring (1) , mev)/* line 5 */
    }
    else if ( firstc ==  "?") {                        /* line 6 */
      probe_handler ( eh,  s.substring (1) , mev)      /* line 7 */
    }
    else {                                             /* line 8 */
      /*  just a string, send it out  */               /* line 9 */
      send ( eh, "",   s.substring (1) .substring (1) , mev)/* line 10 *//* line 11 */
    }                                                  /* line 12 *//* line 13 */
}

function probe_handler (eh,s,mev) {                    /* line 14 */
    live_update ( "fInfo",  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.name.toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 22 *//* line 23 *//* line 24 */
}

function shell_out_handler (eh,cmd,mev) {              /* line 25 */
    let s =  mev.datum.v;                              /* line 26 */
    let  ret =  null;                                  /* line 27 */
    let  rc =  null;                                   /* line 28 */
    let  stdout =  null;                               /* line 29 */
    let  stderr =  null;                               /* line 30 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 31 */
    if ( rc ==  0) {                                   /* line 32 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 33 */
    }
    else {                                             /* line 34 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 35 *//* line 36 */
    }                                                  /* line 37 *//* line 38 */
}