# 3dverse web dev challenge: Pixel Paint
 
## Running the app

We have already set up a boilerplate React app (create-react-app) with an express server backend.

To run it:

- Run `npm install` to install the project dependencies.
- Launch the dev server and express server by running `npm start` and `node server.js` in separate terminals.
- Access the app at [http://localhost:3000](http://localhost:3000).

## What to implement

You will create a collaborative paint app (similar to https://pixelplace.io/). In short:

- You arrive on a page with a canvas.
- You pick a color (or get assigned one randomly), and can click or drag around the page to draw with your color.
- You see the new drawings of other connected users in real time.
- Next to the canvas, you see an indication of your currently assigned color, and you also see a list of currently connected users with their names and respective colors.
- Users can have random names generated on the fly (User 1, User 2 for example), but the same user should have the same name across different clients.
- New users arriving on the page should see previous drawings.

## Additional completition criteria 

- All canvas rendering should be done with the browser canvas API.
- Implement a websocket server alongside the express server for handling real-time messages.
- Modifying the REST routes in the express server is not required (but you can if you want).
- It is *not* necessary to persist the canvas content after restarting the server. You can restart with a blank canvas.

## Sharing your code with us

When you're done, please push to a private repo on GitHub and share it with webtest@3dverse.com.
