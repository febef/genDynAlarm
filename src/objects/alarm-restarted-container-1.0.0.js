import { object as baseObject } from "./generic-createAndVerify-1.0.0";

export class object extends baseObject {
  version="1.0.0";
  name="alarm-restarted-container";

  setUpValues(def){
    // Variables Auxiliares
    let id = [
      this.globalValues["program.name"],
      this.globalValues["env"],
      def.name, "restarted_container_count"
    ].join(".");
    
    const path = [
      "/e/", this.globalValues["Dynatrace.env"], 
      "/api/v1/timeseries/", id
    ].join('');

    this.id = id;
    // Opciones de la petición
    this.options = {
      hostname: this.globalValues["Dynatrace.host"],
      port: 443,
      path: path,
      method: "PUT",
      headers: {
        "Authorization": "Api-Token " + this.globalValues["Dynatrace.token"],
        "Content-Type": "application/json"
      }
    };
    
    // cuerpo de la petición
    this.body = {
      "threshold": def.threshold,
      "alertCondition": "ABOVE",
      "samples": 3,
      "violatingSamples": 1,
      "dealertingSamples": 3,
      "eventType": "ERROR",
      "eventName": "Restarted containers count",
      "filter": "USER_INTERACTION",
      "enabled": true,
      "name": "API Geographicaddress",
      "description": "El contador de contenedores reiniciados es mayor a" +def.threshold+".",
      "timeseriesId": id,
      "tagFilters": [{
          "context": "CONTEXTLESS",
          "key": "tec_restartedpod",
          "value": null
        },{
          "context": "CONTEXTLESS",
          "key": "K8-NameSpace",
          "value": this.globalValues["proyectName"]+ "-" + this.globalValues["env"]
        },{
          "context": "CONTEXTLESS",
          "key": "K8 Base Pod Name",
          "value": def.name + this.globalValues["endPodBaseName"]
      }]
    };
  }

}