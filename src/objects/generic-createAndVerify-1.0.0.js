import { baseObject } from "./object.request.class";

export class object extends baseObject {
  version="1.0.0";
  name="genericalarm";

  async _create(def) {

    let { options, body } = this;

    this.info("Enviando petición de creación de", this.id.brightBlue, "a la api.");
    this.debug("Petición:\n Options: ", options, "\nBody: ",body); 
    if (this.globalValues.notdorequest != true) {
      const response = await this.request({options, body});
      this.debug("Respuesta:", this.id.gray, ((response != "")? JSON.parse(response) : {}) );
    }
    this.info("Verificando creación.", this.id.gray);

    options.method = "GET";
    options.path = this.verifyPath;

    let verifyResponseText = {};
    if (this.globalValues.notdorequest != true) {
    this.debug("Petición VERY:\n Options: ", options, "\nBody: ",body); 
      verifyResponseText = await this.request({options, body: {}});
      this.debug("Respuesta:", this.id.gray, ((verifyResponseText != "")? JSON.parse(verifyResponseText) : {}) );
    } else {
       verifyResponseText = JSON.stringify(body);
    }
    const verifyResponse = JSON.parse(verifyResponseText);

    const passVerify = (
      (verifyResponse.threshold == body.threshold) && 
      (verifyResponse.name == body.name)
    );

    if (passVerify) {
      this.info("Creado.", "[ok]".green, this.id.brightBlue);
      this.setReg("alarm["+this.id+"]" , verifyResponse);
    } else {
      this.error("No se creo o actualizo.", this.id.brightBlue );
    }
    
  }
}