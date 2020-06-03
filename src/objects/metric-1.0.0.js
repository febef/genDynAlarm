import { baseObject } from "../object.request.class";

export class object extends baseObject {
  version="1.0.0"
  name="metric";

  async _create(def) {
    // Variables Auxiliares
    const timeseriesId = [
      "custom:"+ this.globalValues["program.name"],
      this.globalValues["env"],
      def.name, def.tsidTail
    ].join(".");
    
    const name = [
      this.globalValues["program.domain"],
      def.name, this.globalValues["env"]
    ].join("-");

    const path = [
      "/e/", this.globalValues["Dynatrace.env"], 
      "/api/v1/timeseries/", timeseriesId
    ].join('');

    // Opciones de la petición
    let options = {
      hostname: this.globalValues["Dynatrace.host"],
      port: 443, path, method: "PUT",
      headers: {
        "Authorization": "Api-Token " + this.globalValues["Dynatrace.token"],
        "Content-Type": "application/json"
      }
    };
    
    // cuerpo de la petición
    let body = {
      "displayName": def.tagFilter + " | " + def.name,
      "types": [ def.tagFilter ],
      "dimensions":  [ "metrica" ],
      "unit": "Count"
    };

    this.info("Enviando petición de creación de Metrica '"+timeseriesId+"' a la api.");
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
      verifyResponseText = JSON.stringify({...body, timeseriesId});
    }
    const verifyResponse = JSON.parse(verifyResponseText);
    this.debug("Respuesta:", verifyResponse);

    let passVerify = (
      (verifyResponse.timeseriesId == timeseriesId) && 
      (verifyResponse.displayName == body.displayName)
    );

    if (passVerify) {
      this.info("Creado", "[ok]".green);
    } else {
      this.error("No se creo o actualizo la Metrica.");
    }

  }

}