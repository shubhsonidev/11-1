import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './screens/login/login.component';
import { SelectYearComponent } from './screens/select-year/select-year.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { OtpVerifyComponent } from './screens/otp-verify/otp-verify.component';
import { EnrolledListComponent } from './screens/enrolled-list/enrolled-list.component';
import { SchemesListComponent } from './screens/schemes-list/schemes-list.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'otp-verify', component: OtpVerifyComponent, canActivate: [AuthGuard] },
  { path: 'selectYear', component: SelectYearComponent, canActivate: [AuthGuard] },
  { path: 'enrolled', component: EnrolledListComponent, canActivate: [AuthGuard] },
  { path: 'schemes-list', component: SchemesListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to home when the app starts
  { path: '**', redirectTo: '/login', pathMatch: 'full' } //
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
