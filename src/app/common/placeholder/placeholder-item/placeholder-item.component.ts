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
    @Input() public color: 'primary'|'gray' = 'primary';
    @Input() public height: 'xs'|'s'|'m'|'l'|'xl' = 'm';
    @Input() public width: '1/5'|'2/5'|'3/5'|'4/5'|'1' = '1';

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
            case 'gray':
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
            case '1/5':
                this.widthClass = 'w-1/5';
                break;
            case '2/5':
                this.widthClass = 'w-2/5';
                break;
            case '3/5':
                this.widthClass = 'w-3/5';
                break;
            case '4/5':
                this.widthClass = 'w-4/5';
                break;
            default:
                break;
        }
    }
}
