import colors from 'colors';

export class Logger {
  defaultLoglevel = 1;
  timestampEnabled = true;
  appname = "Logger";
  loglevels = {
    "0":"debug", "debug":"0",
    "1":"info", "info":"1",
    "2":"warning", "warning":"2",
    "3":"error", "error":"3"
  };

  constructor({appname, object, timestamp, defaultLoglevel}) {
    this.appname=appname;
    this.timestampEnabled = timestamp || this.timestampEnabled;
    this.defaultLoglevel = timestamp || this.defaultLoglevel;
    
    if(object){
      object.info=this.info.bind(this);
      object.debug=this.debug.bind(this);
      object.error=this.error.bind(this);
      object.warning=this.warning.bind(this);
      object.log=this.log.bind(this);
    }
  }

  timestamp(){
    return new Date().toLocaleString() + " " + process.hrtime()[1];
  }
  
  logLevel(){
    return process.env["LOG_LEVEL"] || this.defaultLoglevel;
  }
  
  debug(...argv) {
    if (this.logLevel() <= 0)
      this._log(0, argv);
  }

  info(...argv) {
    if (this.logLevel() <= 1)
    this._log(1, argv);
  }

  warning(...argv) {
    if (this.logLevel() <= 2)
      this._log(2, argv);
  }

  error(...argv) {
    if (this.logLevel() <= 3)
      this._log(3, argv);
  }

  _log(loglevel, argv) {
    console.log(
      ('['+this.appname+']').blue.bold +
      (this.timestampEnabled ? ('['+this.timestamp()+']').gray : ''),
      this.colorizer((typeof loglevel != "number")
       ? loglevel.toString()
       : this.loglevels[loglevel.toString()].toUpperCase()),
       ...argv
    );
  }

  log(...argv) {
    this._log(argv[0], argv.slice(1));
  }
  
  colorizer(text) {
    let lowText = text.toLowerCase();
    switch (lowText) {
      case 'info':
        return text.brightBlue;
      case 'error':
        return text.red.bold;
      case 'warning':
        return text.magenta;
      case 'debug': 
       return text.white;
      default:
        return text.green;
    }
  }
}
