# Selassie people: work in progress

This work is separate from the non-people updates merged through PR #107. The owner rejected the reduced face meshes, beard shape, loc attachment, chest shape and collar fit. The character revisions are not approved for main.

The current priority is preserving eyes, nose, mouth and jaw geometry during crowd/phone simplification, then checking natural beard contours, attached loc roots, shirt drape and collar seams in still and moving renders. Passing animation, cloth or unit checks alone is insufficient.

Source character recipes still use the shared MakeHuman/MPFB builder and Mixamo rig. Game-specific finishing and packing must remain isolated from other games. Main retains its existing Selassie model assets and thumbnail until this PR passes visual review.
