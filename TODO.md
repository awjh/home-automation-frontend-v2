TODO

Have added image support can see the page redirect works on add and images load but for some reason the cypress tests are erroring with a 404 on the add endpoint?

Have no delete for images so need to add support for that in somewhere. Maybe the backend should be event driven here? Dynamo stream to say recipe added with image or image changed and delete the old key?
Currently no support for editing an image, do we care yet?

JSON entry for form to support AI

Concerns that if backend and frontend pipelines run at the same time the backend cleans the int env fully so would break FE tests, do we care?
