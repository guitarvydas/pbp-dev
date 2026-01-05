if (found) {
    if (%incompilingstate) {
        if (foundimmediate) {
            %funcall exec(item)
        } else {
            %funcall compileword(item)
        }
    } else {
        %funcall exec(item)
    }
} else {
    if (%incompilingstate) {
        if (%isinteger(item)) {
            %funcall compileinteger(item)
        } else {
            if (%isfloat(item)) {
                %funcall compilefloat(item)
            } else {
                %returnFalse
            }
        }
    } else {
        if (%isinteger(item)) {
            %funcall pushasinteger(item)
        } else {
            if (%isfloat(item)) {
                %funcall pushasfloat(item)
            } else {
                %returnFalse
            }
        }
    }
}