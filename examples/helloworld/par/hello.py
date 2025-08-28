import sys
sys.path.insert(0, '../kernel')
import kernel0d as zd

# define template
def install (reg):
    zd.register_component (reg, zd.mkTemplate ("Hello", None, instantiate))

# create an instance of the template
def instantiate (reg,owner,name, arg, template_data):
    name_with_id = zd.gensymbol ( "Hello")
    return zd.make_leaf ( name_with_id, owner, None, arg, handler)

# handler for any instance
def handler (eh,mev):
    zd.send (eh, "", "Hello", mev)

