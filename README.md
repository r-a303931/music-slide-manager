# Five parts: Three clients, server, and store
    
## Server code
Server contains a basic websocket server that is 200 lines that allows for downloading the clients and facilitating communication between clients but does nothing else, as nothing else is needed

## Public client
The public client displays the current slide and allows for going into full screen

## Singer client    
The singer client displays the current slide, the next slide, and all the verses/progress through the verses including the current verse and the current slide in a verse
   
## Management client 
The management client allows for things like creating songs, editing songs, creating presentations, and presenting presentations. The present page is like the singer page, though the singer page has larger text and is designed to be available on phones, and provides for controls to jump to different songs in the current presentation, go to next slide, skip next slide, and go back one slide
