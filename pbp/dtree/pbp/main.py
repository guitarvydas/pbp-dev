import sys
sys.path.insert(0, 'pbp/kernel')
import kernel0d as zd

try:
    [palette, env] = zd.initialize_component_palette_from_files (sys.argv[1], sys.argv[4:])
    zd.start (arg=sys.argv[2], Part_name=sys.argv[3], palette=palette, env=env)
except Exception as e:
    _, _, tb = sys.exc_info()
    while tb.tb_next:
        tb = tb.tb_next
    frame = tb.tb_frame
    filename = frame.f_code.co_filename
    line_number = tb.tb_lineno
    print(f"\n\n\n*** {type(e).__name__} at {filename}:{line_number}: {e}", file=sys.stderr)

