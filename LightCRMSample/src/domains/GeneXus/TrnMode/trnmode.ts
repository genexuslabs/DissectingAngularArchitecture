import { Domain, DomainEnum } from "app/gx/types/domain";


export class GeneXus__TrnMode extends Domain {
  static enumValues:Array<DomainEnum> = [
    new DomainEnum('INS', "Insert"),
    new DomainEnum('UPD', "Update"),
    new DomainEnum('DLT', "Delete"),
    new DomainEnum('DSP', "Display")
  ]
} 