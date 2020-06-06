
import path from "path";
import fs from "fs";
import yamljs from 'yamljs';
import {Logger} from "./logger";

export class genDynalarms {

  version="1.0.0";
  author="febef <febef@gmail.com>";
  mainFileName=false;
  reg={};

  definitions = {};
  globalValues = {};

  constructor(){
    this.logger = new Logger({
      appname:"GDA",
      object: this
    });

    this.loadDefinitions();
  }

  setReg(key, val) {
    this.reg[key] = val;
    this.debug("New Registry:", key);
    if (this.reg.mainFileName && !this.globalValues.nolog) {
      const logFileName = this.reg.mainFileName + ".log";

      fs.appendFile(logFileName, `[${this.logger.timestamp()}] ${key}: ${JSON.stringify(val)}\n`, (err) => {
        if (err) throw err;
        this.debug("Write key to", logFileName);
      });

    }
  }

  loadDefinitions() {
    fs
      .readdirSync(path.join(__dirname,"/objects/"))
      .filter(file => file.indexOf(".") != 0)
      .forEach( file => {
        this.debug("Cargando definición:", file);
        this.definitions[file.slice(0, -3)] = require(path.join(__dirname,"/objects/", file));
      });
  }

  CreateFromFile(file, workdir=""){
    let tm = this.logger.timestamp().replace(/[/,:, ]/g, ".");
    this.reg = { mainFileName: file +"."+ tm};
    if (this.reg.mainFileName && !this.globalValues.nolog) {
      this.info("Se escribiran los registros en: ", (this.reg.mainFileName+".log").gray);
    }
    this._CreateFromFile(file, workdir);
  }

  _CreateFromFile(file, workdir="") {

    try{
      let filepath = path.join(workdir,"/",file);
      this.debug('Creando desde el archivo:', (workdir+"/").gray+file);
      this.data = (file.slice(-3)=="json") ? require(filepath) : yamljs.load(filepath) ;
      this.data.filename = file;
      this.workdir = workdir;
    } catch(e) {
      this.error("al cargando el archivo.\n", e);
      return;
    }

    this.CreateObject(this.data);
    
  }

  AddGlovalValues(data, recursive=false) {
    let name, value;    
    for (let p in data){
      if(typeof data[p] == "object") {
        this.AddGlovalValues(data[p], ((recursive)? recursive +"." :"") + p);
      } else {
        if(recursive) {
          this.debug("Agregado de valor global:", recursive+"."+p, "=", data[p]);
          this.globalValues[recursive+"."+p] = data[p];
        } else {
          this.debug("Agregado de valor global:", p, "=", data[p]);
          this.globalValues[p] = data[p];
        }
      }
    }
  }

  CreateObject(data) {

    this.info("Creando", (data.name || data.filename).bold);
    if (data.version === this.version) {
      
      if (data.globalValues) {
        this.AddGlovalValues(data.globalValues);
      }

      if(data.includes){
        for (let i of data.includes){
          this.debug("Incluyendo", i);
          this._CreateFromFile(i, this.workdir);
        }
      }

      if(data.definitions) {
        for (let d of data.definitions){
          this.debug("Definition", d);
          if (d.type && d.version && this.definitions[d.type+"-"+d.version]) {
            let object = new this.definitions[d.type+"-"+ d.version].object(this);
            object.create(d);
          } else {
            this.warning(
              "No se encuentra la definición o la version es incorrecta para:",
              (d.type+"-"+d.version)
            );
          }
        }
      }

    } else {
      this.error("La versión de la definición no es compatible.")
      return 0;
    }
  }

}