import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-block-loader',
  templateUrl: './block-loader.component.html',
  styleUrls: ['./block-loader.component.scss']
})
export class BlockLoaderComponent {
  @Input() loading: any;

  @Input() message?: string = 'Please wait...';
}
