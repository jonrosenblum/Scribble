import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: any[] = [];
  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getLists();
    this.getListSubTasks();
  }

  private getLists() {
    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    });
  }

  private getListSubTasks() {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      if (!Object.keys(params).includes('listId')) {
        return;
      }

      const listId = params['listId'];
      // const listId = params?.listId;
      if (![null, undefined, ''].includes(listId)) {
        this.taskService.getTasks(listId).subscribe((tasks: any) => {
          this.tasks = tasks;
        });
      }
    });
  }
}
