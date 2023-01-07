import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'rdb-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    @ViewChild('searchInput', { static: false })
    public searchInput: ElementRef;

    @Output()
    public searchValue = new EventEmitter<string>();

    public onInput(event: Event): void {
        this.searchValue.emit((event.target as HTMLInputElement).value);
    }

    public focus(): void {
        this.searchInput.nativeElement.focus();
    }

    public setValue(value: string): void {
        this.searchInput.nativeElement.value = value;
        this.searchValue.emit(value);
    }

    public selectAll(): void {
        (this.searchInput.nativeElement as HTMLInputElement).select();
    }

    public isFocused(): boolean {
        return (this.searchInput.nativeElement as MatInput).focused;
    }
}
