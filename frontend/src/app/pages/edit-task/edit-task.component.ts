import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent {
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  taskId!: string;
  listId!: string;
  task: Task | null = null;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.taskId = params['taskId'];
      this.listId = params['listId'];

      this.taskService.getTasks(this.listId).subscribe((tasks) => {
        this.task = (tasks as Task[]).find((task) => task._id === this.taskId)!;
      });
    });
  }

  updateTask(title: string) {
    this.taskService
      .updateTask(this.listId, this.taskId, title)
      .subscribe(() => {
        this.router.navigate(['authenticated/lists', this.listId]);
      });
  }
}
