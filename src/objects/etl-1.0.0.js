
export class object {
  constructor(m){
    this.globalValues = m.globalValues;
    this.debug= (...msg) => m.debug(("["+this.name+"]").gray, ...msg);
    this.info= (...msg) => m.info(("["+this.name+"]").gray, ...msg);
    this.warning= (...msg) => m.warning(("["+this.name+"]").gray, ...msg);
    this.error= (...msg) => m.error(("["+this.name+"]").gray, ...msg);
    this.debug("Nueva instancia.");
  }

 readFile(file) {

 }

 writeFile(cont, file) {

 }

 remplaceVars() {
   
 }

  create(def){    
    let script = this.readFile(def.template)
    script = this.remplaceVars(script);

    this.writeFile(script, def.fileout);
  }
}