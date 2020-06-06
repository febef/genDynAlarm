import { object as baseObject } from "./generic-createAndVerify-1.0.0";

export class object extends baseObject {
  version="1.0.0";
  name="alarm-restarted-container";

  setUpValues(def){
    // Variables Auxiliares
    let id = [
      this.globalValues["program.name"],
      this.globalValues["program.domain"],
      this.globalValues["env"],
      def.name,
      def.identifier
    ].join(".");
    
    const path = [
      "/e/", this.globalValues["Dynatrace.env"], 
      "/api/v1/thresholds/", id
    ].join('');

    this.id = id;
    this.verifyPath = path.replace(
      "/api/v1/thresholds/",
      "/api/config/v1/anomalyDetection/metricEvents/"
    );

    // Opciones de la petición
    this.options = {
      hostname: this.globalValues["Dynatrace.host"],
      port: 443,
      path,
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
      "eventType": "ERROR_EVENT",
      "eventName": "Reinicio de contenedores",
      "filter": "USER_INTERACTION",
      "enabled": true,
      "name": id,
      "description": "El contador de contenedores reiniciados es mayor a" +def.threshold+".",
      "timeseriesId": "custom:switch.dxp.uat.cust-bs-test.restarted_contaniers_count",//"custom:" + id,
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