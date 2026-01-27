if (found) {
    if (%incompilingstate) {
        if (foundimmediate) {
            exec(item)
        } else {
            compileword(item)
        }
    } else {
        exec(item)
    }
} else {
    if (%incompilingstate) {
        if (%isinteger(item)) {
            compileinteger(item)
        } else {
            if (%isfloat(item)) {
                compilefloat(item)
            } else {
                %returnFalse
            }
        }
    } else {
        if (%isinteger(item)) {
            pushasinteger(item)
        } else {
            if (%isfloat(item)) {
                pushasfloat(item)
            } else {
                %returnFalse
            }
        }
    }
}