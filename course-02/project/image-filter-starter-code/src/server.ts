import express,{Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */


  // Project Endpoint
  // Get an image url and display the image
  app.get("/filteredimage", async(req,res)=>{
    try {
      let  image_url  = req.query.image_url;
      res.header("Content-Security-Policy', 'img-src 'self'");
  
      //    1. validate the image_url query
      const isValideUrl = image_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      if(!image_url || !isValideUrl){
        return res.status(400).send(`Inavlid {url}! Try again with valid url`);
      }
  
      const files:Array<string>=[];
      //    2. call filterImageFromURL(image_url) to filter the image
      console.log(image_url);
      await filterImageFromURL(image_url).then(filteredpath=>{
          if(!filteredpath){
            return res.status(400).send(`Unable to filter image`);
          }else{
            files.push(filteredpath);
            //    3. send the resulting file in the response
            return res.status(200).sendFile(filteredpath);
          }
      }).then(x=>
            //    4. deletes any files on the server on finish of the response
        setTimeout(x=>deleteLocalFiles(files), 1000));
    } catch (error) {
      return res.status(422).send(`An error occured. ${error}`);
    }
   
  });

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();