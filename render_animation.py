import bpy
import math

# 1. Clear the default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# 2. Set up scene parameters
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 250  # Adjust for desired animation length (e.g., 250 frames ~10.4 sec @ 24fps)
scene.render.fps = 24

# 3. Create a Camera
bpy.ops.object.camera_add(location=(0, -50, 20), rotation=(math.radians(75), 0, 0))
camera = bpy.context.active_object
scene.camera = camera

# 4. Create the Sun with an Emissive Material
bpy.ops.mesh.primitive_uv_sphere_add(radius=3, location=(0, 0, 0))
sun = bpy.context.active_object
sun.name = "Sun"

# Create an emissive material for the sun
mat_sun = bpy.data.materials.new(name="SunMaterial")
mat_sun.use_nodes = True
nodes = mat_sun.node_tree.nodes

# Remove default Principled BSDF node
for node in nodes:
    if node.type == 'BSDF_PRINCIPLED':
        nodes.remove(node)

# Add an Emission node
emission_node = nodes.new('ShaderNodeEmission')
emission_node.inputs[0].default_value = (1.0, 0.8, 0.2, 1.0)  # warm yellow color
emission_node.inputs[1].default_value = 10.0  # strength

# Connect Emission to Material Output
output_node = nodes.get("Material Output")
mat_sun.node_tree.links.new(emission_node.outputs[0], output_node.inputs[0])

sun.data.materials.append(mat_sun)

# 5. Create a Sample Planet
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(10, 0, 0))
planet = bpy.context.active_object
planet.name = "Planet1"

# 6. Create an Empty (Orbit Pivot) at the Sun’s Location and Parent the Planet
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
orbit_empty = bpy.context.active_object
orbit_empty.name = "OrbitEmpty"
planet.parent = orbit_empty

# 7. Animate the Orbit (Rotate the Empty 360° over the animation)
orbit_empty.rotation_euler = (0, 0, 0)
orbit_empty.keyframe_insert(data_path="rotation_euler", frame=1)
orbit_empty.rotation_euler = (0, 0, math.radians(360))
orbit_empty.keyframe_insert(data_path="rotation_euler", frame=scene.frame_end)

# Set interpolation to linear for a constant orbit speed
for fcurve in orbit_empty.animation_data.action.fcurves:
    for kf in fcurve.keyframe_points:
        kf.interpolation = 'LINEAR'

# 8. Set up a Basic World Background (Black)
scene.world.use_nodes = True
bg_node = scene.world.node_tree.nodes.get("Background")
bg_node.inputs[0].default_value = (0, 0, 0, 1)  # solid black

# (Optional) You can enhance the world or add a particle system to simulate stars.

# 9. Configure Render Settings for MP4 Output
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.constant_rate_factor = 'HIGH'
scene.render.ffmpeg.ffmpeg_preset = 'GOOD'

# Set the output filepath (this will create the video in the same directory as your .blend file)
scene.render.filepath = "//rendered_animation.mp4"

print("Setup complete. Now go to Render > Render Animation to produce your MP4 video.")
