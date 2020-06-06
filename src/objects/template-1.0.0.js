
import colors from 'colors';
import path from "path";
import fs from "fs";

export class object {
  version="1.0.0";
  name="template"
  def = {};
  
  constructor(m){
    this.globalValues = m.globalValues;
    this.debug= (...msg) => m.debug(("["+this.name+"]").gray, ...msg);
    this.info= (...msg) => m.info(("["+this.name+"]").gray, ...msg);
    this.warning= (...msg) => m.warning(("["+this.name+"]").gray, ...msg);
    this.error= (...msg) => m.error(("["+this.name+"]").gray, ...msg);
    this.debug("Nueva instancia.");
  }

   _remplaceVars(value){
    const regex = /\${{[aA-zZ,_,.,0-9]*}}/g;
    const found = value.match(regex);
    if(found) for (let v of found) {
      let name = v.slice(3).slice(0,-2);
      if(this.globalValues[name]) value = value.split(v).join(this.globalValues[name]);
      if(this.def[name]) value = value.split(v).join(this.def[name]);
      if(!this.globalValues[name] && !this.def[name]) this.warning("Variable global o local '" + name + "'  no definida.");
    }
    return value; 
  }

  create(def){
    this.def = def;
    this.info("Creando", def.outFile.gray);
    this.debug("Leyendo template", def.template);
    let script = fs.readFileSync(def.template, { encoding:'utf8', flag:'r' }); 
    script = this._remplaceVars(script);
    this.debug("Escribiendo template procesado", def.outFile);
    fs.writeFile(def.outFile, script, (err) => {
      if(err) return console.error(err);
      this.info("Creado.", "[ok]".green, def.template, "->", def.outFile);
    });
  }
}