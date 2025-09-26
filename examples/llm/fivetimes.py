import sys
sys.path.insert(0, '../../kernel')
import kernel0d as zd

# define template
def install (reg):
    zd.register_component (reg, zd.mkTemplate ("Five Times", None, instantiate))

class FiveTimes_counter:
    def __init__ (self):
        self.counter = 0
    
# create an instance of the template
def instantiate (reg,owner,name, arg, template_data):
    # 'arg' is ignored for normal Leaf Parts (it is used internally for some stock parts)
    name_with_id = zd.gensymbol ("FiveTimes")
    return zd.make_leaf ( name_with_id, owner, FiveTimes_counter (), arg, handler)

# handler for any instance
def handler (eh,mev):
    inst =  eh.instance_data
    if inst.counter < 5:
        zd.send (eh, "", mev.datum.v, mev)
        inst.counter += 1

