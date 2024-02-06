import {Component, Input, OnInit} from '@angular/core';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@Component({
    selector: 'app-placeholder-item',
    standalone: true,
    imports: [
        NgxSkeletonLoaderModule
    ],
    templateUrl: './placeholder-item.component.html',
    styleUrl: 'placeholder-item.component.scss' 
})
export class PlaceholderItemComponent implements OnInit {
    @Input() public appearance: 'line'|'circle' = 'line';
    @Input() public count: number = 1;
    @Input() public color: 'primary'|'basic' = 'primary';
    @Input() public height: 'xs'|'s'|'m'|'l'|'xl' = 'm';
    @Input() public width: 'xs'|'s'|'m'|'l'|'xl' = 'xl';

    public animation: 'progress'|'progress-dark'|'pulse'|'false'|false = 'progress';

    public readonly theme: {
        extendsFromRoot?: boolean;
        [k: string]: any;
    } = {};

    public widthClass: string = 'w-full';

    public ngOnInit(): void {
        this.setThemeColor();
        this.setThemeHeight();
        this.setWidthClass();
    }

    private setThemeColor(): void {
        switch(this.color) {
            case 'basic':
                this.theme['background-color'] = '#dddddd';
                break;
            default:
                this.theme['background-color'] = '#f0b7be';
                break;
        }
    }

    private setThemeHeight(): void {
        switch(this.height) {
            case 'xs':
                this.theme['height'] = '10px';
                break;
            case 's':
                this.theme['height'] = '15px';
                break;
            case 'l':
                this.theme['height'] = '25px';
                break;
            case 'xl':
                this.theme['height'] = '30px';
                break; 
            default:
                break;
        }
    }

    private setWidthClass(): void {
        switch(this.width) {
            case 'xs':
                this.widthClass = 'w-1/5';
                break;
            case 's':
                this.widthClass = 'w-2/5';
                break;
            case 'm':
                this.widthClass = 'w-3/5';
                break;
            case 'l':
                this.widthClass = 'w-4/5';
                break;
            default:
                break;
        }
    }
}
