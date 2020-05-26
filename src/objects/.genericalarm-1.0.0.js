import { baseObject } from "../object.class";

export class object extends baseObject {
  version="1.0.0";
  name="genericalarm";

  async _create(def) {

    let { options, body } = this;

    this.info("Enviando petición de creación de Metrica a la api.");
    this.debug("Petición:\n Options: ", options, "\nBody: ",body); 

    const response = await this.request({options, body});
    
    this.debug("Respuesta:", JSON.parse(response));

    this.info("Verificando creacíon.");

    options.method = "GET";
    const verifyResponseText = await this.request({options, body: {}});
    const verifyResponse = JSON.parse(verifyResponseText);

    this.debug("Respuesta:", verifyResponse);

    const passVerify = (
      (verifyResponse.threshold == body.threshold) && 
      (verifyResponse.name == body.name)
    );

    if (passVerify) {
      this.info("Creado","[ok]".green);
    } else {
      this.error("No se creo o actualizo la Metrica.");
    }

  }

}