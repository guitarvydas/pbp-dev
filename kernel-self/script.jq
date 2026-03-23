.[] | {
  name,
  children: [.children[] | {name, id} | tojson | fromjson],
  connections: [.connections[] | {dir, source_port, target_port, source, target} | select((.source != null) or (.target != null)) | tojson | fromjson],
  file
}