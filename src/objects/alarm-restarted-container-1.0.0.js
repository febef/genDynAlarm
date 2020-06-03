import { object as baseObject } from "./.genericalarm-1.0.0";

export class object extends baseObject {
  version="1.0.0";
  name="alarm-restarted-container";

  setUpValues(def){
    // Variables Auxiliares
    let timeseriesId = [
      "custom:"+ this.globalValues["program.name"],
      this.globalValues["env"],
      def.name, def.tsidTail
    ].join(".");
    
    const path = [
      "/e/", this.globalValues["Dynatrace.env"], 
      "/api/v1/timeseries/", timeseriesId
    ].join('');

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
      "metadata": {
        "configurationVersions": [2],
        "clusterVersion": this.globalValues["Dynatrace.clusterVersion"]
      },
      "id": "custom-alert-restarted-container-" + def.name,
      "metricId": "builtin:tech.generic.count",
      "name": `Q < ${def.threshold} | ${def.name}-${this.globalValues["projectName"]}-${this.globalValues["env"]}`,
      "description": "Se detectaron reinicios en los contenedores.",
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
          "key": "tec_restartedcontainer",
          "value": null
        },
        {
          "context": "CONTEXTLESS",
          "key": "K8-NameSpace",
          "value": this.globalValues["projectName"] + this.globalValues["env"]
        },
        {
          "context": "CONTEXTLESS",
          "key": "K8 Base Pod Name",
          "value": def.name
        }
      ]
    };
  }

}