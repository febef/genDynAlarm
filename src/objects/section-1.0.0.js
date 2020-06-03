
export class object {
  version="1.0.0"
  name="section";
  gda;

  constructor(parent) {
    this.gda = parent;
  }

  create(d) {
    this.gda.CreateObject(d);
  }

}