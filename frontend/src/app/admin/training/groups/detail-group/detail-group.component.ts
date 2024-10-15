import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupModel} from "../../../../../models/training.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-detail-group',
  templateUrl: './detail-group.component.html',
  styleUrl: './detail-group.component.scss'
})
export class DetailGroupComponent implements OnInit, OnDestroy {
  datasource!: MatTableDataSource<GroupModel>
  group! : GroupModel[]
  constructor() {
  }

  ngOnInit() {
    const group = localStorage.getItem('group')
    if (group) {
      this.group = JSON.parse(group)
      this.datasource = new MatTableDataSource(this.group)
    }
  }

  ngOnDestroy() {}
}
