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
    let s =  mev.datum.v;                              /* line 15 */
    live_update ( "Info",  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.name.toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 23 *//* line 24 *//* line 25 */
}

function shell_out_handler (eh,cmd,mev) {              /* line 26 */
    let s =  mev.datum.v;                              /* line 27 */
    let  ret =  null;                                  /* line 28 */
    let  rc =  null;                                   /* line 29 */
    let  stdout =  null;                               /* line 30 */
    let  stderr =  null;                               /* line 31 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 32 */
    if ( rc ==  0) {                                   /* line 33 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 34 */
    }
    else {                                             /* line 35 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 36 *//* line 37 */
    }                                                  /* line 38 *//* line 39 */
}
