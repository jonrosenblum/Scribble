import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent implements OnInit {
  tasks: any[] = [];
  listId: string = ''; // Initialize listId here

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId']; // Update listId with the route parameter
      this.getTasks(); // Call getTasks here, passing the listId
    });
  }

  private getTasks() {
    this.taskService.getTasks(this.listId).subscribe((tasks: any) => {
      this.tasks = tasks;
    });
  }

  createTask(title: string) {
    this.taskService.createTask(title, this.listId).subscribe(() => {
      // Now we navigate to /lists/response._id
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
