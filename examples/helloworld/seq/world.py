import sys
sys.path.insert(0, '../kernel')
import kernel0d as zd

# define template
def install (reg):
    zd.register_component (reg, zd.mkTemplate ("World", None, instantiate))

# create an instance of the template
def instantiate (reg,owner,name,template_data):
    name_with_id = zd.gensymbol ( "World")
    return zd.make_leaf ( name_with_id, owner, None, handler)

# handler for any instance
def handler (eh,mev):
    zd.send_string (eh, "", "World", mev)

