
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
    live_update ( "Info",  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 20 *//* line 21 *//* line 22 */
}

function shell_out_handler (eh,cmd,mev) {              /* line 23 */
    let s =  mev.datum.v;                              /* line 24 */
    let  ret =  null;                                  /* line 25 */
    let  rc =  null;                                   /* line 26 */
    let  stdout =  null;                               /* line 27 */
    let  stderr =  null;                               /* line 28 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 29 */
    if ( rc ==  0) {                                   /* line 30 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 31 */
    }
    else {                                             /* line 32 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 33 *//* line 34 */
    }                                                  /* line 35 *//* line 36 */
}