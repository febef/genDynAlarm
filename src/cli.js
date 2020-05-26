
import { genDynalarms } from "./"; 

export function cli() {

  let gda = new genDynalarms();
  
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  gda.CreateFromFile(process.argv[2], process.cwd());

}