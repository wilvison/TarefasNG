import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskService } from './task.service';
import { EisenhowerMatrixComponent } from './eisenhower-matrix/eisenhower-matrix.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { SaasFeaturesComponent } from './saas-features/saas-features.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    EisenhowerMatrixComponent,
    TaskFormComponent,
    SaasFeaturesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }