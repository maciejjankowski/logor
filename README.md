This is LOGOR - two things
====================

Logor is a *log sink* to catch all your **debug messages** from both server side and client side - all in one place. Now with socket.io.
 AND more importantly:
LOGOR is a **watchdog timer** - this means - it will *bark* when your app is stuck.

I made it for a project with many loose ends - several components working together and I had to monitor them all and make sure they are all operational.

why the hell would you want LOGOR
==================

1. When you want to see what the console is saying without going to the server.
2. When your app is **dead and unresponsive** you will get an annoying sound and you'll know it's time to fix it or restart it (when forever fails or sth)
3. When you want to see when your app get's hit - I made those faux blinken-lights just for you. Watching them blink makes me feel good.
4. Better reasons yet to be found

How on earth would I set it up
----------------------------------

I hope this clears a little bit the mumble I wrote before:

`var L = require ('./logor.js');` // in each component you want to monitor

OR

`<script src="logorBrowser.js"></script>`

then (same for client and server side):

````
// make introduction - it will name the component
L.ping('your-service-name', timeout_in_ms); // must be valid (but made up) html id

L.log('this is logor');

L.info('logor informs');

L.error('logor unhapy!');

// ... in another component:


// make introduction - it will name the component
L.ping('another service', 15*60e3); // make that annoying sound after 15 minutes of inactivity

L.log('this is logor');

````

Now you need to run `L.ping` every significant, yet frequent operation (say - user logging in, or user inviting a friend. OR BETTER: user fulfilling the order.

Then  - if there is no activity (say, your app hanged itself or the exceptions blew off) - you'll get a sound notification.
Plus, you could still see what happened in your app (the logs are there for review).


All this made possible by the goodness of socket.io and a bit of jabashcript code.

