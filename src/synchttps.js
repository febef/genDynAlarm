import https from "https";

function PromisedRequest({options, body}) {

  return new Promise((resolve, reject) => {
  
    const request = https.request(options, response => {
  
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);			
        // promise resolved on success
        resolve(response_body.toString());
      });

      response.on('error', (error) => {
        // promise rejected on error
        reject(error);
      });
    });
    
    request.on('error', (error) => {
      // promise rejected on error
      reject(error);
    });

    request.write(JSON.stringify(body));
    request.end();

  });
}

export async function Request(options){
  try{
    return await PromisedRequest(options);
  } catch (e){
    console.log("EEROR",e);
  }
};