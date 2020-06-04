import { object as baseObject } from "./generic-createAndVerify-1.0.0";

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

}