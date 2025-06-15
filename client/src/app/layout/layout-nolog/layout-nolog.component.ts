import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';

@Component({
  selector: 'app-layout-nolog',
  templateUrl: './layout-nolog.component.html',
  styleUrls: ['./layout-nolog.component.scss']
})
export class LayoutNologComponent implements OnInit {

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

}
