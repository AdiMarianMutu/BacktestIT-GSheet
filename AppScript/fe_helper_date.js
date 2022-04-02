<script>
  class HDate {
    constructor(mainHelper) {
      this.h = mainHelper;
    }

    addDays(date, numOfDays) {
      const d = new Date(date);
      d.setDate(d.getDate() + numOfDays);

      return d;
    }

    arrayGetIndexByDate(array, date, maximumDate = null, dateKeyName = undefined) {
      const arrayStartingDate = this.newDateObj(dateKeyName ? array[0][dateKeyName] : array[0].date);
      date = this.newDateObj(date);

      // If the array starting date is greater than the date to lookup, we will break the search
      if (
        arrayStartingDate.getFullYear() > date.getFullYear() ||
        (
          (arrayStartingDate.getFullYear() === date.getFullYear()) && arrayStartingDate.getMonth() > date.getMonth()
        )
      ) return -1;

      let index = array.map(v => +this.newDateObj(dateKeyName ? v[dateKeyName] : v.date)).indexOf(+date);

      if (index === -1 && (maximumDate !== null && date <= this.newDateObj(maximumDate)))
        // Recursively looks for the next available day
        return this.arrayGetIndexByDate(array, this.addDays(date, 1), this.newDateObj(maximumDate), dateKeyName);

      return index;
    }

    newDateObj(dateStr) {
      // Already a date object
      if (typeof dateStr !== 'string') return dateStr;

      const values = dateStr.replace(/,|-|\//g, ',').split(',');

      return new Date(values[0], parseInt(values[1]) - 1, values[2]);
    }

    getLastDayOfMonth(date) {
      const d = this.newDateObj(date);

      return new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }

    iterateOverTimeframe(from, to, fnCallback, getFullDate = false) {
      from = this.newDateObj(from);
      to = this.newDateObj(to);

      const addDate = (year, month, day) => {
        if (getFullDate) return `${year}/${month + 1}/${day}`;

        return `${year}/${month + 1}`;
      }
      
      const dispatch = (index, obj) => {
        fnCallback(
          index,
          {
            str: addDate(obj.getFullYear(), obj.getMonth(), obj.getDay()),
            obj: {
              self: obj,
              year: obj.getFullYear(),
              month: obj.getMonth(),
              day: obj.getDay()
            }
          }
        );
      };

      let index = 0;
      let currentDate = new Date(from);

      while (currentDate <= to) {
        dispatch(index, currentDate);
        
        currentDate = this.addDays(currentDate, 1);
        index++;
      }
    }
  }
</script>