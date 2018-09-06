# celestials
A desktop buddies application with customizable .json resources.

## What is this?
This is a desktop buddies application built with electron in mind, as a tray application. 
Using JSON, buddies can be customized without needing to recompile an application, allowing an end user to add and alter any buddy they like using a simple JSON file.

**How to Use**
- **`npm install`** - Install the dependencies required.
- **`npm start`** - Start the electron application.


### Known Issues:
- The tray options will not run properly, as the RemoteManager.ts has been commented out for development within a browser.
- There are a few dependencies that are not ironed out yet.  You'll end up installing a few more than required.  It's a work in progress.
- Development is mostly being done in the **chrome browser** for now.  Running from a server will allow you to do the same (ex. Apache, Live Server (VS Code)).