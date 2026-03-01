Implement BatchBG project.

  Use tailwind 4 and shadcn UI.

  Screenshot 1: the main app screen
  Screenshot 2: setting panel

  BatchBG is a web application that lets users upload their screenshots for creating a more attractive screenshots using beautiful backgrounds (same concept as
  background of Screen Studio app).

  - Users upload screenshots (can select multiple files at once)
  - They upload background images they want
  - They select an uploaded screenshot to set background config
  - Step 1: select a background
  - Step 2: adjust background zoom position (if they want to zoom into some part of the background)
  - Step 3: adjust padding size. The screenshot is anchored at center of the canvas. Adding padding will leave some spaces and reveal the selected background
  - Step 4: adjust shadow size and position. The shadow is the drop shadow of the screenshot on background image
  - For every step, users can select to apply the settings to all other screenshots at once. So they don't need to manually repeat the same process. But we also
  leave the room for them to customize each individual screenshot manually.
  - Users can remove screenshots and background images by clicking at "x" icon at their top right corner or press backspace/delete on the selected files
  - Users can do multiple selection on screenshots by holding shift and click. The preview screen only shows the first selected screenshot. Changing settings will
  affect all selected screenshots.
  - If multiple selection is active and user press backspace/delete, the app delete multiple screenshots (without confirmation dialog)
  - Users can press cmd+c or right click to copy settings of a screenshot and paste (cmd+v) into another screenshot (or multiple screenshots)
  - Pressing export button will start rendering images and export them into a destination path. Users should be able to select file resolution, quality, and file
  extention (.png, .jpg, etc)

  Please implement all of these requirements. You can run the app and install any required library freely.

  Run the app with this command: "npm run dev". The app is available at http://localhost:3000. You can access to the app using "agent-browser" command. Please do
  testing, fix bugs, and iterate until complete. I have put test files in this folder: test_files/. Feel free to use them for testing.
