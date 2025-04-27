
function handle_external (s,eh,mev) {                  /* line 1 */
    firstc ==  s [ 1]                                  /* line 2 */
    if ( firstc ==  "$") {                             /* line 3 */
      shell_out_handler ( eh,   s.substring (1) .substring (1) , mev)/* line 4 */
    }
    else if ( firstc ==  "?") {                        /* line 5 */
      probe_handler ( eh,  s.substring (1) , mev)      /* line 6 */
    }
    else {                                             /* line 7 */
      /*  just a string, send it out  */               /* line 8 */
      send ( eh, "",   s.substring (1) .substring (1) , msg)/* line 9 *//* line 10 */
    }                                                  /* line 11 *//* line 12 */
}

function probe_handler (eh,s,mev) {                    /* line 13 */
    live_update ( "Info",  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 19 *//* line 20 *//* line 21 */
}

function shell_out_handler (eh,cmd,msg) {              /* line 22 */
    let s =  msg.datum.v;                              /* line 23 */
    let  ret =  null;                                  /* line 24 */
    let  rc =  null;                                   /* line 25 */
    let  stdout =  null;                               /* line 26 */
    let  stderr =  null;                               /* line 27 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 28 */
    if ( rc ==  0) {                                   /* line 29 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , msg)/* line 30 */
    }
    else {                                             /* line 31 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , msg)/* line 32 *//* line 33 */
    }                                                  /* line 34 *//* line 35 */
}