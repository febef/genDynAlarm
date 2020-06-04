import { baseObject } from "./object.request.class";

export class object extends baseObject {
  version="1.0.0";
  name="genericalarm";

  async _create(def) {

    let { options, body } = this;

    this.info("Enviando petición de creación de '"+this.id+"' a la api.");
    this.debug("Petición:\n Options: ", options, "\nBody: ",body); 
    if (this.globalValues.notdorequest != true) {
      const response = await this.request({options, body});
      this.debug("Respuesta:", JSON.parse(response));
    }
    this.info("Verificando creacíon.");

    options.method = "GET";
    let verifyResponseText = {};
    if (this.globalValues.notdorequest != true) {
      verifyResponseText = await this.request({options, body: {}});
    } else {
       verifyResponseText = JSON.stringify(body);
    }
    const verifyResponse = JSON.parse(verifyResponseText);

    this.debug("Respuesta:", verifyResponse);

    const passVerify = (
      (verifyResponse.threshold == body.threshold) && 
      (verifyResponse.name == body.name)
    );

    if (passVerify) {
      this.info("Creado","[ok]".green);
    } else {
      this.error("No se creo o actualizo la Alarma.");
    }

  }

}