
/*  this needs to be rewritten to use the low_level "shell_out“ component, this can be done solely as a diagram without using python code here *//* line 1 */
function shell_out_instantiate (reg,owner,name,template_data) {/* line 2 */
    let name_with_id = gensymbol ( "shell_out")        /* line 3 */;
    let cmd =  template_data.split (" ")               /* line 4 */;
    return make_leaf ( name_with_id, owner, cmd, shell_out_handler)/* line 5 */;/* line 6 *//* line 7 */
}

function shell_out_handler (eh,msg) {                  /* line 8 */
    let cmd =  eh.instance_data;                       /* line 9 */
    let s =  msg.datum.v;                              /* line 10 */
    let  ret =  null;                                  /* line 11 */
    let  rc =  null;                                   /* line 12 */
    let  stdout =  null;                               /* line 13 */
    let  stderr =  null;                               /* line 14 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 15 */
    if ( rc ==  0) {                                   /* line 16 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , msg)/* line 17 */
    }
    else {                                             /* line 18 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , msg)/* line 19 *//* line 20 */
    }                                                  /* line 21 *//* line 22 */
}

function generate_shell_components (reg,container_list) {/* line 23 */
    /*  [ */                                           /* line 24 */
    /*      {;file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, *//* line 25 */
    /*      {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []} *//* line 26 */
    /*  ] */                                           /* line 27 */
    if ( null!= container_list) {                      /* line 28 */
      for (let diagram of  container_list) {           /* line 29 */
        /*  loop through every component in the diagram and look for names that start with “$“ or “'“  *//* line 30 */
        /*  {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, *//* line 31 */
        for (let child_descriptor of  diagram [ "children"]) {/* line 32 */
          if (first_char_is ( child_descriptor [ "name"], "$")) {/* line 33 */
            let name =  child_descriptor [ "name"];    /* line 34 */
            let cmd =   name.substring (1) .strip ();  /* line 35 */
            let generated_leaf = mkTemplate ( name, cmd, shell_out_instantiate)/* line 36 */;
            register_component ( reg, generated_leaf)  /* line 37 */
          }
          else if (first_char_is ( child_descriptor [ "name"], "'")) {/* line 38 */
            let name =  child_descriptor [ "name"];    /* line 39 */
            let s =   name.substring (1)               /* line 40 */;
            let generated_leaf = mkTemplate ( name, s, string_constant_instantiate)/* line 41 */;
            register_component_allow_overwriting ( reg, generated_leaf)/* line 42 *//* line 43 */
          }                                            /* line 44 */
        }                                              /* line 45 */
      }                                                /* line 46 */
    }
    return  reg;                                       /* line 47 *//* line 48 *//* line 49 */
}

function first_char (s) {                              /* line 50 */
    return   s[0]                                      /* line 51 */;/* line 52 *//* line 53 */
}

function first_char_is (s,c) {                         /* line 54 */
    return  c == first_char ( s)                       /* line 55 */;/* line 56 *//* line 57 */
}
                                                       /* line 58 */
/*  TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here *//* line 59 */
/*  I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped *//* line 60 *//* line 61 */