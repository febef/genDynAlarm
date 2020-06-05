import { baseObject } from "./object.request.class";

export class object extends baseObject {
  version="1.0.0"
  name="metric";

  setUpValues(def) {
    // Variables Auxiliares
    const timeseriesId = [
      "custom:" +
      this.globalValues["program.name"],
      this.globalValues["program.domain"],
      this.globalValues["env"],
      def.name,
      def.identifier
    ].join(".");
    
    const name = [
      this.globalValues["program.name"],
      this.globalValues["program.domain"],
      this.globalValues["env"],
      def.name
    ].join("-");

    const path = [
      "/e/", this.globalValues["Dynatrace.env"], 
      "/api/v1/timeseries/", timeseriesId
    ].join('');

    this.id = timeseriesId;

    // Opciones de la petición
    this.options = {
      hostname: this.globalValues["Dynatrace.host"],
      port: 443, path,
      method: "PUT",
      headers: {
        "Authorization": "Api-Token " + this.globalValues["Dynatrace.token"],
        "Content-Type": "application/json"
      }
    };
    
    // cuerpo de la petición
    this.body = {
      "displayName": def.identifier + " | " + def.name,
      "types": [ def.identifier ],
      "dimensions":  [ "metrica" ],
      "unit": "Count"
    };

  }

    async _create(def) {

    let { options, body } = this;

    this.info("Enviando petición de creación de", this.id.brightBlue, "a la api.");
    this.debug("Petición:\n Options: ", options, "\nBody: ",body); 
    if (this.globalValues.notdorequest != true) {
      const response = await this.request({options, body});
      this.debug("Respuesta:", JSON.parse(response));
    }
    this.info("Verificando creacíon.", this.id.gray);

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
      (verifyResponse.displayName == body.displayName) &&
      (verifyResponse.timeseriesId == this.id) 
    );

    if (passVerify) {
      this.info("Creado.", "[ok]".green, this.id.brightBlue);
      this.setReg("metric["+this.id+"]" , verifyResponse);
    } else {
      this.error("No se creo o actualizo.", this.id.brightBlue);
    }
    
  }

}