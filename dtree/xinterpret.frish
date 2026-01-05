if (found) {
    if (%inCompilationState ) {
        if (foundImmediate) {
            %funcall exec (xt)
        } else {
            %funcall compile (xt)
        }
    } else {
        %funcall exec (xt)
    }
} else {
    if (%inCompilationState ) {
        if (%isInteger (word)) {
            %funcall compileInteger (word)
        } else {
            if (%isFloat (word)) {
                %funcall compileFloat (word)
            } else {
                %funcall error (word)
            }
        }
    } else {
        if (%isInteger (word)) {
            %funcall pushInt (word)
        } else {
            if (%isFloat (word)) {
                %funcall pushFloat (word)
            } else {
                %funcall error (word)
            }
        }
    }
}
