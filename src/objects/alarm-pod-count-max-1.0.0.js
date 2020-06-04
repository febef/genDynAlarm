import { object as baseObject } from "./generic-createAndVerify-1.0.0";

export class object extends baseObject {
  version="1.0.0";
  name="alarm-pod-count-max";

  setUpValues(def){
    // Variables Auxiliares
    let id = [
      this.globalValues["program.name"],
      this.globalValues["program.domain"],
      this.globalValues["env"],
      def.name,
      "max-pod-q"
   ].join(".");
   
   const path = [
     "/e/", this.globalValues["Dynatrace.env"], 
     "/api/config/v1/anomalyDetection/metricEvents/", id
   ].join('');

   this.id = id;

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
      "metadata": {
        "configurationVersions": [2],
        "clusterVersion": this.globalValues["Dynatrace.clusterVersion"]
      },
      "id": id,
      "metricId": "builtin:tech.generic.count",
      "name": `Q < ${def.threshold} | ${id}`,
      "description": "La cantidad de pods esta alcanzando su limite.",
      "aggregationType": "VALUE",
      "eventType": "ERROR",
      "severity": "ERROR",
      "threshold": def.threshold,
      "samples": 3,
      "violatingSamples": 1,
      "dealertingSamples": 3,
      "alertCondition": "ABOVE",
      "enabled": true,
      "tagFilters": [
        {
          "context": "CONTEXTLESS",
          "key": "tec_nopod",
          "value": null
        },
        {
          "context": "CONTEXTLESS",
          "key": "K8-NameSpace",
          "value": this.globalValues["projectName"]+ "-" + this.globalValues["env"]
        },
        {
          "context": "CONTEXTLESS",
          "key": "K8 Base Pod Name",
          "value": def.name + this.globalValues["endPodBaseName"]
        }
      ]
    };

  }

}