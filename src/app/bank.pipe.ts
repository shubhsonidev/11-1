import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bank',
})
export class BankPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText || searchText == 'All') {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      return (
        item.desc.toLowerCase().includes(searchText)
      );
    });
  }
}
