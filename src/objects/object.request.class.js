import { Request } from "../synchttps"; 

export class baseObject {
  version="1.0.0";
  name="Object";

  constructor(m){
    this.logger=m.logger;
    this.reg = m.reg;
    this.setReg = m.setReg;
    this.request = Request;
    this.globalValues = m.globalValues;
    this.debug= (...msg) => m.debug(("["+this.name+"]").gray, ...msg);
    this.info= (...msg) => m.info(("["+this.name+"]").gray, ...msg);
    this.warning= (...msg) => m.warning(("["+this.name+"]").gray, ...msg);
    this.error= (...msg) => m.error(("["+this.name+"]").gray, ...msg);
    this.debug("Nueva instancia .");
  }

  _remplaceVars(value){
    const regex = /\${[aA-zZ,_,.,0-9]*}/g;
    const found = value.match(regex);
    if(found) for (let v of found) {
      let name = v.slice(2).slice(0,-1);
      if(this.globalValues[name]) value = value.split(v).join(this.globalValues[name]);
      else this.warning("Variable global'" + name + "'  no definida.");
    }
    return value; 
  }

  resolveDefinition(d) {
    let pd={}, type;
    for (let p in d) {
      type = typeof d[p]
      switch(type) {
        case "object": pd[p] = this.resolveDefinition(d[p]);  break;
        case "string": pd[p] = this._remplaceVars(d[p]); break;
        default: pd[p] = d[p];
      }
    }
    this.debug("Resolución de definicion: \noriginal: ", d, "\nresuelta:", pd);
    return pd;
  }

  async create(definition) {
    if (definition.version !== this.version) return this.warning("La version de la definición no existe!");
    let def = this.resolveDefinition(definition);
    this.setUpValues(def);
    await this._create(def);
  }

  setUpValues(def) {
    this.options = {
      hostname: "https://google.com",
      port: 443,
      path: "/", 
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    this.body = {};
  }

  async _create(def) {
    let {options, body} = this;
    if (this.m.globalValues.notdorequest != true) {
      const response = await this.request({
        options: options,
        body: body
      });
    }

    this.debug("respose:", response);
  }

}