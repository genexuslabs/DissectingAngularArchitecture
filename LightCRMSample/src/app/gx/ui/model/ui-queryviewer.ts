export class UIQueryViewerElement {
  visible: boolean = null;
  class: string = null;

  objectcall: string = null;
  type: string = null;
  charttype: string = null;
  paging: boolean = null;
  pagesize: number = null;
  showdatalabelsin: string = null;
  plotseries: string = null;
  xaxislabels: string = null;
  xaxisintersectionatzero: boolean = null;
  showvalues: boolean = null;
  xaxistitle: string = null;
  yaxistitle: string = null;
  showdataas: string = null;
  includetrend: boolean = null;
  trendperiod: string = null;
  Totalforrows: string = null;
  Totalforcolumns: string = null;
  rememberlayout: boolean = null;
  orientation: string = null;
  includesparkline: boolean = null;
  includemaxandmin: boolean = null;
  objectname: string = null;
  isexternalquery: boolean = null;
  allowchangeaxesorder: boolean = null;
  autoresize: boolean = null;
  autoresizetype: string = null;
  fontfamily: string = null;
  fontsize: number = null;
  fontcolor: string = null;
  autorefreshgroup: string = null;
  disablecolumnsort: boolean = null;
  allowselection: boolean = null;
  exporttoxml: boolean = null;
  exporttohtml: boolean = null;
  exporttoxls: boolean = null;
  exporttoxlsx: boolean = null;
  exporttopdf: boolean = null;
  title: string = null;
  dataversionid: number = 0;
  maptype: string = null;
  region: string = null;
  country: string = null;
  continent: string = null;

  refresh() {
    this.dataversionid += 1;
  }
}
