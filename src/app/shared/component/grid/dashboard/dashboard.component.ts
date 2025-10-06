import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Utils } from '@app/lib/utils/utils';
import { PieChartComponent } from '@swimlane/ngx-charts';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ThemeService } from '@app/service/theme.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('chatOpened', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DashboardComponent implements OnInit, OnChanges {

  @ViewChild(PieChartComponent) pieChart: PieChartComponent;

  @Input() dashboards: any[];
  dashboardsElements: any[] = [];

  chartOpened: boolean = false;
  view = [400, 0]

  chartColors;
  colors = ['#EC407A', '#5C6BC0', '#26C6DA', '#9CCC65', '#FF9800', '#A1887F', "#EF5350", "#FFD54F", "#F06292"]

  chartOne = [];
  chartOneColors = { domain: [] }

  chartTwo = [];
  chartTwoColors = { domain: [] }

  chartThree = [];
  chartThreeColors = { domain: [] }


  chartFour = [];
  chartFourColors = { domain: [] }


  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  yAxisLabel = 'Real (R$)';
  xAxisLabel = 'Tipo lançamento';


  legendLine: boolean = true;
  showLabelsLine: boolean = true;
  animationsLine: boolean = true;
  xAxisLine: boolean = true;
  yAxisLine: boolean = true;
  showYAxisLabelLine: boolean = true;
  showXAxisLabelLine: boolean = true;
  xAxisLabelLine: string = 'Year';
  yAxisLabelLine: string = 'Population';
  timelineLine: boolean = true;

  loadingDashs = true;

  constructor(private themeService: ThemeService) {

  }

  ngOnInit(): void {

  }

  onWheel(event: WheelEvent): void {
    ;
    (<Element>event.currentTarget).scrollLeft += event.deltaY;
    event.preventDefault();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes["dashboards"];
    if (change) {
      this.createDashboards();
    }
  }


  getRandomColor() {
    let notChoices = this.chartColors.filter(c => c.choiced == false);
    if (notChoices.length == 0) {
      this.chartColors.forEach(c => c.choiced = false);
      notChoices = this.chartColors.filter(c => c.choiced == false);
    }
    var color = notChoices[Math.floor(Math.random() * notChoices.length)];
    color.choiced = true;
    return color.color;
  }

  createDashboards() {

    this.dashboardsElements = [];
    this.chartOpened = false;
    this.chartColors = this.colors.map((m) => { return { color: m, choiced: false } });
    this.chartOne = [];
    this.chartOneColors = { domain: [] }
    this.chartTwo = [];
    this.chartTwoColors = { domain: [] }
    this.chartThree = [];
    this.chartThreeColors = { domain: [] }
    this.chartFour = [];
    this.chartFourColors = { domain: [] }

    let dashTotalDebito: any = { nomeGrupo: "Débitos", valorTotal: 0, quantidade: 0, icon: "money_off", color: "#c8414b", chartColor: this.getRandomColor() };
    let dashTotalPagar: any = { nomeGrupo: "à pagar", valorTotal: 0, quantidade: 0, icon: "attach_money", color: "#5bb26e", chartColor: this.getRandomColor() };

    this.dashboards.forEach(d => {

      let dash = Utils.refazObjetoReadOnly(d);

      dash.color = "primary";
      dash.icon = "bar_chart";
      dash.chartColor = this.getRandomColor();

      if (dash.tipoLancamento == "Credito") {
        dashTotalPagar.valorTotal = dashTotalPagar.valorTotal + dash.valorTotal;
        dashTotalPagar.quantidade = dashTotalPagar.quantidade + dash.quantidade;
        this.chartOne.push({ name: dash.nomeGrupo, value: dash.valorTotal })
        this.chartOneColors.domain.push(dash.chartColor)
      } else {
        dashTotalDebito.valorTotal = dashTotalDebito.valorTotal + dash.valorTotal;
        dashTotalDebito.quantidade = dashTotalDebito.quantidade + dash.quantidade;
        this.chartTwo.push({ name: dash.nomeGrupo, value: dash.valorTotal })
        this.chartTwoColors.domain.push(dash.chartColor)
      }

      this.chartThree.push({ name: dash.nomeGrupo, value: dash.valorTotal })
      this.chartThreeColors.domain.push(dash.chartColor)

      this.dashboardsElements.push(dash);

    });

    this.dashboardsElements.push(dashTotalDebito);
    this.dashboardsElements.push(dashTotalPagar);

    this.chartThree.push({ name: dashTotalDebito.nomeGrupo, value: dashTotalDebito.valorTotal })
    this.chartThreeColors.domain.push(dashTotalDebito.chartColor)

    this.chartThree.push({ name: dashTotalPagar.nomeGrupo, value: dashTotalPagar.valorTotal })
    this.chartThreeColors.domain.push(dashTotalPagar.chartColor)


    this.chartFour.push({ name: dashTotalDebito.nomeGrupo, value: dashTotalDebito.valorTotal })
    this.chartFourColors.domain.push(dashTotalDebito.chartColor)

    this.chartFour.push({ name: dashTotalPagar.nomeGrupo, value: dashTotalPagar.valorTotal })
    this.chartFourColors.domain.push(dashTotalPagar.chartColor)

    this.loadingDashs = false;

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pieChart.margins = [0, 20, 0, 0];
      this.pieChart.update();
    }, 0);
  }

  retornaValorFormatado(valor: number): string {
    return (valor || 0).toLocaleString("PT-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

}
