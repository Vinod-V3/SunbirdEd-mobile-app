import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinks } from '../app.constant';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: RouterLinks.RESOURCES,
        children: [
          {
            path: '',
            // loadChildren: '../resources/resources.module#ResourcesModule',
            loadChildren: '../resources/explore-books/explore-books.module#ExploreBooksPageModule'

          }
        ]
      },
      {
        path: RouterLinks.COURSES,
        children: [
          {
            path: '',
            loadChildren: '../courses/courses.module#CoursesPageModule'
          }
        ]
      },
      {
        path: RouterLinks.GUEST_PROFILE,
        children: [
          {
            path: '',
            loadChildren: '../profile/guest-profile/guest-profile.module#GuestProfilePageModule'
          }
        ]
      },
      {
        path: RouterLinks.PROFILE,
        children: [
          {
            path: '',
            loadChildren: '../profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: RouterLinks.DOWNLOAD_MANAGER,
        children: [
          {
            path: '',
            loadChildren: '../download-manager/download-manager.module#DownloadManagerPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'resources',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }