import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: List[] = [];
  tasks: Task[] | null = null;

  selectedListId!: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getLists();
    this.getListSubTasks();
  }

  private getLists() {
    this.taskService.getLists().subscribe((lists: any) => {
      console.log(lists);
      this.lists = lists;
    });
  }

  private getListSubTasks() {
    this.route.params.subscribe((params: Params) => {
      if (!Object.keys(params).includes('listId')) {
        return;
      }

      const listId = params['listId'];
      this.selectedListId = listId;
      // const listId = params?.listId;
      if (![null, undefined, ''].includes(listId)) {
        this.taskService.getTasks(listId).subscribe((tasks: any) => {
          this.tasks = tasks;
          console.log('Tasks:', this.tasks);
        });
      }
    });
  }

  onTaskClick(task: Task) {
    //we want to set the task to completed
    this.taskService.complete(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log('task completed');
      task.completed = !task.completed;
    });
  }

  onDeleteListClick(listId: string) {
    this.taskService.deleteList(listId).subscribe((res: any) => {
      this.router.navigate(['authenticated/lists']);
      console.log(res);
    });
  }

  onDeleteTaskClick(id: string) {
    this.taskService
      .deleteTask(this.selectedListId, id)
      .subscribe((res: any) => {  
        if (!this.tasks) {
          return;
        }
        this.tasks = this.tasks.filter((val) => val._id !== id);
        console.log(res);
      });
  }

  logout() {
    this.authService.logout();
  }
}
