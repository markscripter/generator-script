// ((window, $) => {
//   class Column {
//     constructor(target, opts) {
//       this.target = target;
//       this.options = $.extend({
//         breakpoints: [
//           {
//             breakpoint: 0,
//             columns: 1,
//           },
//           {
//             breakpoint: 480,
//             columns: 2,
//           },
//           {
//             breakpoint: 680,
//             columns: 3,
//             max: 4,
//           },
//         ],
//       }, target.data('settings'));
//       this.currentOptions = {};
//     }
//
//     init() {
//       // attach bindings
//       $(window).on('resize', _.debounce(_.bind(this.shouldRender, this), 250));
//       this.shouldRender();
//     }
//
//     getBreakpoint(clientSize = 0, arr = []) {
//       if (arr.length > 0) {
//         if (arr.length === 1) {
//           return arr[0];
//         }
//         const returned = arr.reduce((prev, curr) => {
//           if (prev !== undefined && curr !== undefined) {
//             return clientSize > prev.breakpoint && clientSize < curr.breakpoint ? prev : curr;
//           }
//           return {};
//         });
//         return returned;
//       }
//     }
//
//     getWrapper() {
//       const divWrap = document.createElement('div');
//       divWrap.className = 'column';
//       return divWrap;
//     }
//
//     render(options = {}) {
//       // check to see if our current options are the same
//       if (!_.isEqual(this.currentOptions, options)) {
//         // if not, update our current options
//         this.currentOptions = options;
//         const children = this.target.find('.columns-item');
//
//         switch (this.currentOptions.columns) {
//         case 1:
//           // put everything in 1 column
//           const wrappingDiv = this.getWrapper();
//           _.forEach(children, (child) => {
//             wrappingDiv.appendChild(child);
//           });
//           this.target.html(wrappingDiv);
//           break;
//         case 2:
//           // put everything into 2 columns
//           const half = children.length / 2; // This is to be used to determine how many items go into the first column. If there is an odd number, the left(first) column should contain more.
//           const parent = this.target.clone(); // clone the parent wrapper so we can inject 2 div.column objects.
//           let returned; // empty object to append the 2 div.columns onto
//           let firstCol = this.getWrapper();
//           let secondCol = this.getWrapper();
//
//           break;
//         default:
//           // put max per column in column
//           break;
//         }
//       }
//     }
//
//     algorithm(options) {
//       const children = this.target.find('.columns-item');
//       // determine if there is a max per column.
//       // if so, then we need to determine if the amount of items can fit into the # of columns, with a max set.
//       // Example: if we have 30 items with 3 columns but set a max at 9,
//       //          we can't really fit 30 items in to 3 columns of 9 items each (3 * 9 !== 30)
//       if (options.hasOwnProperty('max')) {
//         // validate that we can fit the # of items into the # of columns w/ a max.
//         //          9    x        3         >=         27+
//         if ((options.max * options.columns) >= children.length) {
//           // we can fit our items into this, continue
//         }
//       }
//     }
//
//     shouldRender() {
//       const clientSize = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//       this.render(this.getBreakpoint(clientSize, this.options.breakpoints));
//     }
//   }
//
//   $(document).ready(() => {
//     // const cols = $('[data-enhancer="columns"]');
//     // $.each(cols, (idx) => {
//     //   const columns = new Column($(cols[idx]));
//     //   columns.init();
//     // });
//   });
// })(window, jQuery);
